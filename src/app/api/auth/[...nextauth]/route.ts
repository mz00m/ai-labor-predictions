import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { getDb } from "@/lib/db";

// Custom adapter that stores sessions and users in Neon PostgreSQL
// Minimal implementation for magic link auth
const authOptions: AuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "",
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASSWORD || "",
        },
      },
      from: process.env.EMAIL_FROM || "noreply@jobsdata.ai",
    }),
  ],
  pages: {
    signIn: "/assessment/dashboard",
    verifyRequest: "/assessment/dashboard?verify=true",
  },
  callbacks: {
    async session({ session }) {
      // Attach assessment user data to session if needed
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
