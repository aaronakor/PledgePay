'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, ArrowRight, Bell } from 'lucide-react'
import { TrustScoreCard } from '@/components/home/TrustScoreCard'
import { TrustTipCard } from '@/components/home/TrustTipCard'
import { PledgeEmptyIllustration } from '@/components/PledgeEmptyIllustration'
import { DashboardWelcome } from '@/components/onboarding/DashboardWelcome'
import { ProfileReminderCard } from '@/components/onboarding/ProfileReminderCard'
import styles from './Home.module.css'

export default function HomePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'
  const [welcomeDismissed, setWelcomeDismissed] = useState(false)

  const profileComplete = session?.user?.profileComplete ?? true
  const firstLogin = session?.user?.firstLogin ?? false
  const showWelcome = firstLogin && !welcomeDismissed

  async function handleWelcomeDismiss() {
    await fetch('/api/onboarding', { method: 'PATCH' })
    update()
    setWelcomeDismissed(true)
  }

  return (
    <div className={styles.page}>
      {showWelcome && (
        <div className="px-4 pt-4">
          <DashboardWelcome
            profileComplete={profileComplete}
            onDismiss={handleWelcomeDismiss}
          />
        </div>
      )}

      {!profileComplete && !showWelcome && (
        <div className="px-4 pt-4">
          <ProfileReminderCard />
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.greeting}>Hello, {firstName} 👋</h1>
          <p className={styles.subtitle}>Keep promises. Build trust.</p>
        </div>
        <button
          onClick={() => router.push('/notifications')}
          className={styles.avatarButton}
          aria-label="Notifications"
        >
          <div className={styles.avatar}>
            <Bell className="w-5 h-5" />
          </div>
        </button>
      </header>

      <section className={styles.hero}>
        <TrustScoreCard score={50} />
      </section>

      <section className={styles.mainEmpty}>
        <PledgeEmptyIllustration />
        <h2 className={styles.headline}>
          Start building trust, one promise at a time.
        </h2>
        <p className={styles.supporting}>
          Create your first pledge to lend money, track repayments, and keep
          financial commitments organized.
        </p>
        <div className={styles.actions}>
          <button
            onClick={() => router.push('/pledges/new')}
            className={styles.primaryButton}
          >
            <Plus className="w-5 h-5" />
            Create First Pledge
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => router.push('/how-it-works')}
          >
            <ArrowRight className="w-5 h-5" />
            How PledgePay Works
          </button>
        </div>
      </section>

      <section className={styles.tipSection}>
        <TrustTipCard />
      </section>
    </div>
  )
}
