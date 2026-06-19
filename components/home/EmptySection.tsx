import type { LucideIcon } from 'lucide-react'
import styles from './EmptySection.module.css'

interface EmptySectionProps {
  icon?: LucideIcon
  title: string
  description: string
}

export function EmptySection({ icon: Icon, title, description }: EmptySectionProps) {
  return (
    <div className={styles.section}>
      {Icon && (
        <div className={styles.iconWrap}>
          <Icon className={styles.icon} />
        </div>
      )}
      <strong className={styles.title}>{title}</strong>
      <p className={styles.description}>{description}</p>
    </div>
  )
}
