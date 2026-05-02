import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/utils/cn'
import type { SubscriptionManagePackage } from '../types'

interface PackageCardProps {
  pkg: SubscriptionManagePackage
  onToggleEnabled: (next: boolean) => void
  onEditFeatures: () => void
}

function cycleLabel(cycle: SubscriptionManagePackage['cycle']) {
  if (cycle === 'trial') return 'Free Trial'
  return cycle === 'annual' ? ' / year' : ' / month'
}

export function PackageCard({ pkg, onToggleEnabled, onEditFeatures }: PackageCardProps) {
  const flatFeatures = pkg.featureGroups.flatMap((g) => g.items)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{pkg.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {pkg.cycle === 'trial' ? '0' : `$${pkg.price}`}{' '}
              <span className="text-muted-foreground/90">{cycleLabel(pkg.cycle)}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
          <div>
            <p className="text-sm font-medium text-foreground">Enable</p>
          </div>
          <Switch checked={pkg.enabled} onCheckedChange={onToggleEnabled} />
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <ul className="space-y-2 text-sm">
            {flatFeatures.slice(0, 6).map((f) => (
              <li key={f.id} className="flex items-center gap-2 text-foreground">
                <span
                  className={cn(
                    'inline-block h-1.5 w-1.5 rounded-full',
                    f.enabled ? 'bg-primary' : 'bg-muted-foreground/40'
                  )}
                />
                <span className={cn(!f.enabled && 'text-muted-foreground')}>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-border bg-muted/30 p-4">
        <Button type="button" variant="outline" className="w-full rounded-xl" onClick={onEditFeatures}>
          Edit Features
        </Button>
      </div>
    </div>
  )
}
