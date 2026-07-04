import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateProfileSchema = z.object({
  bankName: z.string().min(1).optional(),
  accountNumber: z.string().min(10).optional(),
  accountName: z.string().min(1).optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
        reputationScore: true,
        profileComplete: true,
        createdAt: true,
      },
    })

    if (!user) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    if (
      !user.profileComplete &&
      user.bankName &&
      user.accountNumber &&
      user.accountName
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: { profileComplete: true },
      })
      user.profileComplete = true
    }

    return Response.json(user)
  } catch (error) {
    console.error('[GET /api/profile]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = UpdateProfileSchema.parse(body)

    const hasAllBankFields =
      validated.bankName && validated.accountNumber && validated.accountName

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...validated,
        ...(hasAllBankFields ? { profileComplete: true } : {}),
      },
      select: {
        id: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
        profileComplete: true,
      },
    })

    return Response.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('[PATCH /api/profile]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
