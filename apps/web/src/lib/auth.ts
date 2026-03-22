import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { generateApiKey } from "@/lib/api-key";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user.id) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
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
