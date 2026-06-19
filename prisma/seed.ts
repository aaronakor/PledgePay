import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const lender = await prisma.user.upsert({
    where: { email: 'lender@test.com' },
    update: {},
    create: {
      fullName: 'Emeka Okafor',
      email: 'lender@test.com',
      phoneNumber: '08012345678',
      passwordHash: await bcrypt.hash('password123', 12),
      bankName: 'GTBank',
      accountNumber: '0123456789',
      accountName: 'EMEKA OKAFOR',
      reputationScore: 75,
    },
  })

  const borrower = await prisma.user.upsert({
    where: { email: 'borrower@test.com' },
    update: {},
    create: {
      fullName: 'Chidi Nwosu',
      email: 'borrower@test.com',
      phoneNumber: '08098765432',
      passwordHash: await bcrypt.hash('password123', 12),
      reputationScore: 50,
    },
  })

  await prisma.pledge.upsert({
    where: { shareToken: 'test-token-active' },
    update: {},
    create: {
      shareToken: 'test-token-active',
      lenderId: lender.id,
      borrowerId: borrower.id,
      borrowerName: 'Chidi Nwosu',
      borrowerEmail: 'borrower@test.com',
      borrowerPhone: '08098765432',
      amount: 10000000,
      outstandingBalance: 8000000,
      purpose: 'Business stock',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      reminderPreference: 'STANDARD',
      acceptedAt: new Date(),
      fundedAt: new Date(),
    },
  })

  await prisma.pledge.upsert({
    where: { shareToken: 'test-token-pending' },
    update: {},
    create: {
      shareToken: 'test-token-pending',
      lenderId: lender.id,
      borrowerName: 'Amara Obi',
      borrowerEmail: 'amara@test.com',
      borrowerPhone: '08055555555',
      amount: 5000000,
      outstandingBalance: 5000000,
      purpose: 'School fees',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'PENDING_ACCEPTANCE',
      reminderPreference: 'LIGHT',
    },
  })

  console.log('Seed complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
