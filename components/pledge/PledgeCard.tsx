import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatNaira, formatDate, formatRelativeDate } from '@/lib/format'
import type { PledgeSummary } from '@/types'

interface PledgeCardProps {
  pledge: PledgeSummary
  perspective: 'lender' | 'borrower'
  onClick?: () => void
}

export function PledgeCard({
  pledge,
  perspective,
  onClick,
}: PledgeCardProps) {
  const counterpartyName =
    perspective === 'lender' ? pledge.borrowerName : pledge.lenderName

  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-ink-muted font-medium uppercase tracking-wide">
            {perspective === 'lender' ? 'Lent to' : 'Borrowed from'}
          </p>
          <p className="text-base font-semibold text-ink">
            {counterpartyName}
          </p>
          <p className="text-sm text-ink-muted">{pledge.purpose}</p>
        </div>
        <StatusBadge status={pledge.status} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-ink-muted">Outstanding</p>
          <p className="text-2xl font-serif text-ink tabular-nums">
            {formatNaira(pledge.outstandingBalance / 100)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-muted">Due</p>
          <p className="text-sm font-medium text-ink">
            {formatDate(pledge.dueDate)}
          </p>
          <p className="text-xs text-ink-faint">
            {formatRelativeDate(pledge.dueDate)}
          </p>
        </div>
      </div>
    </Card>
  )
}
