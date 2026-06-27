'use client'

import Image from 'next/image'

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center gap-0 -mt-8">
      {/* Hero Image — no rounded corners, blends into beige background */}
      <div className="relative w-full max-w-sm mx-auto">
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <Image
            src="/images/onboarding-hero.png"
            alt="PledgePay — Promises made. Goals met. Two people making a pledge together with reminders, payment schedules, and goal tracking."
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 640px) 100vw, 400px"
          />
          {/* Bottom gradient fade to blend into background */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24"
            style={{
              background: 'linear-gradient(to top, #FBEADB 0%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xs -mt-6 relative z-10">
        <p className="text-sm text-ink-muted text-center max-w-[280px] leading-relaxed">
          Create, manage, and track financial commitments with the people you trust.
        </p>

        <button
          onClick={onNext}
          className="w-full bg-primary text-white text-sm font-medium h-12 rounded-lg hover:bg-primary-800 active:scale-[0.98] transition-all duration-200 shadow-md"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
