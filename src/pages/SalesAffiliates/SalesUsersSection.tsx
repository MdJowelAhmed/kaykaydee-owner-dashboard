import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Users,
  Activity,
  Award,
  Save,
  X,
} from 'lucide-react'
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
import { TH, TD, relativeTime } from './shared'
import {
  salesUsers as initialUsers,
  type SalesUser,
  type CommissionTier,
} from './salesData'

const TIER_TONE = {
  Bronze: 'amber',
  Silver: 'neutral',
  Gold: 'warning',
  Platinum: 'violet',
} as const

const STATUS_TONE = {
  Active: 'success',
  Onboarding: 'info',
  Paused: 'neutral',
} as const

const TIER_DEFAULT_PCT: Record<CommissionTier, number> = {
  Bronze: 7,
  Silver: 10,
  Gold: 14,
  Platinum: 18,
}

interface SalesFormState {
  name: string
  email: string
  territory: string
  tier: CommissionTier
  commissionPct: number
}

const EMPTY_FORM: SalesFormState = {
  name: '',
  email: '',
  territory: '',
  tier: 'Silver',
  commissionPct: 10,
}

export function SalesUsersSection() {
  const [users, setUsers] = useState<SalesUser[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SalesUser['status'] | 'all'>('all')
  const [tierFilter, setTierFilter] = useState<CommissionTier | 'all'>('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<SalesFormState>(EMPTY_FORM)

  const summary = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === 'Active').length,
      avgCommission:
        users.length === 0
          ? 0
          : users.reduce((sum, u) => sum + u.commissionPct, 0) / users.length,
      pipeline: users.reduce((sum, u) => sum + u.pipelineCount, 0),
    }
  }, [users])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      if (tierFilter !== 'all' && u.tier !== tierFilter) return false
      if (!q) return true
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.territory.toLowerCase().includes(q)
      )
    })
  }, [users, search, statusFilter, tierFilter])

  const handleCreate = () => {
    const name = form.name.trim()
    const email = form.email.trim()
    const territory = form.territory.trim()
    if (!name || !email.includes('@') || !territory) {
      toast.error('Please fill name, valid email, and territory')
      return
    }
    const newUser: SalesUser = {
      id: `SU-${Math.floor(Math.random() * 9000 + 1000)}`,
      name,
      email,
      avatarUrl: `https://i.pravatar.cc/96?u=${encodeURIComponent(email)}`,
      territory,
      tier: form.tier,
      commissionPct: form.commissionPct,
      status: 'Onboarding',
      joinedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      clinicsOnboarded: 0,
      pipelineCount: 0,
    }
    setUsers((prev) => [newUser, ...prev])
    setOpen(false)
    setForm(EMPTY_FORM)
    toast.success(`Sales account created for ${newUser.name}`)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total sales users" value={summary.total.toString()} icon={Users} tint="bg-sky-50 text-sky-700" index={0} />
        <SummaryCard label="Active" value={summary.active.toString()} helper={`${summary.total - summary.active} inactive`} icon={Activity} tint="bg-emerald-50 text-emerald-700" index={1} />
        <SummaryCard label="Avg commission" value={`${summary.avgCommission.toFixed(1)}%`} icon={Award} tint="bg-violet-50 text-violet-700" index={2} />
        <SummaryCard label="Active pipeline" value={summary.pipeline.toString()} helper="leads in flight" icon={Activity} tint="bg-amber-50 text-amber-700" index={3} />
      </div>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-card-foreground">
                Sales accounts
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {filtered.length} of {users.length} · territory + tier + activity
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="w-full pl-9 sm:w-[240px]"
                  placeholder="Search name, email, territory…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as SalesUser['status'] | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={tierFilter}
                onValueChange={(v) => setTierFilter(v as CommissionTier | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tiers</SelectItem>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={() => setOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create account
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-y border-border bg-neutral-50">
                <tr>
                  <th className={TH}>Sales user</th>
                  <th className={TH}>Territory</th>
                  <th className={TH}>Tier</th>
                  <th className={TH}>Commission</th>
                  <th className={TH}>Clinics</th>
                  <th className={TH}>Pipeline</th>
                  <th className={TH}>Last activity</th>
                  <th className={TH}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50">
                    <td className={TD}>
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={cn(TD, 'max-w-[220px] text-muted-foreground')}>{u.territory}</td>
                    <td className={TD}>
                      <StatusPill tone={TIER_TONE[u.tier]}>{u.tier}</StatusPill>
                    </td>
                    <td className={TD}>
                      <span className="font-semibold">{u.commissionPct}%</span>
                      <span className="ml-1 text-xs text-muted-foreground">recurring</span>
                    </td>
                    <td className={cn(TD, 'tabular-nums font-medium')}>{u.clinicsOnboarded}</td>
                    <td className={cn(TD, 'tabular-nums text-muted-foreground')}>{u.pipelineCount}</td>
                    <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                      {relativeTime(u.lastActivityAt)}
                    </td>
                    <td className={TD}>
                      <StatusPill tone={STATUS_TONE[u.status]}>{u.status}</StatusPill>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No sales users match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create sales account</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </Label>
              <Input
                className="mt-1"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Maria Lopez"
              />
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
                placeholder="name@kaykaydee.health"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Territory
              </Label>
              <Input
                className="mt-1"
                value={form.territory}
                onChange={(e) => setForm((p) => ({ ...p, territory: e.target.value }))}
                placeholder="West · California, Nevada, Arizona"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Starting tier
                </Label>
                <Select
                  value={form.tier}
                  onValueChange={(v) => {
                    const tier = v as CommissionTier
                    setForm((p) => ({
                      ...p,
                      tier,
                      commissionPct: TIER_DEFAULT_PCT[tier],
                    }))
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Commission %
                </Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  max={50}
                  value={form.commissionPct}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, commissionPct: Number(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="gap-1">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="button" onClick={handleCreate} className="gap-1">
              <Save className="h-4 w-4" />
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SummaryCard({
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
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', tint)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{value}</p>
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </motion.div>
  )
}
