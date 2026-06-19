import styles from './TrustTipCard.module.css'

export function TrustTipCard() {
  return (
    <div className={styles.card}>
      <span className={styles.emoji}>💡</span>
      <div className={styles.body}>
        <strong className={styles.title}>Trust Tip</strong>
        <p className={styles.text}>
          Clear agreements and timely reminders help maintain healthy relationships
          and improve repayment success.
        </p>
      </div>
    </div>
  )
}
