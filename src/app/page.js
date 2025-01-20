"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Welcome() {
    const router = useRouter();

    useEffect(() => {
        router.push("/login");
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-cyan-950 text-white">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Redirecting to the (Unofficial) Autodarts League Login...
            </h1>
        </div>
    );
}
