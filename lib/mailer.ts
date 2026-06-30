import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

function createTransporter() {
  if (!env.gmailUser || !env.gmailAppPassword) {
    return null
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.gmailUser,
      pass: env.gmailAppPassword,
    },
  })
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> {
  const transporter = createTransporter()
  if (!transporter) {
    console.warn('[mailer] Email not sent: Gmail credentials not configured.')
    return
  }
  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    html,
  })
}
