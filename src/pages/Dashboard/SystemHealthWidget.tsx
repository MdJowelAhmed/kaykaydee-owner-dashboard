import { motion } from 'framer-motion'
import {
  Server,
  Smartphone,
  Database,
  Globe2,
  Sparkles,
  Briefcase,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import {
  systemServices,
  errorLogs,
  type ServiceStatus,
  type SystemService,
  type ErrorLogRow,
} from './dashboardWidgetsData'

const STATUS_TONE: Record<ServiceStatus, string> = {
  operational: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  degraded: 'border-amber-200 bg-amber-50 text-amber-700',
  outage: 'border-rose-200 bg-rose-50 text-rose-700',
  maintenance: 'border-sky-200 bg-sky-50 text-sky-700',
}

const STATUS_DOT: Record<ServiceStatus, string> = {
  operational: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  outage: 'bg-rose-500',
  maintenance: 'bg-sky-500',
}

const STATUS_LABEL: Record<ServiceStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  outage: 'Outage',
  maintenance: 'Maintenance',
}

const SERVICE_ICON: Record<string, React.ElementType> = {
  api: Server,
  web: Globe2,
  mobile: Smartphone,
  db: Database,
  ai: Sparkles,
  jobs: Briefcase,
}

const SEVERITY_TONE: Record<ErrorLogRow['severity'], string> = {
  Info: 'border-sky-200 bg-sky-50 text-sky-700',
  Warning: 'border-amber-200 bg-amber-50 text-amber-700',
  Error: 'border-rose-200 bg-rose-50 text-rose-700',
  Fatal: 'border-rose-300 bg-rose-100 text-rose-800',
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function ServiceCard({ service, index }: { service: SystemService; index: number }) {
  const Icon = SERVICE_ICON[service.id] ?? Server
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-card-foreground">{service.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{service.description}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn('flex items-center gap-1.5 font-medium', STATUS_TONE[service.status])}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[service.status])} />
          {STATUS_LABEL[service.status]}
        </Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-card-foreground">
            {service.uptimeWindowPct.toFixed(2)}%
          </span>{' '}
          uptime · 30d
        </span>
        <span>
          {service.latencyMs !== null ? `${service.latencyMs}ms` : '—'} · {service.region}
        </span>
      </div>
    </motion.div>
  )
}

export function SystemHealthWidget() {
  const overall = systemServices.every((s) => s.status === 'operational')
    ? 'All systems operational'
    : systemServices.some((s) => s.status === 'outage')
      ? 'Active outage'
      : systemServices.some((s) => s.status === 'degraded')
        ? 'Partial degradation'
        : 'Maintenance in progress'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-card-foreground">
                System Health
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Service status, uptime, and recent error logs
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'self-start font-medium',
                overall === 'All systems operational'
                  ? STATUS_TONE.operational
                  : overall === 'Active outage'
                    ? STATUS_TONE.outage
                    : overall === 'Partial degradation'
                      ? STATUS_TONE.degraded
                      : STATUS_TONE.maintenance
              )}
            >
              {overall}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {systemServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <AlertCircle className="h-4 w-4 text-rose-500" />
              Recent errors
            </p>
            <ul className="space-y-2">
              {errorLogs.map((log) => (
                <li
                  key={log.id}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"
                >
                  <Badge
                    variant="outline"
                    className={cn('shrink-0 font-medium', SEVERITY_TONE[log.severity])}
                  >
                    {log.severity}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {log.message}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {log.service} · {relativeTime(log.occurredAt)} · {log.occurrences} occurrence{log.occurrences === 1 ? '' : 's'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
