'use client'

import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter')

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('show'), 100)
    const showTimer = setTimeout(() => setPhase('exit'), 2200)
    const doneTimer = setTimeout(() => onDone(), 2600)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(showTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface transition-all duration-500 ${
        phase === 'enter'
          ? 'opacity-0'
          : phase === 'exit'
            ? 'opacity-0 scale-105'
            : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl text-primary font-serif">PledgePay</h1>
          <p className="text-xs text-ink-muted tracking-wider uppercase">
            Trust &amp; Accountability
          </p>
        </div>
      </div>
    </div>
  )
}
