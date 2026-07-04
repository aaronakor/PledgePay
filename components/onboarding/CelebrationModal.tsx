'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CelebrationModalProps {
  onContinue: () => void
}

export function CelebrationModal({ onContinue }: CelebrationModalProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 px-6 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center transform transition-all duration-300 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>

        <h2 className="text-xl font-bold text-ink mb-2">Profile Complete</h2>

        <p className="text-sm text-ink-muted leading-relaxed mb-8">
          You're all set.
          <br />
          Your account is ready for creating trusted financial commitments.
        </p>

        <Button fullWidth onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
