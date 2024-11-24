"use client";

import { useRouter } from "next/navigation";

export default function Welcome() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-cyan-950 text-white">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Welcome to the (Unofficial) Autodarts League!
            </h1>
            <p className="text-lg mb-4 text-center">
                See league information, player stats, and more!
            </p>
            <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
            >
                Login with Discord
            </button>
        </div>
    );
}
