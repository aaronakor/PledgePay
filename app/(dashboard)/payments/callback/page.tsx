'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, XCircle } from 'lucide-react'

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading'
  )
  const pledgeId = searchParams.get('pledgeId')

  useEffect(() => {
    const transactionStatus = searchParams.get('status')
    const transactionRef = searchParams.get('tx_ref')

    if (transactionStatus === 'successful' || transactionStatus === 'completed') {
      setStatus('success')
    } else if (transactionStatus === 'failed' || transactionStatus === 'cancelled') {
      setStatus('failed')
    } else {
      const timer = setTimeout(() => {
        setStatus('success')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full">
        {status === 'loading' && (
          <Card className="text-center">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-sm text-ink-muted">
                Verifying your payment...
              </p>
            </div>
          </Card>
        )}

        {status === 'success' && (
          <Card className="text-center">
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle className="w-12 h-12 text-success" />
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-ink">
                  Payment Successful
                </p>
                <p className="text-sm text-ink-muted">
                  Your repayment has been received.
                </p>
              </div>
              <Button
                fullWidth
                onClick={() =>
                  router.push(
                    pledgeId ? `/pledges/${pledgeId}` : '/dashboard'
                  )
                }
              >
                View Pledge
              </Button>
            </div>
          </Card>
        )}

        {status === 'failed' && (
          <Card className="text-center">
            <div className="flex flex-col items-center gap-4 py-4">
              <XCircle className="w-12 h-12 text-error" />
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-ink">
                  Payment Failed
                </p>
                <p className="text-sm text-ink-muted">
                  Payment failed. Please try again.
                </p>
              </div>
              <Button
                fullWidth
                onClick={() =>
                  router.push(
                    pledgeId ? `/payments/${pledgeId}` : '/dashboard'
                  )
                }
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
