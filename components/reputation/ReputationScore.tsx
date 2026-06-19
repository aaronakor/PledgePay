import { cn } from '@/lib/utils'

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
          <p
            className={cn(
              'text-5xl font-serif font-bold tabular-nums',
              getScoreColour(score)
            )}
          >
            {score}
          </p>
          <p className="text-xs text-ink-muted uppercase tracking-widest">
            Reputation
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 w-full border-t border-border pt-4">
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-lg font-semibold text-ink">
            {completedPledges}
          </p>
          <p className="text-xs text-ink-muted text-center">Completed</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-lg font-semibold text-ink">{onTimeRate}%</p>
          <p className="text-xs text-ink-muted text-center">On Time</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p
            className={cn(
              'text-lg font-semibold',
              activeOverdue > 0 ? 'text-warning' : 'text-ink'
            )}
          >
            {activeOverdue}
          </p>
          <p className="text-xs text-ink-muted text-center">Overdue</p>
        </div>
      </div>
    </div>
  )
}
