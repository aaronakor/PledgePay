import { prisma } from '@/lib/prisma'

export const REPUTATION_ACTIONS = {
  COMPLETED_PLEDGE: 5,
  ON_TIME_COMPLETION: 10,
  EARLY_COMPLETION: 15,
  OVERDUE_PLEDGE: -10,
  REPEATED_OVERDUE: -15,
  ABANDONED_PLEDGE: -20,
} as const

export const MAX_REPUTATION_SCORE = 100
export const MIN_REPUTATION_SCORE = 0

export async function updateReputation(
  userId: string,
  delta: number
): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { reputationScore: true },
  })

  if (!user) throw new Error('User not found')

  const newScore = Math.max(
    MIN_REPUTATION_SCORE,
    Math.min(MAX_REPUTATION_SCORE, user.reputationScore + delta)
  )

  await prisma.user.update({
    where: { id: userId },
    data: { reputationScore: newScore },
  })

  return newScore
}

export async function getReputationProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { reputationScore: true },
  })

  if (!user) throw new Error('User not found')

  const completedPledges = await prisma.pledge.count({
    where: {
      borrowerId: userId,
      status: 'COMPLETED',
    },
  })

  const totalCompleted = await prisma.pledge.count({
    where: {
      borrowerId: userId,
      status: { in: ['COMPLETED', 'OVERDUE'] },
    },
  })

  const onTimeCount = await prisma.pledge.count({
    where: {
      borrowerId: userId,
      status: 'COMPLETED',
      completedAt: { lte: undefined },
    },
  })

  const activeOverdue = await prisma.pledge.count({
    where: {
      borrowerId: userId,
      status: 'OVERDUE',
    },
  })

  const onTimeRate =
    totalCompleted > 0
      ? Math.round((onTimeCount / totalCompleted) * 100)
      : 0

  return {
    score: user.reputationScore,
    completedPledges,
    onTimeRate,
    activeOverdue,
    isNew: completedPledges === 0,
  }
}
