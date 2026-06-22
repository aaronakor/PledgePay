'use client'

import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import styles from './FloatingNewPledge.module.css'

export function FloatingNewPledge() {
  const router = useRouter()

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => router.push('/pledges/new')}
        className={styles.button}
        aria-label="New Pledge"
      >
        <Plus className={styles.icon} />
      </button>
      <span className={styles.label}>New Pledge</span>
    </div>
  )
}
