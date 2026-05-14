import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FileSearch, ShieldCheck, ToggleRight, AlertOctagon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/utils/cn'
import { toast } from 'sonner'
import { StatusPill } from './StatusPill'
import { formatDateTime, TH, TD } from './shared'
import {
  noteAudits,
  complianceLogs,
  overrideRules,
  type AIOverrideRule,
  type AINoteAuditRow,
  type ComplianceLogRow,
} from './aiData'

const NOTE_STATUS_TONE = {
  'Pending Review': 'warning',
  Accepted: 'success',
  Edited: 'info',
  Rejected: 'danger',
} as const

const LOG_SEVERITY_TONE = {
  Info: 'info',
  Warning: 'warning',
  Critical: 'danger',
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

export function SafetySection() {
  const [rules, setRules] = useState<AIOverrideRule[]>(overrideRules)

  const summary = useMemo(() => {
    const pendingReview = noteAudits.filter((n) => n.status === 'Pending Review').length
    const rejected = noteAudits.filter((n) => n.status === 'Rejected').length
    const total = noteAudits.length
    const reviewed = total - pendingReview
    const reviewedShare = total === 0 ? 0 : (reviewed / total) * 100
    const overridesOn = rules.filter((r) => r.state === 'on').length
    return { pendingReview, rejected, reviewedShare, overridesOn }
  }, [rules])

  const handleToggle = (id: string, next: boolean) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              state: next ? 'on' : 'off',
              updatedAt: new Date().toISOString(),
              updatedBy: 'You',
            }
          : rule
      )
    )
    toast.success(`Override ${next ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Pending Note Reviews"
          value={summary.pendingReview.toString()}
          helper="Awaiting clinician sign-off"
          icon={FileSearch}
          tint="bg-amber-50 text-amber-700"
          index={0}
        />
        <MetricCard
          label="Notes Rejected"
          value={summary.rejected.toString()}
          helper="Last 30 days"
          icon={AlertOctagon}
          tint="bg-rose-50 text-rose-700"
          index={1}
        />
        <MetricCard
          label="Reviewed Share"
          value={`${summary.reviewedShare.toFixed(0)}%`}
          helper="Of all AI-generated notes"
          icon={ShieldCheck}
          tint="bg-emerald-50 text-emerald-700"
          index={2}
        />
        <MetricCard
          label="Active Overrides"
          value={`${summary.overridesOn} / ${rules.length}`}
          helper="Manual safety controls engaged"
          icon={ToggleRight}
          tint="bg-violet-50 text-violet-700"
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
              AI-Generated Note Audit
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Track which AI outputs were accepted, edited, or rejected
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Clinic / Clinician</th>
                    <th className={TH}>Patient</th>
                    <th className={TH}>Feature</th>
                    <th className={TH}>Accepted / Edited</th>
                    <th className={TH}>Reviewed</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {noteAudits.map((row: AINoteAuditRow) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>
                        {row.id}
                      </td>
                      <td className={TD}>
                        <div className="leading-tight">
                          <p>{row.clinic}</p>
                          <p className="text-xs text-muted-foreground">{row.clinician}</p>
                        </div>
                      </td>
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>
                        {row.patientRef}
                      </td>
                      <td className={cn(TD, 'text-muted-foreground')}>{row.feature}</td>
                      <td className={TD}>
                        {row.status === 'Pending Review' ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span>
                            <span className="font-semibold text-emerald-600">
                              {row.acceptedTokens}
                            </span>
                            <span className="text-muted-foreground"> / </span>
                            <span className="font-semibold text-amber-600">
                              {row.editedTokens}
                            </span>
                            <span className="text-xs text-muted-foreground"> tokens</span>
                          </span>
                        )}
                      </td>
                      <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                        {row.reviewedAt ? formatDateTime(row.reviewedAt) : '—'}
                        {row.reviewedBy && (
                          <p className="text-xs">by {row.reviewedBy}</p>
                        )}
                      </td>
                      <td className={TD}>
                        <StatusPill tone={NOTE_STATUS_TONE[row.status]}>{row.status}</StatusPill>
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
        transition={{ duration: 0.3, delay: 0.28 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Compliance Logging
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Policy publishes, escalations, and override changes
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Event</th>
                    <th className={TH}>Actor</th>
                    <th className={TH}>Context</th>
                    <th className={TH}>Timestamp</th>
                    <th className={TH}>Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {complianceLogs.map((row: ComplianceLogRow) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{row.id}</td>
                      <td className={cn(TD, 'font-medium')}>{row.event}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{row.actor}</td>
                      <td className={cn(TD, 'max-w-[320px] text-muted-foreground')}>
                        {row.context}
                      </td>
                      <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                        {formatDateTime(row.timestamp)}
                      </td>
                      <td className={TD}>
                        <StatusPill tone={LOG_SEVERITY_TONE[row.severity]}>{row.severity}</StatusPill>
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
        transition={{ duration: 0.3, delay: 0.34 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Manual Override Controls
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Toggle safety behaviors and feature kill-switches across the platform
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-card-foreground">{rule.scope}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{rule.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Last updated {formatDateTime(rule.updatedAt)} by {rule.updatedBy}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill tone={rule.state === 'on' ? 'success' : 'neutral'}>
                    {rule.state === 'on' ? 'Enforced' : 'Disabled'}
                  </StatusPill>
                  <Switch
                    checked={rule.state === 'on'}
                    onCheckedChange={(checked) => handleToggle(rule.id, checked)}
                    aria-label={`Toggle ${rule.scope}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
