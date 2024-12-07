"use client";

import React, { useState, useEffect } from "react";
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
import { useSession } from "next-auth/react";

const allowedAdminDiscordIds = ["414395899570290690", "335970728811954187"]; // Replace with actual allowed Discord IDs

function getNavigation(session) {
    const baseNavigation = [
        { kind: "header", title: "Main Items" },
        { segment: "home", title: "Home", icon: <DashboardIcon /> },
        {
            segment: "home/standings",
            title: "Standings",
            icon: <BarChartIcon />,
        },
        { segment: "home/stats", title: "Stats", icon: <BarChartIcon /> },
        { segment: "home/matches", title: "Matches", icon: <SportsIcon /> },
    ];

    const isAdmin =
        session?.user?.id && allowedAdminDiscordIds.includes(session?.user?.id);

    if (isAdmin) {
        baseNavigation.push({ kind: "divider" });
        baseNavigation.push({ kind: "header", title: "Admin" });
        baseNavigation.push({
            segment: "home/users",
            title: "Users",
            icon: <SettingsIcon />,
        });
    }

    return baseNavigation;
}

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

function DemoPageContent({ children }) {
    const pathname = usePathname();

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
            {children || (
                <>
                    <Typography variant="h4">
                        {pathname === "/home" && "Welcome to the Home Page!"}
                        {pathname === "/home/stats" && "League Stats"}
                        {pathname === "/home/players" && "Manage Players"}
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
    );
}

export default function DashboardLayoutBasic({ children }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [navigation, setNavigation] = useState(getNavigation(session));

    useEffect(() => {
        setNavigation(getNavigation(session));
    }, [session, router]);

    return (
        <AppProvider
            navigation={navigation}
            theme={demoTheme}
            session={session}
            branding={{ title: "Unofficial Autodarts League" }}
        >
            <DashboardLayout
                navigationProps={{
                    onNavigationItemClick: (segment) => {
                        router.push(segment);
                    },
                }}
            >
                <DemoPageContent>{children}</DemoPageContent>
            </DashboardLayout>
        </AppProvider>
    );
}
