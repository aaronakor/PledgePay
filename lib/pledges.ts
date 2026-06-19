import { prisma } from '@/lib/prisma'
import type { CreatePledgeInput } from '@/lib/validations/pledge'

export async function createPledge(
  data: CreatePledgeInput,
  lenderId: string
) {
  const amountInKobo = Math.round(data.amount * 100)

  const pledge = await prisma.pledge.create({
    data: {
      lenderId,
      borrowerName: data.borrowerName,
      borrowerEmail: data.borrowerEmail,
      borrowerPhone: data.borrowerPhone,
      amount: amountInKobo,
      outstandingBalance: amountInKobo,
      purpose: data.purpose,
      dueDate: new Date(data.dueDate),
      reminderPreference: data.reminderPreference,
    },
    select: {
      id: true,
      shareToken: true,
      amount: true,
      purpose: true,
      dueDate: true,
      status: true,
      createdAt: true,
    },
  })

  return pledge
}

export async function getUserPledges(
  userId: string,
  options?: { status?: string }
) {
  const where: Record<string, unknown> = {
    OR: [{ lenderId: userId }, { borrowerId: userId }],
  }

  if (options?.status) {
    where.status = options.status
  }

  const pledges = await prisma.pledge.findMany({
    where,
    select: {
      id: true,
      amount: true,
      outstandingBalance: true,
      purpose: true,
      dueDate: true,
      status: true,
      borrowerName: true,
      lender: { select: { fullName: true } },
      borrower: { select: { fullName: true } },
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return pledges.map((p) => ({
    id: p.id,
    amount: p.amount,
    outstandingBalance: p.outstandingBalance,
    purpose: p.purpose,
    dueDate: p.dueDate,
    status: p.status,
    borrowerName: p.borrowerName,
    lenderName: p.lender.fullName,
    createdAt: p.createdAt,
  }))
}
