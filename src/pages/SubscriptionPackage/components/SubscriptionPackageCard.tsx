import { Check, X, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import type { AdminSubscriptionPackage } from '../subscriptionPackageData'

interface SubscriptionPackageCardProps {
  pkg: AdminSubscriptionPackage
  onEdit: (pkg: AdminSubscriptionPackage) => void
  onDelete: (pkg: AdminSubscriptionPackage) => void
}

export function SubscriptionPackageCard({
  pkg,
  onEdit,
  onDelete,
}: SubscriptionPackageCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-border p-5 shadow-sm',
        'bg-gradient-to-b from-primary/8 via-card to-card',
        'dark:from-primary/15 dark:via-card dark:to-card'
      )}
    >
      <div className="flex min-h-[28px] flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {pkg.name}
        </span>
        {pkg.mostPopular && (
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            (Most Popular)
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-3xl font-bold tabular-nums text-foreground">
          {formatCurrency(pkg.price, 'USD')}
        </p>
        <p className="text-sm text-muted-foreground">{pkg.billingLabel}</p>
      </div>

      <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-foreground">
        {pkg.featureLabels.map((label, i) => {
          const ok = pkg.features[i]
          return (
            <li key={`${pkg.id}-${i}`} className="flex items-center gap-2">
              {ok ? (
                <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
              ) : (
                <X className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
              )}
              <span className={cn(!ok && 'text-muted-foreground')}>{label}</span>
            </li>
          )
        })}
      </ul>

      <div className="mt-10 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-primary text-primary hover:bg-primary/10"
          onClick={() => onEdit(pkg)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button type="button" variant="destructive" className="rounded-xl" onClick={() => onDelete(pkg)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}
