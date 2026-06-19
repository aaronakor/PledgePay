import { ShieldCheck } from 'lucide-react'
import styles from './ProfileReputationCard.module.css'

interface ProfileReputationCardProps {
  score: number
}

export function ProfileReputationCard({ score }: ProfileReputationCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.shieldWrap}>
        <ShieldCheck className={styles.shieldIcon} />
      </div>

      <span className={styles.scoreLabel}>Trust Score</span>
      <span className={styles.scoreValue}>{score}</span>

      <span className={styles.pill}>New Member</span>

      <p className={styles.tagline}>Your trust journey starts here.</p>

      <div className={styles.divider} />

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Completed Commitments</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>--</span>
          <span className={styles.statLabel}>On-Time Rate</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Overdue Commitments</span>
        </div>
      </div>
    </div>
  )
}
