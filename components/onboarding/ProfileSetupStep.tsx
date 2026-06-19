'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'

const purposes = [
  { value: 'borrow', label: 'Borrow money from friends' },
  { value: 'lend', label: 'Lend money to people I trust' },
  { value: 'group', label: 'Manage group contributions' },
  { value: 'other', label: 'Just exploring' },
]

export function ProfileSetupStep({
  initialName,
  onNext,
}: {
  initialName: string
  onNext: (name: string, purpose: string) => void
}) {
  const [name, setName] = useState(initialName)
  const [purpose, setPurpose] = useState('')

  const isValid = name.trim().length >= 2

  return (
    <div className="flex flex-col items-center text-center gap-8 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl text-primary font-serif">Tell us about you</h2>
        <p className="text-sm text-ink-muted max-w-xs">
          Help us tailor the experience. This helps your friends know who you are.
        </p>
      </div>

      <div className="flex flex-col gap-5 w-full max-w-xs text-left">
        <Input
          label="Your Name"
          placeholder="e.g. Chidi Okonkwo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">
            What brings you here?
          </label>
          <div className="flex flex-col gap-2">
            {purposes.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPurpose(p.value)}
                className={`text-left text-sm px-4 py-3 rounded-md border transition-colors ${
                  purpose === p.value
                    ? 'border-primary bg-primary-50 text-primary font-medium'
                    : 'border-border bg-gray-50 text-ink hover:border-ink-faint'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onNext(name.trim(), purpose)}
        disabled={!isValid}
        className="w-full max-w-xs bg-primary text-white text-sm font-medium h-12 rounded-md hover:bg-primary-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  )
}
