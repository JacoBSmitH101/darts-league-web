"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardActionArea,
    CardContent,
    Box,
    Typography,
} from "@mui/material";

export default function StatsPage() {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
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
        }
    };

    const userId = session?.user?.id;
    useEffect(() => {
        if (userId) {
            getStats();
        }
    }, [userId]);

    return (
        <div className="text-white text-center py-10 px-4 w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Matches Page</h2>
            <p>View your matches for the tournament</p>

            {error && (
                <p className="text-red-500 mt-4">
                    Failed to load matches: {error}
                </p>
            )}

            <div className="mt-8 grid grid-cols-1 gap-6">
                {matches.map((match) => {
                    // Determine the opponent's name
                    const opponent =
                        match.player1_name === session?.user?.name
                            ? match.player2_name
                            : match.player1_name;

                    // Determine match status
                    let status = "Not Played";
                    if (match.state === "complete") {
                        if (match.winner_id === null) {
                            status = "Draw";
                        } else if (
                            match.winner_id === match.player1_id &&
                            match.player1_name !== opponent
                        ) {
                            status = "Won";
                        } else if (
                            match.winner_id === match.player2_id &&
                            match.player2_name !== opponent
                        ) {
                            status = "Won";
                        } else {
                            status = "Lost";
                        }
                    }

                    return (
                        <Card
                            key={match.match_id}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "rgba(31, 41, 55, 0.9)",
                                color: "white",
                                borderRadius: "8px",
                                padding: 2,
                                width: "100%",
                                transition: "transform 0.2s",
                                "&:hover": { transform: "scale(1.02)" },
                            }}
                            onClick={() =>
                                router.push(
                                    `/home/matches/match/${match.match_id}`
                                )
                            }
                        >
                            <CardActionArea>
                                <Box
                                    sx={{
                                        flex: 1,
                                        padding: 2,
                                        borderRight:
                                            "1px solid rgba(255, 255, 255, 0.2)",
                                    }}
                                >
                                    <Typography variant="h6" component="div">
                                        Opponent: {opponent}
                                    </Typography>
                                    <Typography variant="body2" color="gray">
                                        Match ID: {match.match_id}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1, padding: 2 }}>
                                    <Typography variant="h6" component="div">
                                        Status: {status}
                                    </Typography>
                                    <Typography variant="body2" color="gray">
                                        Updated:{" "}
                                        {new Date(
                                            match.updated_at
                                        ).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </CardActionArea>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
