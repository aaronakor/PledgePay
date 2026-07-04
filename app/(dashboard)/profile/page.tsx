'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProfileReputationCard } from '@/components/home/ProfileReputationCard'
import { signOut } from 'next-auth/react'

interface Profile {
  fullName: string
  email: string
  phoneNumber: string
  bankName: string | null
  accountNumber: string | null
  accountName: string | null
  reputationScore: number
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()
        setProfile(data)
        setBankName(data.bankName ?? '')
        setAccountNumber(data.accountNumber ?? '')
        setAccountName(data.accountName ?? '')
      } catch {
        setError('Could not load profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName,
          accountNumber,
          accountName,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save.')
        return
      }

      setSuccess('Bank details saved.')
      await update()
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 w-32 bg-border rounded" />
        <div className="h-48 bg-white rounded-xl shadow-md" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/home"
          className="text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-serif text-ink">Profile</h1>
      </div>

      {profile && <ProfileReputationCard score={profile.reputationScore} />}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-ink">
            Bank Details
          </h2>
          <Link
            href="/settings"
            className="text-ink-muted hover:text-primary-700 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
        <p className="text-xs text-ink-muted mb-4">
          This is where repayments will be sent. Only you can see this
          information.
        </p>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
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

          {error && <p className="text-sm text-error">{error}</p>}
          {success && (
            <p className="text-sm text-success">{success}</p>
          )}

          <Button type="submit" loading={saving} fullWidth>
            Save Bank Details
          </Button>
        </form>
      </Card>

      <div className="flex flex-col gap-3 mt-4">
        <Button
          variant="ghost"
          fullWidth
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
