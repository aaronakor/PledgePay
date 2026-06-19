import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mailer'
import type { NotificationType } from '@/types'

interface CreateNotificationInput {
  userId: string
  type: NotificationType
  title: string
  message: string
}

export async function createNotification({
  userId,
  type,
  title,
  message,
}: CreateNotificationInput) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  })

  return notification
}

export async function createAndSendNotification(
  input: CreateNotificationInput & { email?: string; emailHtml?: string }
) {
  await createNotification({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
  })

  if (input.email && input.emailHtml) {
    try {
      await sendEmail({
        to: input.email,
        subject: input.title,
        html: input.emailHtml,
      })
    } catch (error) {
      console.error('[notifications] Failed to send email:', error)
    }
  }
}
