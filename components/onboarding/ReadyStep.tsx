'use client'

import { Sparkles } from 'lucide-react'

export function ReadyStep({
  name,
  onStart,
  onSkip,
}: {
  name: string
  onStart: () => void
  onSkip: () => void
}) {
  const displayName = name || 'there'

  return (
    <div className="flex flex-col items-center text-center gap-8 py-4">
      <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl text-primary font-serif">
          You&apos;re all set, {displayName.split(' ')[0]}!
        </h2>
        <p className="text-sm text-ink-muted max-w-xs">
          You&apos;re just one step away from creating your first pledge and
          building your reputation.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onStart}
          className="w-full bg-primary text-white text-sm font-medium h-12 rounded-md hover:bg-primary-800 transition-colors"
        >
          Create Your Account
        </button>
        <button
          onClick={onSkip}
          className="w-full text-sm text-ink-muted font-medium h-10 hover:text-ink transition-colors"
        >
          Skip to sign in
        </button>
      </div>
    </div>
  )
}
