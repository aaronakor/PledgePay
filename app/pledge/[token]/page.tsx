'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatNaira, formatDate } from '@/lib/format'
import type { PledgeStatus } from '@/types'

interface PublicPledge {
  id: string
  amount: number
  purpose: string
  dueDate: string
  status: PledgeStatus
  borrowerName: string
  borrowerEmail: string
  lender: { fullName: string }
}

export default function AcceptPledgePage() {
  const params = useParams()
  const router = useRouter()
  const [pledge, setPledge] = useState<PublicPledge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    async function fetchPledge() {
      try {
        const res = await fetch(`/api/pledges/public/${params.token}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error('not available')
          throw new Error('Failed to load')
        }
        const data = await res.json()
        setPledge(data)
      } catch (err) {
        setError(
          err instanceof Error && err.message === 'not available'
            ? 'This pledge is no longer available.'
            : 'We could not load this pledge.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchPledge()
  }, [params.token])

  async function handleAccept() {
    setAccepting(true)
    setError(null)

    try {
      const res = await fetch(`/api/pledges/public/${params.token}/accept`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to accept pledge.')
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm animate-pulse">
          <div className="h-48 bg-white rounded-xl shadow-md" />
        </div>
      </div>
    )
  }

  if (error || !pledge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Card className="text-center">
          <p className="text-sm text-ink-muted">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-sm w-full flex flex-col gap-6">
        <div className="text-center">
          <p className="text-xl text-primary font-serif mb-1">PledgePay</p>
          <p className="text-xs text-ink-muted">
            You have received a pledge
          </p>
        </div>

        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-ink-muted font-medium uppercase tracking-wide">
                  From
                </p>
                <p className="text-base font-semibold text-ink">
                  {pledge.lender.fullName}
                </p>
              </div>
              <StatusBadge status={pledge.status} />
            </div>

            <div className="py-4 border-y border-border flex flex-col gap-1">
              <p className="text-xs text-ink-muted">Amount</p>
              <p className="text-3xl font-serif text-ink tabular-nums">
                {formatNaira(pledge.amount / 100)}
              </p>
              <p className="text-sm text-ink-muted">{pledge.purpose}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-muted">Due Date</p>
                <p className="text-sm font-medium text-ink">
                  {formatDate(pledge.dueDate)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <p className="text-xs text-ink-muted text-center">
            By accepting, you agree to repay this amount by the due date.
          </p>
          <Button
            fullWidth
            loading={accepting}
            onClick={handleAccept}
          >
            Accept Pledge
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => router.push('/login')}
          >
            Sign In First
          </Button>
        </div>

        {error && (
          <p className="text-sm text-error text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
