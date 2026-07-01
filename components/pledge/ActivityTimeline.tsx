import {
  CheckCircle,
  Clock,
  Banknote,
  Bell,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/format'
import type { ActivityEventType } from '@/types'

const eventConfig: Record<
  ActivityEventType,
  { icon: typeof Clock; colour: string; label: string }
> = {
  PLEDGE_CREATED: {
    icon: Clock,
    colour: 'text-info',
    label: 'Pledge created',
  },
  PLEDGE_ACCEPTED: {
    icon: CheckCircle,
    colour: 'text-success',
    label: 'Pledge accepted',
  },
  FUNDING_CONFIRMED: {
    icon: Banknote,
    colour: 'text-success',
    label: 'Funding confirmed',
  },
  REMINDER_SENT: {
    icon: Bell,
    colour: 'text-primary',
    label: 'Reminder sent',
  },
  PAYMENT_RECEIVED: {
    icon: Banknote,
    colour: 'text-success',
    label: 'Payment received',
  },
  PLEDGE_COMPLETED: {
    icon: CheckCircle,
    colour: 'text-success',
    label: 'Pledge completed',
  },
  PLEDGE_OVERDUE: {
    icon: AlertCircle,
    colour: 'text-warning',
    label: 'Pledge overdue',
  },
  PLEDGE_CANCELLED: {
    icon: XCircle,
    colour: 'text-neutral',
    label: 'Pledge cancelled',
  },
  PLEDGE_EXPIRED: {
    icon: XCircle,
    colour: 'text-neutral',
    label: 'Pledge expired',
  },
}

interface ActivityEvent {
  id: string
  eventType: ActivityEventType
  metadata: Record<string, unknown> | null
  createdAt: Date
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
            {!isLast && (
              <div className="absolute left-[18px] top-8 bottom-0 w-px bg-border" />
            )}
            <div className="relative flex-shrink-0 w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center">
              <Icon className={cn('w-4 h-4', config.colour)} />
            </div>
            <div className="flex flex-col gap-0.5 pt-1.5">
              <p className="text-sm font-medium text-ink">{config.label}</p>
              {!!event.metadata?.amount && (
                <p className="text-sm text-ink-muted">
                  ₦
                  {Number(event.metadata.amount).toLocaleString('en-NG')}
                </p>
              )}
              <p className="text-xs text-ink-faint">
                {formatDateTime(event.createdAt)}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
