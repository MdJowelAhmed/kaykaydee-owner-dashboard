import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, ChevronRight, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/utils/cn'
import { toast } from 'sonner'
import { StatusPill } from './StatusPill'
import { formatUsd, relativeTime } from './shared'
import { leads as initialLeads, salesUsers, type LeadRow, type LeadStage } from './salesData'

const STAGES: { key: LeadStage; label: string; tint: string }[] = [
  { key: 'Lead', label: 'Leads', tint: 'bg-sky-50 text-sky-700' },
  { key: 'Demo', label: 'Demos', tint: 'bg-violet-50 text-violet-700' },
  { key: 'Trial', label: 'Trials', tint: 'bg-amber-50 text-amber-700' },
  { key: 'Converted', label: 'Converted', tint: 'bg-emerald-50 text-emerald-700' },
  { key: 'Lost', label: 'Lost', tint: 'bg-rose-50 text-rose-700' },
]

const NEXT_STAGE: Partial<Record<LeadStage, LeadStage>> = {
  Lead: 'Demo',
  Demo: 'Trial',
  Trial: 'Converted',
}

const SOURCE_TONE = {
  'Cold Outreach': 'neutral',
  Inbound: 'info',
  Referral: 'success',
  Event: 'violet',
  Partner: 'warning',
} as const

interface LeadFormState {
  clinic: string
  contactName: string
  email: string
  plan: LeadRow['plan']
  owner: string
  estValue: number
  source: LeadRow['source']
}

const EMPTY_LEAD_FORM: LeadFormState = {
  clinic: '',
  contactName: '',
  email: '',
  plan: 'Basic',
  owner: salesUsers[0]?.name ?? '',
  estValue: 588,
  source: 'Inbound',
}

