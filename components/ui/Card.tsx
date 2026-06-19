import { cn } from '@/lib/utils'

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
        onClick &&
          'cursor-pointer hover:shadow-lg transition-shadow duration-150',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
