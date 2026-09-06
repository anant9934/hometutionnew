import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        // user object comes from the database via DrizzleAdapter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = user.id;
        
        // Fetch role if not directly available on the adapter user type
        const dbUser = await db.select({ role: users.role }).from(users).where(eq(users.id, user.id)).limit(1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = dbUser[0]?.role || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
