import { motion } from 'framer-motion'
import { Cpu, Mic, CircleDollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { aiUsageSnapshot, aiTopClinics } from './dashboardWidgetsData'

function formatCompact(n: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(n)
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const PLAN_TONE = {
  Basic: 'border-neutral-200 bg-neutral-100 text-neutral-700',
  Advanced: 'border-sky-200 bg-sky-50 text-sky-700',
  Premium: 'border-violet-200 bg-violet-50 text-violet-700',
  Enterprise: 'border-amber-200 bg-amber-50 text-amber-700',
} as const

function MiniStat({
  label,
  value,
  changePct,
  helper,
  icon: Icon,
  tint,
}: {
  label: string
  value: string
  changePct?: number
  helper?: string
  icon: React.ElementType
  tint: string
}) {
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
        {typeof changePct === 'number' && (
          <span
            className={cn(
              'font-semibold',
              changePct >= 0 ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            {changePct >= 0 ? '+' : ''}
            {changePct.toFixed(1)}%
          </span>
        )}
        {helper && <span className="text-muted-foreground">{helper}</span>}
      </div>
    </div>
  )
}

export function AIUsageOverviewWidget() {
  const costShare =
    aiUsageSnapshot.revenueAttributedMonth === 0
      ? 0
      : (aiUsageSnapshot.costMonth / aiUsageSnapshot.revenueAttributedMonth) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.34 }}
    >
      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-card-foreground">
            AI Usage Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Platform AI consumption and cost vs revenue
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat
              label="AI requests (month)"
              value={formatCompact(aiUsageSnapshot.totalRequestsMonth)}
              changePct={aiUsageSnapshot.requestsChangePct}
              helper="vs last month"
              icon={Cpu}
              tint="bg-violet-50 text-violet-700"
            />
            <MiniStat
              label="Dictation minutes"
              value={formatCompact(aiUsageSnapshot.dictationMinutes)}
              changePct={aiUsageSnapshot.dictationChangePct}
              helper="vs last month"
              icon={Mic}
              tint="bg-emerald-50 text-emerald-700"
            />
            <MiniStat
              label="AI cost (month)"
              value={formatUsd(aiUsageSnapshot.costMonth)}
              changePct={aiUsageSnapshot.costChangePct}
              helper="vs last month"
              icon={CircleDollarSign}
              tint="bg-amber-50 text-amber-700"
            />
            <MiniStat
              label="Cost vs revenue"
              value={`${costShare.toFixed(1)}%`}
              helper={`${formatUsd(aiUsageSnapshot.revenueAttributedMonth)} revenue`}
              icon={TrendingUp}
              tint="bg-sky-50 text-sky-700"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-card-foreground">
              Top AI-consuming clinics
            </p>
            <ul className="space-y-2">
              {aiTopClinics.map((row) => (
                <li
                  key={row.clinic}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-card-foreground">{row.clinic}</p>
                      <Badge variant="outline" className={cn('font-medium', PLAN_TONE[row.plan])}>
                        {row.plan}
                      </Badge>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-neutral-100 sm:max-w-[200px]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          style={{ width: `${Math.min(100, row.share * 3)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{row.share}%</span>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-bold tabular-nums text-card-foreground">
                    {formatCompact(row.weeklyRequests)}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">/wk</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
