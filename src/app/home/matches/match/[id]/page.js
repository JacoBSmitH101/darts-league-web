"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";

export default function MatchPage() {
    const { id } = useParams(); // Match ID from URL
    const [matchData, setMatchData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        if (!id) return;

        const fetchMatchData = async () => {
            try {
                const res = await fetch(`/api/matches/match?match_id=${id}`);
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
                <CircularProgress size={80} thickness={4} />
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
        if (legs === 3) return "text-yellow-400";
        return "text-red-400";
    };

    const ScoreBlock = ({ player, stats }) => {
        const legs = stats.legsWon ?? 0;
        const legsColor = getLegsColor(legs);

        return (
            <div className="flex flex-col items-center space-y-2">
                {player.avatarUrl && (
                    <img
                        src={player.avatarUrl}
                        alt={player.name}
                        className="w-24 h-24 rounded-full mb-2"
                    />
                )}
                <h2 className="text-xl font-bold">
                    {player.name || "Unknown Player"}
                </h2>
                <div className={`text-7xl font-extrabold ${legsColor}`}>
                    {legs}
                </div>
            </div>
        );
    };

    const StatsBlock = ({ stats }) => {
        return (
            <div className="w-80 space-y-2 bg-zinc-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 underline decoration-green-400 text-center">
                    Stats
                </h3>
                <div className="flex justify-between text-gray-200">
                    <span className="font-bold">Average</span>
                    <span>{stats.average?.toFixed(2) || "N/A"}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                    <span className="font-bold">Checkouts Hit</span>
                    <span>{stats.checkoutsHit ?? "N/A"}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                    <span className="font-bold">Checkout %</span>
                    <span>
                        {stats.checkoutPercent
                            ? (stats.checkoutPercent * 100).toFixed(1) + "%"
                            : "N/A"}
                    </span>
                </div>
                <div className="flex justify-between text-gray-200">
                    <span className="font-bold">Darts Thrown</span>
                    <span>{stats.dartsThrown ?? "N/A"}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                    <span className="font-bold">First 9 Avg</span>
                    <span>{stats.first9Average?.toFixed(2) || "N/A"}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full rounded-xl mx-auto p-4 text-white space-y-10">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Match Details</h1>
                <p className="text-lg text-gray-300">
                    Hosted by: {host.name || "Unknown"} (
                    {host.country?.toUpperCase() || "N/A"})
                </p>
            </div>

            {players.length > 0 && matchStats.length === players.length ? (
                <>
                    {/* Center the container horizontally by adding mx-auto */}
                    <div className="w-11/12 mx-auto bg-zinc-800 rounded-xl py-12">
                        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start justify-evenly md:space-x-10 space-y-10 md:space-y-0">
                            {players.length === 2 ? (
                                <>
                                    {/* Player 1 side */}
                                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-6 md:space-y-0 md:space-x-6 flex-1">
                                        <ScoreBlock
                                            player={players[0]}
                                            stats={matchStats[0]}
                                        />
                                        <StatsBlock stats={matchStats[0]} />
                                    </div>

                                    {/* Divider */}
                                    <div className="hidden md:block w-px bg-gray-600 h-full mx-6" />

                                    {/* Player 2 side */}
                                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-6 md:space-y-0 md:space-x-6 flex-1">
                                        <StatsBlock stats={matchStats[1]} />
                                        <ScoreBlock
                                            player={players[1]}
                                            stats={matchStats[1]}
                                        />
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-400 text-center">
                                    Currently only supporting two players
                                    layout.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-gray-400 text-center">
                    No overall stats available.
                </p>
            )}

            {/* Link to AutoDarts match stats */}
            <div className="text-center">
                <a
                    href={`https://play.autodarts.io/history/matches/${ad_stats.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded"
                >
                    View full match stats on autodarts
                </a>
            </div>
        </div>
    );
}
