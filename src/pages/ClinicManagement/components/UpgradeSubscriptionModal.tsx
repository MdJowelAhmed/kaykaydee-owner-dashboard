import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { ModalWrapper } from '@/components/common'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { CLINIC_PACKAGE_LABELS } from '@/utils/constants'
import type { ClinicPackagePlan } from '@/types'

const PLAN_ORDER: ClinicPackagePlan[] = ['basic', 'pro', 'enterprise']

const PLAN_BLURB: Record<ClinicPackagePlan, string> = {
  basic: 'Core scheduling, billing and limited AI usage.',
  pro: 'Advanced reporting and a higher AI quota.',
  enterprise: 'Unlimited AI, white-label and priority support.',
}

interface UpgradeSubscriptionModalProps {
  open: boolean
  onClose: () => void
  clinicName: string
  currentPlan: ClinicPackagePlan
  onConfirm: (plan: ClinicPackagePlan) => void
}

export function UpgradeSubscriptionModal({
  open,
  onClose,
  clinicName,
  currentPlan,
  onConfirm,
}: UpgradeSubscriptionModalProps) {
  const [selected, setSelected] = useState<ClinicPackagePlan>(currentPlan)

  useEffect(() => {
    if (open) setSelected(currentPlan)
  }, [open, currentPlan])

  const handleConfirm = () => {
    onConfirm(selected)
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Change subscription"
      description={`Upgrade or downgrade the plan for ${clinicName}.`}
      size="md"
      className="rounded-2xl"
    >
      <div className="space-y-3 pt-2">
        {PLAN_ORDER.map((plan) => {
          const isSelected = selected === plan
          const isCurrent = currentPlan === plan
          return (
            <button
              key={plan}
              type="button"
              onClick={() => setSelected(plan)}
              className={cn(
                'flex w-full items-start justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              )}
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {CLINIC_PACKAGE_LABELS[plan]}
                  {isCurrent && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Current
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{PLAN_BLURB[plan]}</p>
              </div>
              <span
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </span>
            </button>
          )
        })}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={selected === currentPlan}
            className="bg-primary text-accent-foreground hover:bg-primary/90"
          >
            Confirm change
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}
