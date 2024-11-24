"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import SportsIcon from "@mui/icons-material/Sports";
import SettingsIcon from "@mui/icons-material/Settings";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { usePathname, useRouter } from "next/navigation";

const NAVIGATION = [
    {
        kind: "header",
        title: "Main Items",
    },
    {
        segment: "home",
        title: "Home",
        icon: <DashboardIcon />,
    },
    {
        segment: "home/stats",
        title: "Stats",
        icon: <BarChartIcon />,
    },
    {
        segment: "home/players",
        title: "Players",
        icon: <SportsIcon />,
    },
    {
        kind: "divider",
    },
    {
        kind: "header",
        title: "Settings",
    },
    {
        segment: "home/settings",
        title: "Settings",
        icon: <SettingsIcon />,
    },
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function DemoPageContent() {
    const pathname = usePathname(); // Get the current path dynamically

    return (
        <Box
            sx={{
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                color: "white",
            }}
        >
            <Typography variant="h4">
                {pathname === "/home" && "Welcome to the Home Page!"}
                {pathname === "/home/stats" && "League Stats"}
                {pathname === "/home/players" && "Manage Players"}
                {pathname === "/home/settings" && "Settings"}
            </Typography>
            <Typography sx={{ mt: 2 }}>
                {
                    pathname === "/home"
                        ? "This is the dashboard home page for managing the darts league."
                        : `You are on the ${pathname.slice(6)} page.` /* Slice removes "/home/" */
                }
            </Typography>
        </Box>
    );
}

export default function DashboardLayoutBasic() {
    const router = useRouter();

    return (
        <AppProvider navigation={NAVIGATION} theme={demoTheme}>
            <DashboardLayout
                navigationProps={{
                    onNavigationItemClick: (segment) => {
                        if (!segment.startsWith("/")) {
                            segment = `/home/${segment}`; // Ensure absolute path
                        }
                        router.push(segment);
                    },
                }}
            >
                <DemoPageContent />
            </DashboardLayout>
        </AppProvider>
    );
}
