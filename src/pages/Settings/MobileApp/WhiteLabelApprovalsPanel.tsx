import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Apple, Smartphone, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { toast } from 'sonner'
import { defaultSubmissions, type AppSubmission } from './mobileAppData'

const STATUS_TONE: Record<AppSubmission['status'], string> = {
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

export function WhiteLabelApprovalsPanel() {
  const [submissions, setSubmissions] = useState<AppSubmission[]>(defaultSubmissions)

  const summary = useMemo(() => {
    return {
      pending: submissions.filter((s) => s.status === 'Pending Review').length,
      approved: submissions.filter((s) => s.status === 'Approved').length,
      rejected: submissions.filter((s) => s.status === 'Rejected').length,
    }
  }, [submissions])

  const review = (id: string, status: 'Approved' | 'Rejected') => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, reviewer: 'You' } : s))
    )
    toast.success(`App ${status === 'Approved' ? 'approved' : 'rejected'}`)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Pending review" value={summary.pending} tint="bg-amber-50 text-amber-700" index={0} />
        <SummaryCard label="Approved" value={summary.approved} tint="bg-emerald-50 text-emerald-700" index={1} />
        <SummaryCard label="Rejected" value={summary.rejected} tint="bg-rose-50 text-rose-700" index={2} />
      </div>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-card-foreground">
            White-label app submissions
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Approve clinic-branded apps before they ship to the App Store / Play Store
          </p>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                  {sub.platform === 'iOS' ? (
                    <Apple className="h-5 w-5" />
                  ) : (
                    <Smartphone className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-card-foreground">{sub.clinic}</p>
                    <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">
                      {sub.plan}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{sub.platform}</span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {sub.bundleId} · v{sub.version}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitted by {sub.submittedBy} · {formatDateTime(sub.submittedAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={cn('font-medium', STATUS_TONE[sub.status])}>
                  {sub.status}
                </Badge>
                {sub.status === 'Pending Review' ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="gap-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                      onClick={() => review(sub.id, 'Rejected')}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => review(sub.id, 'Approved')}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {sub.reviewer ? `Reviewed by ${sub.reviewer}` : ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  tint,
  index,
}: {
  label: string
  value: number
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
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <p className="text-3xl font-bold tabular-nums text-foreground">{value}</p>
        <span className={cn('h-6 rounded-full px-2 py-0.5 text-xs font-semibold', tint)} />
      </div>
    </motion.div>
  )
}
