import { useMemo } from 'react'
import { CircleDollarSign, TrendingUp, Wallet, Globe2 } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from './MetricCard'
import {
  revenueTrend,
  revenueByTier,
  revenueByRegion,
  currentMrr,
  previousMrr,
  currentArr,
  previousArr,
} from './reportsData'

const TEAL = '#14b8a6'
const PURPLE = '#7946CD'

function formatUsd0(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const kFormatter = (v: number) => `${Math.round(v / 1000)}k`

const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; name: string; color: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md bg-[#364355] px-3 py-2 text-xs font-medium text-white shadow-lg">
      {label && <p className="mb-1 text-white/70">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.name}:</span>
          <span>{formatUsd0(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export function RevenueMetricsSection() {
  const mrrGrowth = useMemo(
    () => ((currentMrr - previousMrr) / previousMrr) * 100,
    []
  )
  const arrGrowth = useMemo(
    () => ((currentArr - previousArr) / previousArr) * 100,
    []
  )
  const totalRevenue = useMemo(
    () => revenueTrend.reduce((sum, r) => sum + r.mrr, 0),
    []
  )
  const revenueGrowth = useMemo(() => {
    const first = revenueTrend[0]?.mrr ?? 1
    const last = revenueTrend[revenueTrend.length - 1]?.mrr ?? 0
    return ((last - first) / first) * 100
  }, [])

  const totalRegionRevenue = useMemo(
    () => revenueByRegion.reduce((sum, r) => sum + r.revenue, 0),
    []
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="MRR"
          value={formatUsd0(currentMrr)}
          change={Number(mrrGrowth.toFixed(1))}
          changeLabel="vs last month"
          icon={CircleDollarSign}
          index={0}
        />
        <MetricCard
          title="ARR"
          value={formatUsd0(currentArr)}
          change={Number(arrGrowth.toFixed(1))}
          changeLabel="vs last month"
          icon={Wallet}
          index={1}
        />
        <MetricCard
          title="Revenue Growth"
          value={`${revenueGrowth.toFixed(1)}%`}
          change={Number(revenueGrowth.toFixed(1))}
          changeLabel="YTD"
          icon={TrendingUp}
          index={2}
        />
        <MetricCard
          title="Total Revenue (YTD)"
          value={formatUsd0(totalRevenue)}
          change={12.4}
          changeLabel="vs last year"
          icon={Globe2}
          index={3}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-card-foreground">
                  MRR &amp; ARR Trend
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monthly recurring revenue and annualized run rate
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[320px] w-full sm:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 16, right: 12, left: 4, bottom: 4 }}>
                  <defs>
                    <linearGradient id="mrr-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="arr-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PURPLE} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    tickFormatter={kFormatter}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="arr"
                    name="ARR"
                    stroke={PURPLE}
                    strokeWidth={2}
                    fill="url(#arr-fill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    name="MRR"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    fill="url(#mrr-fill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
        >
          <Card className="h-full rounded-2xl bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-card-foreground">
                Revenue by Tier
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Current MRR distribution across subscription plans
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByTier}
                        dataKey="revenue"
                        nameKey="tier"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {revenueByTier.map((row) => (
                          <Cell key={row.tier} fill={row.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          const row = payload[0].payload as (typeof revenueByTier)[number]
                          return (
                            <div className="rounded-md bg-[#364355] px-3 py-2 text-xs font-medium text-white shadow-lg">
                              <p>{row.tier}</p>
                              <p>{formatUsd0(row.revenue)} · {row.share}%</p>
                            </div>
                          )
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-2 text-sm">
                  {revenueByTier.map((row) => (
                    <li key={row.tier} className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: row.color }}
                      />
                      <span className="font-medium text-card-foreground">{row.tier}</span>
                      <span className="ml-1 text-muted-foreground">
                        {formatUsd0(row.revenue)} · {row.share}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.34 }}
        >
          <Card className="h-full rounded-2xl bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-card-foreground">
                Revenue by Region
              </CardTitle>
              <p className="text-sm text-muted-foreground">Top markets by country / state</p>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3">
                {revenueByRegion.map((row) => {
                  const pct = (row.revenue / totalRegionRevenue) * 100
                  return (
                    <li key={`${row.country}-${row.region}`} className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-card-foreground">
                            {row.region}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {row.country} · {row.clinics} clinics
                          </p>
                        </div>
                        <p className="shrink-0 font-semibold text-card-foreground">
                          {formatUsd0(row.revenue)}
                        </p>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(to right, ${TEAL}, ${PURPLE})`,
                          }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
