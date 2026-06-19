# PledgePay — Compound Component Builder

## Purpose

This skill defines how to build every UI component in PledgePay correctly.
PledgePay components are built in layers: base UI components first, then
feature components that compose them, then page sections that compose feature
components. Never skip layers.

When asked to build any UI in PledgePay, work through this file before
writing a single line of JSX.

---

## The Three Layers

```
Layer 1 — Base UI (components/ui/)
  Generic, reusable, brand-aware.
  No business logic. No data fetching.
  Examples: Button, Input, Card, Badge, Avatar, Spinner

Layer 2 — Feature Components (components/pledge/, components/payment/, etc.)
  PledgePay-specific. Composed from Layer 1.
  No data fetching — receive data as props.
  Examples: PledgeCard, RepaymentForm, ActivityTimeline, ReputationScore

Layer 3 — Page Sections / Views (app/(dashboard)/...)
  Fetch data. Compose Layer 2 components.
  Handle loading, error, and empty states.
  Examples: DashboardPage, PledgeDetailPage, AcceptPledgePage
```

Never put business logic in Layer 1.
Never fetch data in Layer 2.
Never build raw UI elements in Layer 3 — compose Layer 2 instead.

---

## Base Component Patterns (Layer 1)

### Button

```tsx
// components/ui/Button.tsx

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        // Base
        'inline-flex items-center justify-center gap-2 font-medium rounded-md',
        'transition-opacity duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        // Variants
        variant === 'primary' && 'bg-primary text-white hover:bg-primary-800',
        variant === 'secondary' && 'bg-white border border-primary text-primary hover:bg-primary-50',
        variant === 'ghost' && 'text-primary hover:bg-primary-50',
        variant === 'danger' && 'bg-ink text-white hover:opacity-90',
        // Sizes
        size === 'sm' && 'text-sm px-3 py-1.5 h-8',
        size === 'md' && 'text-sm px-4 py-2 h-10',
        size === 'lg' && 'text-base px-6 py-3 h-12',
        // Full width
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
```

### Input

```tsx
// components/ui/Input.tsx

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  prefix?: string   // e.g. "₦" for naira amounts
}

export function Input({ label, error, hint, prefix, className, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full h-10 rounded-md border border-border bg-white px-3 text-sm text-ink',
            'placeholder:text-ink-faint',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:bg-surface disabled:cursor-not-allowed',
            error && 'border-error focus:ring-error',
            prefix && 'pl-8',
            className
          )}
          {...props}
        />
      </div>

      {error && <p className="text-xs text-error">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  )
}
```

### Card

```tsx
// components/ui/Card.tsx

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md p-6',
        onClick && 'cursor-pointer hover:shadow-lg transition-shadow duration-150',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
```

### StatusBadge

```tsx
// components/ui/StatusBadge.tsx
import type { PledgeStatus } from '@/types'

const statusConfig: Record<PledgeStatus, { label: string; className: string }> = {
  PENDING_ACCEPTANCE: { label: 'Pending',         className: 'bg-warning-bg text-warning' },
  AWAITING_FUNDING:  { label: 'Awaiting Funding', className: 'bg-info-bg text-info' },
  ACTIVE:            { label: 'Active',            className: 'bg-primary-50 text-primary' },
  OVERDUE:           { label: 'Overdue',           className: 'bg-warning-bg text-warning' },
  COMPLETED:         { label: 'Completed',         className: 'bg-success-bg text-success' },
  CANCELLED:         { label: 'Cancelled',         className: 'bg-neutral-bg text-neutral' },
  EXPIRED:           { label: 'Expired',           className: 'bg-neutral-bg text-neutral' },
}

export function StatusBadge({ status }: { status: PledgeStatus }) {
  const config = statusConfig[status]
  return (
    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full', config.className)}>
      {config.label}
    </span>
  )
}
```

---

## Feature Component Patterns (Layer 2)

### PledgeCard

