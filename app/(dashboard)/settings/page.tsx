'use client'

import { useState } from 'react'
import { ArrowLeft, Bell, Clock, LogOut } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const notificationOptions = [
  { key: 'PLEDGE_RECEIVED', label: 'Pledge received' },
  { key: 'PLEDGE_ACCEPTED', label: 'Pledge accepted' },
  { key: 'FUNDING_CONFIRMED', label: 'Funding confirmed' },
  { key: 'REMINDER', label: 'Payment reminders' },
  { key: 'PAYMENT_RECEIVED', label: 'Payment received' },
  { key: 'PLEDGE_COMPLETED', label: 'Pledge completed' },
  { key: 'PLEDGE_OVERDUE', label: 'Overdue alerts' },
] as const

const reminderStyles = [
  { value: 'LIGHT', label: 'Light', desc: 'One gentle reminder before due date' },
  { value: 'STANDARD', label: 'Standard', desc: 'Reminder at due date and one follow-up' },
  { value: 'STRICT', label: 'Strict', desc: 'Multiple reminders and escalation notices' },
] as const

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        notificationOptions.map((n) => [n.key, true])
      )
  )
  const [reminderStyle, setReminderStyle] = useState('STANDARD')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleNotification(key: string) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await new Promise((r) => setTimeout(r, 400))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-serif text-ink">Settings</h1>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary-700" />
          <h2 className="text-base font-semibold text-ink">
            Notifications
          </h2>
        </div>
        <p className="text-xs text-ink-muted mb-4">
          Choose which updates you want to be notified about.
        </p>

        <div className="flex flex-col gap-3">
          {notificationOptions.map((opt) => (
            <label
              key={opt.key}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm text-ink">{opt.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={notifications[opt.key]}
                onClick={() => toggleNotification(opt.key)}
                className={`relative inline-flex h-6 w-10 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  notifications[opt.key]
                    ? 'bg-primary-700'
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ${
                    notifications[opt.key]
                      ? 'translate-x-4'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary-700" />
          <h2 className="text-base font-semibold text-ink">
            Reminder Style
          </h2>
        </div>
        <p className="text-xs text-ink-muted mb-4">
          How often do you want to be reminded about upcoming payments?
        </p>

        <div className="flex flex-col gap-2">
          {reminderStyles.map((style) => (
            <label
              key={style.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                reminderStyle === style.value
                  ? 'border-primary-700 bg-primary-50'
                  : 'border-border hover:border-ink-faint'
              }`}
            >
              <input
                type="radio"
                name="reminderStyle"
                value={style.value}
                checked={reminderStyle === style.value}
                onChange={(e) => setReminderStyle(e.target.value)}
                className="mt-0.5 accent-primary-700"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink">
                  {style.label}
                </span>
                <span className="text-xs text-ink-muted">
                  {style.desc}
                </span>
              </div>
            </label>
          ))}
        </div>
      </Card>

      <Button onClick={handleSave} loading={saving} fullWidth>
        {saved ? 'Saved' : 'Save Preferences'}
      </Button>

      <div className="flex flex-col gap-3 mt-2">
        <Button
          variant="ghost"
          fullWidth
          className="text-error hover:bg-error-bg"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
