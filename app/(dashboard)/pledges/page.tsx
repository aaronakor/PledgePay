'use client'

import { useRouter } from 'next/navigation'
import { Plus, Handshake } from 'lucide-react'
import styles from './Pledges.module.css'

export default function PledgesPage() {
  const router = useRouter()

  return (
    <div className={styles.page}>
      <div className={styles.iconWrap}>
        <Handshake className={styles.icon} />
      </div>

      <h1 className={styles.headline}>No pledges yet</h1>

      <p className={styles.body}>
          You haven&apos;t created or received any pledges yet. Create your first
          pledge and start building trust.
      </p>

      <div className={styles.actions}>
        <button
          onClick={() => router.push('/pledges/new')}
          className={styles.primaryButton}
        >
          <Plus className="w-5 h-5" />
          Create First Pledge
        </button>
      </div>

      <p className={styles.footnote}>
        Pledges help you keep promises and track repayments.
      </p>
    </div>
  )
}
