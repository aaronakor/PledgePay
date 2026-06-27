'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  User,
  Mail,
  Lock,
  Calendar,
  Bell,
  ChevronDown,
  Loader2,
  Info,
} from 'lucide-react'
import { BorrowerIllustration } from '@/components/pledge/BorrowerIllustration'
import { PledgeDetailsIllustration } from '@/components/pledge/PledgeDetailsIllustration'
import styles from './CreatePledge.module.css'

type ReminderPreference = 'LIGHT' | 'STANDARD' | 'STRICT'
type RepaymentType = 'ONE_TIME' | 'INSTALLMENTS'

const REMINDER_OPTIONS: { value: ReminderPreference; label: string }[] = [
  { value: 'LIGHT', label: 'Light — 3 reminders' },
  { value: 'STANDARD', label: 'Standard — 4 reminders' },
  { value: 'STRICT', label: 'Strict — 5 reminders' },
]

const PURPOSE_MAX_LENGTH = 250

export default function CreatePledgePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  /* ── form state ── */
  const [form, setForm] = useState({
    borrowerName: '',
    borrowerEmail: '',
    borrowerPhone: '',
    amount: '',
    purpose: '',
    dueDate: '',
    repaymentType: 'ONE_TIME' as RepaymentType,
    reminderPreference: 'STANDARD' as ReminderPreference,
  })

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  /* ── helpers ── */
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target
    if (name === 'purpose' && value.length > PURPOSE_MAX_LENGTH) return
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validateStep1(): boolean {
    const errors: Record<string, string> = {}
    if (!form.borrowerName.trim()) errors.borrowerName = 'Full name is required'
    if (!form.borrowerPhone.trim())
      errors.borrowerPhone = 'Phone number is required'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleContinue() {
    if (validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handleBackToStep1() {
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setError(null)
    setFieldErrors({})
    setLoading(true)

    const amountValue = parseFloat(form.amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setFieldErrors({ amount: 'Enter a valid amount' })
      setLoading(false)
      return
    }
    if (!form.purpose.trim()) {
      setFieldErrors({ purpose: 'Purpose is required' })
      setLoading(false)
      return
    }
    if (!form.dueDate) {
      setFieldErrors({ dueDate: 'Due date is required' })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerName: form.borrowerName,
          borrowerEmail: form.borrowerEmail || undefined,
          borrowerPhone: form.borrowerPhone,
          amount: amountValue,
          purpose: form.purpose,
          dueDate: new Date(form.dueDate).toISOString(),
          repaymentType: form.repaymentType,
          reminderPreference: form.reminderPreference,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details) {
          const errors: Record<string, string> = {}
          for (const d of data.details) {
            errors[d.path[0]] = d.message
          }
          setFieldErrors(errors)
          // If the error belongs to step 1 fields, go back
          const step1Fields = [
            'borrowerName',
            'borrowerEmail',
            'borrowerPhone',
          ]
          if (Object.keys(errors).some((k) => step1Fields.includes(k))) {
            setStep(1)
          }
        } else {
          setError(data.error || 'Failed to create pledge.')
        }
        return
      }

      router.push(`/pledges/${data.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className={styles.page}>
      {/* ── Top bar ── */}
      <header className={styles.topBar}>
        <button
          className={styles.backButton}
          onClick={() => (step === 2 ? handleBackToStep1() : router.back())}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className={styles.topBarCenter}>
          <h1 className={styles.topBarTitle}>Create Pledge</h1>
        </div>
      </header>

      {/* ── Progress stepper ── */}
      <div className={styles.stepper}>
        <div className={styles.stepItem}>
          <div
            className={`${styles.stepCircle} ${
              step >= 1
                ? styles.stepCircleActive
                : styles.stepCircleInactive
            }`}
          >
            {step > 1 ? <Check size={16} /> : '1'}
          </div>
          <span
            className={`${styles.stepLabel} ${
              step >= 1
                ? styles.stepLabelActive
                : styles.stepLabelInactive
            }`}
          >
            Borrower Details
          </span>
        </div>

        <div
          className={`${styles.stepConnector} ${
            step >= 2
              ? styles.stepConnectorActive
              : styles.stepConnectorInactive
          }`}
        />

        <div className={styles.stepItem}>
          <div
            className={`${styles.stepCircle} ${
              step >= 2
                ? styles.stepCircleActive
                : styles.stepCircleInactive
            }`}
          >
            2
          </div>
          <span
            className={`${styles.stepLabel} ${
              step >= 2
                ? styles.stepLabelActive
                : styles.stepLabelInactive
            }`}
          >
            Pledge Details
          </span>
        </div>
      </div>

      <div className={styles.stepTag}>Step {step} of 2</div>

      {/* ══════════════════════════════════════
           STEP 1 — Borrower Details
      ══════════════════════════════════════ */}
      {step === 1 && (
        <>
          <div className={styles.illustrationSection}>
            <div className={styles.illustrationWrap}>
              <BorrowerIllustration />
            </div>
            <h2 className={styles.illustrationTitle}>
              Let&apos;s add the borrower
            </h2>
            <p className={styles.illustrationSubtitle}>
              Provide accurate details so you can track this pledge and stay
              connected.
            </p>
          </div>

          <div className={styles.formContent}>
            <p className={styles.sectionLabel}>Borrower Details</p>

            {/* Full Name */}
            <div className={styles.fieldGroup}>
              <label htmlFor="borrowerName" className={styles.fieldLabel}>
                Full Name
              </label>
              <div
                className={`${styles.inputWrapper} ${
                  fieldErrors.borrowerName ? styles.inputWrapperError : ''
                }`}
              >
                <span className={styles.inputIcon}>
                  <User className={styles.inputIconSvg} />
                </span>
                <input
                  id="borrowerName"
                  name="borrowerName"
                  type="text"
                  placeholder="Borrower's full name"
                  value={form.borrowerName}
                  onChange={handleChange}
                  className={styles.inputField}
                  autoComplete="name"
                />
              </div>
              {fieldErrors.borrowerName && (
                <span className={styles.fieldError}>
                  {fieldErrors.borrowerName}
                </span>
              )}
            </div>

            {/* Email (optional) */}
            <div className={styles.fieldGroup}>
              <label htmlFor="borrowerEmail" className={styles.fieldLabel}>
                Email{' '}
                <span className={styles.fieldOptional}>(optional)</span>
              </label>
              <div
                className={`${styles.inputWrapper} ${
                  fieldErrors.borrowerEmail ? styles.inputWrapperError : ''
                }`}
              >
                <span className={styles.inputIcon}>
                  <Mail className={styles.inputIconSvg} />
                </span>
                <input
                  id="borrowerEmail"
                  name="borrowerEmail"
                  type="email"
                  placeholder="borrower@example.com"
                  value={form.borrowerEmail}
                  onChange={handleChange}
                  className={styles.inputField}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.borrowerEmail && (
                <span className={styles.fieldError}>
                  {fieldErrors.borrowerEmail}
                </span>
              )}
            </div>

            {/* Phone Number */}
            <div className={styles.fieldGroup}>
              <label htmlFor="borrowerPhone" className={styles.fieldLabel}>
                Phone Number
              </label>
              <div
                className={`${styles.phoneRow} ${
                  fieldErrors.borrowerPhone ? styles.inputWrapperError : ''
                }`}
              >
                <div className={styles.phoneFlag}>
                  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Nigeria" style={{ borderRadius: 2, flexShrink: 0 }}>
                    <rect width="20" height="14" rx="1" fill="white"/>
                    <rect width="6.67" height="14" fill="#008751"/>
                    <rect x="13.33" width="6.67" height="14" fill="#008751"/>
                  </svg>
                  <span className={styles.phoneCode}>+234</span>
                </div>
                <input
                  id="borrowerPhone"
                  name="borrowerPhone"
                  type="tel"
                  placeholder="080 123 45678"
                  value={form.borrowerPhone}
                  onChange={handleChange}
                  className={styles.phoneInput}
                  autoComplete="tel"
                />
              </div>
              {fieldErrors.borrowerPhone && (
                <span className={styles.fieldError}>
                  {fieldErrors.borrowerPhone}
                </span>
              )}
            </div>

            {/* Privacy card */}
            <div className={styles.privacyCard}>
              <div className={styles.privacyIcon}>
                <Lock className={styles.privacyIconSvg} />
              </div>
              <div className={styles.privacyContent}>
                <p className={styles.privacyTitle}>We keep this private</p>
                <p className={styles.privacyText}>
                  The borrower will only see what you choose to share with
                  them.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={styles.bottomCTA}>
            <button
              type="button"
              className={styles.ctaButton}
              onClick={handleContinue}
            >
              Continue to Pledge Details
              <ArrowRight className={styles.ctaIcon} />
            </button>
            <button
              type="button"
              className={styles.saveLink}
              onClick={() => router.push('/home')}
            >
              Save and finish later
            </button>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════
           STEP 2 — Pledge Details
      ══════════════════════════════════════ */}
      {step === 2 && (
        <>
          <div className={styles.illustrationSection}>
            <div className={styles.illustrationWrap}>
              <PledgeDetailsIllustration />
            </div>
            <h2 className={styles.illustrationTitle}>
              Now, let&apos;s define the pledge
            </h2>
            <p className={styles.illustrationSubtitle}>
              Add the amount, purpose, due date and how you&apos;d like to be
              reminded.
            </p>
          </div>

          <div className={styles.formContent}>
            <p className={styles.sectionLabel}>Pledge Details</p>

            {/* Amount */}
            <div className={styles.fieldGroup}>
              <label htmlFor="amount" className={styles.fieldLabel}>
                Amount (₦)
              </label>
              <div
                className={`${styles.inputWrapper} ${
                  fieldErrors.amount ? styles.inputWrapperError : ''
                }`}
              >
                <span className={styles.inputIcon}>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--color-ink-faint)',
                    }}
                  >
                    ₦
                  </span>
                </span>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  inputMode="decimal"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={handleChange}
                  className={styles.inputField}
                  min="1"
                  step="0.01"
                />
                <span className={styles.inputSuffix}>.00</span>
              </div>
              {fieldErrors.amount && (
                <span className={styles.fieldError}>
                  {fieldErrors.amount}
                </span>
              )}
            </div>

            {/* Purpose */}
            <div className={styles.fieldGroup}>
              <label htmlFor="purpose" className={styles.fieldLabel}>
                Purpose
              </label>
              <div
                className={`${styles.textareaWrapper} ${
                  fieldErrors.purpose ? styles.textareaWrapperError : ''
                }`}
              >
                <textarea
                  id="purpose"
                  name="purpose"
                  placeholder="What is this pledge for?"
                  value={form.purpose}
                  onChange={handleChange}
                  className={styles.textarea}
                  maxLength={PURPOSE_MAX_LENGTH}
                  rows={3}
                />
                <div className={styles.charCount}>
                  {form.purpose.length}/{PURPOSE_MAX_LENGTH}
                </div>
              </div>
              {fieldErrors.purpose && (
                <span className={styles.fieldError}>
                  {fieldErrors.purpose}
                </span>
              )}
            </div>

            {/* Due Date */}
            <div className={styles.fieldGroup}>
              <label htmlFor="dueDate" className={styles.fieldLabel}>
                Due Date
              </label>
              <div
                className={`${styles.dateInputWrapper} ${
                  fieldErrors.dueDate ? styles.dateInputWrapperError : ''
                }`}
              >
                <span className={styles.inputIcon}>
                  <Calendar className={styles.inputIconSvg} />
                </span>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={styles.dateInput}
                  placeholder="Select due date"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {fieldErrors.dueDate && (
                <span className={styles.fieldError}>
                  {fieldErrors.dueDate}
                </span>
              )}
            </div>

            {/* Repayment Type */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Repayment Type</label>
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggleOption} ${
                    form.repaymentType === 'ONE_TIME'
                      ? styles.toggleOptionActive
                      : ''
                  }`}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      repaymentType: 'ONE_TIME',
                    }))
                  }
                >
                  {form.repaymentType === 'ONE_TIME' && (
                    <Check className={styles.toggleCheck} />
                  )}
                  One-time
                </button>
                <button
                  type="button"
                  className={`${styles.toggleOption} ${
                    form.repaymentType === 'INSTALLMENTS'
                      ? styles.toggleOptionActive
                      : ''
                  }`}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      repaymentType: 'INSTALLMENTS',
                    }))
                  }
                >
                  {form.repaymentType === 'INSTALLMENTS' && (
                    <Check className={styles.toggleCheck} />
                  )}
                  Installments
                </button>
              </div>
            </div>

            {/* Reminder Preference */}
            <div className={styles.fieldGroup}>
              <label
                htmlFor="reminderPreference"
                className={styles.fieldLabel}
              >
                Reminder Preference
              </label>
              <div className={styles.selectWrapper}>
                <span className={styles.selectIcon}>
                  <Bell className={styles.inputIconSvg} />
                </span>
                <select
                  id="reminderPreference"
                  name="reminderPreference"
                  value={form.reminderPreference}
                  onChange={handleChange}
                  className={styles.selectField}
                >
                  {REMINDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className={styles.selectChevron} />
              </div>
            </div>

            {/* Info note */}
            <div className={styles.infoNote}>
              <div className={styles.infoIcon}>
                <Info className={styles.infoIconSvg} />
              </div>
              <div className={styles.infoContent}>
                <p className={styles.infoTitle}>
                  You can always edit this later
                </p>
                <p className={styles.infoText}>
                  All pledge details can be updated if the agreement changes.
                </p>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className={styles.errorBanner}>
                <Info size={16} />
                {error}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className={styles.bottomCTA}>
            <button
              type="button"
              className={styles.ctaButton}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className={styles.ctaSpinner} />
              ) : null}
              {loading ? 'Creating...' : 'Review Pledge'}
            </button>
            <button
              type="button"
              className={styles.backLink}
              onClick={handleBackToStep1}
            >
              <ArrowLeft size={14} />
              Back to Borrower Details
            </button>
          </div>
        </>
      )}
    </div>
  )
}
