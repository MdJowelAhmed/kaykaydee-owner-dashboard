import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  CircleDollarSign,
  Cpu,
  FileCode2,
  ShieldAlert,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { StatusPill } from './StatusPill'
import {
  formatCompact,
  formatDateTime,
  formatNumber,
  formatUsd,
  TH,
  TD,
} from './shared'
import {
  usageTrend,
  tierLimits,
  prompts,
  moderationFlags,
  type AIPromptRow,
  type AIModerationFlag,
} from './aiData'

const TEAL = '#14b8a6'
const PURPLE = '#7946CD'

const PROMPT_STATUS_TONE = {
  Active: 'success',
  Draft: 'warning',
  Deprecated: 'neutral',
} as const

const MODERATION_STATUS_TONE = {
  'Pending Review': 'warning',
  Resolved: 'success',
  Escalated: 'danger',
} as const

const SEVERITY_TONE = {
  Low: 'neutral',
  Medium: 'info',
  High: 'danger',
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

const UsageTooltip = ({
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
          <span>{p.name === 'Cost' ? formatUsd(p.value) : formatCompact(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export function GovernanceSection() {
  const last = usageTrend[usageTrend.length - 1]
  const prev = usageTrend[usageTrend.length - 2]

  const summary = useMemo(() => {
    if (!last || !prev) return null
    const reqGrowth = ((last.requests - prev.requests) / prev.requests) * 100
    const costGrowth = ((last.cost - prev.cost) / prev.cost) * 100
    const pendingModeration = moderationFlags.filter((m) => m.status === 'Pending Review').length
    const activePrompts = prompts.filter((p) => p.status === 'Active').length
    return {
      requests: last.requests,
      tokens: last.tokens,
      cost: last.cost,
      reqGrowth,
      costGrowth,
      pendingModeration,
      activePrompts,
    }
  }, [last, prev])

  if (!summary) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Monthly Requests"
          value={formatCompact(summary.requests)}
          helper={`+${summary.reqGrowth.toFixed(1)}% vs last month`}
          icon={Activity}
          tint="bg-sky-50 text-sky-700"
          index={0}
        />
        <MetricCard
          label="Tokens Used"
          value={formatCompact(summary.tokens)}
          helper={`${formatNumber(Math.round(summary.tokens / summary.requests))} tokens / request`}
          icon={Cpu}
          tint="bg-violet-50 text-violet-700"
          index={1}
        />
        <MetricCard
          label="Monthly AI Cost"
          value={formatUsd(summary.cost)}
          helper={`+${summary.costGrowth.toFixed(1)}% vs last month`}
          icon={CircleDollarSign}
          tint="bg-emerald-50 text-emerald-700"
          index={2}
        />
        <MetricCard
          label="Open Moderation"
          value={summary.pendingModeration.toString()}
          helper={`${summary.activePrompts} active prompts`}
          icon={ShieldAlert}
          tint="bg-rose-50 text-rose-700"
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
              Usage &amp; Cost Trend
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly AI requests and dollar cost
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[320px] w-full sm:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageTrend} margin={{ top: 16, right: 12, left: 4, bottom: 4 }}>
                  <defs>
                    <linearGradient id="ai-req" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ai-cost" x1="0" y1="0" x2="0" y2="1">
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
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(v) => formatCompact(v)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                  />
                  <Tooltip content={<UsageTooltip />} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="requests"
                    name="Requests"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    fill="url(#ai-req)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="cost"
                    name="Cost"
                    stroke={PURPLE}
                    strokeWidth={2}
                    fill="url(#ai-cost)"
                  />
                </AreaChart>
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
              AI Limits per Tier
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly request quotas and feature entitlements
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {tierLimits.map((tier) => {
              const pct = Math.min(100, (tier.usedRequests / tier.monthlyRequests) * 100)
              const breached = pct >= 90
              return (
                <div
                  key={tier.tier}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-card-foreground">{tier.tier}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(tier.monthlyRequests)} req/mo · {formatCompact(tier.tokenCeiling)} tokens
                      </p>
                    </div>
                    <p className="text-sm font-medium text-card-foreground">
                      {formatNumber(tier.usedRequests)} / {formatNumber(tier.monthlyRequests)} used
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        breached ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tier.features.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
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
              Prompt Management
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Active, draft, and deprecated prompts across features
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Name</th>
                    <th className={TH}>Feature</th>
                    <th className={TH}>Version</th>
                    <th className={TH}>Owner</th>
                    <th className={TH}>Last Edited</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {prompts.map((p: AIPromptRow) => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{p.id}</td>
                      <td className={cn(TD, 'font-mono text-xs font-medium')}>{p.name}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{p.feature}</td>
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{p.version}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{p.owner}</td>
                      <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                        {formatDateTime(p.lastEdited)}
                      </td>
                      <td className={TD}>
                        <StatusPill tone={PROMPT_STATUS_TONE[p.status]}>{p.status}</StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              AI Moderation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              PHI leaks, hallucinations, toxic outputs, and bias flags
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Category</th>
                    <th className={TH}>Feature</th>
                    <th className={TH}>Clinic / User</th>
                    <th className={TH}>Severity</th>
                    <th className={TH}>Flagged</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {moderationFlags.map((m: AIModerationFlag) => (
                    <tr key={m.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{m.id}</td>
                      <td className={cn(TD, 'font-medium')}>{m.category}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{m.feature}</td>
                      <td className={TD}>
                        <div className="leading-tight">
                          <p>{m.clinic}</p>
                          <p className="text-xs text-muted-foreground">{m.user}</p>
                        </div>
                      </td>
                      <td className={TD}>
                        <StatusPill tone={SEVERITY_TONE[m.severity]}>{m.severity}</StatusPill>
                      </td>
                      <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                        {formatDateTime(m.flaggedAt)}
                      </td>
                      <td className={TD}>
                        <StatusPill tone={MODERATION_STATUS_TONE[m.status]}>{m.status}</StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.46 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Prompt Studio
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Author and review prompts powering each feature
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {prompts.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-sm font-semibold text-card-foreground">{p.name}</p>
                    <FileCode2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.feature}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    Version {p.version} · maintained by {p.owner}
                  </p>
                  <div className="mt-3">
                    <StatusPill tone={PROMPT_STATUS_TONE[p.status]}>{p.status}</StatusPill>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
