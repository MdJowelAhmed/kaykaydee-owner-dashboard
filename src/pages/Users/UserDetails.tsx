import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  Edit,
  KeyRound,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Shield,
  ShieldCheck,
  Smartphone,
  Tablet,
  Trash2,
  User as UserIcon,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfirmDialog } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  deleteUser,
  updateUser,
  updateUserAccessPermission,
  updateUserSecurity,
} from '@/redux/slices/userSlice'
import { USER_ACCESS_PERMISSIONS, USER_TYPE_LABELS } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { formatDate, getInitials } from '@/utils/formatters'
import { toast } from '@/utils/toast'
import { userStatusPillClass } from '@/pages/Users/userStatusStyles'
import type { User, UserDevice } from '@/types'

const COL_ACCENT = '#6737BE'

const tabListClass =
  'flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-border bg-card p-3 sm:flex-nowrap sm:overflow-x-auto sm:scrollbar-thin'

const tabTriggerClass = cn(
  'inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
  'text-muted-foreground hover:text-foreground',
  'data-[state=active]:bg-background data-[state=active]:text-[#6737BE] data-[state=active]:shadow-sm',
  'dark:data-[state=active]:bg-background',
  'data-[state=active]:shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
)

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

function fullAddress(user: User) {
  const parts = [user.address, user.city, user.country].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-sm font-medium text-foreground">{children}</div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof UserIcon
  label: string
  value: ReactNode
  sub?: ReactNode
}) {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-sm">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-0.5 truncate text-lg font-bold text-foreground">{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h4>
  )
}

