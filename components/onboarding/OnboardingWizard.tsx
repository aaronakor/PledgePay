'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useOnboardingStore } from '@/lib/onboarding-store'
import { WelcomeStep } from './WelcomeStep'
import { FeaturesStep } from './FeaturesStep'
import { ProfileSetupStep } from './ProfileSetupStep'
import { ReadyStep } from './ReadyStep'

const TOTAL_STEPS = 4

export function OnboardingWizard() {
  const router = useRouter()
  const { step, data, setStep, updateData, reset } = useOnboardingStore()
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [animKey, setAnimKey] = useState(0)

  const goNext = useCallback(() => {
    setDirection('forward')
    setAnimKey((k) => k + 1)
    setStep(Math.min(step + 1, TOTAL_STEPS - 1))
  }, [step, setStep])

  const goBack = useCallback(() => {
    setDirection('back')
    setAnimKey((k) => k + 1)
    setStep(Math.max(step - 1, 0))
  }, [step, setStep])

  const handleProfileDone = useCallback(
    (name: string, purpose: string) => {
      updateData({ fullName: name, purpose })
      goNext()
    },
    [updateData, goNext]
  )

  const handleStart = useCallback(() => {
    reset()
    const params = new URLSearchParams()
    if (data.fullName) params.set('name', data.fullName)
    router.push(`/register?${params.toString()}`)
  }, [data.fullName, reset, router])

  const handleSkip = useCallback(() => {
    reset()
    router.push('/login')
  }, [reset, router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-sm w-full">
        <div className="flex flex-col gap-2 mb-8 text-center">
          <span className="text-xl text-primary font-serif">PledgePay</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i <= step
                  ? 'w-6 bg-primary'
                  : 'w-6 bg-border'
              }`}
            />
          ))}
        </div>

        <div className="relative overflow-hidden">
          <div
            key={animKey}
            className={
              direction === 'forward' ? 'animate-fade-in-up' : 'animate-fade-in-down'
            }
          >
            {step === 0 && <WelcomeStep onNext={goNext} />}
            {step === 1 && <FeaturesStep onNext={goNext} />}
            {step === 2 && (
              <ProfileSetupStep
                initialName={data.fullName}
                onNext={handleProfileDone}
              />
            )}
            {step === 3 && (
              <ReadyStep
                name={data.fullName}
                onStart={handleStart}
                onSkip={handleSkip}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS - 1 && (
            <button
              onClick={handleSkip}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
