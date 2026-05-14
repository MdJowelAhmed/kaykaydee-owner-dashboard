import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Crown, Award, Trophy, Sparkles, RefreshCcw, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { StatusPill } from './StatusPill'
import { TH, TD, formatUsd } from './shared'
import {
  affiliateMetrics,
  commissionTierRules,
  commissionMilestones,
  salesUsers,
  type CommissionTier,
  type CommissionMilestone,
} from './salesData'

const TIER_TONE = {
  Bronze: 'amber',
  Silver: 'neutral',
  Gold: 'warning',
  Platinum: 'violet',
} as const

const TIER_ICON: Record<CommissionTier, React.ElementType> = {
  Bronze: Award,
  Silver: Award,
  Gold: Trophy,
  Platinum: Crown,
}

interface MilestoneProgress {
  milestone: CommissionMilestone
  progress: number
  achievedBy: string[]
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tint,
  index,
}: {
  label: string
  value: string
  helper?: string
  icon: React.ElementType
  tint: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', tint)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{value}</p>
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </motion.div>
  )
}

export function CommissionDashboardSection() {
  const summary = useMemo(() => {
    const monthlyPayout = affiliateMetrics.reduce(
      (s, a) => s + a.monthlyRecurringCommission,
      0
    )
    const totalSales = salesUsers.length
    const platinums = salesUsers.filter((u) => u.tier === 'Platinum').length
    return { monthlyPayout, totalSales, platinums }
  }, [])

  const milestoneRows = useMemo<MilestoneProgress[]>(() => {
    return commissionMilestones.map((m) => {
      let achievedBy: string[] = []
      let progress = 0
      if (m.id === 'BM-1') {
        achievedBy = salesUsers.filter((u) => u.clinicsOnboarded >= 1).map((u) => u.name)
        const denom = salesUsers.length
        progress = denom === 0 ? 0 : achievedBy.length / denom
      } else if (m.id === 'BM-2') {
        achievedBy = salesUsers.filter((u) => u.clinicsOnboarded >= 10).map((u) => u.name)
        const denom = salesUsers.length
        progress = denom === 0 ? 0 : achievedBy.length / denom
      } else if (m.id === 'BM-3') {
        achievedBy = affiliateMetrics
          .filter((a) => a.revenueGenerated >= 100_000)
          .map((a) => a.name)
        const denom = affiliateMetrics.length
        progress = denom === 0 ? 0 : achievedBy.length / denom
      } else {
        achievedBy = affiliateMetrics
          .slice()
          .sort((a, b) => b.revenueGenerated - a.revenueGenerated)
          .slice(0, 3)
          .map((a) => a.name)
        progress = 1
      }
      return { milestone: m, progress, achievedBy }
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Monthly payout"
          value={formatUsd(summary.monthlyPayout)}
          helper="Recurring commissions due this month"
          icon={RefreshCcw}
          tint="bg-emerald-50 text-emerald-700"
          index={0}
        />
        <MetricCard
          label="Sales users"
          value={summary.totalSales.toString()}
          helper={`${summary.platinums} on Platinum tier`}
          icon={Sparkles}
          tint="bg-sky-50 text-sky-700"
          index={1}
        />
        <MetricCard
          label="Tier rules"
          value={`${commissionTierRules.length}`}
          helper="Bronze → Silver → Gold → Platinum"
          icon={Award}
          tint="bg-violet-50 text-violet-700"
          index={2}
        />
        <MetricCard
          label="Active milestones"
          value={`${commissionMilestones.length}`}
          helper="Bonus events available to earn"
          icon={Target}
          tint="bg-amber-50 text-amber-700"
          index={3}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Tier-based commission
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Recurring percent + per-clinic bonus by tier
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {commissionTierRules.map((rule) => {
                const Icon = TIER_ICON[rule.tier]
                return (
                  <div
                    key={rule.tier}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <StatusPill tone={TIER_TONE[rule.tier]}>{rule.tier}</StatusPill>
                    </div>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">
                      {rule.recurringPct}%
                    </p>
                    <p className="text-xs text-muted-foreground">recurring commission</p>
                    <p className="mt-3 text-sm font-semibold text-card-foreground">
                      {formatUsd(rule.newClinicBonus)}
                    </p>
                    <p className="text-xs text-muted-foreground">per new clinic</p>
                    <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                      {rule.requirement}
                    </p>
                    <p className="mt-1 text-xs">
                      <span className="font-semibold text-card-foreground">{rule.active}</span>
                      <span className="text-muted-foreground"> currently in tier</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.28 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Bonus milestones
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              One-time bonuses awarded for hitting growth milestones
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {milestoneRows.map(({ milestone, progress, achievedBy }) => (
              <div
                key={milestone.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <p className="font-semibold text-card-foreground">{milestone.name}</p>
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        {formatUsd(milestone.bonusAmount)}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    Trigger:{' '}
                    <span className="font-semibold text-card-foreground">
                      {milestone.threshold.toLocaleString('en-US')}
                    </span>{' '}
                    {milestone.thresholdLabel}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                      style={{ width: `${Math.min(100, progress * 100)}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-card-foreground">
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                {achievedBy.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-card-foreground">Earned by: </span>
                    {achievedBy.join(' · ')}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.34 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Monthly recurring commission run
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              What each affiliate is currently earning per month
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>Sales user</th>
                    <th className={TH}>Tier</th>
                    <th className={TH}>Clinics</th>
                    <th className={TH}>Recurring commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {salesUsers.map((u) => {
                    const aff = affiliateMetrics.find((a) => a.salesUserId === u.id)
                    return (
                      <tr key={u.id} className="hover:bg-neutral-50">
                        <td className={TD}>
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatarUrl}
                              alt=""
                              className="h-9 w-9 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className={TD}>
                          <StatusPill tone={TIER_TONE[u.tier]}>{u.tier}</StatusPill>
                        </td>
                        <td className={cn(TD, 'tabular-nums')}>{u.clinicsOnboarded}</td>
                        <td className={cn(TD, 'tabular-nums font-semibold')}>
                          {formatUsd(aff?.monthlyRecurringCommission ?? 0)}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            /mo
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
