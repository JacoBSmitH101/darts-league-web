"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import SportsIcon from "@mui/icons-material/Sports";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const allowedAdminDiscordIds = ["414395899570290690", "335970728811954187"]; // Replace with actual allowed Discord IDs

function getNavigation(session) {
    const baseNavigation = [
        { title: "Home", segment: "home", icon: <HomeIcon /> },
        {
            title: "Standings",
            segment: "home/standings",
            icon: <BarChartIcon />,
        },
        { title: "Matches", segment: "home/matches", icon: <SportsIcon /> },
    ];

    const isAdmin =
        session?.user?.id && allowedAdminDiscordIds.includes(session?.user?.id);

    if (isAdmin) {
        // Add admin section
        baseNavigation.push({
            title: "Users",
            segment: "home/users",
            icon: <SettingsIcon />,
        });
    }

    return baseNavigation;
}

export default function CustomLayout({ children }) {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [navigation, setNavigation] = useState(getNavigation(session));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setNavigation(getNavigation(session));
    }, [session]);

    // If not logged in, redirect to login
    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    // Display loading state if session is not yet available
    if (session === undefined) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-cyan-950 text-white">
                <Typography variant="h6">Loading...</Typography>
            </div>
        );
    }

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-950 text-white flex flex-col">
            {/* Navigation Bar */}
            <header className="w-full bg-black bg-opacity-30 backdrop-blur-md py-4 px-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <DashboardIcon className="text-white" />
                    <span className="font-bold text-xl">
                        Unofficial Autodarts League
                    </span>
                </div>
                {/* Hamburger icon visible on small screens */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none"
                    >
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
                {/* Navigation - hidden on small screens unless menu is open */}
                <nav
                    className={`md:flex items-center space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-black bg-opacity-80 md:bg-opacity-0 backdrop-blur-md md:backdrop-blur-none md:p-0 p-4 md:space-x-6 flex-col md:flex-row transition-transform ${
                        isMenuOpen ? "block" : "hidden md:flex"
                    }`}
                >
                    {navigation.map((navItem) => {
                        const isActive = pathname.startsWith(
                            `/${navItem.segment}`
                        );
                        return (
                            <button
                                key={navItem.segment}
                                onClick={() => {
                                    router.push(`/${navItem.segment}`);
                                    setIsMenuOpen(false);
                                }}
                                className={`flex items-center space-x-2 px-3 py-2 rounded hover:bg-white hover:bg-opacity-10 transition w-full md:w-auto text-left ${
                                    isActive ? "bg-white bg-opacity-20" : ""
                                }`}
                            >
                                <span className="text-white">
                                    {navItem.icon}
                                </span>
                                <span className="text-white font-medium">
                                    {navItem.title}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </header>

            {/* Content Area */}
            <div className="flex-1 pt-8 w-full flex flex-col items-center justify-start">
                <Box
                    sx={{
                        py: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        color: "white",
                        width: "100%",
                        maxWidth: "1200px",
                        margin: "0",
                    }}
                >
                    {children || (
                        <>
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: "bold", mb: 2 }}
                            >
                                {pathname === "/home" &&
                                    "Welcome to the Home Page!"}
                                {pathname === "/home/standings" &&
                                    "League Standings"}
                                {pathname === "/home/matches" && "Your Matches"}
                                {pathname === "/home/users" && "Manage Users"}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                {pathname === "/home"
                                    ? "This is the dashboard home page for managing the darts league."
                                    : `You are on the ${pathname.slice(6)} page.`}
                            </Typography>
                        </>
                    )}
                </Box>
            </div>
        </div>
    );
}
