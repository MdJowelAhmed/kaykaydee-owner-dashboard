import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  FileText,
  KeyRound,
  LogIn,
  Layers,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'
import { TH, TD, formatDateTime } from './shared'
import { StatusPill } from './StatusPill'
import type { AuditCategory, AuditSeverity } from './complianceData'
import { auditLogs } from './complianceData'

const CATEGORY_ICON: Record<AuditCategory, React.ElementType> = {
  Billing: CreditCard,
  'Clinical Notes': FileText,
  Permissions: KeyRound,
  'Login Activity': LogIn,
  Subscription: Layers,
}

const ALL_CATEGORIES: AuditCategory[] = [
  'Billing',
  'Clinical Notes',
  'Permissions',
  'Login Activity',
  'Subscription',
]

const SEVERITY_TONE = {
  Info: 'info',
  Warning: 'warning',
  Critical: 'danger',
} as const

function CategoryCard({
  category,
  count,
  active,
  onClick,
}: {
  category: AuditCategory
  count: number
  active: boolean
  onClick: () => void
}) {
  const Icon = CATEGORY_ICON[category]
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-sm transition-all',
        active
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-transparent hover:border-neutral-300'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          active ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-700'
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-card-foreground">{category}</p>
        <p className="text-xs text-muted-foreground">{count} events</p>
      </div>
    </button>
  )
}

export function AuditLogsSection() {
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | 'all'>('all')
  const [search, setSearch] = useState('')

  const counts = useMemo(() => {
    const map = new Map<AuditCategory, number>()
    for (const log of auditLogs) {
      map.set(log.category, (map.get(log.category) ?? 0) + 1)
    }
    return map
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return auditLogs.filter((log) => {
      if (categoryFilter !== 'all' && log.category !== categoryFilter) return false
      if (severityFilter !== 'all' && log.severity !== severityFilter) return false
      if (!q) return true
      return (
        log.action.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.clinic.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q)
      )
    })
  }, [categoryFilter, severityFilter, search])

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ALL_CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat}
            category={cat}
            count={counts.get(cat) ?? 0}
            active={categoryFilter === cat}
            onClick={() =>
              setCategoryFilter((prev) => (prev === cat ? 'all' : cat))
            }
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="gap-3 pb-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-card-foreground">
                  Audit Trail
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {filtered.length} of {auditLogs.length} events
                  {categoryFilter !== 'all' && ` · ${categoryFilter}`}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search action, actor, clinic…"
                    className="w-full pl-9 sm:w-[280px]"
                  />
                </div>
                <Select
                  value={severityFilter}
                  onValueChange={(v) => setSeverityFilter(v as AuditSeverity | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severities</SelectItem>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Category</th>
                    <th className={TH}>Action</th>
                    <th className={TH}>Actor</th>
                    <th className={TH}>Target / Clinic</th>
                    <th className={TH}>IP</th>
                    <th className={TH}>Timestamp</th>
                    <th className={TH}>Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((log) => {
                    const Icon = CATEGORY_ICON[log.category]
                    return (
                      <tr key={log.id} className="hover:bg-neutral-50">
                        <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>
                          {log.id}
                        </td>
                        <td className={TD}>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Icon className="h-3.5 w-3.5" />
                            {log.category}
                          </span>
                        </td>
                        <td className={cn(TD, 'max-w-[320px]')}>{log.action}</td>
                        <td className={TD}>
                          <div className="leading-tight">
                            <p className="font-medium">{log.actor}</p>
                            <p className="text-xs text-muted-foreground">{log.actorRole}</p>
                          </div>
                        </td>
                        <td className={TD}>
                          <div className="leading-tight">
                            <p>{log.target}</p>
                            <p className="text-xs text-muted-foreground">{log.clinic}</p>
                          </div>
                        </td>
                        <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>
                          {log.ip}
                        </td>
                        <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                          {formatDateTime(log.timestamp)}
                        </td>
                        <td className={TD}>
                          <StatusPill tone={SEVERITY_TONE[log.severity]}>{log.severity}</StatusPill>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No audit events match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