export function LeadPipelineSection() {
  const [leads, setLeads] = useState<LeadRow[]>(initialLeads)
  const [search, setSearch] = useState('')
  const [ownerFilter, setOwnerFilter] = useState<string>('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<LeadFormState>(EMPTY_LEAD_FORM)

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase()
    const map: Record<LeadStage, LeadRow[]> = {
      Lead: [],
      Demo: [],
      Trial: [],
      Converted: [],
      Lost: [],
    }
    for (const lead of leads) {
      if (ownerFilter !== 'all' && lead.owner !== ownerFilter) continue
      if (q) {
        const hit =
          lead.clinic.toLowerCase().includes(q) ||
          lead.contactName.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q)
        if (!hit) continue
      }
      map[lead.stage].push(lead)
    }
    return map
  }, [leads, search, ownerFilter])

  const summary = useMemo(() => {
    const open = leads.filter((l) => l.stage !== 'Converted' && l.stage !== 'Lost')
    const openValue = open.reduce((s, l) => s + l.estValue, 0)
    const wonValue = leads
      .filter((l) => l.stage === 'Converted')
      .reduce((s, l) => s + l.estValue, 0)
    const winRate = (() => {
      const closed = leads.filter((l) => l.stage === 'Converted' || l.stage === 'Lost')
      if (closed.length === 0) return 0
      return leads.filter((l) => l.stage === 'Converted').length / closed.length
    })()
    return { openCount: open.length, openValue, wonValue, winRate }
  }, [leads])

  const advance = (id: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        const next = NEXT_STAGE[l.stage]
        if (!next) return l
        toast.success(`Moved ${l.clinic} → ${next}`)
        return { ...l, stage: next, updatedAt: new Date().toISOString() }
      })
    )
  }

  const markLost = (id: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        toast.success(`Marked ${l.clinic} as Lost`)
        return { ...l, stage: 'Lost', updatedAt: new Date().toISOString() }
      })
    )
  }

  const handleCreate = () => {
    const clinic = form.clinic.trim()
    const contactName = form.contactName.trim()
    const email = form.email.trim()
    if (!clinic || !contactName || !email.includes('@')) {
      toast.error('Please fill clinic, contact name, and a valid email')
      return
    }
    const newLead: LeadRow = {
      id: `L-${Math.floor(Math.random() * 9000 + 1000)}`,
      clinic,
      contactName,
      email,
      plan: form.plan,
      owner: form.owner,
      estValue: form.estValue,
      stage: 'Lead',
      source: form.source,
      updatedAt: new Date().toISOString(),
      notes: 'New lead — needs first outreach.',
    }
    setLeads((prev) => [newLead, ...prev])
    setOpen(false)
    setForm(EMPTY_LEAD_FORM)
    toast.success(`Lead added: ${clinic}`)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Open opportunities" value={summary.openCount.toString()} helper="Active stages" tint="bg-sky-50 text-sky-700" index={0} />
        <SummaryCard label="Pipeline value" value={formatUsd(summary.openValue)} helper="Sum of est. annual values" tint="bg-violet-50 text-violet-700" index={1} />
        <SummaryCard label="Closed won (90d)" value={formatUsd(summary.wonValue)} helper="Converted revenue" tint="bg-emerald-50 text-emerald-700" index={2} />
        <SummaryCard label="Win rate" value={`${(summary.winRate * 100).toFixed(0)}%`} helper="Converted vs closed" tint="bg-amber-50 text-amber-700" index={3} />
      </div>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-card-foreground">Pipeline</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track leads from first contact → demo → trial → conversion
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="w-full pl-9 sm:w-[240px]"
                  placeholder="Search clinic, contact…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All owners</SelectItem>
                  {salesUsers.map((u) => (
                    <SelectItem key={u.id} value={u.name}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={() => setOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add lead
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-5">
            {STAGES.map(({ key, label, tint }) => {
              const items = grouped[key]
              const value = items.reduce((s, l) => s + l.estValue, 0)
              return (
                <div key={key} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-neutral-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className={cn('inline-block h-2 w-2 rounded-full', tint)} />
                      <p className="text-sm font-semibold text-card-foreground">{label}</p>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {items.length}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">{formatUsd(value)}</p>
                  </div>
                  <div className="space-y-2">
                    {items.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onAdvance={() => advance(lead.id)}
                        onLost={() => markLost(lead.id)}
                      />
                    ))}
                    {items.length === 0 && (
                      <p className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                        No leads in this stage
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Clinic
                </Label>
                <Input
                  className="mt-1"
                  value={form.clinic}
                  onChange={(e) => setForm((p) => ({ ...p, clinic: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contact name
                </Label>
                <Input
                  className="mt-1"
                  value={form.contactName}
                  onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </Label>
              <Input
                className="mt-1"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Plan
                </Label>
                <Select
                  value={form.plan}
                  onValueChange={(v) => setForm((p) => ({ ...p, plan: v as LeadRow['plan'] }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Est. value ($)
                </Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.estValue}
                  onChange={(e) => setForm((p) => ({ ...p, estValue: Number(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Source
                </Label>
                <Select
                  value={form.source}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, source: v as LeadRow['source'] }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
                    <SelectItem value="Inbound">Inbound</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Owner
              </Label>
              <Select
                value={form.owner}
                onValueChange={(v) => setForm((p) => ({ ...p, owner: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {salesUsers.map((u) => (
                    <SelectItem key={u.id} value={u.name}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreate}>
              Add lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LeadCard({
  lead,
  onAdvance,
  onLost,
}: {
  lead: LeadRow
  onAdvance: () => void
  onLost: () => void
}) {
  const closed = lead.stage === 'Converted' || lead.stage === 'Lost'
  const nextStage = NEXT_STAGE[lead.stage]

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate font-semibold text-card-foreground">{lead.clinic}</p>
        <p className="shrink-0 text-xs font-semibold text-card-foreground">
          {formatUsd(lead.estValue)}
        </p>
      </div>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">
        {lead.contactName} · {lead.plan}
      </p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{lead.notes}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusPill tone={SOURCE_TONE[lead.source]}>{lead.source}</StatusPill>
        <span className="text-[10px] text-muted-foreground">
          {lead.owner} · {relativeTime(lead.updatedAt)}
        </span>
      </div>
      {!closed && (
        <div className="mt-2 flex gap-1.5 border-t border-border pt-2">
          {nextStage && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 flex-1 gap-1 px-2 text-xs"
              onClick={onAdvance}
            >
              <ChevronRight className="h-3 w-3" />
              {nextStage}
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 gap-1 border-rose-200 px-2 text-xs text-rose-600 hover:bg-rose-50"
            onClick={onLost}
          >
            <X className="h-3 w-3" />
            Lost
          </Button>
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  helper,
  tint,
  index,
}: {
  label: string
  value: string
  helper?: string
  tint: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn('inline-block h-3 w-3 rounded-full', tint)} />
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{value}</p>
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </motion.div>
  )
}
