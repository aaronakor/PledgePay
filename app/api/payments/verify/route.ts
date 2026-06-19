import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyTransaction } from '@/lib/flutterwave'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const transactionRef = searchParams.get('ref')

  if (!transactionRef) {
    return Response.json(
      { error: 'Transaction reference is required.' },
      { status: 400 }
    )
  }

  try {
    const existingPayment = await prisma.payment.findUnique({
      where: { flutterwaveTransactionId: transactionRef },
    })

    if (existingPayment?.status === 'SUCCESSFUL') {
      return Response.json({ status: 'SUCCESSFUL', payment: existingPayment })
    }

    const verified = await verifyTransaction(transactionRef)

    if (!verified) {
      return Response.json({ status: 'PENDING' })
    }

    return Response.json({ status: 'SUCCESSFUL', verified })
  } catch (error) {
    console.error('[GET /api/payments/verify]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
