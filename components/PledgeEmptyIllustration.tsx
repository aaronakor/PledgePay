import Image from 'next/image'
import styles from './PledgeEmptyIllustration.module.css'

export function PledgeEmptyIllustration() {
  return (
    <div className={styles.wrapper}>
      {/* Soft glow behind the image */}
      <div className={styles.glow} />
      <Image
        src="/images/pledge-empty-state.png"
        alt="Two hands reaching toward each other, symbolizing trust and connection"
        width={320}
        height={320}
        className={styles.image}
        priority
      />
    </div>
  )
}
