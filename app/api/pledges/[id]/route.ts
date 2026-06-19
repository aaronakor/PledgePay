import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const pledge = await prisma.pledge.findUnique({
      where: { id: params.id },
      include: {
        lender: {
          select: { id: true, fullName: true, email: true },
        },
        borrower: {
          select: { id: true, fullName: true, email: true },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!pledge) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    if (
      pledge.lenderId !== session.user.id &&
      pledge.borrowerId !== session.user.id
    ) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json(pledge)
  } catch (error) {
    console.error('[GET /api/pledges/[id]]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
