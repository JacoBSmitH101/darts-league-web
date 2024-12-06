import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
require("dotenv").config();
export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub; // Attach the Discord user ID
            return session;
        },
    },
    debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
