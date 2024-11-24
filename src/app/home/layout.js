"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomeLayout({ children }) {
    const router = useRouter();

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-500 to-cyan-950 flex">
            {/* Sidebar */}
            <div className="w-64 h-full bg-black/70 backdrop-blur-lg rounded-lg m-4 shadow-lg">
                <div className="text-white text-center py-6">
                    <h2 className="text-xl font-semibold">Sidebar</h2>
                    <nav className="space-y-4 mt-6">
                        <a
                            href="/home"
                            className="block text-gray-300 hover:text-white transition"
                        >
                            Home
                        </a>
                        <a
                            href="/home/stats"
                            className="block text-gray-300 hover:text-white transition"
                        >
                            Stats
                        </a>
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col m-4 space-y-4">
                {/* Navbar */}
                <div className="h-16 bg-black/70 backdrop-blur-lg rounded-lg shadow-lg flex items-center justify-between px-6">
                    <h1 className="text-white text-lg font-semibold">
                        Darts League
                    </h1>
                    <button
                        onClick={async () => {
                            await signOut();
                            router.push("/login");
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                </div>

                {/* Page-Specific Content */}
                <div className="flex-1 bg-black/70 backdrop-blur-lg rounded-lg shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}
