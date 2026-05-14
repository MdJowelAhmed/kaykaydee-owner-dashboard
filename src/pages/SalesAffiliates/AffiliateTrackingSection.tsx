import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  CircleDollarSign,
  RefreshCcw,
  Target,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { TH, TD, formatUsd, formatPercent } from './shared'
import { affiliateMetrics, type AffiliateMetrics } from './salesData'

const TEAL = '#14b8a6'

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

const RevenueTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: { value: number; payload: AffiliateMetrics }[]
}) => {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="rounded-md bg-[#364355] px-3 py-2 text-xs font-medium text-white shadow-lg">
      <p className="mb-1">{row.name}</p>
      <p>{formatUsd(row.revenueGenerated)} revenue</p>
      <p>{row.clinicsOnboarded} clinics · {formatPercent(row.conversionRate, 0)} conv</p>
    </div>
  )
}

export function AffiliateTrackingSection() {
  const summary = useMemo(() => {
    const clinics = affiliateMetrics.reduce((s, a) => s + a.clinicsOnboarded, 0)
    const revenue = affiliateMetrics.reduce((s, a) => s + a.revenueGenerated, 0)
    const mrrCommission = affiliateMetrics.reduce(
      (s, a) => s + a.monthlyRecurringCommission,
      0
    )
    const avgConversion =
      affiliateMetrics.length === 0
        ? 0
        : affiliateMetrics.reduce((s, a) => s + a.conversionRate, 0) /
          affiliateMetrics.length
    return { clinics, revenue, mrrCommission, avgConversion }
  }, [])

  const sorted = useMemo(
    () => affiliateMetrics.slice().sort((a, b) => b.revenueGenerated - a.revenueGenerated),
    []
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Clinics onboarded"
          value={summary.clinics.toString()}
          helper="Across all affiliates"
          icon={Building2}
          tint="bg-sky-50 text-sky-700"
          index={0}
        />
        <MetricCard
          label="Revenue generated"
          value={formatUsd(summary.revenue)}
          helper="Lifetime revenue from affiliate-led clinics"
          icon={CircleDollarSign}
          tint="bg-emerald-50 text-emerald-700"
          index={1}
        />
        <MetricCard
          label="MRR commission"
          value={formatUsd(summary.mrrCommission)}
          helper="Recurring monthly payout"
          icon={RefreshCcw}
          tint="bg-violet-50 text-violet-700"
          index={2}
        />
        <MetricCard
          label="Avg conversion rate"
          value={formatPercent(summary.avgConversion, 1)}
          helper="Lead → paying clinic"
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
              Revenue by affiliate
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Cumulative revenue generated per sales user
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[320px] w-full sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sorted}
                  layout="vertical"
                  margin={{ top: 12, right: 56, left: 20, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#374151', fontSize: 12 }}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Bar
                    dataKey="revenueGenerated"
                    fill={TEAL}
                    radius={[0, 6, 6, 0]}
                    maxBarSize={22}
                  >
                    <LabelList
                      dataKey="revenueGenerated"
                      position="right"
                      formatter={(v) =>
                        `$${Math.round((Number(v) || 0) / 1000)}k`
                      }
                      fill="#6b7280"
                      fontSize={11}
                      fontWeight={600}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
              Affiliate performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Onboarding velocity, revenue, recurring commission, and conversion rate
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>Affiliate</th>
                    <th className={TH}>Clinics onboarded</th>
                    <th className={TH}>Revenue generated</th>
                    <th className={TH}>Monthly recurring commission</th>
                    <th className={TH}>Conversion rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sorted.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={TD}>
                        <div className="flex items-center gap-3">
                          <img
                            src={row.avatarUrl}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                          />
                          <p className="font-medium">{row.name}</p>
                        </div>
                      </td>
                      <td className={TD}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold tabular-nums">
                            {row.clinicsOnboarded}
                          </span>
                          {row.clinicsOnboardedDelta > 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                              <TrendingUp className="h-3 w-3" />+{row.clinicsOnboardedDelta}
                            </span>
                          ) : row.clinicsOnboardedDelta < 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-600">
                              <TrendingDown className="h-3 w-3" />
                              {row.clinicsOnboardedDelta}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">no change</span>
                          )}
                        </div>
                      </td>
                      <td className={cn(TD, 'tabular-nums font-semibold')}>
                        {formatUsd(row.revenueGenerated)}
                      </td>
                      <td className={cn(TD, 'tabular-nums')}>
                        {formatUsd(row.monthlyRecurringCommission)}
                        <span className="ml-1 text-xs text-muted-foreground">/mo</span>
                      </td>
                      <td className={TD}>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                row.conversionRate >= 0.35
                                  ? 'bg-emerald-500'
                                  : row.conversionRate >= 0.2
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                              )}
                              style={{ width: `${Math.min(100, row.conversionRate * 200)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-card-foreground">
                            {formatPercent(row.conversionRate, 0)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
