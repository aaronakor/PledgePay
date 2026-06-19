import { cn } from '@/lib/utils'
import type { PledgeStatus } from '@/types'

const statusConfig: Record<
  PledgeStatus,
  { label: string; className: string }
> = {
  PENDING_ACCEPTANCE: {
    label: 'Pending',
    className: 'bg-warning-bg text-warning',
  },
  AWAITING_FUNDING: {
    label: 'Awaiting Funding',
    className: 'bg-info-bg text-info',
  },
  ACTIVE: {
    label: 'Active',
    className: 'bg-primary-50 text-primary',
  },
  OVERDUE: {
    label: 'Overdue',
    className: 'bg-warning-bg text-warning',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-success-bg text-success',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-neutral-bg text-neutral',
  },
  EXPIRED: {
    label: 'Expired',
    className: 'bg-neutral-bg text-neutral',
  },
}

export function StatusBadge({ status }: { status: PledgeStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'text-xs font-medium px-2.5 py-0.5 rounded-full',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
