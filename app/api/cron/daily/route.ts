import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mailer'
import { reminderTemplate } from '@/lib/email-templates/reminder'
import { formatDate } from '@/lib/format'

const REMINDER_SCHEDULES = {
  LIGHT: [14, 7, 1],
  STANDARD: [14, 7, 3, 1],
  STRICT: [21, 14, 7, 3, 1],
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const twentyFourHoursAgo = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    )

    // Expire old pending pledges
    await prisma.pledge.updateMany({
      where: {
        status: 'PENDING_ACCEPTANCE',
        createdAt: { lt: twentyFourHoursAgo },
      },
      data: { status: 'EXPIRED' },
    })

    // Expire old awaiting funding pledges
    await prisma.pledge.updateMany({
      where: {
        status: 'AWAITING_FUNDING',
        createdAt: { lt: twentyFourHoursAgo },
      },
      data: { status: 'EXPIRED' },
    })

    // Mark overdue
    const overduePledges = await prisma.pledge.updateMany({
      where: {
        status: 'ACTIVE',
        dueDate: { lt: now },
        outstandingBalance: { gt: 0 },
      },
      data: { status: 'OVERDUE' },
    })

    if (overduePledges.count > 0) {
      const overdueRecords = await prisma.pledge.findMany({
        where: {
          status: 'OVERDUE',
          dueDate: { lt: now },
          outstandingBalance: { gt: 0 },
        },
        select: {
          id: true,
          borrowerId: true,
        },
      })

      for (const p of overdueRecords) {
        if (p.borrowerId) {
          await prisma.activity.create({
            data: {
              pledgeId: p.id,
              actorId: p.borrowerId,
              eventType: 'PLEDGE_OVERDUE',
            },
          })
        }
      }
    }

    // Send reminders
    const activePledges = await prisma.pledge.findMany({
      where: { status: 'ACTIVE' },
      include: {
        borrower: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        lender: {
          select: {
            fullName: true,
          },
        },
      },
    })

    for (const pledge of activePledges) {
      const dueDate = new Date(pledge.dueDate)
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysUntilDue < 0) continue

      const schedule = REMINDER_SCHEDULES[pledge.reminderPreference]
      if (!schedule.includes(daysUntilDue)) continue

      if (!pledge.borrower) continue

      try {
        await sendEmail({
          to: pledge.borrower.email,
          subject: `Repayment reminder — ₦${(pledge.outstandingBalance / 100).toLocaleString('en-NG')}`,
          html: reminderTemplate({
            borrowerName: pledge.borrower.fullName,
            lenderName: pledge.lender.fullName,
            amount: pledge.outstandingBalance / 100,
            dueDate: formatDate(pledge.dueDate),
            daysLeft: daysUntilDue,
            pledgeLink: `${process.env.NEXT_PUBLIC_APP_URL}/pledges/${pledge.id}`,
          }),
        })

        await prisma.activity.create({
          data: {
            pledgeId: pledge.id,
            eventType: 'REMINDER_SENT',
          },
        })
      } catch (error) {
        console.error(
          '[cron] Failed to send reminder for pledge:',
          pledge.id,
          error
        )
      }
    }

    return Response.json({
      processed: true,
      expiredPending: true,
      expiredFunding: true,
      markedOverdue: overduePledges.count,
      remindersSent: activePledges.length,
    })
  } catch (error) {
    console.error('[cron] Daily job error:', error)
    return Response.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}
