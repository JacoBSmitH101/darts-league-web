"use client";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { CircularProgress, Box, Typography, Paper } from "@mui/material";

export default function StandingsPage() {
    const { data: session } = useSession();
    const [standings, setStandings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("User Name:", session?.user?.name);
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
        {
            field: "name",
            headerName: "Player Name",
            width: 180,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "played",
            headerName: "Played",
            width: 110,
            type: "number",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "points",
            headerName: "Points",
            width: 110,
            type: "number",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "wins",
            headerName: "Wins",
            width: 110,
            type: "number",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "losses",
            headerName: "Losses",
            width: 110,
            type: "number",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "draws",
            headerName: "Draws",
            width: 110,
            type: "number",
            headerAlign: "center",
            align: "center",
        },
    ];

    return (
        <div
            className="text-white py-10"
            style={{
                background:
                    "linear-gradient(to bottom right, #000000, #0f0f0f)",
                minHeight: "100vh",
            }}
        >
            <Box textAlign="center" mb={6}>
                <Typography
                    variant="h3"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 1 }}
                >
                    League Standings
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#d1d5db" }}>
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
                    color="text.primary"
                >
                    <CircularProgress size={60} />
                    <Typography variant="h6" mt={2}>
                        Loading Standings...
                    </Typography>
                </Box>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
                    {Object.keys(standings)
                        .slice(0, 4)
                        .map((groupId, index) => {
                            const groupStandings = Object.values(
                                standings[groupId].standings
                            ).map((player, idx) => ({
                                id: `${groupId}-${idx}`,
                                ...player,
                            }));

                            return (
                                <Paper
                                    key={groupId}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: "rgba(17,17,17,0.8)",
                                        backdropFilter: "blur(4px)",
                                        boxShadow: "0 4px 14px rgba(0,0,0,0.7)",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{
                                            fontWeight: "bold",
                                            mb: 2,
                                            textAlign: "center",
                                        }}
                                    >
                                        Division {index + 1}
                                    </Typography>
                                    <div style={{ height: 520, width: "100%" }}>
                                        <DataGrid
                                            rows={groupStandings}
                                            columns={columns}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            hideFooter
                                            initialState={{
                                                sorting: {
                                                    sortModel: [
                                                        {
                                                            field: "points",
                                                            sort: "desc",
                                                        },
                                                    ],
                                                },
                                            }}
                                            getRowClassName={(params) =>
                                                params.row.name?.trim() ===
                                                session?.user?.name?.trim()
                                                    ? "current-user-row"
                                                    : ""
                                            }
                                            sx={{
                                                color: "white",
                                                border: "none",
                                                "& .MuiDataGrid-columnHeaders":
                                                    {
                                                        backgroundColor:
                                                            "#1f2937",
                                                        borderColor: "#374151",
                                                        fontWeight: "bold",
                                                        color: "#e5e7eb",
                                                    },
                                                "& .MuiDataGrid-cell": {
                                                    borderColor: "#374151",
                                                },
                                                "& .MuiDataGrid-row:hover": {
                                                    backgroundColor: "#262626",
                                                },
                                                "& .current-user-row": {
                                                    fontWeight: "bold",
                                                    backgroundColor:
                                                        "#14532d !important",
                                                    color: "white",
                                                },
                                            }}
                                        />
                                    </div>
                                </Paper>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
