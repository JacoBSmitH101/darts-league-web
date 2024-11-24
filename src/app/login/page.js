"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/home");
        }
    }, [session, router]);

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-cyan-950">
            {/* Black Box Container */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-white mb-4">
                    Login to your discord account
                </h1>
                <p className="text-gray-400 mb-6">
                    Access league stats, manage players, and track scores
                    easily.
                </p>
                <button
                    onClick={() => signIn("discord")}
                    className="w-full px-4 py-3 text-white font-semibold rounded-md bg-[#5865F2] hover:bg-[#4752C4] transition duration-300"
                >
                    Login with Discord
                </button>
            </div>
        </div>
    );
}
