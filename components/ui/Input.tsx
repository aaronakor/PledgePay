import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  prefix?: string
}

export function Input({
  label,
  error,
  hint,
  prefix,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-ink"
      >
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
            'w-full h-10 rounded-md border border-border bg-gray-50 px-3 text-sm text-ink',
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
      {hint && !error && (
        <p className="text-xs text-ink-muted">{hint}</p>
      )}
    </div>
  )
}