```tsx
// components/pledge/PledgeCard.tsx

import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatNaira, formatDate, formatRelativeDate } from '@/lib/format'
import type { PledgeSummary } from '@/types'

interface PledgeCardProps {
  pledge: PledgeSummary
  perspective: 'lender' | 'borrower'
  onClick?: () => void
}

export function PledgeCard({ pledge, perspective, onClick }: PledgeCardProps) {
  const counterpartyName = perspective === 'lender'
    ? pledge.borrowerName
    : pledge.lenderName

  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-ink-muted font-medium uppercase tracking-wide">
            {perspective === 'lender' ? 'Lent to' : 'Borrowed from'}
          </p>
          <p className="text-base font-semibold text-ink">{counterpartyName}</p>
          <p className="text-sm text-ink-muted">{pledge.purpose}</p>
        </div>
        <StatusBadge status={pledge.status} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-ink-muted">Outstanding</p>
          <p className="text-2xl font-serif text-ink tabular-nums">
            {formatNaira(pledge.outstandingBalance)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-muted">Due</p>
          <p className="text-sm font-medium text-ink">{formatDate(pledge.dueDate)}</p>
          <p className="text-xs text-ink-faint">{formatRelativeDate(pledge.dueDate)}</p>
        </div>
      </div>
    </Card>
  )
}
```

### ActivityTimeline

```tsx
// components/pledge/ActivityTimeline.tsx

import { CheckCircle, Clock, Banknote, Bell, AlertCircle, XCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/format'
import type { ActivityEvent } from '@/types'

const eventConfig = {
  PLEDGE_CREATED:      { icon: Clock,        colour: 'text-info',    label: 'Pledge created' },
  PLEDGE_ACCEPTED:     { icon: CheckCircle,  colour: 'text-success', label: 'Pledge accepted' },
  FUNDING_CONFIRMED:   { icon: Banknote,     colour: 'text-success', label: 'Funding confirmed' },
  REMINDER_SENT:       { icon: Bell,         colour: 'text-primary', label: 'Reminder sent' },
  PAYMENT_RECEIVED:    { icon: Banknote,     colour: 'text-success', label: 'Payment received' },
  PLEDGE_COMPLETED:    { icon: CheckCircle,  colour: 'text-success', label: 'Pledge completed' },
  PLEDGE_OVERDUE:      { icon: AlertCircle,  colour: 'text-warning', label: 'Pledge overdue' },
  PLEDGE_CANCELLED:    { icon: XCircle,      colour: 'text-neutral', label: 'Pledge cancelled' },
  PLEDGE_EXPIRED:      { icon: XCircle,      colour: 'text-neutral', label: 'Pledge expired' },
}

interface ActivityTimelineProps {
  events: ActivityEvent[]
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-ink-muted">
        <Clock className="w-8 h-8 opacity-40" />
        <p className="text-sm">No activity yet</p>
      </div>
    )
  }

  return (
    <ol className="relative flex flex-col gap-0">
      {events.map((event, index) => {
        const config = eventConfig[event.eventType]
        const Icon = config.icon
        const isLast = index === events.length - 1

        return (
          <li key={event.id} className="relative flex gap-4 pb-6">
            {/* Vertical connector line */}
            {!isLast && (
              <div className="absolute left-[18px] top-8 bottom-0 w-px bg-border" />
            )}

            {/* Icon */}
            <div className="relative flex-shrink-0 w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center">
              <Icon className={cn('w-4 h-4', config.colour)} />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-0.5 pt-1.5">
              <p className="text-sm font-medium text-ink">{config.label}</p>
              {event.metadata?.amount && (
                <p className="text-sm text-ink-muted">
                  {formatNaira(event.metadata.amount)}
                </p>
              )}
              <p className="text-xs text-ink-faint">{formatDateTime(event.createdAt)}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
```

### ReputationScore

```tsx
// components/reputation/ReputationScore.tsx

interface ReputationScoreProps {
  score: number
  completedPledges: number
  onTimeRate: number
  activeOverdue: number
  isNew: boolean
}

function getScoreColour(score: number): string {
  if (score >= 80) return 'text-success'
  if (score >= 50) return 'text-primary'
  if (score >= 30) return 'text-warning'
  return 'text-error'
}

export function ReputationScore({
  score,
  completedPledges,
  onTimeRate,
  activeOverdue,
  isNew,
}: ReputationScoreProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {isNew ? (
        <div className="flex flex-col items-center gap-2">
          <span className="bg-primary-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
            New Member
          </span>
          <p className="text-xs text-ink-muted text-center">
            Complete your first pledge to earn a reputation score
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <p className={cn('text-5xl font-serif font-bold tabular-nums', getScoreColour(score))}>
            {score}
          </p>
          <p className="text-xs text-ink-muted uppercase tracking-widest">Reputation</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 w-full border-t border-border pt-4">
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-lg font-semibold text-ink">{completedPledges}</p>
          <p className="text-xs text-ink-muted text-center">Completed</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-lg font-semibold text-ink">{onTimeRate}%</p>
          <p className="text-xs text-ink-muted text-center">On Time</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className={cn('text-lg font-semibold', activeOverdue > 0 ? 'text-warning' : 'text-ink')}>
            {activeOverdue}
          </p>
          <p className="text-xs text-ink-muted text-center">Overdue</p>
        </div>
      </div>
    </div>
  )
}
```

