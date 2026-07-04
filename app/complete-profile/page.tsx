'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { CelebrationModal } from '@/components/onboarding/CelebrationModal'

export default function CompleteProfilePage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()

  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [notificationPref, setNotificationPref] = useState('email')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated') {
      if (session?.user?.profileComplete) {
        router.push('/home')
        return
      }
      setLoading(false)
    }
  }, [status, session, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankName, accountNumber, accountName }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save.')
        return
      }

      await update()
      setShowCelebration(true)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSkip() {
    setSaving(true)
    try {
      await fetch('/api/onboarding', { method: 'PATCH' })
      await update()
      router.push('/home')
    } catch {
      router.push('/home')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (showCelebration) {
    return (
      <CelebrationModal onContinue={() => {
        fetch('/api/onboarding', { method: 'PATCH' }).then(() => {
          update()
          router.push('/home')
        })
      }} />
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <div className="flex-1 max-w-sm w-full mx-auto px-6 pt-12 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push('/home')}
            className="text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif text-ink">
              Complete your profile
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Help people trust you by completing your account. This only takes
              about a minute.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Card>
            <h2 className="text-base font-semibold text-ink mb-4">
              Bank Details
            </h2>
            <p className="text-xs text-ink-muted mb-4">
              This is where repayments will be sent. Only you can see this
              information.
            </p>
            <div className="flex flex-col gap-4">
              <Input
                label="Bank Name"
                placeholder="e.g. GTBank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
              <Input
                label="Account Number"
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
              <Input
                label="Account Name"
                placeholder="Full account name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-ink mb-4">
              Notification Preference
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS' },
                { value: 'both', label: 'Both Email & SMS' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    notificationPref === opt.value
                      ? 'border-primary bg-primary-50'
                      : 'border-border hover:border-ink-faint'
                  }`}
                >
                  <input
                    type="radio"
                    name="notificationPref"
                    value={opt.value}
                    checked={notificationPref === opt.value}
                    onChange={(e) => setNotificationPref(e.target.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-ink">{opt.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {error && (
            <p className="text-sm text-error text-center">{error}</p>
          )}

          <Button type="submit" loading={saving} fullWidth>
            Complete Profile
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Skip for now
            </button>
            <p className="text-xs text-ink-faint mt-1">
              You can always complete your profile later in Settings.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
