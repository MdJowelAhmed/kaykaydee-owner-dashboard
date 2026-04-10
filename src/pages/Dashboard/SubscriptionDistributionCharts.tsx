import { useId, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import type { OverviewMonthRow, PlanTierRow } from './dashboardData'
import { overviewYears, overviewSubscriptionPlans } from './dashboardData'

const PURPLE = '#7946CD'
const Y_TICKS_SUB = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500]

interface SubscriptionDistributionChartsProps {
  monthlyData: OverviewMonthRow[]
  selectedYear: string
  onYearChange: (year: string) => void
  planRows?: PlanTierRow[]
}

type StackedPlanRow = PlanTierRow & { main: number; trail: number }

const H_MIN = 5000
const H_MAX = 50000
const H_TICKS = [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000]

function toStackedPlanData(rows: PlanTierRow[]): StackedPlanRow[] {
  return rows.map((p) => ({
    ...p,
    main: H_MAX - p.endValue,
    trail: p.endValue - H_MIN,
  }))
}

type BarLabelViewBox = {
  x?: number
  y?: number
  upperWidth?: number
  width?: number
  height?: number
}

/** Fixed text at bar start (50k side), directly above the bar segment */
function PlanTierBarLabel(props: {
  viewBox?: BarLabelViewBox
  x?: number
  y?: number
  payload?: StackedPlanRow
  index?: number
  rows?: StackedPlanRow[]
}) {
  const vb = props.viewBox
  const row =
    props.payload?.label != null ? props.payload : props.rows?.[props.index ?? -1]
  if (!row?.label) return null

  const upperX = vb?.x ?? props.x ?? 0
  const yTop = vb?.y ?? props.y ?? 0
  const labelX = upperX + 2
  const labelY = yTop - 10

  return (
    <text
      x={labelX}
      y={labelY}
      textAnchor="start"
      dominantBaseline="auto"
      fill="#152238"
      fontSize={12}
      fontWeight={600}
      style={{ whiteSpace: 'nowrap' }}
    >
      {row.label}
    </text>
  )
}

export function SubscriptionDistributionCharts({
  monthlyData,
  selectedYear,
  onYearChange,
  planRows = overviewSubscriptionPlans,
}: SubscriptionDistributionChartsProps) {
  const planGradId = useId().replace(/:/g, '')
  const stackedPlans = useMemo(() => toStackedPlanData(planRows), [planRows])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.28 }}
      >
        <Card className="h-full rounded-2xl border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div>
                <h2 className="text-lg font-bold text-card-foreground">Subscription Distribution</h2>
                <p className="text-sm text-muted-foreground">1 year&apos;s subscription details</p>
              </div>
              <Select value={selectedYear} onValueChange={onYearChange}>
                <SelectTrigger className="h-9 w-[100px] shrink-0 border-border bg-background text-sm font-medium">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {overviewYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 28, right: 8, left: 4, bottom: 4 }}>
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
                    domain={[0, 500]}
                    ticks={Y_TICKS_SUB}
                  />
                  <Bar
                    dataKey="subscriptions"
                    fill={PURPLE}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={28}
                    isAnimationActive={false}
                  >
                    <LabelList
                      position="top"
                      dataKey="subscriptions"
                      fill="#374151"
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
        transition={{ duration: 0.35, delay: 0.34 }}
      >
        <Card className="h-full rounded-2xl border border-border/60 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="text-left">
                <h2 className="text-lg font-bold text-[#152238]">Subscription Distribution</h2>
                <p className="text-sm text-muted-foreground">1 years subscriptionsdetails</p>
              </div>
              <Select value={selectedYear} onValueChange={onYearChange}>
                <SelectTrigger
                  className={cn(
                    'h-9 w-[100px] shrink-0 rounded-full border-0 bg-neutral-100 text-sm font-medium shadow-none',
                    'text-[#152238] focus:ring-2 focus:ring-neutral-200'
                  )}
                >
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {overviewYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stackedPlans}
                  margin={{ top: 52, right: 12, left: 0, bottom: 28 }}
                  barCategoryGap="32%"
                >
                  <defs>
                    <linearGradient id={planGradId} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#26578C" />
                      <stop offset="100%" stopColor="#55DCD0" />
                    </linearGradient>
                  </defs>
                  <XAxis
                    type="number"
                    domain={[H_MIN, H_MAX]}
                    reversed
                    ticks={H_TICKS}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <YAxis type="category" dataKey="label" width={0} hide />
                  {/* Trail first: empty segment from 5k → endValue; main second: gradient from endValue → 50k (left). */}
                  <Bar
                    dataKey="trail"
                    stackId="plan"
                    fill="transparent"
                    barSize={20}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="main"
                    stackId="plan"
                    fill={`url(#${planGradId})`}
                    barSize={20}
                    radius={[16, 16, 16, 16]}
                    isAnimationActive={false}
                  >
                    <LabelList
                      position="top"
                      dataKey="endValue"
                      offset={12}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- recharts Label Props union
                      content={(p: any) => (
                        <PlanTierBarLabel
                          viewBox={p.viewBox}
                          x={p.x}
                          y={p.y}
                          payload={p.payload}
                          index={p.index}
                          rows={stackedPlans}
                        />
                      )}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
