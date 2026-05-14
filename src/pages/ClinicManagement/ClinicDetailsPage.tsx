import { useMemo, useState, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowLeft,
  CreditCard,
  DollarSign,
  Edit,
  Globe,
  LifeBuoy,
  KeyRound,
  Receipt,
  Sparkles,
  User,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/common'
import { useAppSelector } from '@/redux/hooks'
import { CLINIC_PACKAGE_LABELS } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { formatCurrency, formatDate, getInitialsFromName } from '@/utils/formatters'
import type { Clinic } from '@/types'
import { ClinicQuickActions } from './components/ClinicQuickActions'
import {
  mockInvoicesForClinic,
  mockNextRenewalDate,
  mockSubscriptionStartedAt,
  type ClinicInvoiceRow,
} from './clinicDetailsMock'

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

function packageLabel(plan: Clinic['packagePlan']): string {
  return CLINIC_PACKAGE_LABELS[plan] ?? plan
}

function invoiceStatusClass(status: ClinicInvoiceRow['status']) {
  if (status === 'Paid') return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
  if (status === 'Pending') return 'bg-amber-100 text-amber-900 dark:bg-amber-950/55 dark:text-amber-300'
  return 'bg-red-100 text-red-900 dark:bg-red-950/55 dark:text-red-300'
}

function clinicStatusClass(status: Clinic['status']) {
  if (status === 'active') return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
  if (status === 'suspended') return 'bg-amber-100 text-amber-900 dark:bg-amber-950/55 dark:text-amber-300'
  return 'bg-red-100 text-red-900 dark:bg-red-950/55 dark:text-red-300'
}

function statusLabel(status: Clinic['status']) {
  if (status === 'suspended') return 'Suspended'
  return status === 'deactive' ? 'Deactive' : 'Active'
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
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
  icon: typeof Users
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
          <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground">{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClinicDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { list } = useAppSelector((state) => state.clinics)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const clinic = list.find((c) => c.id === id)

  const invoices = useMemo(() => (clinic ? mockInvoicesForClinic(clinic.id) : []), [clinic])

  if (!clinic) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-lg text-muted-foreground">Clinic not found</p>
        <Button variant="link" onClick={() => navigate('/clinic-management')} className="mt-2">
          Back to Clinic Management
        </Button>
      </div>
    )
  }

  const initials = getInitialsFromName(clinic.name)
  const renewal = mockNextRenewalDate(clinic.id)
  const started = mockSubscriptionStartedAt(clinic.id)
  const { aiUsage } = clinic
  const aiPercent =
    aiUsage.quota != null && aiUsage.quota > 0
      ? Math.min(100, Math.round((aiUsage.used / aiUsage.quota) * 100))
      : null
  const openTickets = clinic.supportTickets.filter(
    (t) => t.status === 'open' || t.status === 'in_progress'
  ).length

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }
    toast.success('Password updated', {
      description: `A new password has been set for ${clinic.name}. Connect your API to apply this for real accounts.`,
    })
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Button
            type="button"
            variant="ghost"
            className="-ml-3 h-auto px-3 py-1 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/clinic-management')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clinic Directory
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic profile</h1>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-2 rounded-full border-border"
          onClick={() => toast.message('Edit clinic', { description: 'Hook this button to your edit flow.' })}
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Identity card */}
      <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6">
          <div
            className="flex h-[5.5rem] w-[5.5rem] shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white shadow-inner"
            style={{ backgroundColor: COL_ACCENT }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{clinic.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Clinic ID: CLN{clinic.id} · {clinic.state}, {clinic.country}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                  clinicStatusClass(clinic.status)
                )}
              >
                {statusLabel(clinic.status)}
              </span>
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: COL_ACCENT }}
              >
                {packageLabel(clinic.packagePlan)}
              </span>
              <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                {clinic.features.whiteLabel ? 'White-label on' : 'White-label off'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Number of users" value={clinic.staff} sub={`${clinic.patients} patients`} />
        <MetricCard icon={DollarSign} label="Revenue generated" value={formatCurrency(clinic.revenue)} />
        <MetricCard
          icon={Sparkles}
          label="AI usage"
          value={`${aiUsage.used.toLocaleString()}`}
          sub={aiUsage.quota != null ? `of ${aiUsage.quota.toLocaleString()} this period` : 'Unlimited plan'}
        />
        <MetricCard
          icon={LifeBuoy}
          label="Support tickets"
          value={clinic.supportTickets.length}
          sub={`${openTickets} open`}
        />
      </div>

      {/* Quick actions */}
      <ClinicQuickActions clinic={clinic} />

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList className={tabListClass}>
          <TabsTrigger value="overview" className={tabTriggerClass}>
            <User className="h-4 w-4 shrink-0" strokeWidth={2} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="subscription" className={tabTriggerClass}>
            <CreditCard className="h-4 w-4 shrink-0" strokeWidth={2} />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="invoices" className={tabTriggerClass}>
            <Receipt className="h-4 w-4 shrink-0" strokeWidth={2} />
            Payment history
          </TabsTrigger>
          <TabsTrigger value="support" className={tabTriggerClass}>
            <LifeBuoy className="h-4 w-4 shrink-0" strokeWidth={2} />
            Support tickets
          </TabsTrigger>
          <TabsTrigger value="activity" className={tabTriggerClass}>
            <Activity className="h-4 w-4 shrink-0" strokeWidth={2} />
            Activity log
          </TabsTrigger>
          <TabsTrigger value="password" className={tabTriggerClass}>
            <KeyRound className="h-4 w-4 shrink-0" strokeWidth={2} />
            Password reset
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <User className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">Clinic details</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                <DetailField label="Company name">{clinic.name}</DetailField>
                <DetailField label="Clinic ID">CLN{clinic.id}</DetailField>
                <DetailField label="Email">{clinic.email}</DetailField>
                <DetailField label="Phone">{clinic.contact}</DetailField>
                <DetailField label="Contact person">{clinic.contactPerson}</DetailField>
                <DetailField label="Website">
                  {clinic.website ? (
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 break-all font-medium text-[#6737BE] hover:underline"
                    >
                      <Globe className="h-4 w-4 shrink-0" />
                      {clinic.website}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </DetailField>
                <DetailField label="Country / State">
                  {clinic.country} · {clinic.state}
                </DetailField>
                <DetailField label="Assigned salesperson">{clinic.salesperson}</DetailField>
                <DetailField label="Referral source">{clinic.referralSource}</DetailField>
                <DetailField label="Status">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      clinicStatusClass(clinic.status)
                    )}
                  >
                    {statusLabel(clinic.status)}
                  </span>
                </DetailField>
                <Separator className="sm:col-span-2" />
                <DetailField label="Number of users">{clinic.staff}</DetailField>
                <DetailField label="Patients">{clinic.patients}</DetailField>
                <DetailField label="Revenue generated">{formatCurrency(clinic.revenue)}</DetailField>
                <DetailField label="Subscription tier">{packageLabel(clinic.packagePlan)}</DetailField>
                <DetailField label="White-label status">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      clinic.features.whiteLabel
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {clinic.features.whiteLabel ? 'Enabled' : 'Disabled'}
                  </span>
                </DetailField>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-muted-foreground">AI usage</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${aiPercent ?? 100}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                      {aiUsage.used.toLocaleString()}
                      {aiUsage.quota != null
                        ? ` / ${aiUsage.quota.toLocaleString()}`
                        : ' · Unlimited'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last used {formatDate(aiUsage.lastUsedAt, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription */}
        <TabsContent value="subscription" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <CreditCard className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6 pt-0">
              <p className="text-sm text-muted-foreground">Current package and renewal timeline.</p>
              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                <DetailField label="Subscription tier">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white"
                    style={{ backgroundColor: COL_ACCENT }}
                  >
                    {packageLabel(clinic.packagePlan)}
                  </span>
                </DetailField>
                <DetailField label="Billing cycle">
                  <span className="capitalize">{clinic.billingCycle}</span>
                </DetailField>
                <DetailField label="Subscribed since">{started}</DetailField>
                <DetailField label="Next renewal">{renewal}</DetailField>
                <DetailField label="Revenue generated">{formatCurrency(clinic.revenue)}</DetailField>
                <DetailField label="Last billing reset">
                  {clinic.lastBillingResetAt
                    ? formatDate(clinic.lastBillingResetAt, 'MMM dd, yyyy')
                    : 'Never'}
                </DetailField>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Use Quick actions above to upgrade, downgrade or reset billing. Wire this tab to your
                billing API when ready.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment history */}
        <TabsContent value="invoices" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <Receipt className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">Payment history</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              <p className="mb-4 text-sm text-muted-foreground">Invoices for {clinic.name}.</p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-[#E9EBF0] text-left text-xs font-semibold text-accent dark:bg-muted/50">
                      <th className="rounded-tl-lg px-4 py-3">Invoice</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="rounded-tr-lg px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card">
                    {invoices.map((row) => (
                      <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">{row.id}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(row.issuedAt)}</td>
                        <td className="px-4 py-3 tabular-nums text-foreground">{formatCurrency(row.amount)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                              invoiceStatusClass(row.status)
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support tickets */}
        <TabsContent value="support" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <LifeBuoy className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">Support tickets</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              {clinic.supportTickets.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No support tickets raised by this clinic.
                </p>
              ) : (
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {clinic.supportTickets.map((ticket) => (
                    <li key={ticket.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          <span className="text-muted-foreground">{ticket.ref}</span> · {ticket.subject}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Opened {formatDate(ticket.createdAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <StatusBadge status={ticket.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity log */}
        <TabsContent value="activity" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <Activity className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">
                Activity log
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              <p className="mb-4 text-sm text-muted-foreground">
                Every super-admin quick action against this clinic is securely logged here.
              </p>
              {clinic.auditLog.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No actions logged yet.
                </p>
              ) : (
                <ol className="space-y-3">
                  {clinic.auditLog.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex gap-3 rounded-xl border border-border px-4 py-3"
                    >
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{entry.action}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{entry.detail}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {entry.actor} · {formatDate(entry.timestamp, 'MMM dd, yyyy · h:mm a')}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password reset */}
        <TabsContent value="password" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <KeyRound className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">Password reset</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              <p className="mb-4 text-sm text-muted-foreground">
                Set a new password for this clinic&apos;s dashboard login. Confirm with your backend when
                integrated.
              </p>
              <form onSubmit={handlePasswordReset} className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinic-new-password">New password</Label>
                  <Input
                    id="clinic-new-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-confirm-password">Confirm password</Label>
                  <Input
                    id="clinic-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-full bg-secondary px-6 text-secondary-foreground hover:bg-secondary/90"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Save new password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
