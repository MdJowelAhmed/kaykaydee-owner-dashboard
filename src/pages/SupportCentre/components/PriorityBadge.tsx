import { cn } from '@/utils/cn'
import { PRIORITY_LABELS, type TicketPriority } from '../types'

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-primary/10 text-primary',
  high: 'bg-warning/10 text-warning',
  urgent: 'bg-destructive/10 text-destructive',
}

interface PriorityBadgeProps {
  priority: TicketPriority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        PRIORITY_STYLES[priority],
        className
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
