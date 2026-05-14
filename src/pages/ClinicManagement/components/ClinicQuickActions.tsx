import { useState } from 'react'
import {
  Ban,
  PlayCircle,
  Megaphone,
  RefreshCw,
  ArrowLeftRight,
  UserCog,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/common'
import { cn } from '@/utils/cn'
import { useAppDispatch } from '@/redux/hooks'
import {
  setClinicStatus,
  setClinicPackage,
  setClinicFeature,
  resetClinicBilling,
  logClinicAction,
} from '@/redux/slices/clinicSlice'
import { toast } from '@/utils/toast'
import { CLINIC_FEATURE_FLAGS } from '@/utils/constants'
import type { Clinic, ClinicFeatureKey, ClinicPackagePlan } from '@/types'
import { UpgradeSubscriptionModal } from './UpgradeSubscriptionModal'
import { SendAnnouncementModal } from './SendAnnouncementModal'

type DialogKind = 'suspend' | 'reset' | 'impersonate' | null

interface ClinicQuickActionsProps {
  clinic: Clinic
}

export function ClinicQuickActions({ clinic }: ClinicQuickActionsProps) {
  const dispatch = useAppDispatch()
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [announceOpen, setAnnounceOpen] = useState(false)

  const isSuspended = clinic.status === 'suspended'

  const handleToggleSuspend = () => {
    const nextStatus = isSuspended ? 'active' : 'suspended'
    dispatch(setClinicStatus({ id: clinic.id, status: nextStatus }))
    toast({
      variant: isSuspended ? 'success' : 'warning',
      title: isSuspended ? 'Clinic reactivated' : 'Clinic suspended',
      description: `${clinic.name} is now ${nextStatus}.`,
    })
    setDialog(null)
  }

  const handleResetBilling = () => {
    dispatch(resetClinicBilling({ id: clinic.id }))
    toast({
      variant: 'success',
      title: 'Billing reset',
      description: `Billing cycle and AI usage reset for ${clinic.name}.`,
    })
    setDialog(null)
  }

  const handleImpersonate = () => {
    dispatch(
      logClinicAction({
        id: clinic.id,
        action: 'Impersonation session',
        detail: `Super admin started an impersonation session as ${clinic.contactPerson}.`,
      })
    )
    toast({
      variant: 'info',
      title: 'Impersonation session started',
      description: 'This action has been securely logged in the activity trail.',
    })
    setDialog(null)
  }

  const handleChangePlan = (plan: ClinicPackagePlan) => {
    dispatch(setClinicPackage({ id: clinic.id, packagePlan: plan }))
    toast({
      variant: 'success',
      title: 'Subscription updated',
      description: `${clinic.name} moved to the ${plan} plan.`,
    })
  }

  const handleToggleFeature = (key: ClinicFeatureKey, label: string, value: boolean) => {
    dispatch(setClinicFeature({ id: clinic.id, key, value, label }))
    toast({
      variant: 'success',
      title: value ? `${label} enabled` : `${label} disabled`,
    })
  }

  const handleSendAnnouncement = (title: string, message: string) => {
    dispatch(
      logClinicAction({
        id: clinic.id,
        action: 'Announcement sent',
        detail: `"${title}" — ${message}`,
      })
    )
    toast({ variant: 'success', title: 'Announcement sent', description: clinic.name })
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
        <Zap className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
        <CardTitle className="text-base font-semibold text-foreground">Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pb-6 pt-2">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              'gap-2 rounded-full',
              isSuspended
                ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300'
                : 'border-destructive/40 text-destructive hover:bg-destructive/10'
            )}
            onClick={() => setDialog('suspend')}
          >
            {isSuspended ? <PlayCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
            {isSuspended ? 'Reactivate clinic' : 'Suspend clinic'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={() => setUpgradeOpen(true)}
          >
            <ArrowLeftRight className="h-4 w-4" />
            Upgrade / downgrade
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={() => setDialog('reset')}
          >
            <RefreshCw className="h-4 w-4" />
            Reset billing
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={() => setDialog('impersonate')}
          >
            <UserCog className="h-4 w-4" />
            Impersonate admin
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={() => setAnnounceOpen(true)}
          >
            <Megaphone className="h-4 w-4" />
            Send announcement
          </Button>
        </div>

        {/* Feature switches */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Enable / disable features
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CLINIC_FEATURE_FLAGS.map(({ key, label, description }) => {
              const featureKey = key as ClinicFeatureKey
              return (
                <div
                  key={key}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                  </div>
                  <Switch
                    checked={clinic.features[featureKey]}
                    onCheckedChange={(v) => handleToggleFeature(featureKey, label, v)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>

      <ConfirmDialog
        open={dialog === 'suspend'}
        onClose={() => setDialog(null)}
        onConfirm={handleToggleSuspend}
        title={isSuspended ? 'Reactivate clinic' : 'Suspend clinic'}
        description={
          isSuspended
            ? `Restore full access for ${clinic.name}?`
            : `Suspend ${clinic.name}? Staff will lose access until reactivated.`
        }
        confirmText={isSuspended ? 'Reactivate' : 'Suspend'}
        variant={isSuspended ? 'info' : 'danger'}
      />

      <ConfirmDialog
        open={dialog === 'reset'}
        onClose={() => setDialog(null)}
        onConfirm={handleResetBilling}
        title="Reset billing"
        description={`Reset the billing cycle and AI usage counter for ${clinic.name}? This is logged.`}
        confirmText="Reset billing"
        variant="warning"
      />

      <ConfirmDialog
        open={dialog === 'impersonate'}
        onClose={() => setDialog(null)}
        onConfirm={handleImpersonate}
        title="Impersonate clinic admin"
        description={`Start a session as ${clinic.contactPerson}. This action is securely logged in the activity trail.`}
        confirmText="Start session"
        variant="info"
      />

      <UpgradeSubscriptionModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        clinicName={clinic.name}
        currentPlan={clinic.packagePlan}
        onConfirm={handleChangePlan}
      />

      <SendAnnouncementModal
        open={announceOpen}
        onClose={() => setAnnounceOpen(false)}
        clinicName={clinic.name}
        onSend={handleSendAnnouncement}
      />
    </Card>
  )
}
