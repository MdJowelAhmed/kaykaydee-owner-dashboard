import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingUp, AlertTriangle, MessageSquare, Search, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import {
  clinicSupportSummaries,
  escalations,
  type ClinicSupportSummary,
  type EscalationLevel,
  type EscalationRecord,
} from '../extraData'
import { mockSupportTickets } from '../mockData'
import { CATEGORY_LABELS, STATUS_LABELS, type SupportTicket } from '../types'
import { PriorityBadge } from './PriorityBadge'

const PLAN_TONE: Record<ClinicSupportSummary['plan'], string> = {
  Basic: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  Professional: 'bg-sky-50 text-sky-700 border-sky-200',
  Enterprise: 'bg-violet-50 text-violet-700 border-violet-200',
}

const LEVEL_TONE: Record<EscalationLevel, string> = {
  L1: 'bg-sky-50 text-sky-700 border-sky-200',
  L2: 'bg-amber-50 text-amber-700 border-amber-200',
  L3: 'bg-rose-50 text-rose-700 border-rose-200',
}

const TH = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground'
const TD = 'px-4 py-3 text-sm text-card-foreground'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function relativeDays(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value * 2) / 2
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i <= rounded
              ? 'fill-amber-400 text-amber-400'
              : 'text-neutral-300'
          )}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-card-foreground">{value.toFixed(1)}</span>
    </div>
  )
}

export function ClinicHistoryTab() {
  const [search, setSearch] = useState('')
  const [selectedClinic, setSelectedClinic] = useState<ClinicSupportSummary | null>(null)

  const summary = useMemo(() => {
    const totalTickets = clinicSupportSummaries.reduce((sum, c) => sum + c.totalTickets, 0)
    const totalEscalations = clinicSupportSummaries.reduce((sum, c) => sum + c.escalations, 0)
    const avgSat =
      clinicSupportSummaries.length === 0
        ? 0
        : clinicSupportSummaries.reduce((sum, c) => sum + c.satisfaction, 0) /
          clinicSupportSummaries.length
    const atRisk = clinicSupportSummaries.filter((c) => c.satisfaction < 4.0).length
    return { totalTickets, totalEscalations, avgSat, atRisk }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return clinicSupportSummaries
    return clinicSupportSummaries.filter(
      (c) => c.clinic.toLowerCase().includes(q) || c.plan.toLowerCase().includes(q)
    )
  }, [search])

  const selectedTickets = useMemo<SupportTicket[]>(() => {
    if (!selectedClinic) return []
    return mockSupportTickets.filter((t) => t.requesterName === selectedClinic.clinic)
  }, [selectedClinic])

  const selectedEscalations = useMemo<EscalationRecord[]>(() => {
    if (!selectedClinic) return []
    return escalations.filter((e) => e.clinicId === selectedClinic.id)
  }, [selectedClinic])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total tickets"
          value={summary.totalTickets.toString()}
          icon={MessageSquare}
          tint="bg-sky-50 text-sky-700"
          index={0}
        />
        <SummaryCard
          label="Avg satisfaction"
          value={`${summary.avgSat.toFixed(1)} / 5`}
          icon={Star}
          tint="bg-amber-50 text-amber-700"
          index={1}
        />
        <SummaryCard
          label="Active escalations"
          value={summary.totalEscalations.toString()}
          icon={TrendingUp}
          tint="bg-violet-50 text-violet-700"
          index={2}
        />
        <SummaryCard
          label="At-risk clinics"
          value={summary.atRisk.toString()}
          icon={AlertTriangle}
          tint="bg-rose-50 text-rose-700"
          index={3}
        />
      </div>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-card-foreground">Clinics</h3>
              <p className="text-sm text-muted-foreground">
                Click a clinic to view its support history
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clinic or plan…"
                className="w-full pl-9 sm:w-[260px]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-y border-border bg-neutral-50">
                <tr>
                  <th className={TH}>Clinic</th>
                  <th className={TH}>Plan</th>
                  <th className={TH}>Tickets</th>
                  <th className={TH}>Open</th>
                  <th className={TH}>Escalations</th>
                  <th className={TH}>Satisfaction</th>
                  <th className={TH}>Last Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedClinic(row)}
                    className="cursor-pointer hover:bg-neutral-50"
                  >
                    <td className={cn(TD, 'font-medium')}>{row.clinic}</td>
                    <td className={TD}>
                      <Badge variant="outline" className={cn('font-medium', PLAN_TONE[row.plan])}>
                        {row.plan}
                      </Badge>
                    </td>
                    <td className={TD}>{row.totalTickets}</td>
                    <td className={TD}>
                      {row.openTickets > 0 ? (
                        <span className="font-semibold text-rose-600">{row.openTickets}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className={TD}>{row.escalations}</td>
                    <td className={TD}>
                      <Stars value={row.satisfaction} />
                    </td>
                    <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                      {relativeDays(row.lastContact)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-sm text-muted-foreground"
                    >
                      No clinics match the search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedClinic && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl bg-card shadow-sm">
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">
                    {selectedClinic.clinic}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedClinic.plan} plan · {selectedClinic.totalTickets} total tickets ·{' '}
                    {Math.round(selectedClinic.responseRatio * 100)}% response within SLA
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedClinic(null)}
                  className="text-muted-foreground"
                >
                  <X className="mr-1 h-4 w-4" />
                  Close
                </Button>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-card-foreground">Past tickets</h4>
                {selectedTickets.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="min-w-full">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className={TH}>Ref</th>
                          <th className={TH}>Subject</th>
                          <th className={TH}>Category</th>
                          <th className={TH}>Priority</th>
                          <th className={TH}>Status</th>
                          <th className={TH}>Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedTickets.map((t) => (
                          <tr key={t.id} className="hover:bg-neutral-50">
                            <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>
                              {t.ref}
                            </td>
                            <td className={cn(TD, 'max-w-[280px] truncate')}>{t.subject}</td>
                            <td className={cn(TD, 'text-muted-foreground')}>
                              {CATEGORY_LABELS[t.category]}
                            </td>
                            <td className={TD}>
                              <PriorityBadge priority={t.priority} />
                            </td>
                            <td className={cn(TD, 'text-muted-foreground')}>
                              {STATUS_LABELS[t.status]}
                            </td>
                            <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                              {formatDate(t.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                    No past tickets on file for this clinic.
                  </p>
                )}
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-card-foreground">Escalation history</h4>
                {selectedEscalations.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedEscalations.map((esc) => (
                      <li
                        key={esc.id}
                        className="rounded-xl border border-border bg-card p-3 text-sm shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn('font-medium', LEVEL_TONE[esc.level])}
                              >
                                {esc.level}
                              </Badge>
                              <span className="font-mono text-xs text-muted-foreground">
                                {esc.ticketRef}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Owner: {esc.owner}
                              </span>
                            </div>
                            <p className="mt-1 font-medium text-card-foreground">{esc.subject}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{esc.reason}</p>
                          </div>
                          <div className="shrink-0 text-right text-xs text-muted-foreground">
                            <p>Escalated {formatDate(esc.escalatedAt)}</p>
                            <p>
                              {esc.resolvedAt
                                ? `Resolved ${formatDate(esc.resolvedAt)}`
                                : 'Still open'}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                    No escalations recorded for this clinic.
                  </p>
                )}
              </section>
            </CardContent>
          </Card>
        </motion.div>
      )}
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
  value: string
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
