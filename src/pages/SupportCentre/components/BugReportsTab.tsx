import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bug, ShieldAlert, Users, Wrench } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import {
  bugReports,
  STATUS_LABELS_BUG,
  type BugSeverity,
  type BugStatus,
} from '../extraData'

const SEVERITY_TONE: Record<BugSeverity, string> = {
  low: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  medium: 'bg-sky-50 text-sky-700 border-sky-200',
  high: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
}

const STATUS_TONE: Record<BugStatus, string> = {
  new: 'bg-rose-50 text-rose-700 border-rose-200',
  triaged: 'bg-amber-50 text-amber-700 border-amber-200',
  in_progress: 'bg-sky-50 text-sky-700 border-sky-200',
  fixed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  wont_fix: 'bg-neutral-100 text-neutral-700 border-neutral-200',
}

const SEVERITY_ORDER: Record<BugSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function BugReportsTab() {
  const [statusFilter, setStatusFilter] = useState<BugStatus | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<BugSeverity | 'all'>('all')

  const summary = useMemo(() => {
    const open = bugReports.filter((b) => b.status !== 'fixed' && b.status !== 'wont_fix')
    const critical = open.filter((b) => b.severity === 'critical')
    const affected = open.reduce((sum, b) => sum + b.affectedUsers, 0)
    const fixed = bugReports.filter((b) => b.status === 'fixed').length
    return {
      open: open.length,
      critical: critical.length,
      affected,
      fixed,
    }
  }, [])

  const filtered = useMemo(() => {
    return bugReports
      .filter((b) => (statusFilter === 'all' ? true : b.status === statusFilter))
      .filter((b) => (severityFilter === 'all' ? true : b.severity === severityFilter))
      .slice()
      .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
  }, [statusFilter, severityFilter])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Open bugs" value={summary.open} icon={Bug} tint="bg-rose-50 text-rose-700" index={0} />
        <SummaryCard label="Critical severity" value={summary.critical} icon={ShieldAlert} tint="bg-rose-50 text-rose-700" index={1} />
        <SummaryCard label="Users affected" value={summary.affected} icon={Users} tint="bg-amber-50 text-amber-700" index={2} />
        <SummaryCard label="Fixed (recent)" value={summary.fixed} icon={Wrench} tint="bg-emerald-50 text-emerald-700" index={3} />
      </div>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-card-foreground">Bug Reports</h3>
              <p className="text-sm text-muted-foreground">
                {filtered.length} of {bugReports.length} — sorted by severity
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select
                value={severityFilter}
                onValueChange={(v) => setSeverityFilter(v as BugSeverity | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as BugStatus | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="triaged">Triaged</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="wont_fix">Won&apos;t Fix</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ul className="space-y-3">
            {filtered.map((bug) => (
              <li
                key={bug.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{bug.ref}</span>
                      <Badge variant="outline" className={cn('font-medium', SEVERITY_TONE[bug.severity])}>
                        {bug.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={cn('font-medium', STATUS_TONE[bug.status])}>
                        {STATUS_LABELS_BUG[bug.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{bug.module}</span>
                    </div>
                    <p className="mt-1 font-semibold text-card-foreground">{bug.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {bug.clinic} · reported by {bug.reportedBy} · {formatDate(bug.reportedAt)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-xs">
                    <p className="font-semibold text-card-foreground">
                      {bug.affectedUsers} affected
                    </p>
                    <p className="text-muted-foreground">users</p>
                  </div>
                </div>
                <p className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-card-foreground">Steps: </span>
                  {bug.steps}
                </p>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="py-12 text-center text-sm text-muted-foreground">
                No bugs match the current filters.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tint,
  index,
}: {
  label: string
  value: number
  icon: React.ElementType
  tint: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', tint)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{value}</p>
    </motion.div>
  )
}
