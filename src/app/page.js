"use client";

import { useRouter } from "next/navigation";

export default function Welcome() {
    const router = useRouter();

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Darts League!</h1>
            <button
                onClick={() => router.push("/login")}
                style={{ marginTop: "20px" }}
            >
                Login with Discord
            </button>
        </div>
    );
}
