'use client'

import { Target, Shield, Handshake } from 'lucide-react'

const perks = [
  {
    icon: Target,
    title: 'Set Your Goals',
    desc: 'Define financial commitments that matter to you and your circle.',
  },
  {
    icon: Shield,
    title: 'Stay Accountable',
    desc: 'Gentle reminders keep everyone on track — no harassment, just results.',
  },
  {
    icon: Handshake,
    title: 'Build Trust',
    desc: 'Every completed pledge grows your reputation within the community.',
  },
]

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl text-primary font-serif">
          Welcome to PledgePay
        </h1>
        <p className="text-sm text-ink-muted max-w-xs">
          Accountability without harassment — create, manage, and track financial
          commitments with the people you trust.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {perks.map((perk) => (
          <div
            key={perk.title}
            className="flex items-start gap-3 text-left"
          >
            <div className="shrink-0 w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center mt-0.5">
              <perk.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-ink">{perk.title}</p>
              <p className="text-xs text-ink-muted leading-relaxed">
                {perk.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-xs bg-primary text-white text-sm font-medium h-12 rounded-md hover:bg-primary-800 transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
