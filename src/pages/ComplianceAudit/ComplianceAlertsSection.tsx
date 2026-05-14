import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertOctagon,
  FileWarning,
  ShieldAlert,
  UserCheck,
  CreditCard,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'
import { formatDateTime } from './shared'
import { StatusPill } from './StatusPill'
import type {
  ComplianceAlertRow,
  ComplianceAlertSeverity,
  ComplianceAlertType,
} from './complianceData'
import { complianceAlerts } from './complianceData'

const TYPE_ICON: Record<ComplianceAlertType, React.ElementType> = {
  'Missing Report': FileWarning,
  'Unverified User': UserCheck,
  'Security Incident': ShieldAlert,
  'Expired Payment Method': CreditCard,
}

const TYPE_BG: Record<ComplianceAlertType, string> = {
  'Missing Report': 'bg-amber-50 text-amber-700',
  'Unverified User': 'bg-sky-50 text-sky-700',
  'Security Incident': 'bg-rose-50 text-rose-700',
  'Expired Payment Method': 'bg-violet-50 text-violet-700',
}

const SEVERITY_TONE = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Critical: 'danger',
} as const

const STATUS_TONE = {
  Open: 'danger',
  'In Review': 'warning',
  Resolved: 'success',
} as const

const SEVERITY_RANK: Record<ComplianceAlertSeverity, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

function SummaryCard({
  label,
  count,
  icon: Icon,
  tint,
  index,
}: {
  label: string
  count: number
  icon: React.ElementType
  tint: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-2xl bg-card p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', tint)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">{count}</p>
    </motion.div>
  )
}

function AlertRow({ alert }: { alert: ComplianceAlertRow }) {
  const Icon = TYPE_ICON[alert.type]
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          TYPE_BG[alert.type]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-card-foreground">{alert.title}</p>
            <p className="text-xs text-muted-foreground">
              {alert.type} · {alert.clinic} · {formatDateTime(alert.detectedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill tone={SEVERITY_TONE[alert.severity]}>{alert.severity}</StatusPill>
            <StatusPill tone={STATUS_TONE[alert.status]}>{alert.status}</StatusPill>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{alert.description}</p>
      </div>
    </li>
  )
}

export function ComplianceAlertsSection() {
  const [typeFilter, setTypeFilter] = useState<ComplianceAlertType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ComplianceAlertRow['status'] | 'all'>('all')

  const summaries = useMemo(() => {
    const open = complianceAlerts.filter((a) => a.status === 'Open')
    const critical = open.filter((a) => a.severity === 'Critical')
    const security = complianceAlerts.filter(
      (a) => a.type === 'Security Incident' && a.status !== 'Resolved'
    )
    const payment = complianceAlerts.filter(
      (a) => a.type === 'Expired Payment Method' && a.status !== 'Resolved'
    )
    return {
      open: open.length,
      critical: critical.length,
      security: security.length,
      payment: payment.length,
    }
  }, [])

  const filtered = useMemo(() => {
    return complianceAlerts
      .filter((a) => (typeFilter === 'all' ? true : a.type === typeFilter))
      .filter((a) => (statusFilter === 'all' ? true : a.status === statusFilter))
      .slice()
      .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
  }, [typeFilter, statusFilter])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Open Alerts"
          count={summaries.open}
          icon={AlertOctagon}
          tint="bg-rose-50 text-rose-700"
          index={0}
        />
        <SummaryCard
          label="Critical Severity"
          count={summaries.critical}
          icon={ShieldAlert}
          tint="bg-rose-50 text-rose-700"
          index={1}
        />
        <SummaryCard
          label="Security Incidents"
          count={summaries.security}
          icon={ShieldAlert}
          tint="bg-amber-50 text-amber-700"
          index={2}
        />
        <SummaryCard
          label="Payment Issues"
          count={summaries.payment}
          icon={CreditCard}
          tint="bg-violet-50 text-violet-700"
          index={3}
        />
      </div>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-card-foreground">Active Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Sorted by severity ({filtered.length} of {complianceAlerts.length})
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as ComplianceAlertType | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="Missing Report">Missing Reports</SelectItem>
                  <SelectItem value="Unverified User">Unverified Users</SelectItem>
                  <SelectItem value="Security Incident">Security Incidents</SelectItem>
                  <SelectItem value="Expired Payment Method">Expired Payments</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as ComplianceAlertRow['status'] | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length > 0 ? (
            <ul className="space-y-3">
              {filtered.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No alerts match the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
