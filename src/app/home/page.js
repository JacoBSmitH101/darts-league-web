"use client";

import { useSession } from "next-auth/react";
import { use, useState, useEffect } from "react";
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

export default function HomePage() {
    const [loading, setLoading] = useState(true);
    const [standings, setStandings] = useState([]);
    const [groupNumber, setGroupNumber] = useState(0);
    const { data: session } = useSession();

    useEffect(() => {
        const getStandings = async () => {
            try {
                const res = await fetch("/api/standings");
                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                const nres = await fetch(
                    `/api/user/division?user_id=${session?.user?.id}`
                );
                if (!nres.ok) {
                    throw new Error(`Error: ${nres.status} ${nres.statusText}`);
                }
                let nresjson = await nres.json();
                const group_id = await nresjson.group_id;
                const group_number = await nresjson.group_number;
                setGroupNumber(group_number);
                console.log(
                    `User: ${session?.user?.id} is in group ${group_number}`
                );
                console.log(
                    `User: ${session?.user?.id} is in group ${group_id}`
                );
                setStandings({
                    [group_id]: data.groups[group_id],
                    //group_number: group_number,
                });
                setLoading(false);
                console.log({ [group_id]: data.groups[group_id] });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getStandings();
    }, []);

    const columns = [
        { id: "name", label: "Player Name" },
        { id: "played", label: "Played" },
        { id: "points", label: "Points" },
        { id: "wins", label: "Wins" },
        { id: "losses", label: "Losses" },
        { id: "draws", label: "Draws" },
    ];
    return (
        <div
            className="min-h-screen min-w-full py-10 px-4 text-white"
            style={{ background: "none" }}
        >
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
                                        Division {groupNumber}
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
        </div>
    );
}
