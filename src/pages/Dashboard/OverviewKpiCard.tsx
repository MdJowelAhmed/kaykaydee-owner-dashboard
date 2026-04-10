import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'
import { formatPercentage } from '@/utils/formatters'

export interface OverviewKpiCardProps {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
  index: number
  /** Kept for API compatibility; styling matches other cards (white / black hover). */
  featured?: boolean
}

export function OverviewKpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  index,
}: OverviewKpiCardProps) {
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/60 bg-white p-6 shadow-sm',
        'transition-all duration-200 ease-out',
        'hover:border-black hover:bg-black hover:shadow-lg'
      )}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <p
          className={cn(
            'text-sm font-medium text-muted-foreground transition-colors duration-200',
            'group-hover:text-white/80'
          )}
        >
          {title}
        </p>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
            'bg-neutral-100 group-hover:bg-white/15'
          )}
        >
          <Icon
            className={cn(
              'h-5 w-5 text-neutral-700 transition-colors duration-200',
              'group-hover:text-white'
            )}
          />
        </div>
      </div>
      <p
        className={cn(
          'relative z-10 mt-4 text-3xl font-bold tracking-tight text-foreground transition-colors duration-200 xl:text-[2rem]',
          'group-hover:text-white'
        )}
      >
        {value}
      </p>
      <div className="relative z-10 mt-2 flex flex-wrap items-center gap-x-1 text-xs">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 font-semibold text-teal-600 transition-colors duration-200',
            'group-hover:text-teal-400'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" aria-hidden />
          )}
          {formatPercentage(change)}
        </span>
        <span
          className={cn(
            'text-muted-foreground transition-colors duration-200',
            'group-hover:text-white/70'
          )}
        >
          {changeLabel}
        </span>
      </div>
    </motion.div>
  )
}
