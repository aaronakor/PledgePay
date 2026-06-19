import Link from 'next/link'
import { HandshakeIllustration } from '@/components/HandshakeIllustration'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-surface">
      <div className="max-w-sm w-full flex flex-col items-center gap-10">
        <div className="w-56 h-56">
          <HandshakeIllustration />
        </div>

        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl font-serif text-primary">PledgePay</h1>
          <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
            Accountability without harassment. Create, manage, and track financial
            commitments with the people you trust.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/auth"
            className="w-full bg-primary text-white text-sm font-medium h-12 rounded-md inline-flex items-center justify-center hover:bg-primary-800 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/auth"
            className="w-full bg-white border border-primary text-primary text-sm font-medium h-12 rounded-md inline-flex items-center justify-center hover:bg-primary-50 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  )
}
