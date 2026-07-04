'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Banknote, Plus } from 'lucide-react'
import { PledgeCard } from '@/components/pledge/PledgeCard'
import { PledgeCardSkeleton } from '@/components/pledge/PledgeCardSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { DashboardWelcome } from '@/components/onboarding/DashboardWelcome'
import { ProfileReminderCard } from '@/components/onboarding/ProfileReminderCard'
import type { PledgeSummary } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [pledges, setPledges] = useState<PledgeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [welcomeDismissed, setWelcomeDismissed] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status !== 'authenticated') return

    async function fetchPledges() {
      try {
        const res = await fetch('/api/pledges')
        if (!res.ok) throw new Error('Failed to load pledges')
        const data = await res.json()
        setPledges(data)
      } catch {
        setError('We could not load your pledges. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchPledges()
  }, [status, router])

  async function handleWelcomeDismiss() {
    await fetch('/api/onboarding', { method: 'PATCH' })
    update()
    setWelcomeDismissed(true)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 bg-border rounded animate-pulse mb-2" />
        {[1, 2, 3].map((i) => <PledgeCardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-error text-center py-8">{error}</p>
    )
  }

  const profileComplete = session?.user?.profileComplete ?? true
  const firstLogin = session?.user?.firstLogin ?? false
  const showWelcome = firstLogin && !welcomeDismissed

  return (
    <div className="flex flex-col gap-6">
      {showWelcome && (
        <DashboardWelcome
          profileComplete={profileComplete}
          onDismiss={handleWelcomeDismiss}
        />
      )}

      {!profileComplete && !showWelcome && <ProfileReminderCard />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-ink">
            Hello, {session?.user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-ink-muted">Your pledges</p>
        </div>
        <Button
          size="sm"
          onClick={() => router.push('/pledges/new')}
        >
          <Plus className="w-4 h-4" />
          New Pledge
        </Button>
      </div>

      {pledges.length === 0 ? (
        <EmptyState
          icon={Banknote}
          title="No pledges yet"
          description="Create your first pledge to start tracking a commitment."
          action={{
            label: 'Create Pledge',
            onClick: () => router.push('/pledges/new'),
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {pledges.map((pledge) => (
            <PledgeCard
              key={pledge.id}
              pledge={pledge}
              perspective="lender"
              onClick={() => router.push(`/pledges/${pledge.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
