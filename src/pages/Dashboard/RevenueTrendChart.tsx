import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import type { OverviewMonthRow } from './dashboardData'
import { overviewYears } from './dashboardData'

const TEAL = '#14b8a6'
const Y_TICKS = [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000]

interface RevenueTrendChartProps {
  data: OverviewMonthRow[]
  selectedYear: string
  onYearChange: (year: string) => void
}

function formatTooltipExact(value: unknown): string {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-md bg-[#364355] px-3 py-1.5 text-sm font-medium text-white shadow-lg">
        <p>{formatTooltipExact(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

const kFormatter = (v: number) => `${v / 1000}k`

export function RevenueTrendChart({ data, selectedYear, onYearChange }: RevenueTrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
    >
      <Card className="rounded-2xl border border-border/60 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Revenue Trend</h2>
              <p className="text-sm text-muted-foreground">1 year&apos;s revenue growth</p>
            </div>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="h-9 w-[100px] shrink-0 border-border bg-white text-sm font-medium text-card-foreground">
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
          <div className="h-[300px] w-full sm:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 16, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e5e7eb"
                />
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
                  domain={[5000, 50000]}
                  ticks={Y_TICKS}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{
                    fill: TEAL,
                    strokeWidth: 2,
                    stroke: '#fff',
                    r: 4,
                  }}
                  activeDot={{ r: 6, fill: TEAL, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
