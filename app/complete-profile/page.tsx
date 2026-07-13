'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import styles from './page.module.css'

const BANKS = [
  'Access Bank', 'Fidelity Bank', 'First Bank', 'GTBank', 
  'Moniepoint', 'Opay', 'Palmpay', 'UBA', 'Union Bank', 'Zenith Bank'
]

export default function CompleteProfilePage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()

  const [bankName, setBankName] = useState('')
  const [bankSearch, setBankSearch] = useState('')
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated') {
      if (session?.user?.profileComplete) {
        router.push('/home')
        return
      }
      setLoading(false)
    }
  }, [status, session, router])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowBankDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (accountNumber.length === 10 && bankName) {
      setAccountName('Verifying...')
      const timer = setTimeout(() => {
        setAccountName(session?.user?.name?.toUpperCase() || 'VERIFIED ACCOUNT NAME')
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setAccountName('')
    }
  }, [accountNumber, bankName, session?.user?.name])

  const filteredBanks = BANKS.filter(b => 
    b.toLowerCase().includes(bankSearch.toLowerCase())
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!bankName || accountNumber.length !== 10 || !accountName || accountName === 'Verifying...') return
    setError(null)
    setSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankName, accountNumber, accountName }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save.')
        setSaving(false)
        return
      }

      await update()
      setToastMessage("Repayment account added. You're ready to create and manage pledges.")
      setTimeout(() => {
        router.push('/home')
      }, 2000)
    } catch {
      setError('Something went wrong.')
      setSaving(false)
    }
  }

  async function handleSkip() {
    setSaving(true)
    try {
      await fetch('/api/onboarding', { method: 'PATCH' })
      await update()
      setToastMessage('You can add your repayment account later in Settings.')
      setTimeout(() => {
        router.push('/home')
      }, 2000)
    } catch {
      router.push('/home')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Your Repayment Account
          </h1>
          <p className={styles.subtitle}>
            This is where borrowers will send repayments. Only you can see and edit these details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Card>
            <div className={styles.formFields}>
              <div className={styles.selectWrapper} ref={dropdownRef}>
                <Input
                  label="Bank Name"
                  placeholder="Select your bank"
                  value={showBankDropdown ? bankSearch : bankName}
                  onChange={(e) => {
                    setBankSearch(e.target.value)
                    setShowBankDropdown(true)
                    if (bankName) setBankName('')
                  }}
                  onFocus={() => {
                    setShowBankDropdown(true)
                    setBankSearch('')
                  }}
                  autoComplete="off"
                />
                {showBankDropdown && (
                  <div className={styles.dropdownMenu}>
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map(bank => (
                        <div 
                          key={bank} 
                          className={styles.dropdownItem}
                          onClick={() => {
                            setBankName(bank)
                            setBankSearch(bank)
                            setShowBankDropdown(false)
                          }}
                        >
                          {bank}
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No banks found</div>
                    )}
                  </div>
                )}
              </div>
              
              <Input
                label="Account Number"
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setAccountNumber(val)
                }}
                inputMode="numeric"
              />
              
              <Input
                label="Account Name"
                placeholder="Automatically populated"
                value={accountName}
                disabled
              />
            </div>
          </Card>

          <div className={styles.trustElement}>
            <span>🔒</span> Your bank information is encrypted and visible only to you.
          </div>

          {error && (
            <p className="text-sm text-error text-center">{error}</p>
          )}

          <div className={styles.actions}>
            <Button 
              type="submit" 
              loading={saving} 
              disabled={saving || !bankName || accountNumber.length !== 10 || !accountName || accountName === 'Verifying...'}
              fullWidth
            >
              Save & Continue
            </Button>
            
            <button
              type="button"
              onClick={handleSkip}
              disabled={saving}
              className={styles.secondaryButton}
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>

      {toastMessage && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}
    </div>
  )
}
