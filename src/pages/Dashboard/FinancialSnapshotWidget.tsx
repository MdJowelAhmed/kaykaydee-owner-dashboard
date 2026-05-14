import { motion } from 'framer-motion'
import {
  CalendarDays,
  CalendarRange,
  FileWarning,
  AlertTriangle,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import {
  financialSnapshot,
  outstandingInvoicesLite,
  churnRiskRows,
  recentFailedPayments,
} from './dashboardWidgetsData'

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatPct(pct: number, decimals = 1): string {
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(decimals)}%`
}

const PLAN_TONE = {
  Basic: 'border-neutral-200 bg-neutral-100 text-neutral-700',
  Advanced: 'border-sky-200 bg-sky-50 text-sky-700',
  Premium: 'border-violet-200 bg-violet-50 text-violet-700',
} as const

function MiniStat({
  label,
  value,
  helper,
  icon: Icon,
  tint,
  changePct,
  invertChange,
}: {
  label: string
  value: string
  helper?: string
  icon: React.ElementType
  tint: string
  changePct?: number
  invertChange?: boolean
}) {
  const hasChange = typeof changePct === 'number'
  const isPositive = hasChange ? changePct >= 0 : false
  const isGood = invertChange ? !isPositive : isPositive

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', tint)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
      <div className="mt-1 flex items-baseline gap-2 text-xs">
        {hasChange && (
          <span className={cn('font-semibold', isGood ? 'text-emerald-600' : 'text-rose-600')}>
            {formatPct(changePct)}
          </span>
        )}
        {helper && <span className="text-muted-foreground">{helper}</span>}
      </div>
    </div>
  )
}

export function FinancialSnapshotWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.28 }}
    >
      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-card-foreground">
            Financial Snapshot
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Revenue, receivables, and risk at a glance
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MiniStat
              label="Revenue today"
              value={formatUsd(financialSnapshot.revenueToday)}
              changePct={financialSnapshot.revenueTodayChangePct}
              helper="vs yesterday"
              icon={CalendarDays}
              tint="bg-emerald-50 text-emerald-700"
            />
            <MiniStat
              label="Revenue this month"
              value={formatUsd(financialSnapshot.revenueMonth)}
              changePct={financialSnapshot.revenueMonthChangePct}
              helper="vs last month"
              icon={CalendarRange}
              tint="bg-sky-50 text-sky-700"
            />
            <MiniStat
              label="Outstanding invoices"
              value={formatUsd(financialSnapshot.outstandingTotal)}
              helper={`${financialSnapshot.outstandingCount} invoices`}
              icon={FileWarning}
              tint="bg-amber-50 text-amber-700"
            />
            <MiniStat
              label="Failed payments"
              value={formatUsd(financialSnapshot.failedPaymentsTotal)}
              helper={`${financialSnapshot.failedPaymentsCount} this week`}
              icon={AlertTriangle}
              tint="bg-rose-50 text-rose-700"
            />
            <MiniStat
              label="Churn risk"
              value={`${financialSnapshot.churnRiskCount} clinics`}
              helper={`${formatUsd(financialSnapshot.churnRiskValue)} ARR at risk`}
              icon={TrendingDown}
              tint="bg-violet-50 text-violet-700"
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <Card className="rounded-xl border border-border bg-card shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-card-foreground">
                  Outstanding invoices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {outstandingInvoicesLite.map((row) => (
                  <div
                    key={row.ref}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-card-foreground">{row.clinic}</p>
                      <p className="text-muted-foreground">{row.ref}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold text-card-foreground">{formatUsd(row.amount)}</p>
                      <p
                        className={cn(
                          'text-[10px]',
                          row.daysOverdue > 0 ? 'font-semibold text-rose-600' : 'text-muted-foreground'
                        )}
                      >
                        {row.daysOverdue > 0 ? `${row.daysOverdue}d overdue` : 'Due soon'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-border bg-card shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-card-foreground">
                  Churn risk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {churnRiskRows.map((row) => (
                  <div key={row.clinic} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-card-foreground">{row.clinic}</p>
                        <p className="text-muted-foreground">{row.reason}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="outline" className={cn('font-medium', PLAN_TONE[row.plan])}>
                          {row.plan}
                        </Badge>
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                            row.riskScore >= 70
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          )}
                        >
                          {row.riskScore}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-border bg-card shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-card-foreground">
                  Failed payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {recentFailedPayments.map((row) => (
                  <div
                    key={row.ref}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-card-foreground">{row.clinic}</p>
                      <p className="text-muted-foreground">{row.reason}</p>
                    </div>
                    <p className="shrink-0 font-semibold text-rose-600">{formatUsd(row.amount)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
