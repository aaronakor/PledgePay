'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function FundPledgePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/pledges/${params.id}/fund`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to confirm funding.')
        return
      }

      router.push(`/pledges/${params.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/pledges/${params.id}`}
          className="text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-serif text-ink">Confirm Funding</h1>
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-muted">
            Have you sent the money to the borrower through your bank,
            Moniepoint, PalmPay, or Opay?
          </p>
          <p className="text-sm text-ink-muted">
            Confirm below to mark this pledge as funded. Repayment tracking
            will begin immediately.
          </p>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex flex-col gap-3">
            <Button
              fullWidth
              loading={loading}
              onClick={handleConfirm}
            >
              Yes, I&apos;ve Funded This Pledge
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => router.push(`/pledges/${params.id}`)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
