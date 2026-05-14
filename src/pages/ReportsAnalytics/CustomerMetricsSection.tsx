import { useMemo } from 'react'
import { Activity, HeartHandshake, Target, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from './MetricCard'
import { customerMetricsTrend } from './reportsData'

const TEAL = '#14b8a6'
const PURPLE = '#7946CD'
const ROSE = '#f43f5e'
const AMBER = '#f59e0b'

function formatUsd0(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const CurrencyTooltip = ({
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
          <span>{p.name}:</span>
          <span>{formatUsd0(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

const PercentTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; color: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md bg-[#364355] px-3 py-2 text-xs font-medium text-white shadow-lg">
      {label && <p className="mb-1 text-white/70">{label}</p>}
      <p className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: payload[0].color }} />
        <span>Churn: {payload[0].value.toFixed(2)}%</span>
      </p>
    </div>
  )
}

export function CustomerMetricsSection() {
  const last = customerMetricsTrend[customerMetricsTrend.length - 1]
  const prev = customerMetricsTrend[customerMetricsTrend.length - 2]

  const deltas = useMemo(() => {
    if (!last || !prev) return null
    const pct = (a: number, b: number) => ((a - b) / b) * 100
    return {
      churn: pct(last.churn, prev.churn),
      ltv: pct(last.ltv, prev.ltv),
      cac: pct(last.cac, prev.cac),
      arpc: pct(last.arpc, prev.arpc),
    }
  }, [last, prev])

  if (!last || !deltas) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Churn Rate"
          value={`${last.churn.toFixed(2)}%`}
          change={Number(deltas.churn.toFixed(1))}
          changeLabel="vs last month"
          icon={Activity}
          index={0}
          invertedChange
        />
        <MetricCard
          title="Lifetime Value (LTV)"
          value={formatUsd0(last.ltv)}
          change={Number(deltas.ltv.toFixed(1))}
          changeLabel="vs last month"
          icon={HeartHandshake}
          index={1}
        />
        <MetricCard
          title="Customer Acquisition Cost"
          value={formatUsd0(last.cac)}
          change={Number(deltas.cac.toFixed(1))}
          changeLabel="vs last month"
          icon={Target}
          index={2}
          invertedChange
        />
        <MetricCard
          title="Avg Revenue / Clinic"
          value={formatUsd0(last.arpc)}
          change={Number(deltas.arpc.toFixed(1))}
          changeLabel="vs last month"
          icon={Building2}
          index={3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <Card className="h-full rounded-2xl bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-card-foreground">
                Churn Rate Trend
              </CardTitle>
              <p className="text-sm text-muted-foreground">Lower is better</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[280px] w-full sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerMetricsTrend} margin={{ top: 16, right: 12, left: 4, bottom: 4 }}>
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
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 4]}
                    />
                    <Tooltip content={<PercentTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="churn"
                      stroke={ROSE}
                      strokeWidth={2.5}
                      dot={{ fill: ROSE, strokeWidth: 2, stroke: '#fff', r: 4 }}
                      activeDot={{ r: 6, fill: ROSE, stroke: '#fff', strokeWidth: 2 }}
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
          transition={{ duration: 0.35, delay: 0.28 }}
        >
          <Card className="h-full rounded-2xl bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-card-foreground">
                LTV vs CAC
              </CardTitle>
              <p className="text-sm text-muted-foreground">Lifetime value versus acquisition cost</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[280px] w-full sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerMetricsTrend} margin={{ top: 16, right: 12, left: 4, bottom: 4 }}>
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
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                    />
                    <Tooltip content={<CurrencyTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 8, fontSize: 12 }} />
                    <Bar dataKey="ltv" name="LTV" fill={PURPLE} radius={[4, 4, 0, 0]} maxBarSize={18} />
                    <Bar dataKey="cac" name="CAC" fill={AMBER} radius={[4, 4, 0, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.34 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Avg Revenue per Clinic
            </CardTitle>
            <p className="text-sm text-muted-foreground">Monthly ARPC trend</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[260px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerMetricsTrend} margin={{ top: 16, right: 12, left: 4, bottom: 4 }}>
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
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="arpc"
                    name="ARPC"
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
    </div>
  )
}
