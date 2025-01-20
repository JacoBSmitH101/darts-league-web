"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Card, CardContent, Typography } from "@mui/material";
import { CheckCircle, Cancel, RemoveCircle } from "@mui/icons-material"; // Optional: for status icons
import Box from "@mui/material/Box";
export default function MatchesPage() {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    const getStats = async () => {
        try {
            const res = await fetch(
                `/api/matches?user_id=${session?.user?.id}&tournament_id=15397196`
            );
            if (!res.ok) {
                throw new Error(`Error: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            setMatches(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const userId = session?.user?.id;
    useEffect(() => {
        if (userId) {
            getStats();
        }
    }, [userId]);

    const getStatusColor = (match) => {
        console.log(match);
        const isPlayer1 = match.player1_name === session?.user?.name;

        if (match.state === "complete") {
            if (match.winner_id === null)
                return { bg: "rgba(234, 179, 8, 0.1)", border: "#EAB308" }; // Draw - yellow
            if (
                match.winner_id ===
                (isPlayer1 ? match.player1_id : match.player2_id)
            )
                return { bg: "rgba(34, 197, 94, 0.1)", border: "#22C55E" }; // Won - green
            return { bg: "rgba(239, 68, 68, 0.1)", border: "#EF4444" }; // Lost - red
        }
        return { bg: "rgba(107, 114, 128, 0.1)", border: "#6B7280" }; // Not Played - gray
    };
    const getScoreColor = (score) => {
        const playerScore = parseInt(score.split("-")[0].trim());
        if (playerScore <= 2) return "text-red-500 font-bold"; // More prominent
        if (playerScore === 3) return "text-orange-400 font-bold"; // Increased prominence
        if (playerScore >= 4) return "text-green-500 font-bold"; // More prominent
        return "text-white font-bold";
    };

    return (
        <div
            className="min-h-screen min-w-full py-10 px-4 text-white"
            style={{ background: "none" }}
        >
            {/* Header Section */}
            <div className="text-center mb-8">
                <Typography
                    variant="h3"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 1, color: "white" }}
                >
                    Your Matches
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "white" }}>
                    See all your matches in the current league.
                </Typography>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center h-48">
                    <CircularProgress style={{ color: "white" }} />
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
                    Failed to load matches: {error}
                </div>
            )}

            {/* Matches Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[70vw] mx-auto">
                    {matches.map((match) => {
                        const opponent =
                            match.player1_name === session?.user?.name
                                ? match.player2_name
                                : match.player1_name;
                        const score =
                            match.player1_name === session?.user?.name
                                ? `${match.player1_score} - ${match.player2_score}`
                                : `${match.player2_score} - ${match.player1_score}`;
                        const statusStyle = getStatusColor(match);
                        const scoreColor = getScoreColor(score);

                        return (
                            <Card
                                key={match.match_id}
                                onClick={() =>
                                    router.push(
                                        `/home/matches/match/${match.match_id}`
                                    )
                                }
                                className="cursor-pointer hover:shadow-xl transition-shadow duration-200 ease-in-out"
                                sx={{
                                    backgroundColor: statusStyle.bg,
                                    border: `2px solid ${statusStyle.border}`,
                                    borderRadius: "16px",
                                    height: "112px", // Adjusted height for shorter boxes
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    "&:hover": {
                                        boxShadow:
                                            "0 10px 15px rgba(0,0,0,0.2)",
                                    },
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    p: 2, // Padding inside the card
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        router.push(
                                            `/home/matches/match/${match.match_id}`
                                        );
                                    }
                                }}
                                aria-label={`Match against ${opponent}`}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <div className="flex justify-between items-start">
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            className="truncate max-w-[70%]"
                                            sx={{
                                                color: "white",
                                                fontWeight: "medium",
                                            }}
                                        >
                                            {opponent}
                                        </Typography>
                                        {match.state === "complete" ? (
                                            <Typography
                                                variant="h6"
                                                component="span"
                                                className={`font-semibold ${scoreColor} flex items-center`}
                                            >
                                                {score}
                                                {/* Optional: Add status icons */}
                                                {/* {match.winner_id === null ? (
                                                    <RemoveCircle className="ml-1 text-yellow-600" />
                                                ) : match.winner_id === match.player1_id ? (
                                                    <CheckCircle className="ml-1 text-green-600" />
                                                ) : (
                                                    <Cancel className="ml-1 text-red-600" />
                                                )} */}
                                            </Typography>
                                        ) : (
                                            <Typography
                                                variant="h6"
                                                component="span"
                                                className="font-semibold text-gray-400"
                                            >
                                                Not Played
                                            </Typography>
                                        )}
                                    </div>

                                    <div className="flex flex-col text-sm text-gray-400">
                                        <span>
                                            {new Date(
                                                match.updated_at
                                            ).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs">
                                            Click for details
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
