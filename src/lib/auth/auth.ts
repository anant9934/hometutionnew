import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Future: Import Drizzle adapter here if full session DB sync is needed

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        // In Phase 2: Query DB for user role and append to session
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = "PENDING_SETUP"; // Placeholder
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
