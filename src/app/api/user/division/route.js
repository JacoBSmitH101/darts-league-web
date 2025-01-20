import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("user_id");
    const { rows: tournamentRows } = await query(
        "SELECT tournament_id FROM tournaments WHERE active = 1"
    );

    if (!userId) {
        return NextResponse.json(
            { error: "user_id is required" },
            { status: 400 }
        );
    }

    const tournamentId = tournamentRows.length
        ? tournamentRows[0].tournament_id
        : null;

    if (!tournamentId) {
        return NextResponse.json(
            { error: "No active tournament found" },
            { status: 404 }
        );
    }
    console.log(userId);
    console.log(tournamentId);

    const queryText = `
SELECT group_id
FROM participants 
WHERE user_id = $1 AND tournament_id = $2;
`;

    const { rows } = await query(queryText, [userId, tournamentId]);
    const query2 = `SELECT (grp.key)::int AS group_number
FROM participants p
JOIN tournaments t 
  ON p.tournament_id = t.tournament_id
CROSS JOIN LATERAL jsonb_each_text(t.groups) AS grp(key, val)
WHERE p.participant_id = (
    SELECT participant_id
    FROM participants
    WHERE user_id = $1 AND tournament_id = $2
)
  AND (grp.val)::int = p.group_id;

`;
    const { rows: groupNumberRows } = await query(query2, [
        userId,
        tournamentId,
    ]);

    return NextResponse.json({
        group_id: rows[0].group_id,
        group_number: groupNumberRows[0].group_number,
    });
}
