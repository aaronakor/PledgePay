import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.gmailUser,
    pass: env.gmailAppPassword,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> {
  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    html,
  })
}
