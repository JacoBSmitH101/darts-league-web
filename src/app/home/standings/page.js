"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    CircularProgress,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    Modal,
} from "@mui/material";

export default function StandingsPage() {
    const { data: session } = useSession();
    const [standings, setStandings] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetch("/api/standings?tournament_id=15397196")
            .then((response) => response.json())
            .then((data) => {
                setStandings(data.groups || {});
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching standings:", err);
                setLoading(false);
            });
    }, [session]);

    const columns = [
        { id: "name", label: "Player Name" },
        { id: "played", label: "Played" },
        { id: "points", label: "Points" },
        { id: "wins", label: "Wins" },
        { id: "losses", label: "Losses" },
        { id: "draws", label: "Draws" },
    ];

    const handleOpenModal = (player) => {
        setSelectedPlayer(player);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedPlayer(null);
    };

    return (
        <div
            className="min-h-screen min-w-full py-10 px-4 text-white"
            style={{ background: "none" }}
        >
            <Box textAlign="center" mb={6}>
                <Typography
                    variant="h3"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 1, color: "white" }}
                >
                    League Standings
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "white" }}>
                    Check out how players are performing in each division
                </Typography>
            </Box>

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="60vh"
                    flexDirection="column"
                >
                    <CircularProgress size={60} sx={{ color: "white" }} />
                    <Typography variant="h6" mt={2} sx={{ color: "white" }}>
                        Loading Standings...
                    </Typography>
                </Box>
            ) : (
                <Box
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    sx={{
                        width: "80vw", // Set container width to 80% of viewport
                        maxWidth: "1400px", // Optional: maximum width to prevent excessive stretching
                        margin: "0 auto",
                    }}
                >
                    {Object.keys(standings)
                        .slice(0, 4)
                        .map((groupId, index) => {
                            // Extract and sort group standings by points descending
                            const groupStandings = Object.values(
                                standings[groupId].standings
                            )
                                .map((player, idx) => ({
                                    id: `${groupId}-${idx}`,
                                    ...player,
                                }))
                                .sort((a, b) => b.points - a.points); // Sorting here

                            return (
                                <Box key={groupId} sx={{ width: "100%" }}>
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{
                                            fontWeight: "bold",
                                            mb: 2,
                                            textAlign: "center",
                                            color: "white",
                                        }}
                                    >
                                        Division {index + 1}
                                    </Typography>
                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            borderRadius: "24px",
                                            backgroundColor:
                                                "rgba(0,120,255,0.05)",
                                            boxShadow:
                                                "0 6px 25px rgba(0,0,0,0.4)",
                                            overflow: "hidden",
                                            border: "1px solid rgba(255, 255, 255, 0.2)",
                                            transition: "box-shadow 0.3s ease",
                                            "&:hover": {
                                                boxShadow:
                                                    "0 8px 30px rgba(0,0,0,0.5)",
                                            },
                                        }}
                                    >
                                        <Table
                                            sx={{
                                                minWidth: 800, // Ensure tables are wide enough
                                                width: "100%", // Make table take full width of container
                                                fontFamily:
                                                    "Roboto, sans-serif",
                                            }}
                                            aria-label="standings table"
                                        >
                                            <TableHead>
                                                <TableRow
                                                    sx={{
                                                        background:
                                                            "linear-gradient(45deg, rgba(0,120,255,0.3), rgba(0,200,255,0.3), rgba(150,0,255,0.3))", // Added a third color (purple) for more depth
                                                    }}
                                                >
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            align="center"
                                                            sx={{
                                                                color: "white",
                                                                fontWeight:
                                                                    "600",
                                                                borderBottom:
                                                                    "1px solid rgba(255,255,255,0.2)",
                                                                padding: "16px",
                                                                ...(column.id ===
                                                                "draws"
                                                                    ? {
                                                                          minWidth: 120,
                                                                      } // Ensure "Draws" column has sufficient width
                                                                    : {}),
                                                            }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {groupStandings.map((row) => (
                                                    <TableRow
                                                        key={row.id}
                                                        onClick={() =>
                                                            handleOpenModal(row)
                                                        }
                                                        sx={{
                                                            cursor: "pointer",
                                                            "&:nth-of-type(odd)":
                                                                {
                                                                    backgroundColor:
                                                                        "rgba(0,120,255,0.05)",
                                                                },
                                                            "&:nth-of-type(even)":
                                                                {
                                                                    backgroundColor:
                                                                        "rgba(0,120,255,0.03)",
                                                                },
                                                            backgroundColor:
                                                                row.name.trim() ===
                                                                session?.user?.name.trim()
                                                                    ? "rgba(20,83,45,0.7)"
                                                                    : "transparent",
                                                            fontWeight:
                                                                row.name.trim() ===
                                                                session?.user?.name.trim()
                                                                    ? "bold"
                                                                    : "normal",
                                                            "&:hover": {
                                                                backgroundColor:
                                                                    "rgba(255,255,255,0.1)",
                                                            },
                                                            borderBottom:
                                                                "1px solid rgba(255,255,255,0.1)",
                                                            transition:
                                                                "background-color 0.3s ease",
                                                        }}
                                                    >
                                                        {columns.map(
                                                            (column) => (
                                                                <TableCell
                                                                    key={
                                                                        column.id
                                                                    }
                                                                    align="center"
                                                                    sx={{
                                                                        color: "white",
                                                                        padding:
                                                                            "16px",
                                                                    }}
                                                                >
                                                                    {column.id ===
                                                                    "wins"
                                                                        ? row.wins
                                                                        : column.id ===
                                                                          "losses"
                                                                        ? row.losses
                                                                        : column.id ===
                                                                          "draws"
                                                                        ? row.draws
                                                                        : row[
                                                                              column
                                                                                  .id
                                                                          ]}
                                                                </TableCell>
                                                            )
                                                        )}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            );
                        })}
                </Box>
            )}

            {/* Modal for Player Details */}
            <Modal
                open={open}
                onClose={handleCloseModal}
                aria-labelledby="player-details-title"
                aria-describedby="player-details-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: 300, sm: 400 },
                        bgcolor: "background.paper",
                        border: "2px solid rgba(0,120,255,0.5)", // Semi-transparent blue border
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "16px",
                        color: "black", // Ensure text is readable
                    }}
                >
                    {selectedPlayer && (
                        <>
                            <Typography
                                id="player-details-title"
                                variant="h6"
                                component="h2"
                            >
                                {selectedPlayer.name}&apos;s Details
                            </Typography>
                            <Typography
                                id="player-details-description"
                                sx={{ mt: 2 }}
                            >
                                {/* Add detailed information about the player here */}
                                <strong>Played:</strong> {selectedPlayer.played}
                                <br />
                                <strong>Points:</strong> {selectedPlayer.points}
                                <br />
                                <strong>Wins:</strong> {selectedPlayer.wins}
                                <br />
                                <strong>Losses:</strong> {selectedPlayer.losses}
                                <br />
                                <strong>Draws:</strong> {selectedPlayer.draws}
                                {/* Add more details as needed */}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}