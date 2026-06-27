'use client'

import { Bell, Wallet, CheckCircle } from 'lucide-react'
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
        <h1 className={styles.headline}>No activity yet</h1>
        <p className={styles.body}>
          Payments, reminders, accepted pledges, and completed commitments will
          appear here.
        </p>
      </div>

      <div className={styles.timelinePreview}>
        {placeholders.map((item, index) => {
          const Icon = item.icon
          const isLast = index === placeholders.length - 1
          return (
            <div key={item.title} className={styles.timelineItem}>
              {!isLast && <div className={styles.connector} />}
              <div className={styles.timelineIconWrap}>
                <Icon className={styles.timelineIcon} />
              </div>
              <div className={styles.timelineBody}>
                <span className={styles.timelineTitle}>
                  {item.title}
                </span>
                <p className={styles.timelineDesc}>
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
