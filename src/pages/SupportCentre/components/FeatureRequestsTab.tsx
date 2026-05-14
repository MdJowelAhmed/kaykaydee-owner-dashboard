import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, ThumbsUp, Rocket, ListChecks } from 'lucide-react'
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
  featureRequests,
  STATUS_LABELS_FEATURE,
  type FeatureRequestStatus,
  type FeatureRequest,
} from '../extraData'

const STATUS_TONE: Record<FeatureRequestStatus, string> = {
  under_review: 'bg-amber-50 text-amber-700 border-amber-200',
  planned: 'bg-sky-50 text-sky-700 border-sky-200',
  in_progress: 'bg-violet-50 text-violet-700 border-violet-200',
  shipped: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-neutral-100 text-neutral-700 border-neutral-200',
}

type SortMode = 'votes' | 'newest'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function FeatureRequestsTab() {
  const [statusFilter, setStatusFilter] = useState<FeatureRequestStatus | 'all'>('all')
  const [sortMode, setSortMode] = useState<SortMode>('votes')
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())

  const summary = useMemo(() => {
    return {
      under_review: featureRequests.filter((f) => f.status === 'under_review').length,
      planned: featureRequests.filter((f) => f.status === 'planned').length,
      in_progress: featureRequests.filter((f) => f.status === 'in_progress').length,
      shipped: featureRequests.filter((f) => f.status === 'shipped').length,
    }
  }, [])

  const totalVotes = useMemo(
    () => featureRequests.reduce((sum, f) => sum + f.votes, 0),
    []
  )

  const filtered = useMemo(() => {
    return featureRequests
      .filter((f) => (statusFilter === 'all' ? true : f.status === statusFilter))
      .slice()
      .sort((a, b) =>
        sortMode === 'votes'
          ? b.votes - a.votes
          : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
  }, [statusFilter, sortMode])

  const toggleVote = (id: string) => {
    setVotedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Under review" value={summary.under_review} icon={ListChecks} tint="bg-amber-50 text-amber-700" index={0} />
        <SummaryCard label="Planned" value={summary.planned} icon={Lightbulb} tint="bg-sky-50 text-sky-700" index={1} />
        <SummaryCard label="In progress" value={summary.in_progress} icon={ListChecks} tint="bg-violet-50 text-violet-700" index={2} />
        <SummaryCard label="Shipped" value={summary.shipped} icon={Rocket} tint="bg-emerald-50 text-emerald-700" index={3} />
      </div>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-card-foreground">Feature Requests</h3>
              <p className="text-sm text-muted-foreground">
                {filtered.length} of {featureRequests.length} · {totalVotes} total votes
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as FeatureRequestStatus | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="votes">Most votes</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ul className="space-y-3">
            {filtered.map((req) => (
              <FeatureRow
                key={req.id}
                req={req}
                voted={votedIds.has(req.id)}
                onVote={() => toggleVote(req.id)}
              />
            ))}
            {filtered.length === 0 && (
              <li className="py-12 text-center text-sm text-muted-foreground">
                No feature requests match the current filters.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function FeatureRow({
  req,
  voted,
  onVote,
}: {
  req: FeatureRequest
  voted: boolean
  onVote: () => void
}) {
  const displayedVotes = req.votes + (voted ? 1 : 0)
  return (
    <li className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <button
        type="button"
        onClick={onVote}
        className={cn(
          'flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border transition-colors',
          voted
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border bg-neutral-50 text-muted-foreground hover:border-primary/40 hover:text-primary'
        )}
        aria-label={voted ? 'Remove vote' : 'Upvote'}
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="mt-1 text-sm font-bold">{displayedVotes}</span>
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{req.ref}</span>
          <Badge variant="outline" className={cn('font-medium', STATUS_TONE[req.status])}>
            {STATUS_LABELS_FEATURE[req.status]}
          </Badge>
          <span className="text-xs text-muted-foreground">{req.category}</span>
        </div>
        <p className="mt-1 font-semibold text-card-foreground">{req.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{req.description}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {req.clinic} · submitted by {req.submittedBy} · {formatDate(req.submittedAt)}
        </p>
      </div>
    </li>
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
