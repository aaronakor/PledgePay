'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, ArrowRight } from 'lucide-react'
import { TrustScoreCard } from '@/components/home/TrustScoreCard'
import { TrustTipCard } from '@/components/home/TrustTipCard'
import { HandshakeIllustration } from '@/components/HandshakeIllustration'
import styles from './Home.module.css'

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.greeting}>Hello, {firstName} 👋</h1>
          <p className={styles.subtitle}>Keep promises. Build trust.</p>
        </div>
        <button
          onClick={() => router.push('/profile')}
          className={styles.avatarButton}
          aria-label="Profile"
        >
          <div className={styles.avatar}>{initials}</div>
        </button>
      </header>

      <section className={styles.hero}>
        <TrustScoreCard score={50} />
      </section>

      <section className={styles.mainEmpty}>
        <div className={styles.illustrationWrap}>
          <HandshakeIllustration />
        </div>
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
          <button className={styles.secondaryButton}>
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
