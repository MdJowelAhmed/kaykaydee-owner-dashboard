import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Timer, Users, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { StatusPill } from './StatusPill'
import { formatCompact, formatNumber, TH, TD } from './shared'
import {
  featureUsage,
  dictationTimeSaved,
  adoptionByClinic,
  type AIAdoptionRow,
} from './aiData'

const TEAL = '#14b8a6'
const PURPLE = '#7946CD'

const PLAN_TONE = {
  Basic: 'neutral',
  Professional: 'info',
  Enterprise: 'violet',
} as const

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
      className="rounded-2xl bg-card p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', tint)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">{value}</p>
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </motion.div>
  )
}

const FeatureTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: { value: number; payload: { feature: string; share: number } }[]
}) => {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-md bg-[#364355] px-3 py-2 text-xs font-medium text-white shadow-lg">
      <p>{p.feature}</p>
      <p>{formatNumber(payload[0].value)} requests · {p.share}%</p>
    </div>
  )
}

const TimeTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md bg-[#364355] px-3 py-2 text-xs font-medium text-white shadow-lg">
      {label && <p className="mb-1 text-white/70">{label}</p>}
      <p>{payload[0].value} min / clinician / day</p>
    </div>
  )
}

export function AnalyticsSection() {
  const totalRequests = useMemo(
    () => featureUsage.reduce((sum, f) => sum + f.requests, 0),
    []
  )
  const topFeature = useMemo(
    () =>
      featureUsage.slice().sort((a, b) => b.requests - a.requests)[0],
    []
  )

  const summary = useMemo(() => {
    const lastMonth = dictationTimeSaved[dictationTimeSaved.length - 1]
    const prevMonth = dictationTimeSaved[dictationTimeSaved.length - 2]
    const timeSaved = lastMonth?.minutesPerClinician ?? 0
    const timeSavedGrowth =
      prevMonth && prevMonth.minutesPerClinician > 0
        ? ((timeSaved - prevMonth.minutesPerClinician) / prevMonth.minutesPerClinician) * 100
        : 0

    const totalUsers = adoptionByClinic.reduce((s, c) => s + c.totalUsers, 0)
    const activeUsers = adoptionByClinic.reduce((s, c) => s + c.activeUsers, 0)
    const adoptionRate = totalUsers === 0 ? 0 : (activeUsers / totalUsers) * 100

    return { timeSaved, timeSavedGrowth, totalUsers, activeUsers, adoptionRate }
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Most-used Feature"
          value={topFeature ? topFeature.feature.split(' ')[0] : '—'}
          helper={topFeature ? `${formatCompact(topFeature.requests)} requests · ${topFeature.share}%` : undefined}
          icon={Sparkles}
          tint="bg-violet-50 text-violet-700"
          index={0}
        />
        <MetricCard
          label="Total Requests (Month)"
          value={formatCompact(totalRequests)}
          helper={`${featureUsage.length} features in use`}
          icon={TrendingUp}
          tint="bg-sky-50 text-sky-700"
          index={1}
        />
        <MetricCard
          label="Time Saved / Clinician"
          value={`${summary.timeSaved} min/day`}
          helper={`${summary.timeSavedGrowth >= 0 ? '+' : ''}${summary.timeSavedGrowth.toFixed(1)}% vs last month`}
          icon={Timer}
          tint="bg-emerald-50 text-emerald-700"
          index={2}
        />
        <MetricCard
          label="Adoption Rate"
          value={`${summary.adoptionRate.toFixed(0)}%`}
          helper={`${summary.activeUsers} of ${summary.totalUsers} users active`}
          icon={Users}
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
              Most-used AI Features
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Requests per feature in the last 30 days
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[320px] w-full sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={featureUsage}
                  layout="vertical"
                  margin={{ top: 12, right: 48, left: 16, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(v) => formatCompact(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    width={200}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#374151', fontSize: 12 }}
                  />
                  <Tooltip content={<FeatureTooltip />} />
                  <Bar dataKey="requests" fill={PURPLE} radius={[0, 6, 6, 0]} maxBarSize={22}>
                    <LabelList
                      dataKey="share"
                      position="right"
                      formatter={(v) => `${v}%`}
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
              Avg Dictation Time Saved
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Minutes saved per clinician per day from voice dictation
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[260px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dictationTimeSaved}
                  margin={{ top: 16, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(v) => `${v}m`}
                  />
                  <Tooltip content={<TimeTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="minutesPerClinician"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={{ fill: TEAL, strokeWidth: 2, stroke: '#fff', r: 4 }}
                    activeDot={{ r: 6, fill: TEAL, stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
              AI Adoption by Clinic
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Active vs total seats and weekly request volume
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>Clinic</th>
                    <th className={TH}>Plan</th>
                    <th className={TH}>Active / Total</th>
                    <th className={TH}>Adoption</th>
                    <th className={TH}>Weekly Requests</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {adoptionByClinic.map((row: AIAdoptionRow) => {
                    const pct = (row.activeUsers / row.totalUsers) * 100
                    return (
                      <tr key={row.clinic} className="hover:bg-neutral-50">
                        <td className={cn(TD, 'font-medium')}>{row.clinic}</td>
                        <td className={TD}>
                          <StatusPill tone={PLAN_TONE[row.plan]}>{row.plan}</StatusPill>
                        </td>
                        <td className={cn(TD, 'whitespace-nowrap')}>
                          {row.activeUsers} / {row.totalUsers}
                        </td>
                        <td className={TD}>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-neutral-100">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{pct.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className={TD}>{formatNumber(row.weeklyRequests)}</td>
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
