'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface DashboardWelcomeProps {
  profileComplete: boolean
  onDismiss: () => void
}

export function DashboardWelcome({
  profileComplete,
  onDismiss,
}: DashboardWelcomeProps) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  if (profileComplete) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-success/20">
        <p className="text-2xl mb-2">🎉</p>
        <h2 className="text-lg font-bold text-ink mb-1">
          Welcome to PledgePay!
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-4">
          Everything is ready. Create your first pledge and start building
          trust.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            fullWidth
            onClick={() => router.push('/pledges/new')}
          >
            Create First Pledge
          </Button>
          <button
            onClick={onDismiss}
            className="text-sm text-ink-muted hover:text-ink py-1 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-primary/20">
      <p className="text-2xl mb-2">👋</p>
      <h2 className="text-lg font-bold text-ink mb-1">
        Welcome to PledgePay!
      </h2>
      <p className="text-sm text-ink-muted leading-relaxed mb-4">
        You're ready to explore. Completing your profile helps people trust you
        and allows faster repayments.
      </p>
      <div className="flex flex-col gap-2">
        <Button fullWidth onClick={() => router.push('/complete-profile')}>
          Complete Profile
        </Button>
        <button
          onClick={onDismiss}
          className="text-sm text-ink-muted hover:text-ink py-1 transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  )
}
