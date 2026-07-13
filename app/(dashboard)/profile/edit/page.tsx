'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import styles from './EditProfile.module.css'

interface Profile {
  fullName: string
  email: string
  phoneNumber: string
  profilePhoto: string | null
}

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()
        setProfile(data)
        setFullName(data.fullName ?? '')
        setPhoneNumber(data.phoneNumber ?? '')
        setProfilePhoto(data.profilePhoto ?? null)
      } catch {
        setError('Could not load profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Photo must be under 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setProfilePhoto(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim()) return
    setError(null)
    setSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          profilePhoto: profilePhoto || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save.')
        return
      }

      setToastMessage('Profile updated successfully')
      setTimeout(() => router.push('/profile'), 1500)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.backLink} />
          <div className={styles.skeletonTitle} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/profile" className={styles.backLink} aria-label="Back to profile">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className={styles.pageTitle}>Edit Profile</h1>
      </header>

      <div className={styles.avatarSection}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile photo"
                className={styles.avatarImage}
              />
            ) : (
              getInitials(fullName || 'U')
            )}
          </div>
          <button
            type="button"
            className={styles.cameraOverlay}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change profile photo"
          >
            <Camera className={styles.cameraIcon} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={handlePhotoSelect}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <span className={styles.avatarHint}>Tap to change photo</span>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className={styles.formCard}>
            <div>
              <label htmlFor="full-name" className={styles.fieldLabel}>
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                className={styles.fieldInput}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={styles.fieldLabel}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={styles.fieldInput}
                value={profile?.email ?? ''}
                disabled
                aria-describedby="email-hint"
              />
              <span id="email-hint" className={styles.fieldHint}>
                Email cannot be changed
              </span>
            </div>

            <div>
              <label htmlFor="phone" className={styles.fieldLabel}>
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className={styles.fieldInput}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Your phone number"
              />
            </div>
          </div>
        </Card>

        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <Button type="submit" loading={saving} fullWidth disabled={saving || !fullName.trim()}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={() => router.push('/profile')}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>

      {toastMessage && (
        <div className={styles.toast} role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
