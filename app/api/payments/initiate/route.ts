import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { initiatePayment } from '@/lib/flutterwave'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { pledgeId, amount } = body as {
      pledgeId: string
      amount: number
    }

    if (!pledgeId || !amount || amount <= 0) {
      return Response.json(
        { error: 'Invalid payment request.' },
        { status: 400 }
      )
    }

    const pledge = await prisma.pledge.findUnique({
      where: { id: pledgeId },
      include: {
        lender: {
          select: {
            fullName: true,
            email: true,
          },
        },
        borrower: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    })

    if (!pledge) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    if (pledge.borrowerId !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (pledge.status !== 'ACTIVE' && pledge.status !== 'OVERDUE') {
      return Response.json(
        { error: 'This pledge is not in a repayable state.' },
        { status: 409 }
      )
    }

    const amountInKobo = Math.round(amount * 100)
    if (amountInKobo > pledge.outstandingBalance) {
      return Response.json(
        { error: 'Payment amount cannot exceed the outstanding balance.' },
        { status: 400 }
      )
    }

    const transactionRef = `PP-${pledge.shareToken}-${crypto.randomBytes(4).toString('hex')}`

    const paymentLink = await initiatePayment(
      amount,
      session.user.email!,
      pledge.borrowerPhone,
      session.user.name ?? 'Borrower',
      `${process.env.NEXT_PUBLIC_APP_URL}/payments/callback?pledgeId=${pledge.id}`,
      transactionRef
    )

    if (!paymentLink) {
      return Response.json(
        { error: 'Failed to initiate payment. Please try again.' },
        { status: 502 }
      )
    }

    return Response.json(paymentLink)
  } catch (error) {
    console.error('[POST /api/payments/initiate]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
