import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

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
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email.toLowerCase()

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )
        if (!isValid) return null

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
