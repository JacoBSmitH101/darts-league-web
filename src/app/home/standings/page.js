"use client";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";

export default function StandingsPage() {
    const { data: session } = useSession();
    const [standings, setStandings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch standings from the API
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
        { field: "name", headerName: "Player Name", flex: 1 },
        { field: "played", headerName: "Played", width: 100, type: "number" },
        { field: "points", headerName: "Points", width: 100, type: "number" },
        { field: "wins", headerName: "Wins", width: 100, type: "number" },
        { field: "losses", headerName: "Losses", width: 100, type: "number" },
        { field: "draws", headerName: "Draws", width: 100, type: "number" },
    ];

    return (
        <div className="text-white text-center py-10">
            <h2 className="text-2xl font-semibold mb-6">Standings Page</h2>

            {loading ? (
                <p>Loading standings...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
                    {Object.keys(standings)
                        .slice(0, 4) // Limit to 4 groups
                        .map((groupId, index) => {
                            // Sort group standings by points in descending order
                            const groupStandings = Object.values(
                                standings[groupId].standings
                            )
                                .sort((a, b) => b.points - a.points) // Sort descending by points
                                .map((player, idx) => ({
                                    id: `${groupId}-${idx}`, // Unique ID
                                    ...player,
                                }));

                            return (
                                <div
                                    key={groupId}
                                    style={{
                                        minHeight: 600,
                                        height: "fit-content",
                                        maxWidth: "100%", // Ensure table scales with container
                                    }}
                                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                                >
                                    <h3 className="text-xl font-semibold mb-4">
                                        Division {index + 1}
                                    </h3>
                                    <DataGrid
                                        rows={groupStandings}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        hideFooter
                                        sx={{
                                            "& .MuiDataGrid-root": {
                                                color: "white",
                                            },
                                            "& .MuiDataGrid-cell": {
                                                borderColor: "#334155",
                                            },
                                            "& .MuiDataGrid-columnHeaders": {
                                                backgroundColor: "#1e40af",
                                                borderColor: "#334155",
                                            },
                                        }}
                                    />
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
