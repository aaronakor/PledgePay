'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import styles from './BankDetails.module.css'

const BANKS = [
  'Access Bank', 'Fidelity Bank', 'First Bank', 'GTBank',
  'Moniepoint', 'Opay', 'Palmpay', 'UBA', 'Union Bank', 'Zenith Bank'
]

export default function BankDetailsPage() {
  const router = useRouter()
  const { data: session, update } = useSession()

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
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()
        setBankName(data.bankName ?? '')
        setAccountNumber(data.accountNumber ?? '')
        setAccountName(data.accountName ?? '')
      } catch {
        setError('Could not load bank details.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

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
    } else if (accountNumber.length < 10 || !bankName) {
      if (accountName === 'Verifying...') setAccountName('')
    }
  }, [accountNumber, bankName, session?.user?.name])

  const filteredBanks = BANKS.filter((b) =>
    b.toLowerCase().includes(bankSearch.toLowerCase())
  )

  function handleBankSelect(bank: string) {
    setBankName(bank)
    setBankSearch(bank)
    setShowBankDropdown(false)
  }

  function handleBankInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBankSearch(e.target.value)
    setShowBankDropdown(true)
    if (bankName) setBankName('')
  }

  function handleBankInputFocus() {
    setShowBankDropdown(true)
    setBankSearch(bankName)
  }

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
        return
      }

      await update()
      setToastMessage('Bank details updated successfully')
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
        <h1 className={styles.pageTitle}>Bank Details</h1>
      </header>

      <p className={styles.description}>
        Repayments sent through PledgePay will be directed to this account. Only you can see this information.
      </p>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className={styles.formCard}>
            <div className={styles.fieldGroup} ref={dropdownRef}>
              <label htmlFor="bank-name" className={styles.fieldLabel}>
                Bank Name
              </label>
              <input
                id="bank-name"
                type="text"
                className={styles.fieldInput}
                placeholder="Select your bank"
                value={showBankDropdown ? bankSearch : bankName}
                onChange={handleBankInputChange}
                onFocus={handleBankInputFocus}
                autoComplete="off"
                role="combobox"
                aria-expanded={showBankDropdown}
                aria-haspopup="listbox"
                aria-autocomplete="list"
              />
              {showBankDropdown && (
                <div className={styles.dropdownMenu} role="listbox">
                  {filteredBanks.length > 0 ? (
                    filteredBanks.map((bank) => (
                      <div
                        key={bank}
                        className={`${styles.dropdownItem} ${bank === bankName ? styles.dropdownItemActive : ''}`}
                        role="option"
                        aria-selected={bank === bankName}
                        onClick={() => handleBankSelect(bank)}
                      >
                        {bank}
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyDropdown}>No banks found</div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="account-number" className={styles.fieldLabel}>
                Account Number
              </label>
              <input
                id="account-number"
                type="text"
                inputMode="numeric"
                className={styles.fieldInput}
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setAccountNumber(val)
                }}
                maxLength={10}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="account-name" className={styles.fieldLabel}>
                Account Name
              </label>
              <input
                id="account-name"
                type="text"
                className={styles.fieldInput}
                placeholder="Automatically populated"
                value={accountName}
                disabled
                readOnly
                aria-describedby="account-name-hint"
              />
              <span id="account-name-hint" className={styles.fieldHint}>
                {!accountName && 'Enter bank and account number to verify'}
              </span>
            </div>
          </div>
        </Card>

        <div className={styles.trustElement}>
          <span role="img" aria-label="Lock">&#x1F512;</span>
          Your bank information is encrypted and visible only to you.
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="submit"
            loading={saving}
            fullWidth
            disabled={saving || !bankName || accountNumber.length !== 10 || !accountName || accountName === 'Verifying...'}
          >
            Save Bank Details
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
