import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { formatPercentage } from '@/utils/formatters'

interface MetricCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon: React.ElementType
  index?: number
  /** Lower is better for this metric (used for churn, CAC). Inverts color of the change pill. */
  invertedChange?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  index = 0,
  invertedChange = false,
}: MetricCardProps) {
  const hasChange = typeof change === 'number'
  const isPositive = hasChange ? change >= 0 : false
  const isGood = invertedChange ? !isPositive : isPositive

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm',
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
      {hasChange && (
        <div className="relative z-10 mt-2 flex flex-wrap items-center gap-x-1 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-semibold transition-colors duration-200',
              isGood ? 'text-teal-600 group-hover:text-teal-400' : 'text-rose-600 group-hover:text-rose-400'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden />
            )}
            {formatPercentage(change)}
          </span>
          {changeLabel && (
            <span
              className={cn(
                'text-muted-foreground transition-colors duration-200',
                'group-hover:text-white/70'
              )}
            >
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
