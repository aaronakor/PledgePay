import { ShieldCheck } from 'lucide-react'
import styles from './TrustScoreCard.module.css'

interface TrustScoreCardProps {
  score: number
}

export function TrustScoreCard({ score }: TrustScoreCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.topLeft}>
          <div className={styles.shieldWrap}>
            <ShieldCheck className={styles.shieldIcon} />
          </div>
          <div className={styles.scoreArea}>
            <span className={styles.scoreLabel}>Trust Score</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
        </div>
        <div className={styles.journeyBadge}>
          <span className={styles.journeyDot} />
          Beginning Journey
        </div>
      </div>

      <div className={styles.pillRow}>
        <span className={styles.pill}>New Member</span>
      </div>

      <p className={styles.tagline}>
        Trust is built through fulfilled promises.
      </p>

      <div className={styles.divider} />

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Overdue</span>
        </div>
      </div>
    </div>
  )
}
