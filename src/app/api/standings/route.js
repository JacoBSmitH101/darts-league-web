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

    // Fetch tournament URL
    const { rows: tournamentData } = await query(
        "SELECT challonge_id FROM tournaments WHERE tournament_id = $1",
        [tournamentId]
    );
    const tournamentUrl = tournamentData?.[0]?.challonge_url || "";

    // Initialize standings structure
    const standings = {
        tournamentId,
        groups: {},
        tournamentUrl,
    };

    // Process matches and populate standings
    for (const match of matches) {
        const groupId = match.group_id;
        if (!groupId) continue;

        // Initialize group if not present
        if (!standings.groups[groupId]) {
            standings.groups[groupId] = { standings: {} };
        }

        // Initialize players if not already present
        const playerIds = [match.player1_id, match.player2_id];
        for (const playerId of playerIds) {
            if (!standings.groups[groupId].standings[playerId]) {
                // Fetch the user_id from the participants table using challonge_id
                const { rows: participantData } = await query(
                    "SELECT user_id FROM participants WHERE challonge_id = $1",
                    [playerId]
                );

                const userId = participantData?.[0]?.user_id;

                // Fetch discord_tag from the users table using user_id
                const { rows: userData } = await query(
                    "SELECT discord_tag FROM users WHERE user_id = $1",
                    [userId]
                );

                const discordTag =
                    userData?.[0]?.discord_tag || `Player ${playerId}`;

                standings.groups[groupId].standings[playerId] = {
                    name: discordTag.substring(0, 15).padEnd(15, " "),
                    discordTag,
                    userId, // Store user_id
                    played: 0,
                    points: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                };
            }
        }

        const [player1, player2] = playerIds;

        // Update scores and results
        standings.groups[groupId].standings[player1].points +=
            match.player1_score;
        standings.groups[groupId].standings[player2].points +=
            match.player2_score;

        if (match.state === "complete") {
            standings.groups[groupId].standings[player1].played++;
            standings.groups[groupId].standings[player2].played++;

            if (match.winner_id === "draw") {
                standings.groups[groupId].standings[player1].draws++;
                standings.groups[groupId].standings[player2].draws++;
                standings.groups[groupId].standings[player1].points++;
                standings.groups[groupId].standings[player2].points++;
            } else if (match.winner_id === player1) {
                standings.groups[groupId].standings[player1].wins++;
                standings.groups[groupId].standings[player1].points += 2;
                standings.groups[groupId].standings[player2].losses++;
            } else if (match.winner_id === player2) {
                standings.groups[groupId].standings[player2].wins++;
                standings.groups[groupId].standings[player2].points += 2;
                standings.groups[groupId].standings[player1].losses++;
            }
        }
    }

    // Return computed standings
    return NextResponse.json(standings);
}
