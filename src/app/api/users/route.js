import { query } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req) {
    const { rows } = await query("SELECT * FROM users");
    return NextResponse.json(rows);
}
