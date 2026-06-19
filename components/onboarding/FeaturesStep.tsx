'use client'

import { ScrollText, Bell, Wallet } from 'lucide-react'

const features = [
  {
    icon: ScrollText,
    title: 'Create a Pledge',
    desc: 'Set the terms — amount, deadline, and who it\'s for. Share a link to get their commitment.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    desc: 'Choose your reminder style: Light, Standard, or Strict. Never miss a deadline.',
  },
  {
    icon: Wallet,
    title: 'Track Payments',
    desc: 'See who has paid, who hasn\'t, and celebrate every completed pledge.',
  },
]

export function FeaturesStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl text-primary font-serif">How It Works</h2>
        <p className="text-sm text-ink-muted max-w-xs">
          Three simple steps to keep everyone accountable.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="flex items-start gap-3 text-left"
          >
            <div className="shrink-0 w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center mt-0.5">
              <feature.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary-500 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm font-medium text-ink">{feature.title}</p>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                {feature.desc}
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
