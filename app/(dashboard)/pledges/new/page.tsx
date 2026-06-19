'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type ReminderPreference = 'LIGHT' | 'STANDARD' | 'STRICT'

export default function CreatePledgePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    borrowerName: '',
    borrowerEmail: '',
    borrowerPhone: '',
    amount: '',
    purpose: '',
    dueDate: '',
    reminderPreference: 'STANDARD' as ReminderPreference,
  })
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)

    const amountValue = parseFloat(form.amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setFieldErrors({ amount: 'Enter a valid amount' })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerName: form.borrowerName,
          borrowerEmail: form.borrowerEmail,
          borrowerPhone: form.borrowerPhone,
          amount: amountValue,
          purpose: form.purpose,
          dueDate: new Date(form.dueDate).toISOString(),
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-serif text-ink">Create Pledge</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-medium text-ink-muted uppercase tracking-wide mb-1">
            Borrower Details
          </legend>
          <Input
            label="Full Name"
            name="borrowerName"
            placeholder="Borrower's full name"
            value={form.borrowerName}
            onChange={handleChange}
            error={fieldErrors.borrowerName}
            required
          />
          <Input
            label="Email"
            name="borrowerEmail"
            type="email"
            placeholder="borrower@example.com"
            value={form.borrowerEmail}
            onChange={handleChange}
            error={fieldErrors.borrowerEmail}
            required
          />
          <Input
            label="Phone Number"
            name="borrowerPhone"
            type="tel"
            placeholder="08012345678"
            value={form.borrowerPhone}
            onChange={handleChange}
            error={fieldErrors.borrowerPhone}
            required
          />
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-medium text-ink-muted uppercase tracking-wide mb-1">
            Pledge Details
          </legend>
          <Input
            label="Amount (₦)"
            name="amount"
            type="number"
            placeholder="10000"
            value={form.amount}
            onChange={handleChange}
            error={fieldErrors.amount}
            prefix="₦"
            required
            min="1"
            step="0.01"
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="purpose"
              className="text-sm font-medium text-ink"
            >
              Purpose
            </label>
            <input
              id="purpose"
              name="purpose"
              placeholder="What is this for?"
              value={form.purpose}
              onChange={handleChange}
              required
              className="w-full h-10 rounded-md border border-border bg-gray-50 px-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {fieldErrors.purpose && (
              <p className="text-xs text-error">{fieldErrors.purpose}</p>
            )}
          </div>
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            error={fieldErrors.dueDate}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reminderPreference"
              className="text-sm font-medium text-ink"
            >
              Reminder Preference
            </label>
            <select
              id="reminderPreference"
              name="reminderPreference"
              value={form.reminderPreference}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-border bg-gray-50 px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="LIGHT">Light — 3 reminders</option>
              <option value="STANDARD">Standard — 4 reminders</option>
              <option value="STRICT">Strict — 5 reminders</option>
            </select>
          </div>
        </fieldset>

        {error && (
          <p className="text-sm text-error text-center">{error}</p>
        )}

        <Button type="submit" loading={loading} fullWidth>
          Create Pledge
        </Button>
      </form>
    </div>
  )
}
