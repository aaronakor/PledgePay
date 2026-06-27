'use client'

import { ArrowLeft, UserCheck, CreditCard, Bell, CheckCircle, Handshake } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    icon: Handshake,
    title: 'Create a Pledge',
    description:
      'Set up a lending agreement with a friend or family member. Add the amount, purpose, and repayment terms.',
  },
  {
    icon: UserCheck,
    title: 'Borrower Accepts',
    description:
      'The borrower receives a link to review and accept the pledge terms. No account needed to accept.',
  },
  {
    icon: CreditCard,
    title: 'Fund the Pledge',
    description:
      'Once accepted, you fund the pledge. The borrower gets a payment schedule and reminders to repay.',
  },
  {
    icon: Bell,
    title: 'Automated Reminders',
    description:
      'Both parties receive polite reminders before and on the due date. Choose Light, Standard, or Strict reminders.',
  },
  {
    icon: CheckCircle,
    title: 'Track & Complete',
    description:
      'Track repayments in real-time. When all payments are made, the pledge is marked complete and both reputations grow.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/home"
          className="text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-serif text-ink">
          How PledgePay Works
        </h1>
      </div>

      <p className="text-sm text-ink-muted leading-relaxed">
        PledgePay helps you lend money to people you trust, with built-in
        reminders and tracking so everyone stays accountable.
      </p>

      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div
              key={step.title}
              className="flex gap-4 bg-white rounded-xl p-4 shadow-sm border border-border"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-700" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px flex-1 bg-primary-100" />
                )}
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <h3 className="text-sm font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-primary-50 rounded-xl p-5 border border-primary-100 mt-2">
        <h3 className="text-sm font-semibold text-primary-900 mb-1">
          Your trust score grows with every completed pledge
        </h3>
        <p className="text-sm text-primary-800 opacity-85 leading-relaxed">
          The more pledges you complete on time, the higher your reputation
          score. A higher score means more people will trust and lend to you.
        </p>
      </div>
    </div>
  )
}
