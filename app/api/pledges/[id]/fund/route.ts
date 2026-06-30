import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const pledge = await prisma.pledge.findUnique({
      where: { id },
    })

    if (!pledge) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    if (pledge.lenderId !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (pledge.status !== 'AWAITING_FUNDING') {
      return Response.json(
        { error: 'Pledge is not awaiting funding.' },
        { status: 409 }
      )
    }

    let body: { proofOfFundingUrl?: string }
    try {
      body = await req.json()
    } catch {
      return Response.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const updatedPledge = await prisma.pledge.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        fundedAt: new Date(),
        proofOfFundingUrl: body.proofOfFundingUrl ?? null,
      },
      select: {
        id: true,
        status: true,
        fundedAt: true,
      },
    })

    await prisma.activity.create({
      data: {
        pledgeId: id,
        actorId: session.user.id,
        eventType: 'FUNDING_CONFIRMED',
      },
    })

    return Response.json(updatedPledge)
  } catch (error) {
    console.error('[POST /api/pledges/[id]/fund]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
