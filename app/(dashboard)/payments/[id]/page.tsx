'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatNaira, formatDate } from '@/lib/format'

interface PledgeData {
  id: string
  amount: number
  outstandingBalance: number
  purpose: string
  dueDate: string
  status: string
  borrowerName: string
  lender: { fullName: string }
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const [pledge, setPledge] = useState<PledgeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payFull, setPayFull] = useState(true)
  const [customAmount, setCustomAmount] = useState('')

  useEffect(() => {
    async function fetchPledge() {
      try {
        const res = await fetch(`/api/pledges/${params.id}`)
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setPledge(data)
      } catch {
        setError('Could not load pledge.')
      } finally {
        setLoading(false)
      }
    }
    fetchPledge()
  }, [params.id])

  async function handlePay() {
    const amount = payFull
      ? (pledge?.outstandingBalance ?? 0) / 100
      : parseFloat(customAmount)

    if (!amount || amount <= 0) {
      setError('Enter a valid amount.')
      return
    }

    setPaying(true)
    setError(null)

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pledgeId: params.id,
          amount,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to initiate payment.')
        return
      }

      if (data.link) {
        window.location.href = data.link
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setPaying(false)
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

  if (error && !pledge) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-sm text-error">{error}</p>
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    )
  }

  if (!pledge) return null

  const outstandingNaira = pledge.outstandingBalance / 100

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/pledges/${params.id}`}
          className="text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-serif text-ink">Make Repayment</h1>
      </div>

      <Card>
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-xs text-ink-muted">To</p>
          <p className="text-base font-semibold text-ink">
            {pledge.lender.fullName}
          </p>
          <p className="text-xs text-ink-faint">{pledge.purpose}</p>
        </div>

        <div className="py-4 border-y border-border">
          <p className="text-xs text-ink-muted mb-1">Outstanding Balance</p>
          <p className="text-3xl font-serif text-ink tabular-nums">
            {formatNaira(outstandingNaira)}
          </p>
          <p className="text-xs text-ink-faint mt-1">
            Due {formatDate(pledge.dueDate)}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm font-medium text-ink">Select Amount</p>

          <label className="flex items-center gap-3 p-3 rounded-md border border-primary bg-primary-50 cursor-pointer">
            <input
              type="radio"
              name="paymentOption"
              checked={payFull}
              onChange={() => setPayFull(true)}
              className="text-primary"
            />
            <div>
              <p className="text-sm font-medium text-ink">
                Pay Full Amount
              </p>
              <p className="text-xs text-ink-muted">
                {formatNaira(outstandingNaira)}
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-md border border-border cursor-pointer hover:bg-surface">
            <input
              type="radio"
              name="paymentOption"
              checked={!payFull}
              onChange={() => setPayFull(false)}
            />
            <div>
              <p className="text-sm font-medium text-ink">
                Pay Custom Amount
              </p>
            </div>
          </label>

          {!payFull && (
            <Input
              label="Amount"
              prefix="₦"
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              min="1"
              max={outstandingNaira}
            />
          )}

          <p className="text-xs text-ink-muted">
            Processing fee applies. You will see the total before confirming.
          </p>

          {error && <p className="text-sm text-error">{error}</p>}

          <Button fullWidth loading={paying} onClick={handlePay}>
            Continue to Payment
          </Button>
        </div>
      </Card>
    </div>
  )
}
