import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { firstLogin: false },
      select: { id: true, firstLogin: true },
    })

    return Response.json(user)
  } catch (error) {
    console.error('[PATCH /api/onboarding]', error)
    return Response.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}
