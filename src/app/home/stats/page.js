"use client";

import { useState, useEffect } from "react";
export default function StatsPage() {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState(null);
    //get a list of all stats from the database
    const getStats = async () => {
        try {
            const res = await fetch("/api/stats");
            const data = await res.json();
            console.log(data);
            setStats(data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        getStats();
    }, []);

    return (
        <div className="text-white text-center py-10">
            <h2 className="text-2xl font-semibold">Stats Page</h2>
            <p>View detailed stats about the darts league here. hopefully</p>
            <div className="mt-8">
                <h3 className="text-xl font-semibold">Stats</h3>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {stats.length}
                </div>
            </div>
        </div>
    );
}
