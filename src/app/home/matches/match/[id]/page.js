"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CircularProgress, Card, Typography } from "@mui/material";
import { CheckCircle, Cancel, RemoveCircle } from "@mui/icons-material"; // Optional: for status icons
import { useRouter } from "next/navigation";

export default function MatchPage() {
    const { id } = useParams(); // Match ID from URL
    const [matchData, setMatchData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter(); // Handle navigation in ScoreBlock

    useEffect(() => {
        if (!id) return;

        const fetchMatchData = async () => {
            try {
                const res = await fetch(`/api/matches/match?match_id=${id}`);
                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                console.log(data);
                setMatchData(data);
            } catch (err) {
                setError("Failed to fetch match data");
            } finally {
                setLoading(false);
            }
        };

        fetchMatchData();
    }, [id]);

    // If still loading
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress size={80} thickness={4} style={{ color: "white" }} />
            </div>
        );
    }

    // Show error message if any
    if (error || !matchData) {
        return (
            <div className="text-center text-red-500 mt-10">
                {error || "No data available"}
            </div>
        );
    }

    // Safely destructure stats data
    const ad_stats = matchData?.stats_data || {};
    const { host = {}, players = [], matchStats = [] } = ad_stats;

    const getLegsColor = (legs) => {
        if (legs > 3) return "text-green-400";
        if (legs === 3) return "text-orange-700 font-bold"; // More prominent
        return "text-red-400";
    };

    const getScoreColor = (score) => {
        const playerScore = parseInt(score.split('-')[0].trim());
        if (playerScore <= 2) return "text-red-500 font-bold"; // More prominent
        if (playerScore === 3) return "text-orange-700 font-bold"; // Increased prominence
        if (playerScore >= 4) return "text-green-500 font-bold"; // More prominent
        return "text-white font-bold";
    };

    const ScoreBlock = ({ player, stats }) => {
        const legs = stats.legsWon ?? 0;
        const legsColor = getLegsColor(legs);
        const score =
            player.player1_name === session?.user?.name
                ? `${stats.player1_score} - ${stats.player2_score}`
                : `${stats.player2_score} - ${stats.player1_score}`;
        const scoreColor = getScoreColor(score);

        return (
            <Card
                className="flex flex-col items-center space-y-2 cursor-pointer h-full"
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    p: 2,
                    width: "100%",
                    height: "100%",
                }}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/home/matches/match/${id}`)}
                onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        router.push(`/home/matches/match/${id}`);
                    }
                }}
                aria-label={`Player ${player.name || "Unknown"}`}
            >
                {player.avatarUrl && (
                    <img
                        src={player.avatarUrl}
                        alt={player.name}
                        className="w-24 h-24 rounded-full mb-2 object-cover"
                        loading="lazy"
                    />
                )}
                <Typography variant="h6" className="text-white font-bold truncate w-full text-center">
                    {player.name || "Unknown Player"}
                </Typography>
                <Typography variant="h4" className={`font-extrabold ${legsColor}`}>
                    {legs}
                </Typography>
                {matchData.state === "complete" ? (
                    <Typography
                        variant="h6"
                        component="span"
                        className={`font-semibold ${scoreColor} flex items-center`}
                        sx={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                    >
                        {score}
                        {player.winner_id === null ? (
                            <RemoveCircle className="ml-1 text-yellow-600" />
                        ) : player.winner_id === player.player1_id ? (
                            <CheckCircle className="ml-1 text-green-600" />
                        ) : (
                            <Cancel className="ml-1 text-red-600" />
                        )}
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
            </Card>
        );
    };

    const StatsBlock = ({ stats }) => {
        return (
            <Card
                className="w-full space-y-2 p-6 rounded-lg shadow-md h-full"
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    height: "100%",
                }}
            >
                <Typography variant="h5" className="text-center text-green-400 font-semibold underline mb-4">
                    Stats
                </Typography>
                <div className="flex justify-between text-gray-200">
                    <Typography className="font-bold">Average</Typography>
                    <Typography>{stats.average?.toFixed(2) || "N/A"}</Typography>
                </div>
                <div className="flex justify-between text-gray-200">
                    <Typography className="font-bold">Checkouts Hit</Typography>
                    <Typography>{stats.checkoutsHit ?? "N/A"}</Typography>
                </div>
                <div className="flex justify-between text-gray-200">
                    <Typography className="font-bold">Checkout %</Typography>
                    <Typography>
                        {stats.checkoutPercent
                            ? (stats.checkoutPercent * 100).toFixed(1) + "%"
                            : "N/A"}
                    </Typography>
                </div>
                <div className="flex justify-between text-gray-200">
                    <Typography className="font-bold">Darts Thrown</Typography>
                    <Typography>{stats.dartsThrown ?? "N/A"}</Typography>
                </div>
                <div className="flex justify-between text-gray-200">
                    <Typography className="font-bold">First 9 Avg</Typography>
                    <Typography>{stats.first9Average?.toFixed(2) || "N/A"}</Typography>
                </div>
            </Card>
        );
    };

    return (
        <div className="w-full rounded-xl mx-auto p-4 text-white space-y-10">
            {/* Header */}
            <div className="text-center space-y-2">
                <Typography variant="h4" className="font-bold">
                    Match Details
                </Typography>
                <Typography variant="subtitle1" className="text-gray-300">
                    Hosted by: {host.name || "Unknown"} ({host.country?.toUpperCase() || "N/A"})
                </Typography>
            </div>

            {players.length > 0 && matchStats.length === players.length ? (
                <>
                    {/* Center the container horizontally */}
                    <div className="w-11/12 mx-auto bg-transparent rounded-xl py-12">
                        <div className="w-full mx-auto px-4 flex flex-col md:flex-row items-start justify-evenly md:space-x-10 space-y-10 md:space-y-0">
                            {players.length === 2 ? (
                                <>
                                    {/* Player 1 side */}
                                    <div className="grid grid-cols-12 gap-4 flex-1">
                                        {/* ScoreBlock spans 5 columns */}
                                        <div className="col-span-12 md:col-span-5 h-full">
                                            <ScoreBlock player={players[0]} stats={matchStats[0]} />
                                        </div>
                                        {/* StatsBlock spans 7 columns */}
                                        <div className="col-span-12 md:col-span-7 h-full">
                                            <StatsBlock stats={matchStats[0]} />
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="hidden md:block w-px bg-gray-600 h-full mx-6" />

                                    {/* Player 2 side */}
                                    <div className="grid grid-cols-12 gap-4 flex-1">
                                        {/* StatsBlock spans 7 columns */}
                                        <div className="col-span-12 md:col-span-7 h-full">
                                            <StatsBlock stats={matchStats[1]} />
                                        </div>
                                        {/* ScoreBlock spans 5 columns */}
                                        <div className="col-span-12 md:col-span-5 h-full">
                                            <ScoreBlock player={players[1]} stats={matchStats[1]} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Typography className="text-gray-400 text-center">
                                    Currently only supporting two players layout.
                                </Typography>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <Typography className="text-gray-400 text-center">
                    No overall stats available.
                </Typography>
            )}

            {/* Link to AutoDarts match stats */}
            <div className="text-center">
                <a
                    href={`https://play.autodarts.io/history/matches/${ad_stats.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded"
                >
                    View full match stats on AutoDarts
                </a>
            </div>
        </div>
    );
}