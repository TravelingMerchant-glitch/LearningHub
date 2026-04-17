/**
 * lib/auth.ts — NextAuth configuration placeholder
 *
 * TODO: Configure an authentication provider before going to production.
 *
 * Options:
 *   1. Email magic links (SMTP):
 *      - Install: npm install nodemailer
 *      - Add EMAIL_SERVER and EMAIL_FROM to .env
 *      - Uncomment the EmailProvider block below
 *
 *   2. OAuth providers (GitHub, Google, etc.):
 *      - Add provider credentials to .env
 *      - Import and add the provider to the `providers` array
 *
 *   3. Clerk (external auth service):
 *      - Install: npm install @clerk/nextjs
 *      - Follow https://clerk.com/docs/quickstarts/nextjs
 *
 * Required environment variables:
 *   NEXTAUTH_URL    — e.g. http://localhost:3000
 *   NEXTAUTH_SECRET — random string (openssl rand -base64 32)
 *
 * For database sessions (recommended), add the Prisma adapter:
 *   npm install @next-auth/prisma-adapter
 *   and import { PrismaAdapter } from "@next-auth/prisma-adapter"
 */

import type { NextAuthOptions } from "next-auth";
// import EmailProvider from "next-auth/providers/email";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  // TODO: Uncomment and configure a provider:
  // adapter: PrismaAdapter(prisma),
  providers: [
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default authOptions;
