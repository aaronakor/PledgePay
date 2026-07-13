'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, User, Landmark, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { ProfileReputationCard } from '@/components/home/ProfileReputationCard'
import { Modal } from '@/components/ui/Modal'
import styles from './Profile.module.css'

interface Profile {
  fullName: string
  email: string
  phoneNumber: string
  profilePhoto: string | null
  bankName: string | null
  accountNumber: string | null
  accountName: string | null
  reputationScore: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()
        setProfile(data)
      } catch {
        // silently handle error
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    await signOut({ callbackUrl: '/' })
  }

  if (loading) {
    return (
      <div className={styles.skeletonPage}>
        <div className={styles.skeletonHeader}>
          <div className={styles.skeletonTitle} />
        </div>
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonRows}>
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/home" className={styles.backLink} aria-label="Back to home">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className={styles.pageTitle}>Profile</h1>
      </header>

      {profile && <ProfileReputationCard score={profile.reputationScore} />}

      <span className={styles.sectionLabel}>Account</span>

      <div className={styles.actionsCard}>
        <Link href="/profile/edit" className={styles.actionRow}>
          <User className={styles.actionIcon} />
          <div className={styles.actionContent}>
            <span className={styles.actionTitle}>Edit Profile</span>
            <span className={styles.actionSubtitle}>Name, photo, phone number</span>
          </div>
          <ChevronRight className={styles.actionChevron} />
        </Link>

        <Link href="/profile/bank" className={styles.actionRow}>
          <Landmark className={styles.actionIcon} />
          <div className={styles.actionContent}>
            <span className={styles.actionTitle}>Bank Details</span>
            <span className={styles.actionSubtitle}>Repayment account information</span>
          </div>
          <ChevronRight className={styles.actionChevron} />
        </Link>

        <Link href="/profile/notifications" className={styles.actionRow}>
          <Bell className={styles.actionIcon} />
          <div className={styles.actionContent}>
            <span className={styles.actionTitle}>Notifications</span>
            <span className={styles.actionSubtitle}>Manage alert preferences</span>
          </div>
          <ChevronRight className={styles.actionChevron} />
        </Link>

        <Link href="/profile/faq" className={styles.actionRow}>
          <HelpCircle className={styles.actionIcon} />
          <div className={styles.actionContent}>
            <span className={styles.actionTitle}>FAQs</span>
            <span className={styles.actionSubtitle}>Get help and learn more</span>
          </div>
          <ChevronRight className={styles.actionChevron} />
        </Link>

        <button
          type="button"
          className={styles.logoutRow}
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut className={styles.logoutIcon} />
          <span className={styles.logoutTitle}>Logout</span>
        </button>
      </div>

      <Modal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign Out?"
        body="You will be signed out of your account and returned to the welcome screen."
        cancelLabel="Cancel"
        confirmLabel="Sign Out"
        confirmVariant="danger"
        loading={loggingOut}
      />
    </div>
  )
}
