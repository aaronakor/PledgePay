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
  console.log('[MAILER] Creating transporter...')
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
  console.log('[MAILER] Sending email to:', to)
  try {
    const info = await transporter.sendMail({
      from: env.emailFrom,
      to,
      subject,
      html,
    })
    console.log('[MAILER] Email sent successfully')
    console.log('[MAILER] Message ID:', info.messageId)
    console.log('[MAILER] Accepted:', info.accepted)
    console.log('[MAILER] Rejected:', info.rejected)
    console.log('[MAILER] Response:', info.response)
  } catch (error) {
    console.error('[MAILER ERROR]', error)
    throw error
  }
}
