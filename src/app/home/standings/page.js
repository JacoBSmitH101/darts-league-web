//just a template for now
"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StandingsPage() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    return (
        <div className="text-white text-center py-10">
            <h2 className="text-2xl font-semibold">Standings Page</h2>
            <p>This is where the standings will be displayed.</p>
        </div>
    );
}
