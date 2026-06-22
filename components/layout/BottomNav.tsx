'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Folder, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import styles from './BottomNav.module.css'

const tabs = [
  { label: 'Home', icon: Home, href: '/home' },
  { label: 'Pledges', icon: Folder, href: '/pledges' },
  { label: 'Activity', icon: Clock, href: '/activity' },
  { label: 'Profile', icon: User, href: '/profile' },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className={styles.nav}>
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          const Icon = tab.icon
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={cn(styles.tab, isActive && styles.tabActive)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={styles.tabIcon}
                {...(isActive ? { fill: 'currentColor' } : {})}
              />
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
