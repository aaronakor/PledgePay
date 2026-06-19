'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { ActivityTimeline } from '@/components/pledge/ActivityTimeline'
import { formatNaira, formatDate } from '@/lib/format'
import type { PledgeDetail } from '@/types'

export default function PledgeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [pledge, setPledge] = useState<PledgeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    async function fetchPledge() {
      try {
        const res = await fetch(`/api/pledges/${params.id}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error('Not found')
          throw new Error('Failed to load')
        }
        const data = await res.json()
        setPledge(data)
        setShareUrl(
          `${window.location.origin}/pledge/${data.shareToken}`
        )
      } catch (err) {
        setError(
          err instanceof Error && err.message === 'Not found'
            ? 'Pledge not found.'
            : 'We could not load this pledge.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchPledge()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 w-32 bg-border rounded" />
        <div className="h-48 bg-white rounded-xl shadow-md" />
      </div>
    )
  }

  if (error || !pledge) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-sm text-error">{error}</p>
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const isLender = session?.user?.id === pledge.lenderId
  const perspective = isLender ? 'lender' : 'borrower'
  const counterpartyName = isLender
    ? pledge.borrowerName
    : pledge.lender?.fullName ?? 'Unknown'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-serif text-ink">Pledge Details</h1>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wide">
              {perspective === 'lender' ? 'Lent to' : 'Borrowed from'}
            </p>
            <p className="text-lg font-semibold text-ink">
              {counterpartyName}
            </p>
          </div>
          <StatusBadge status={pledge.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
          <div>
            <p className="text-xs text-ink-muted">Amount</p>
            <p className="text-xl font-serif text-ink tabular-nums">
              {formatNaira(pledge.amount / 100)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Outstanding</p>
            <p className="text-xl font-serif text-ink tabular-nums">
              {formatNaira(pledge.outstandingBalance / 100)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Due Date</p>
            <p className="text-sm font-medium text-ink">
              {formatDate(pledge.dueDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Purpose</p>
            <p className="text-sm font-medium text-ink">{pledge.purpose}</p>
          </div>
        </div>

        {pledge.status === 'PENDING_ACCEPTANCE' && isLender && (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-ink-muted">
              Share this link with the borrower to accept the pledge:
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 h-10 rounded-md border border-border bg-surface px-3 text-sm text-ink-muted"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl)
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </div>
        )}

        {pledge.status === 'ACTIVE' && !isLender && (
          <div className="mt-4">
            <Button fullWidth onClick={() => router.push(`/payments/${pledge.id}`)}>
              Pay Now
            </Button>
          </div>
        )}

        {pledge.status === 'AWAITING_FUNDING' && isLender && (
          <div className="mt-4">
            <Button
              fullWidth
              onClick={() => router.push(`/pledges/${pledge.id}/fund`)}
            >
              Confirm Funding
            </Button>
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-serif text-ink">Activity</h2>
        <ActivityTimeline events={pledge.activities} />
      </div>
    </div>
  )
}
