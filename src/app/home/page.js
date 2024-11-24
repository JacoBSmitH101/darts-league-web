/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
    const { data: session } = useSession();

    if (!session) {
        return <p>You must log in to access this page.</p>;
    }

    return (
        <div className="text-center items-center flex flex-col">
            <img
                src={session.user.image}
                alt={`${session.user.name}'s avatar`}
                width={100}
                height={100}
                style={{ borderRadius: "50%", marginTop: "20px" }}
            />

            <p style={{ marginTop: "10px" }}>Discord ID: {session.user.id}</p>
            <button
                onClick={() => signOut()}
                style={{
                    padding: "10px 20px",
                    marginTop: "20px",
                    backgroundColor: "#f04747",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>
        </div>
    );
}