---

## Empty State Pattern

Every list component must handle its empty state.

```tsx
// components/ui/EmptyState.tsx

import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 px-6 text-center">
      <Icon className="w-10 h-10 text-ink-faint" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description && <p className="text-sm text-ink-muted">{description}</p>}
      </div>
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
```

---

## Page Section Pattern (Layer 3)

```tsx
// app/(dashboard)/pledges/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Banknote } from 'lucide-react'
import { PledgeCard } from '@/components/pledge/PledgeCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { PledgeCardSkeleton } from '@/components/pledge/PledgeCardSkeleton'
import { useRouter } from 'next/navigation'
import type { PledgeSummary } from '@/types'

export default function PledgesPage() {
  const router = useRouter()
  const [pledges, setPledges] = useState<PledgeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPledges() {
      try {
        const res = await fetch('/api/pledges')
        if (!res.ok) throw new Error('Failed to load pledges')
        const data = await res.json()
        setPledges(data)
      } catch {
        setError('We could not load your pledges. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchPledges()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => <PledgeCardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-error text-center py-8">{error}</p>
  }

  if (pledges.length === 0) {
    return (
      <EmptyState
        icon={Banknote}
        title="No pledges yet"
        description="Create your first pledge to start tracking a commitment."
        action={{ label: 'Create Pledge', onClick: () => router.push('/pledges/new') }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {pledges.map((pledge) => (
        <PledgeCard
          key={pledge.id}
          pledge={pledge}
          perspective="lender"
          onClick={() => router.push(`/pledges/${pledge.id}`)}
        />
      ))}
    </div>
  )
}
```

---

## Skeleton Loader Pattern

Every Layer 2 component that is fetched needs a matching skeleton.

```tsx
// components/pledge/PledgeCardSkeleton.tsx

export function PledgeCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-16 bg-border rounded" />
          <div className="h-4 w-32 bg-border rounded" />
          <div className="h-3 w-48 bg-border rounded" />
        </div>
        <div className="h-5 w-16 bg-border rounded-full" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-20 bg-border rounded" />
          <div className="h-8 w-28 bg-border rounded" />
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="h-3 w-12 bg-border rounded" />
          <div className="h-4 w-20 bg-border rounded" />
        </div>
      </div>
    </div>
  )
}
```

---

## Formatting Helpers

These must be used everywhere amounts, dates, and phone numbers are displayed.
They live in `lib/format.ts`.

```ts
// lib/format.ts

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  // Output: "12 Jun 2025"
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeDate(date: string | Date): string {
  const diff = new Date(date).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return `${Math.abs(days)} days overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `${days} days left`
}
```

---

## Component Checklist Before Submitting

- [ ] Layer 1 component has no business logic and no data fetching
- [ ] Layer 2 component receives all data as props — no internal fetch calls
- [ ] Layer 3 page handles loading, error, and empty states explicitly
- [ ] Every list view has a skeleton loader
- [ ] Every empty state has an icon, title, and optional action
- [ ] Naira amounts always use `formatNaira()` — never raw `.toLocaleString()`
- [ ] Dates always use `formatDate()` or `formatDateTime()` — never raw `new Date().toString()`
- [ ] Status colours come from `StatusBadge` — never hardcoded inline colours
- [ ] Reputation score uses `getScoreColour()` — no inline conditional colours
- [ ] `cn()` utility used for all conditional class merging
- [ ] All interactive elements have visible focus states
- [ ] No hardcoded pixel values — use Tailwind spacing scale only
