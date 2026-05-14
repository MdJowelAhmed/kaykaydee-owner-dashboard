import { motion } from 'framer-motion'
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  LifeBuoy,
  Circle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { liveActivity, type ActivityKind } from './dashboardWidgetsData'

const KIND_ICON: Record<ActivityKind, React.ElementType> = {
  clinic_onboarded: Building2,
  subscription_upgraded: TrendingUp,
  failed_payment: AlertTriangle,
  ai_spike: Sparkles,
  support_ticket: LifeBuoy,
}

const KIND_TINT: Record<ActivityKind, string> = {
  clinic_onboarded: 'bg-emerald-50 text-emerald-700',
  subscription_upgraded: 'bg-sky-50 text-sky-700',
  failed_payment: 'bg-rose-50 text-rose-700',
  ai_spike: 'bg-violet-50 text-violet-700',
  support_ticket: 'bg-amber-50 text-amber-700',
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

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function LiveActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold text-card-foreground">
                Live Activity
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time updates across the platform
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
              Live
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ul className="max-h-[480px] overflow-y-auto divide-y divide-border">
            {liveActivity.map((event) => {
              const Icon = KIND_ICON[event.kind]
              return (
                <li key={event.id} className="flex items-start gap-3 px-5 py-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      KIND_TINT[event.kind]
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-card-foreground">
                        {event.title}
                      </p>
                      <p className="shrink-0 text-xs text-muted-foreground">
                        {relativeTime(event.timestamp)}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{event.detail}</p>
                    {event.amount !== undefined && (
                      <p className="mt-1 text-xs font-semibold text-card-foreground">
                        {formatUsd(event.amount)}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
