"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tooltip, CircularProgress } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

export default function MatchesPage() {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const { data: session } = useSession();
    const router = useRouter();

    const getStats = async () => {
        try {
            const res = await fetch(
                `/api/matches?user_id=${session?.user?.id}&tournament_id=15397196`
            );
            const data = await res.json();
            setMatches(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false); // Stop loading once the data fetch completes
        }
    };

    const userId = session?.user?.id;
    useEffect(() => {
        if (userId) {
            getStats();
        }
    }, [userId]);

    const getStatusColor = (match) => {
        if (match.state === "complete") {
            if (match.winner_id === null) return "bg-yellow-500"; // Draw
            if (match.winner_id === match.player1_id) return "bg-green-500"; // Won
            return "bg-red-500"; // Lost
        }
        return "bg-gray-500"; // Not Played
    };

    return (
        <div className="text-white text-center py-10 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6">Your Matches</h2>
            <p className="mb-6 text-gray-300">
                See all your matches in the current league.
            </p>

            {/* Show loading spinner */}
            {loading && (
                <div className="flex justify-center items-center h-48">
                    <CircularProgress style={{ color: "white" }} />
                </div>
            )}

            {/* Show error message */}
            {error && !loading && (
                <p className="text-red-500 mt-4">
                    Failed to load matches: {error}
                </p>
            )}

            {/* Show matches */}
            {!loading && !error && (
                <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {matches.map((match) => {
                        const opponent =
                            match.player1_name === session?.user?.name
                                ? match.player2_name
                                : match.player1_name;
                        const score =
                            match.player1_name === session?.user?.name
                                ? `${match.player1_score} - ${match.player2_score}`
                                : `${match.player2_score} - ${match.player1_score}`;
                        const statusColor = getStatusColor(match);

                        return (
                            <div
                                key={match.match_id}
                                className="relative bg-zinc-900 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
                                onClick={() =>
                                    router.push(
                                        `/home/matches/match/${match.match_id}`
                                    )
                                }
                                style={{ height: "200px" }} // Increased card height
                            >
                                {/* Status Bar */}
                                <div
                                    className={`absolute top-0 left-0 w-full h-2 ${statusColor}`}
                                ></div>

                                {/* Main Content */}
                                <div className="p-5 flex flex-col h-full mt-1">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xl font-semibold truncate">
                                            Opponent: {opponent}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            Updated:{" "}
                                            {new Date(
                                                match.updated_at
                                            ).toLocaleDateString()}
                                        </p>
                                        {match.state === "complete" && (
                                            <p className="text-lg font-semibold text-gray-300 mt-1">
                                                Score: {score}
                                            </p>
                                        )}
                                    </div>

                                    {/* Bottom Info */}
                                    <div className="flex justify-center items-center mt-auto">
                                        <p className="text-xs text-gray-400 text-center">
                                            Click to view match details
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
