import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const { pathname } = req.nextUrl

      const publicPaths = [
        '/',
        '/onboarding',
        '/login',
        '/register',
        '/api/auth',
        '/api/webhooks',
        '/api/cron',
        '/pledge',
      ]

      const isPublic = publicPaths.some((path) => pathname.startsWith(path))
      if (isPublic) return true

      return !!token
    },
  },
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
