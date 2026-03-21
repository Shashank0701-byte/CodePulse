import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { generateApiKey } from "@/lib/api-key";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Attach user ID to the session so we can use it client-side
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // On first sign-up, generate an API key and set username from GitHub
      if (user.id) {
        const username =
          user.name?.toLowerCase().replace(/\s+/g, "") ??
          `user_${user.id.slice(0, 8)}`;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            apiKey: generateApiKey(),
            username,
            displayName: user.name,
          },
        });
      }
    },
  },
  pages: {
    signIn: "/login",
  },
});
