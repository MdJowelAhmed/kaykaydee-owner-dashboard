import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Clock, Sparkles, Crown, Building2, Rocket } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { tiers, type SubscriptionTier, type TierKey } from '../billingData'

const ICONS: Record<TierKey, React.ElementType> = {
  basic: Sparkles,
  advanced: Rocket,
  premium: Crown,
  enterprise: Building2,
}

const TINTS: Record<TierKey, string> = {
  basic: 'bg-sky-50 text-sky-700',
  advanced: 'bg-emerald-50 text-emerald-700',
  premium: 'bg-violet-50 text-violet-700',
  enterprise: 'bg-amber-50 text-amber-700',
}

type CycleMode = 'monthly' | 'annual'

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function annualSavingsPct(tier: SubscriptionTier): number {
  const fullYear = tier.monthlyPrice * 12
  if (fullYear === 0 || tier.annualPrice === 0) return 0
  return Math.round(((fullYear - tier.annualPrice) / fullYear) * 100)
}

export function TierManagementSection() {
  const [cycle, setCycle] = useState<CycleMode>('monthly')

  const summary = useMemo(() => {
    const active = tiers.filter((t) => t.status === 'active')
    const subscribers = active.reduce((sum, t) => sum + t.subscribers, 0)
    const mrr = active.reduce((sum, t) => sum + t.subscribers * t.monthlyPrice, 0)
    return {
      activeCount: active.length,
      totalCount: tiers.length,
      subscribers,
      mrr,
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Active tiers" value={`${summary.activeCount} / ${summary.totalCount}`} tint="bg-emerald-50 text-emerald-700" icon={Sparkles} index={0} />
        <SummaryCard label="Total subscribers" value={summary.subscribers.toString()} tint="bg-sky-50 text-sky-700" icon={Building2} index={1} />
        <SummaryCard label="MRR from tiers" value={formatUsd(summary.mrr)} tint="bg-violet-50 text-violet-700" icon={Crown} index={2} />
        <SummaryCard label="Future tiers" value={tiers.filter((t) => t.status === 'future').length.toString()} tint="bg-amber-50 text-amber-700" icon={Rocket} index={3} />
      </div>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-card-foreground">Tier Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pricing plans, feature gating, trial periods, and annual discounts
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
              {(['monthly', 'annual'] as CycleMode[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCycle(c)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors',
                    cycle === c
                      ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {c === 'annual' ? 'Annual (save up to 20%)' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((tier, i) => (
              <TierCard key={tier.key} tier={tier} cycle={cycle} index={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TierCard({
  tier,
  cycle,
  index,
}: {
  tier: SubscriptionTier
  cycle: CycleMode
  index: number
}) {
  const Icon = ICONS[tier.key]
  const savings = annualSavingsPct(tier)
  const isFuture = tier.status === 'future'
  const price = cycle === 'annual' ? tier.annualPrice : tier.monthlyPrice

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm',
        isFuture && 'opacity-90'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', TINTS[tier.key])}>
          <Icon className="h-5 w-5" />
        </div>
        {isFuture ? (
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            Future
          </Badge>
        ) : tier.whiteLabel ? (
          <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">
            White-label
          </Badge>
        ) : null}
      </div>

      <h3 className="mt-3 text-lg font-bold text-card-foreground">{tier.name}</h3>
      <p className="text-xs text-muted-foreground">{tier.tagline}</p>

      <div className="mt-4 border-t border-border pt-4">
        {isFuture ? (
          <p className="text-2xl font-bold text-card-foreground">Coming soon</p>
        ) : (
          <>
            <p className="text-3xl font-bold text-card-foreground">
              {formatUsd(price)}
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                /{cycle === 'annual' ? 'yr' : 'mo'}
              </span>
            </p>
            {cycle === 'annual' && savings > 0 && (
              <p className="mt-1 text-xs font-semibold text-emerald-600">
                Save {savings}% vs monthly
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{tier.trialDays}-day free trial</span>
      </div>

      <ul className="mt-4 flex-1 space-y-2 border-t border-border pt-4 text-sm">
        {tier.highlights.map((h) => (
          <li key={h.label} className="flex items-start gap-2">
            {h.included ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
            )}
            <span className={cn(h.included ? 'text-card-foreground' : 'text-muted-foreground line-through')}>
              {h.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <p>
          <span className="font-semibold text-card-foreground">{tier.subscribers}</span> active
          subscribers
        </p>
        <Button type="button" variant="outline" className="w-full rounded-xl" disabled={isFuture}>
          {isFuture ? 'Notify me when ready' : 'Edit tier'}
        </Button>
      </div>
    </motion.div>
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
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
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
