import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournament_id");
    const userId = searchParams.get("user_id");

    if (!tournamentId || !userId) {
        return NextResponse.json(
            { error: "tournament_id and user_id are required" },
            { status: 400 }
        );
    }

    try {
        const queryText = `
            SELECT 
                M.*, -- Fetch all columns from Matches
                U1.autodarts_name AS player1_name, 
                U1.discord_tag AS discord1_tag, 
                U2.autodarts_name AS player2_name, 
                U2.discord_tag AS discord2_tag
            FROM Matches M
            JOIN Participants P1 ON M.player1_id = P1.challonge_id
            JOIN Participants P2 ON M.player2_id = P2.challonge_id
            JOIN Users U1 ON P1.user_id = U1.user_id
            JOIN Users U2 ON P2.user_id = U2.user_id
            WHERE M.tournament_id = $1 -- Filter for the given tournament
              AND (
                  U1.user_id = $2 OR U2.user_id = $2 -- User must be one of the players
              )
            ORDER BY M.suggested_play_order ASC;
        `;

        const { rows } = await query(queryText, [tournamentId, userId]);

        if (rows.length === 0) {
            return NextResponse.json(
                {
                    error: "No matches found for the given tournament and user.",
                },
                { status: 404 }
            );
        }
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching matches:", error);
        return NextResponse.json(
            { error: "Failed to fetch matches." },
            { status: 500 },
            { message: error.message }
        );
    }
}
