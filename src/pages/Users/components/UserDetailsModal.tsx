import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Monitor,
  ShieldCheck,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import type { User, UserDevice } from '@/types'
import { USER_TYPE_LABELS, USER_ACCESS_PERMISSIONS } from '@/utils/constants'
import { useAppDispatch } from '@/redux/hooks'
import { updateUserAccessPermission, updateUserSecurity } from '@/redux/slices/userSlice'
import { toast } from '@/utils/toast'
import { userStatusPillClass } from '@/pages/Users/userStatusStyles'

function userDisplayName(user: User) {
  return user.organizationName?.trim() || `${user.firstName} ${user.lastName}`.trim()
}

function formatDateTime(iso?: string) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function formatDateJoined(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function fullAddress(user: User) {
  const parts = [user.address, user.city, user.country].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
}

const PACKAGE_LABELS: Record<NonNullable<User['packagePlan']>, string> = {
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

const DEVICE_ICON: Record<UserDevice['kind'], typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
}

interface UserDetailsModalProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/* ------------------------------------------------------------------ */
/* Profile                                                            */
/* ------------------------------------------------------------------ */

function ProfileTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex shrink-0 justify-center sm:justify-start">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="h-24 w-24 rounded-2xl border border-border bg-muted/40 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
              No photo
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-lg font-semibold text-foreground">{userDisplayName(user)}</p>
          <p className="text-sm text-muted-foreground">
            ID <span className="font-mono text-foreground">#{user.id}</span>
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span
              className={cn(
                'inline-flex rounded-full px-3 py-0.5 text-xs font-medium capitalize',
                userStatusPillClass(user.status)
              )}
            >
              {user.status}
            </span>
            <Badge variant="outline" className="rounded-full font-normal">
              {USER_TYPE_LABELS[user.userType] ?? '—'}
            </Badge>
            {user.packagePlan && (
              <Badge variant="outline" className="rounded-full font-normal">
                {PACKAGE_LABELS[user.packagePlan]}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 break-all text-sm text-foreground">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Contact
          </dt>
          <dd className="mt-1 text-sm text-foreground">{user.phone}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Legal name
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {user.firstName} {user.lastName}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Clinic
          </dt>
          <dd className="mt-1 text-sm text-foreground">{user.clinicName ?? '—'}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Full address
          </dt>
          <dd className="mt-1 text-sm text-foreground">{fullAddress(user)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Date of joining
          </dt>
          <dd className="mt-1 text-sm text-foreground">{formatDateJoined(user.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Last login
          </dt>
          <dd className="mt-1 text-sm text-foreground">{formatDateTime(user.lastLoginAt)}</dd>
        </div>
      </dl>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Permissions                                                        */
/* ------------------------------------------------------------------ */

function PermissionsTab({ user }: { user: User }) {
  const dispatch = useAppDispatch()

  const handleToggle = (key: keyof User['accessPermissions'], label: string, value: boolean) => {
    dispatch(updateUserAccessPermission({ id: user.id, key, value }))
    toast({
      variant: 'success',
      title: value ? `${label} granted` : `${label} revoked`,
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Grant or revoke access for this account. Availability depends on the user's role and
        subscription tier.
      </p>
      {USER_ACCESS_PERMISSIONS.map(({ key, label, description }) => (
        <div
          key={key}
          className="flex items-start justify-between gap-4 rounded-xl border border-border px-4 py-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
          <Switch
            checked={user.accessPermissions[key]}
            onCheckedChange={(v) => handleToggle(key, label, v)}
          />
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Security                                                           */
/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h4>
  )
}

function SecurityTab({ user }: { user: User }) {
  const dispatch = useAppDispatch()
  const { security } = user

  const handlePasswordReset = () => {
    dispatch(
      updateUserSecurity({ id: user.id, patch: { lastPasswordResetAt: new Date().toISOString() } })
    )
    toast({
      variant: 'success',
      title: 'Password reset link sent',
      description: `A reset link was emailed to ${user.email}.`,
    })
  }

  const handleEnforce2FA = (value: boolean) => {
    dispatch(
      updateUserSecurity({
        id: user.id,
        // Enforcing 2FA also turns it on for the account.
        patch: { twoFactorEnforced: value, twoFactorEnabled: value || security.twoFactorEnabled },
      })
    )
    toast({
      variant: 'success',
      title: value ? '2FA enforced for this account' : '2FA enforcement removed',
    })
  }

  const handleResolveAlert = (alertId: string) => {
    dispatch(
      updateUserSecurity({
        id: user.id,
        patch: {
          suspiciousAlerts: security.suspiciousAlerts.map((a) =>
            a.id === alertId ? { ...a, resolved: true } : a
          ),
        },
      })
    )
    toast({ variant: 'success', title: 'Alert marked as resolved' })
  }

  return (
    <div className="space-y-6">
      {/* Password & 2FA */}
      <div className="space-y-3">
        <SectionTitle>Authentication</SectionTitle>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              Password reset
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Last reset: {formatDateTime(security.lastPasswordResetAt)}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handlePasswordReset}>
            Send reset link
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              Two-factor authentication
              <Badge
                variant="outline"
                className={cn(
                  'rounded-full font-normal',
                  security.twoFactorEnabled
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'text-muted-foreground'
                )}
              >
                {security.twoFactorEnabled ? 'Enabled' : 'Not set up'}
              </Badge>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Enforce 2FA to require it at next login.
            </p>
          </div>
          <Switch checked={security.twoFactorEnforced} onCheckedChange={handleEnforce2FA} />
        </div>
      </div>

      {/* Suspicious login alerts */}
      <div className="space-y-3">
        <SectionTitle>Suspicious login alerts</SectionTitle>
        {security.suspiciousAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suspicious activity detected.</p>
        ) : (
          security.suspiciousAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'flex items-start justify-between gap-4 rounded-xl border px-4 py-3',
                alert.resolved
                  ? 'border-border'
                  : 'border-destructive/30 bg-destructive/5'
              )}
            >
              <div className="flex min-w-0 gap-3">
                <AlertTriangle
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    alert.resolved ? 'text-muted-foreground' : 'text-destructive'
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{alert.reason}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {alert.location} · {alert.ipAddress} · {formatDateTime(alert.timestamp)}
                  </p>
                </div>
              </div>
              {alert.resolved ? (
                <span className="flex items-center gap-1 whitespace-nowrap text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Resolved
                </span>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleResolveAlert(alert.id)}
                >
                  Resolve
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Devices */}
      <div className="space-y-3">
        <SectionTitle>Tracked devices</SectionTitle>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {security.devices.map((device) => {
            const Icon = DEVICE_ICON[device.kind]
            return (
              <li key={device.id} className="flex items-center gap-3 px-4 py-3">
                <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {device.name}
                    {device.current && (
                      <span className="ml-2 text-xs font-normal text-success">This device</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {device.location} · Active {formatDateTime(device.lastActiveAt)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Login activity */}
      <div className="space-y-3">
        <SectionTitle>Recent login activity</SectionTitle>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {security.loginActivity.map((entry) => (
            <li key={entry.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  entry.status === 'success' ? 'bg-success' : 'bg-destructive'
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  {entry.device}
                  <span className="text-muted-foreground"> · {entry.location}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {entry.ipAddress} · {formatDateTime(entry.timestamp)}
                </p>
              </div>
              <span
                className={cn(
                  'whitespace-nowrap text-xs font-medium capitalize',
                  entry.status === 'success' ? 'text-success' : 'text-destructive'
                )}
              >
                {entry.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Modal shell                                                        */
/* ------------------------------------------------------------------ */

export function UserDetailsModal({ user, open, onOpenChange }: UserDetailsModalProps) {
  if (!user) return null

  const openAlerts = user.security.suspiciousAlerts.filter((a) => !a.resolved).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl sm:rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold text-foreground">User details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Profile, access permissions and security controls for this account.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="pt-2">
          <TabsList className="w-full justify-start gap-1 bg-muted/50">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5">
              Security
              {openAlerts > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {openAlerts}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 focus-visible:outline-none">
            <ProfileTab user={user} />
          </TabsContent>
          <TabsContent value="permissions" className="mt-4 focus-visible:outline-none">
            <PermissionsTab user={user} />
          </TabsContent>
          <TabsContent value="security" className="mt-4 focus-visible:outline-none">
            <SecurityTab user={user} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
