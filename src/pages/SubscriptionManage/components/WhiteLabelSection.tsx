import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Crown, PaintBucket, Globe2, Power } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { toast } from 'sonner'
import {
  brandingRequests as initialRequests,
  whiteLabelClinics as initialClinics,
  type BrandingRequest,
  type WhiteLabelClinic,
} from '../billingData'

const STATUS_TONE: Record<BrandingRequest['status'], string> = {
  'Pending Review': 'border-amber-200 bg-amber-50 text-amber-700',
  Approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Rejected: 'border-rose-200 bg-rose-50 text-rose-700',
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function WhiteLabelSection() {
  const [masterEnabled, setMasterEnabled] = useState(true)
  const [requests, setRequests] = useState<BrandingRequest[]>(initialRequests)
  const [clinics, setClinics] = useState<WhiteLabelClinic[]>(initialClinics)

  const pending = requests.filter((r) => r.status === 'Pending Review').length
  const approved = requests.filter((r) => r.status === 'Approved').length
  const enabledClinics = clinics.filter((c) => c.enabled).length

  const toggleClinic = (id: string, next: boolean) => {
    setClinics((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              enabled: next,
              lastDeployedAt: next ? new Date().toISOString() : c.lastDeployedAt,
            }
          : c
      )
    )
    toast.success(`White-label ${next ? 'enabled' : 'disabled'}`)
  }

  const reviewRequest = (id: string, decision: 'Approved' | 'Rejected') => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: decision, reviewer: 'You' } : r
      )
    )
    toast.success(`Branding ${decision.toLowerCase()}`)
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-violet-200 bg-violet-50/40 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-card-foreground">Premium-only access</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                White-label features are available exclusively on Premium and Enterprise plans
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-violet-200 bg-white text-violet-700">
            {enabledClinics} clinics live
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Master switch"
          value={masterEnabled ? 'On' : 'Off'}
          helper="Platform-wide white-label feature"
          tint="bg-emerald-50 text-emerald-700"
          icon={Power}
          index={0}
        />
        <SummaryCard
          label="Pending approvals"
          value={pending.toString()}
          helper="Branding submissions awaiting review"
          tint="bg-amber-50 text-amber-700"
          icon={PaintBucket}
          index={1}
        />
        <SummaryCard
          label="Approved brandings"
          value={approved.toString()}
          helper="Live across the platform"
          tint="bg-violet-50 text-violet-700"
          icon={Check}
          index={2}
        />
        <SummaryCard
          label="Active domains"
          value={enabledClinics.toString()}
          helper="Custom domains deployed"
          tint="bg-sky-50 text-sky-700"
          icon={Globe2}
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
              Platform Controls
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Master switch and per-clinic enable / disable
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                  <Power className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">White-label master switch</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    When off, all clinics revert to default platform branding
                  </p>
                </div>
              </div>
              <Switch
                checked={masterEnabled}
                onCheckedChange={(v) => {
                  setMasterEnabled(v)
                  toast.success(`Master switch ${v ? 'enabled' : 'disabled'}`)
                }}
              />
            </div>

            <div className="space-y-2">
              {clinics.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-1 h-10 w-10 shrink-0 rounded-full"
                      style={{ background: c.primaryColor }}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-card-foreground">{c.clinic}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {c.plan} · {c.domain}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.lastDeployedAt
                          ? `Last deployed ${formatDateTime(c.lastDeployedAt)}`
                          : 'Not yet deployed'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={c.enabled && masterEnabled}
                    disabled={!masterEnabled}
                    onCheckedChange={(v) => toggleClinic(c.id, v)}
                  />
                </div>
              ))}
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
              Branding Approval Queue
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Review submitted logos and brand colors before they go live
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={req.logoUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-card-foreground">{req.clinic}</p>
                      <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">
                        {req.plan}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Submitted by {req.submittedBy} · {formatDateTime(req.submittedAt)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span
                        className="inline-block h-4 w-4 rounded-full border border-border"
                        style={{ background: req.primaryColor }}
                      />
                      <span className="font-mono">{req.primaryColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn('font-medium', STATUS_TONE[req.status])}>
                    {req.status}
                  </Badge>
                  {req.status === 'Pending Review' ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                        onClick={() => reviewRequest(req.id, 'Rejected')}
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => reviewRequest(req.id, 'Approved')}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {req.reviewer ? `Reviewed by ${req.reviewer}` : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
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
