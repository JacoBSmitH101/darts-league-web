"use client";

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function StatsPage() {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState(null);

    // Replace this with the actual logged-in Discord ID (e.g., fetched from session or context)
    const loggedInDiscordId = "414395899570290690";

    // Fetch stats from the API
    const getStats = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setStats(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        getStats();
    }, []);

    // Define columns for the DataGrid
    const columns = [
        { field: "discord_tag", headerName: "Discord Tag", flex: 1 },
        { field: "autodarts_name", headerName: "AutoDarts Name", flex: 1 },
        { field: "challonge_id", headerName: "Challonge ID", flex: 1 },
        { field: "avg", headerName: "Average Score", flex: 1 },
        { field: "created_at", headerName: "Created At", flex: 1 },
        { field: "updated_at", headerName: "Updated At", flex: 1 },
    ];

    return (
        <div className="text-white text-center px-4 min-w-full h-screen">
            <h2 className="text-2xl font-semibold">Users</h2>
            <p>All users in the database</p>

            {error && (
                <p className="text-red-500 mt-4">
                    Failed to load stats: {error}
                </p>
            )}

            <div className="mt-8" style={{ height: 750, width: "100%" }}>
                <DataGrid
                    rows={stats.map((row, index) => ({
                        id: index, // Add a unique `id` for each row (required by DataGrid)
                        ...row,
                    }))}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowClassName={(params) =>
                        params.row.user_id === loggedInDiscordId
                            ? "highlighted-row"
                            : ""
                    }
                    sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#1f2937",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "1px solid #374151",
                        },
                        "& .MuiDataGrid-footerContainer": {
                            backgroundColor: "#1f2937",
                        },
                        "& .MuiDataGrid-row.highlighted-row": {
                            backgroundColor: "#4B5563", // Dark gray for highlighting
                            color: "white",
                        },
                    }}
                />
            </div>
        </div>
    );
}
