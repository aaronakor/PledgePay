import { Suspense } from 'react'
import PaymentCallbackContent from './PaymentCallbackContent'

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  )
}
