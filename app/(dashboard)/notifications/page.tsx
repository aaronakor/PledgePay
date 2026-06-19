'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Bell } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDateTime } from '@/lib/format'
import type { Notification } from '@/types'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setNotifications(data)
    } catch {
      setError('Could not load notifications.')
    } finally {
      setLoading(false)
    }
  }

  async function markAllRead() {
    try {
      await fetch('/api/notifications', { method: 'PATCH' })
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      )
    } catch {
      // silently fail
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 w-40 bg-border rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-white rounded-xl shadow-md" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-serif text-ink">Notifications</h1>
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-error text-center">{error}</p>
      )}

      {notifications.length === 0 && !error && (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You will see updates about your pledges here."
        />
      )}

      <div className="flex flex-col gap-2">
        {notifications.map((n) => (
          <Card key={n.id}>
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  n.read ? 'bg-border' : 'bg-primary'
                }`}
              />
              <div className="flex flex-col gap-0.5 flex-1">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="text-sm text-ink-muted">{n.message}</p>
                <p className="text-xs text-ink-faint">
                  {formatDateTime(n.createdAt)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
