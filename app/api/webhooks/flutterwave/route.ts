import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyFlutterwaveWebhook,
  verifyTransaction,
} from '@/lib/flutterwave'
import { updateReputation, REPUTATION_ACTIONS } from '@/lib/reputation'
import { createAndSendNotification } from '@/lib/notifications'
import { paymentReceivedTemplate } from '@/lib/email-templates/payment-received'
import { pledgeCompletedTemplate } from '@/lib/email-templates/pledge-completed'

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('verif-hash') ?? ''

  if (!verifyFlutterwaveWebhook(payload, signature)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const event = JSON.parse(payload)

  if (event.event !== 'charge.completed') {
    return Response.json({ received: true }, { status: 200 })
  }

  const { tx_ref, id: transactionId, flw_ref, amount } = event.data

  try {
    const existingPayment = await prisma.payment.findUnique({
      where: { flutterwaveTransactionId: flw_ref },
    })

    if (existingPayment?.status === 'SUCCESSFUL') {
      return Response.json({ received: true }, { status: 200 })
    }

    const verified = await verifyTransaction(String(transactionId))
    if (!verified) {
      console.error(
        '[webhook] Transaction verification failed:',
        transactionId
      )
      return Response.json({ received: true }, { status: 200 })
    }

    const pledge = await prisma.pledge.findUnique({
      where: { shareToken: tx_ref },
      include: {
        lender: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        borrower: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    })

    if (!pledge) {
      console.error('[webhook] Pledge not found for ref:', tx_ref)
      return Response.json({ received: true }, { status: 200 })
    }

    const paymentAmountInKobo = Math.round(amount * 100)

    await prisma.$transaction(async (tx) => {
      await tx.payment.upsert({
        where: { flutterwaveTransactionId: flw_ref },
        create: {
          pledgeId: pledge.id,
          amount: paymentAmountInKobo,
          flutterwaveTransactionId: flw_ref,
          flutterwaveRef: flw_ref,
          status: 'SUCCESSFUL',
          paidAt: new Date(),
        },
        update: {
          status: 'SUCCESSFUL',
          paidAt: new Date(),
        },
      })

      const newBalance = pledge.outstandingBalance - paymentAmountInKobo
      const isCompleted = newBalance <= 0

      await tx.pledge.update({
        where: { id: pledge.id },
        data: {
          outstandingBalance: Math.max(0, newBalance),
          status: isCompleted ? 'COMPLETED' : pledge.status,
          completedAt: isCompleted ? new Date() : pledge.completedAt,
        },
      })

      await tx.activity.create({
        data: {
          pledgeId: pledge.id,
          actorId: pledge.borrowerId,
          eventType: 'PAYMENT_RECEIVED',
          metadata: { amount: paymentAmountInKobo },
        },
      })

      if (isCompleted) {
        await tx.activity.create({
          data: {
            pledgeId: pledge.id,
            actorId: pledge.borrowerId,
            eventType: 'PLEDGE_COMPLETED',
          },
        })
      }
    })

    if (pledge.lender?.id) {
      await createAndSendNotification({
        userId: pledge.lender.id,
        type: 'PAYMENT_RECEIVED',
        title: 'Payment received',
        message: `${pledge.borrowerName} repaid ₦${amount.toLocaleString('en-NG')}.`,
        email: pledge.lender.email,
        emailHtml: paymentReceivedTemplate({
          lenderName: pledge.lender.fullName,
          borrowerName: pledge.borrowerName,
          amount,
          outstandingBalance: Math.max(0, pledge.outstandingBalance - paymentAmountInKobo) / 100,
          pledgeLink: `${process.env.NEXT_PUBLIC_APP_URL}/pledges/${pledge.id}`,
        }),
      })
    }

    if (pledge.borrower) {
      const newBalance = pledge.outstandingBalance - paymentAmountInKobo
      if (newBalance <= 0) {
        await updateReputation(
          pledge.borrower.id,
          REPUTATION_ACTIONS.COMPLETED_PLEDGE +
            REPUTATION_ACTIONS.ON_TIME_COMPLETION
        )

        await createAndSendNotification({
          userId: pledge.borrower.id,
          type: 'PLEDGE_COMPLETED',
          title: 'Pledge completed',
          message: `You have fully repaid your pledge to ${pledge.lender.fullName}.`,
          email: pledge.borrower.email,
          emailHtml: pledgeCompletedTemplate({
            name: pledge.borrower.fullName,
            counterpartyName: pledge.lender.fullName,
            amount,
            role: 'borrower',
          }),
        })

        if (pledge.lender) {
          await createAndSendNotification({
            userId: pledge.lender.id,
            type: 'PLEDGE_COMPLETED',
            title: 'Pledge completed',
            message: `${pledge.borrowerName} has fully repaid the pledge.`,
            email: pledge.lender.email,
            emailHtml: pledgeCompletedTemplate({
              name: pledge.lender.fullName,
              counterpartyName: pledge.borrowerName,
              amount,
              role: 'lender',
            }),
          })
        }
      }
    }

    return Response.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[webhook] Processing error:', error)
    return Response.json({ received: true }, { status: 200 })
  }
}
