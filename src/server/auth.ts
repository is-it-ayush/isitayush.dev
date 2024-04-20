import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import { db } from "@src/server/db";

// https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
    };
  }

  interface User {
    id: string;
    username: string;
  }
}

// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        username: user.username,
        email: user.email,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    // email is not supported in oauth 2.0 for twitter.
    TwitterProvider({
      clientId: process.env.TWITTER_ID ?? "",
      clientSecret: process.env.TWITTER_SECRET ?? "",
      version: "2.0",
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          username: profile.data.username,
          email: profile.data.email,
          image: profile.data.profile_image_url,
        };
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
};

// no need pass authOptions everywhere
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
