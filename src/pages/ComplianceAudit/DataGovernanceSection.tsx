import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, DatabaseBackup, Archive } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { TH, TD, formatDateTime, formatDate } from './shared'
import { StatusPill } from './StatusPill'
import { dataExports, backups, retentionPolicies } from './complianceData'

const EXPORT_STATUS_TONE = {
  Queued: 'neutral',
  Processing: 'info',
  Completed: 'success',
  Failed: 'danger',
} as const

const BACKUP_STATUS_TONE = {
  Success: 'success',
  Running: 'info',
  Failed: 'danger',
} as const

const RETENTION_STATUS_TONE = {
  Active: 'success',
  'Under Review': 'warning',
  Expired: 'danger',
} as const

function formatYears(days: number): string {
  if (days >= 365) {
    const years = days / 365
    const rounded = Number.isInteger(years) ? years : years.toFixed(1)
    return `${rounded} yr${years === 1 ? '' : 's'}`
  }
  return `${days} days`
}

export function DataGovernanceSection() {
  const summary = useMemo(() => {
    const completed = dataExports.filter((d) => d.status === 'Completed').length
    const inFlight = dataExports.filter(
      (d) => d.status === 'Queued' || d.status === 'Processing'
    ).length
    const failed = dataExports.filter((d) => d.status === 'Failed').length
    const lastBackup = backups
      .filter((b) => b.status === 'Success')
      .slice()
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0]
    const successRate =
      backups.length === 0
        ? 0
        : Math.round(
            (backups.filter((b) => b.status === 'Success').length / backups.length) * 100
          )
    return { completed, inFlight, failed, lastBackup, successRate }
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl bg-card p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">Exports In Flight</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700">
              <Download className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">
            {summary.inFlight}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.completed} completed · {summary.failed} failed
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl bg-card p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">Last Successful Backup</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <DatabaseBackup className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xl font-bold tracking-tight text-card-foreground">
            {summary.lastBackup ? formatDateTime(summary.lastBackup.startedAt) : '—'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.lastBackup
              ? `${summary.lastBackup.type} · ${summary.lastBackup.sizeGb} GB`
              : 'No successful backups yet'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl bg-card p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">Backup Success Rate</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-700">
              <DatabaseBackup className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">
            {summary.successRate}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Across last {backups.length} runs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-2xl bg-card p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">Retention Policies</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <Archive className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">
            {retentionPolicies.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {retentionPolicies.filter((r) => r.status !== 'Active').length} need review
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Data Export Requests
            </CardTitle>
            <p className="text-sm text-muted-foreground">GDPR / patient / admin export jobs</p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Requester</th>
                    <th className={TH}>Scope</th>
                    <th className={TH}>Format</th>
                    <th className={TH}>Requested</th>
                    <th className={TH}>Completed</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dataExports.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{row.id}</td>
                      <td className={TD}>
                        <div className="leading-tight">
                          <p className="font-medium">{row.requester}</p>
                          <p className="text-xs text-muted-foreground">{row.requesterRole}</p>
                        </div>
                      </td>
                      <td className={cn(TD, 'max-w-[280px] text-muted-foreground')}>{row.scope}</td>
                      <td className={cn(TD, 'font-mono text-xs')}>{row.format}</td>
                      <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                        {formatDateTime(row.requestedAt)}
                      </td>
                      <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                        {row.completedAt ? formatDateTime(row.completedAt) : '—'}
                      </td>
                      <td className={TD}>
                        <StatusPill tone={EXPORT_STATUS_TONE[row.status]}>{row.status}</StatusPill>
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
        transition={{ duration: 0.35, delay: 0.28 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Backup Monitoring
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Scheduled full and incremental backups
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Type</th>
                    <th className={TH}>Started</th>
                    <th className={TH}>Duration</th>
                    <th className={TH}>Size</th>
                    <th className={TH}>Region</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {backups
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
                    )
                    .map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50">
                        <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>
                          {row.id}
                        </td>
                        <td className={TD}>{row.type}</td>
                        <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                          {formatDateTime(row.startedAt)}
                        </td>
                        <td className={TD}>
                          {row.durationMinutes > 0 ? `${row.durationMinutes} min` : '—'}
                        </td>
                        <td className={TD}>
                          {row.sizeGb > 0 ? `${row.sizeGb.toFixed(1)} GB` : '—'}
                        </td>
                        <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>
                          {row.region}
                        </td>
                        <td className={TD}>
                          <StatusPill tone={BACKUP_STATUS_TONE[row.status]}>{row.status}</StatusPill>
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
        transition={{ duration: 0.35, delay: 0.34 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Retention Policies
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              How long each resource type is retained
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>Resource</th>
                    <th className={TH}>Retention</th>
                    <th className={TH}>Owner</th>
                    <th className={TH}>Last Reviewed</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {retentionPolicies.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-medium')}>{row.resource}</td>
                      <td className={TD}>{formatYears(row.retentionDays)}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{row.owner}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>
                        {formatDate(row.lastReviewed)}
                      </td>
                      <td className={TD}>
                        <StatusPill tone={RETENTION_STATUS_TONE[row.status]}>
                          {row.status}
                        </StatusPill>
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
