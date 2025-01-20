import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    let tournamentId = searchParams.get("tournament_id");

    if (!tournamentId) {
        const { rows: tournamentRows } = await query(
            "SELECT tournament_id FROM tournaments WHERE active = 1"
        );
        tournamentId = tournamentRows.length
            ? tournamentRows[0].tournament_id
            : null;

        if (!tournamentId) {
            return NextResponse.json(
                { error: "No active tournament found" },
                { status: 404 }
            );
        }
    }

    // Define mobileView if needed, or just remove these checks.
    // For now, let's assume mobileView = false
    const mobileView = false;

    const standings = { tournamentId, groups: {} };

    // Fetch matches from the database
    const matches = await query(
        "SELECT * FROM matches WHERE tournament_id = $1",
        [tournamentId]
    );

    const playerIds = [
        ...new Set(
            matches.rows.flatMap((match) => [
                match.player1_id,
                match.player2_id,
            ])
        ),
    ];

    const pquery = `
        SELECT p.challonge_id, u.discord_tag
        FROM Participants p
        INNER JOIN Users u ON p.user_id = u.user_id
        WHERE p.challonge_id = ANY($1::integer[])
    `;

    let participants = await query(pquery, [playerIds]);
    const players = Object.fromEntries(
        participants.rows.map((p) => [p.challonge_id, p.discord_tag])
    );

    const matchesByGroup = matches.rows.reduce((acc, match) => {
        if (!match.group_id) return acc;
        acc[match.group_id] = acc[match.group_id] || [];
        acc[match.group_id].push(match);
        return acc;
    }, {});

    for (const [groupId, groupMatches] of Object.entries(matchesByGroup)) {
        standings.groups[groupId] = standings.groups[groupId] || {
            standings: {},
        };

        for (const match of groupMatches) {
            const {
                player1_id,
                player2_id,
                winner_id,
                player1_score,
                player2_score,
                state,
            } = match;
            const thesePlayers = [player1_id, player2_id];

            thesePlayers.forEach((playerId) => {
                if (!standings.groups[groupId].standings[playerId]) {
                    const playerName = players[playerId] || "Unknown";
                    if (mobileView) {
                        standings.groups[groupId].standings[playerId] = {
                            name: playerName.substring(0, 7).padEnd(7, " "),
                            points: 0,
                            played: 0,
                        };
                    } else {
                        standings.groups[groupId].standings[playerId] = {
                            rank: 0,
                            name: playerName.substring(0, 15).padEnd(15, " "),
                            wins: 0,
                            losses: 0,
                            draws: 0,
                            points: 0,
                            played: 0,
                        };
                    }
                }
            });

            // Update points from scores
            standings.groups[groupId].standings[player1_id].points +=
                player1_score;
            standings.groups[groupId].standings[player2_id].points +=
                player2_score;

            if (state === "complete") {
                standings.groups[groupId].standings[player1_id].played++;
                standings.groups[groupId].standings[player2_id].played++;

                if (winner_id === null) {
                    // It's a draw
                    standings.groups[groupId].standings[player1_id].draws++;
                    standings.groups[groupId].standings[player2_id].draws++;
                    standings.groups[groupId].standings[player1_id].points++;
                    standings.groups[groupId].standings[player2_id].points++;
                } else {
                    const winner =
                        standings.groups[groupId].standings[winner_id];
                    const loser =
                        standings.groups[groupId].standings[
                            player1_id === winner_id ? player2_id : player1_id
                        ];
                    winner.wins++;
                    loser.losses++;
                    winner.points += 2;
                }
            }
        }
    }

    console.log(standings);

    // Return computed standings
    return NextResponse.json(standings);
}
