'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ProfileReminderCard() {
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-primary/10 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-ink-faint hover:text-ink transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <h3 className="text-sm font-bold text-ink mb-1">Complete your profile</h3>
      <p className="text-xs text-ink-muted leading-relaxed mb-3">
        Adding your bank details makes repayments smoother and helps build
        trust.
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => router.push('/complete-profile')}>
          Complete Profile
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs text-ink-muted hover:text-ink px-2 py-1 transition-colors"
        >
          Not Now
        </button>
      </div>
    </div>
  )
}
