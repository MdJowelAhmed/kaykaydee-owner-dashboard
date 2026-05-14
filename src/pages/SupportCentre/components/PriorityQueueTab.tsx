import { useMemo } from 'react'
import { Flame, Clock, Timer, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { mockSupportTickets } from '../mockData'
import { CATEGORY_LABELS, type SupportTicket, type TicketPriority } from '../types'
import { PriorityBadge } from './PriorityBadge'

const PRIORITY_ORDER: Record<TicketPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const SLA_HOURS: Record<TicketPriority, number> = {
  urgent: 4,
  high: 12,
  medium: 24,
  low: 72,
}

function hoursSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60)
}

function ageLabel(hours: number): string {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`
  if (hours < 24) return `${Math.round(hours)}h`
  return `${Math.round(hours / 24)}d`
}

type SummaryKey = TicketPriority

const SUMMARY_DEFS: { key: SummaryKey; label: string; icon: React.ElementType; tint: string }[] = [
  { key: 'urgent', label: 'Urgent', icon: ShieldAlert, tint: 'bg-rose-50 text-rose-700' },
  { key: 'high', label: 'High', icon: Flame, tint: 'bg-amber-50 text-amber-700' },
  { key: 'medium', label: 'Medium', icon: Timer, tint: 'bg-sky-50 text-sky-700' },
  { key: 'low', label: 'Low', icon: Clock, tint: 'bg-neutral-100 text-neutral-700' },
]

export function PriorityQueueTab() {
  const openTickets = useMemo(
    () => mockSupportTickets.filter((t) => t.status === 'open' || t.status === 'in_progress'),
    []
  )

  const summary = useMemo(() => {
    const counts: Record<SummaryKey, number> = { urgent: 0, high: 0, medium: 0, low: 0 }
    for (const t of openTickets) counts[t.priority] += 1
    return counts
  }, [openTickets])

  const sorted = useMemo(
    () =>
      openTickets.slice().sort((a, b) => {
        const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        if (p !== 0) return p
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }),
    [openTickets]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_DEFS.map((def, idx) => {
          const Icon = def.icon
          return (
            <motion.div
              key={def.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {def.label} priority
                    </p>
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        def.tint
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">
                    {summary[def.key]}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    SLA: {SLA_HOURS[def.key]}h response
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-1 pb-4">
          <h3 className="text-lg font-bold text-card-foreground">Open Queue</h3>
          <p className="text-sm text-muted-foreground">
            Open + in-progress tickets ordered by priority then age
          </p>
        </div>
        <ul className="space-y-3">
          {sorted.map((ticket) => (
            <QueueRow key={ticket.id} ticket={ticket} />
          ))}
          {sorted.length === 0 && (
            <li className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
              No open or in-progress tickets in the queue.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

function QueueRow({ ticket }: { ticket: SupportTicket }) {
  const ageHours = hoursSince(ticket.createdAt)
  const sla = SLA_HOURS[ticket.priority]
  const breached = ageHours > sla
  const warning = !breached && ageHours > sla * 0.8

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{ticket.ref}</span>
          <PriorityBadge priority={ticket.priority} />
          <span className="text-xs text-muted-foreground">
            {CATEGORY_LABELS[ticket.category]}
          </span>
        </div>
        <p className="mt-1 truncate font-semibold text-card-foreground">{ticket.subject}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {ticket.requesterName} · {ticket.requesterEmail}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1 text-xs sm:items-end">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium',
            breached
              ? 'bg-rose-50 text-rose-700'
              : warning
                ? 'bg-amber-50 text-amber-700'
                : 'bg-emerald-50 text-emerald-700'
          )}
        >
          <Timer className="h-3 w-3" />
          {breached ? 'SLA breached' : warning ? 'SLA risk' : 'On track'}
        </span>
        <span className="text-muted-foreground">
          Age {ageLabel(ageHours)} · SLA {sla}h
        </span>
      </div>
    </li>
  )
}
