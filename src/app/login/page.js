"use client";

import { signIn } from "next-auth/react";

export default function Login() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Login</h1>
            <button
                onClick={() => signIn("discord")}
                style={{
                    padding: "10px 20px",
                    marginTop: "20px",
                    backgroundColor: "#7289da",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Login with Discord
            </button>
        </div>
    );
}
