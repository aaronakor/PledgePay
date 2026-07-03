import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mailer'
import { welcomeTemplate } from '@/lib/email-templates/welcome'
import { env } from '@/lib/env'

const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phoneNumber: z.string().min(11, 'Enter a valid Nigerian phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = RegisterSchema.parse(body)
    validated.email = validated.email.toLowerCase()

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validated.email },
          { phoneNumber: validated.phoneNumber },
        ],
      },
    })

    if (existingUser) {
      const field =
        existingUser.email === validated.email ? 'email' : 'phone number'
      return Response.json(
        { error: `A user with this ${field} already exists.` },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(validated.password, 12)

    console.log('========== REGISTER START ==========')
    console.log('Creating user with:', {
      fullName: validated.fullName,
      email: validated.email,
      phoneNumber: validated.phoneNumber,
    })

    const user = await prisma.user.create({
      data: {
        fullName: validated.fullName,
        email: validated.email,
        phoneNumber: validated.phoneNumber,
        passwordHash,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    })

    console.log('User successfully created:')
    console.log(user)

    sendEmail({
      to: validated.email,
      subject: 'Welcome to PledgePay',
      html: welcomeTemplate({ fullName: validated.fullName, appUrl: env.appUrl }),
    }).catch((err) => console.error('[WELCOME EMAIL]', err))

    console.log('Returning success response.')
    console.log('========== REGISTER END ==========')
    return Response.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('========== REGISTER ERROR ==========')
    console.error(error)

    if (error instanceof Error) {
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
    }

    console.error('====================================')
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
