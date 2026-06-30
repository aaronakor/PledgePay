import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const pledge = await prisma.pledge.findUnique({
      where: { shareToken: token },
      select: {
        id: true,
        amount: true,
        purpose: true,
        dueDate: true,
        status: true,
        borrowerName: true,
        borrowerEmail: true,
        lender: { select: { fullName: true } },
      },
    })

    if (
      !pledge ||
      pledge.status === 'CANCELLED' ||
      pledge.status === 'EXPIRED'
    ) {
      return Response.json(
        { error: 'This pledge is no longer available.' },
        { status: 404 }
      )
    }

    return Response.json(pledge)
  } catch (error) {
    console.error('[GET /api/pledges/public/[token]]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
