import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournament_id");

    if (!tournamentId) {
        return NextResponse.json(
            { error: "tournament_id is required" },
            { status: 400 }
        );
    }

    // Fetch matches from the database
    const { rows: matches } = await query(
        "SELECT * FROM matches WHERE tournament_id = $1",
        [tournamentId]
    );

    if (!matches || matches.length === 0) {
        return NextResponse.json(
            { error: "No matches found for this tournament" },
            { status: 404 }
        );
    }

    // Preload player IDs from matches
    const playerIds = [
        ...new Set(
            matches.flatMap((match) => [match.player1_id, match.player2_id])
        ),
    ];

    // Preload player names from challonge_id
    const playerNames = {};
    const { rows: playerData } = await query(
        "SELECT challonge_id, discord_tag FROM participants p JOIN users u ON p.user_id = u.user_id WHERE challonge_id = ANY($1::int[])",
        [playerIds]
    );
    for (const { challonge_id, discord_tag } of playerData) {
        playerNames[challonge_id] = discord_tag || `Player ${challonge_id}`;
    }

    // Organize matches by group
    const matchesByGroup = matches.reduce((acc, match) => {
        if (!match.group_id) return acc;
        acc[match.group_id] = acc[match.group_id] || [];
        acc[match.group_id].push(match);
        return acc;
    }, {});

    // Initialize standings
    const standings = { tournamentId, groups: {} };

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
            const players = [player1_id, player2_id];

            players.forEach((playerId) => {
                if (!standings.groups[groupId].standings[playerId]) {
                    const playerName = playerNames[playerId];
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
            });

            // Update standings
            standings.groups[groupId].standings[player1_id].points +=
                player1_score;
            standings.groups[groupId].standings[player2_id].points +=
                player2_score;

            if (state === "complete") {
                if (!winner_id) {
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
                standings.groups[groupId].standings[player1_id].played++;
                standings.groups[groupId].standings[player2_id].played++;
            }
        }
    }

    // Return computed standings
    return NextResponse.json(standings);
}
