//just a template for now
"use client";
import React, { use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StandingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    ///for now just get the /api/stats and console.log it
    useEffect(() => {
        fetch("/api/stats")
            .then((response) => response.json())
            .then((data) => console.log(data));
    }, [session, router]);
    return (
        <div className="text-white text-center py-10">
            <h2 className="text-2xl font-semibold">Standings Page</h2>
            <p>This is where the standings will be displayed.</p>
        </div>
    );
}
