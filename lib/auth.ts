import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("[AUTH] Login attempt");

        console.log("[AUTH] Email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
           return null;
        }

        const email = credentials.email.toLowerCase();

        console.log("[AUTH] Normalized:", email);

        const user = await prisma.user.findUnique({
          where: { email },
        });

        console.log("[AUTH] User exists:", !!user);

        if (user) {
          console.log("[AUTH] User ID:", user.id);
        }

        const isValid = user
          ? await bcrypt.compare(credentials.password, user.passwordHash)
          : false;

        console.log("[AUTH] Password valid:", isValid);

        if (!isValid || !user) return null

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  secret: env.nextauthSecret,
}
