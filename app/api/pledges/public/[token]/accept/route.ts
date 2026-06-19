import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const pledge = await prisma.pledge.findUnique({
      where: { shareToken: params.token },
    })

    if (!pledge) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    if (pledge.status !== 'PENDING_ACCEPTANCE') {
      return Response.json(
        { error: 'This pledge is not available for acceptance.' },
        { status: 409 }
      )
    }

    const updatedPledge = await prisma.pledge.update({
      where: { id: pledge.id },
      data: {
        borrowerId: session.user.id,
        status: 'AWAITING_FUNDING',
        acceptedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        acceptedAt: true,
      },
    })

    await prisma.activity.create({
      data: {
        pledgeId: pledge.id,
        actorId: session.user.id,
        eventType: 'PLEDGE_ACCEPTED',
      },
    })

    return Response.json(updatedPledge)
  } catch (error) {
    console.error('[POST /api/pledges/public/[token]/accept]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
