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
        { 
            field: "discord_tag", 
            headerName: "Discord Tag", 
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        { 
            field: "autodarts_name", 
            headerName: "AutoDarts Name", 
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        { 
            field: "challonge_id", 
            headerName: "Challonge ID", 
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        { 
            field: "avg", 
            headerName: "Average Score", 
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        { 
            field: "created_at", 
            headerName: "Created At", 
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        { 
            field: "updated_at", 
            headerName: "Updated At", 
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
    ];

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white">Users</h2>
                <p className="text-gray-400">All users in the database</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
                    Failed to load stats: {error}
                </div>
            )}

            <div style={{ height: 750, width: "100%" }}>
                <DataGrid
                    rows={stats.map((row, index) => ({
                        id: index,
                        ...row,
                    }))}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    getRowClassName={(params) =>
                        params.row.user_id === loggedInDiscordId
                            ? "highlighted-row"
                            : ""
                    }
                    sx={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        '& .MuiDataGrid-cell': {
                            borderColor: 'rgb(51, 65, 85)',
                            color: 'white',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            borderColor: 'rgb(51, 65, 85)',
                            backgroundColor: 'rgb(15, 23, 42)',
                        },
                        '& .MuiDataGrid-row': {
                            backgroundColor: 'rgb(15, 23, 42)',
                            '&:hover': {
                                backgroundColor: 'rgb(30, 41, 59)',
                            },
                        },
                        '& .highlighted-row': {
                            backgroundColor: 'rgb(51, 65, 85)',
                            '&:hover': {
                                backgroundColor: 'rgb(71, 85, 105)',
                            },
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderColor: 'rgb(51, 65, 85)',
                            backgroundColor: 'rgb(15, 23, 42)',
                        },
                        '& .MuiTablePagination-root': {
                            color: 'white',
                        },
                        '& .MuiButtonBase-root': {
                            color: 'white',
                        },
                    }}
                />
            </div>
        </div>
    );
}
