import { query } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get("match_id");
    const { rows } = await query("SELECT * FROM ad_stats WHERE match_id = $1", [
        matchId,
    ]);
    return NextResponse.json(rows[0]);
}
