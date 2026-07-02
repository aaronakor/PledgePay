import { Suspense } from 'react'
import { Card } from '@/components/ui/Card'
import PaymentCallbackContent from './PaymentCallbackContent'

function PaymentCallbackLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <Card className="text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-ink-muted">
              Verifying your payment...
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<PaymentCallbackLoading />}>
      <PaymentCallbackContent />
    </Suspense>
  )
}