export default function UserDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { list } = useAppSelector((state) => state.users)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const user = useMemo(() => list.find((u) => u.id === id) ?? null, [list, id])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-lg text-muted-foreground">User not found</p>
        <Button variant="link" onClick={() => navigate('/users')} className="mt-2">
          Back to Users
        </Button>
      </div>
    )
  }

  const { security } = user
  const openAlerts = security.suspiciousAlerts.filter((a) => !a.resolved).length

  const handlePickPhoto = () => fileInputRef.current?.click()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Only image files are supported.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'Image must be smaller than 5 MB.' })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      dispatch(updateUser({ ...user, avatar: reader.result as string }))
      toast({ variant: 'success', title: 'Profile photo updated.' })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleTogglePermission = (
    key: keyof User['accessPermissions'],
    label: string,
    value: boolean
  ) => {
    dispatch(updateUserAccessPermission({ id: user.id, key, value }))
    toast({
      variant: 'success',
      title: value ? `${label} granted` : `${label} revoked`,
    })
  }

  const handlePasswordReset = () => {
    dispatch(
      updateUserSecurity({
        id: user.id,
        patch: { lastPasswordResetAt: new Date().toISOString() },
      })
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
        patch: {
          twoFactorEnforced: value,
          twoFactorEnabled: value || security.twoFactorEnabled,
        },
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

  const handleConfirmDelete = () => {
    dispatch(deleteUser(user.id))
    toast({ variant: 'success', title: 'User deleted', description: userDisplayName(user) })
    setDeleteOpen(false)
    navigate('/users')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Button
            type="button"
            variant="ghost"
            className="-ml-3 h-auto px-3 py-1 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/users')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User profile</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={() =>
              toast({
                variant: 'info',
                title: 'Edit user',
                description: 'Hook this button to your edit flow.',
              })
            }
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete user
          </Button>
        </div>
      </div>

      {/* Identity card */}
      <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative shrink-0">
            <Avatar className="h-[5.5rem] w-[5.5rem] border border-border bg-muted/40">
              <AvatarImage src={user.avatar} alt="" className="object-cover" />
              <AvatarFallback
                className="text-2xl font-semibold text-white"
                style={{ backgroundColor: COL_ACCENT }}
              >
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handlePickPhoto}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
              aria-label="Upload profile photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {userDisplayName(user)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              User ID: <span className="font-mono">#{user.id}</span>
              {user.clinicName ? ` · ${user.clinicName}` : ''}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
                  userStatusPillClass(user.status)
                )}
              >
                {user.status}
              </span>
              <Badge variant="outline" className="rounded-full font-normal">
                {USER_TYPE_LABELS[user.userType] ?? '—'}
              </Badge>
              {user.packagePlan && (
                <span
                  className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: COL_ACCENT }}
                >
                  {PACKAGE_LABELS[user.packagePlan]}
                </span>
              )}
              {user.membershipType && (
                <Badge variant="outline" className="rounded-full font-normal capitalize">
                  {user.membershipType}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Shield}
          label="Account status"
          value={
            <span className="capitalize">{user.status}</span>
          }
          sub={USER_TYPE_LABELS[user.userType] ?? '—'}
        />
        <MetricCard
          icon={Calendar}
          label="Joined"
          value={formatDate(user.createdAt)}
          sub={`Last login ${formatDateTime(user.lastLoginAt)}`}
        />
        <MetricCard
          icon={ShieldCheck}
          label="Two-factor auth"
          value={security.twoFactorEnabled ? 'Enabled' : 'Off'}
          sub={security.twoFactorEnforced ? 'Enforced by admin' : 'Optional'}
        />
        <MetricCard
          icon={AlertTriangle}
          label="Open security alerts"
          value={openAlerts}
          sub={`${security.devices.length} tracked devices`}
        />
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList className={tabListClass}>
          <TabsTrigger value="overview" className={tabTriggerClass}>
            <UserIcon className="h-4 w-4 shrink-0" strokeWidth={2} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="permissions" className={tabTriggerClass}>
            <Shield className="h-4 w-4 shrink-0" strokeWidth={2} />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="security" className={tabTriggerClass}>
            <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={2} />
            Security
            {openAlerts > 0 && (
              <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {openAlerts}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity" className={tabTriggerClass}>
            <Activity className="h-4 w-4 shrink-0" strokeWidth={2} />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <UserIcon className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">User details</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                <DetailField label="Legal name">
                  {user.firstName} {user.lastName}
                </DetailField>
                <DetailField label="Display name">{userDisplayName(user)}</DetailField>
                <DetailField label="Email">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="break-all">{user.email}</span>
                  </span>
                </DetailField>
                <DetailField label="Phone">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {user.phone}
                  </span>
                </DetailField>
                <DetailField label="User type">
                  {USER_TYPE_LABELS[user.userType] ?? '—'}
                </DetailField>
                <DetailField label="Clinic">{user.clinicName ?? '—'}</DetailField>
                <DetailField label="Subscription">
                  {user.packagePlan ? PACKAGE_LABELS[user.packagePlan] : '—'}
                </DetailField>
                <DetailField label="Membership">
                  {user.membershipType ? (
                    <span className="capitalize">{user.membershipType}</span>
                  ) : (
                    '—'
                  )}
                </DetailField>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Address
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {fullAddress(user)}
                  </p>
                </div>
                <Separator className="sm:col-span-2" />
                <DetailField label="Joined">{formatDate(user.createdAt)}</DetailField>
                <DetailField label="Last login">{formatDateTime(user.lastLoginAt)}</DetailField>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <Shield className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">
                Access permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-6 pt-0">
              <p className="text-sm text-muted-foreground">
                Grant or revoke access for this account. Availability depends on the user's role and
                subscription tier.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
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
                      onCheckedChange={(v) => handleTogglePermission(key, label, v)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-6 pt-0">
              {/* Authentication */}
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
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
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
                      Enforce 2FA to require it at the next login.
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnforced}
                    onCheckedChange={handleEnforce2FA}
                  />
                </div>
              </div>

              {/* Alerts */}
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
                            {alert.location} · {alert.ipAddress} ·{' '}
                            {formatDateTime(alert.timestamp)}
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

              {/* Tracked devices */}
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
                              <span className="ml-2 text-xs font-normal text-success">
                                This device
                              </span>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <Activity className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">
                Recent login activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              {security.loginActivity.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No login activity recorded.
                </p>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete user"
        description={`Permanently remove ${userDisplayName(user)}? This action cannot be undone.`}
        confirmText="Delete user"
        variant="danger"
      />
    </motion.div>
  )
}
