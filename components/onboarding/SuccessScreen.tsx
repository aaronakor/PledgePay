'use client'

import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SuccessScreenProps {
  email: string
  onContinue: () => void
}

export function SuccessScreen({ email, onContinue }: SuccessScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-surface">
      <div className="max-w-sm w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2">
          Welcome to PledgePay
        </h1>

        <p className="text-sm text-ink-muted leading-relaxed mb-8">
          Your account has been created successfully.
          <br />
          <br />
          We've also sent a welcome email to{' '}
          <span className="text-ink font-medium">{email}</span>.
          <br />
          <br />
          Continue to sign in and finish setting up your account.
        </p>

        <Button fullWidth onClick={onContinue}>
          Continue to Sign In
        </Button>

        <p className="text-xs text-ink-faint mt-6 leading-relaxed">
          Didn't receive the email?
          <br />
          Check your Spam folder.
        </p>
      </div>
    </div>
  )
}
