'use client'

import { useState, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import styles from './Notifications.module.css'

const notificationOptions = [
  { key: 'PLEDGE_RECEIVED', label: 'Pledge received' },
  { key: 'PLEDGE_ACCEPTED', label: 'Pledge accepted' },
  { key: 'FUNDING_CONFIRMED', label: 'Funding confirmed' },
  { key: 'REMINDER', label: 'Payment reminders' },
  { key: 'PAYMENT_RECEIVED', label: 'Payment received' },
  { key: 'PLEDGE_COMPLETED', label: 'Pledge completed' },
  { key: 'PLEDGE_OVERDUE', label: 'Overdue alerts' },
] as const

export default function NotificationsPreferencesPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    () => Object.fromEntries(notificationOptions.map((n) => [n.key, true]))
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 2000)
  }, [])

  function toggleNotification(key: string) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
    showToast('Preferences updated')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/profile" className={styles.backLink} aria-label="Back to profile">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className={styles.pageTitle}>Notifications</h1>
      </header>

      <p className={styles.description}>
        Choose which updates you want to be notified about.
      </p>

      <div className={styles.togglesCard}>
        {notificationOptions.map((opt) => (
          <div key={opt.key} className={styles.toggleRow}>
            <span className={styles.toggleLabel}>{opt.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={notifications[opt.key]}
              aria-label={opt.label}
              onClick={() => toggleNotification(opt.key)}
              className={`${styles.switch} ${notifications[opt.key] ? styles.switchOn : ''}`}
            >
              <span
                className={`${styles.switchThumb} ${notifications[opt.key] ? styles.switchThumbOn : ''}`}
              />
            </button>
          </div>
        ))}
      </div>

      {toastMessage && (
        <div className={styles.toast} role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
