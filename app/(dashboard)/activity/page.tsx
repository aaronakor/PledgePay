'use client'

import { Bell, CheckCircle, Wallet } from 'lucide-react'
import styles from './Activity.module.css'

const placeholders = [
  {
    icon: Bell,
    title: 'Reminder Sent',
    description: 'A reminder was sent for an upcoming due date.',
  },
  {
    icon: Wallet,
    title: 'Payment Received',
    description: 'A repayment was received successfully.',
  },
  {
    icon: CheckCircle,
    title: 'Pledge Completed',
    description: 'All payments fulfilled. Pledge is complete.',
  },
] as const

export default function ActivityPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.illustration}>
          <Bell className={styles.illustrationIcon} />
        </div>
        <h1 className={styles.headline}>No activity yet</h1>
        <p className={styles.body}>
          Payments, reminders, accepted pledges, and completed commitments will
          appear here.
        </p>
      </div>

      <div className={styles.placeholderSection}>
        <h2 className={styles.placeholderTitle}>Upcoming</h2>
        {placeholders.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className={styles.placeholderCard}>
              <div className={styles.placeholderIconWrap}>
                <Icon className={styles.placeholderIcon} />
              </div>
              <div className={styles.placeholderBody}>
                <span className={styles.placeholderCardTitle}>
                  {item.title}
                </span>
                <p className={styles.placeholderCardDesc}>
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
