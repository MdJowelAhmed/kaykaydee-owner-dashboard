import { useMemo, useState, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CreditCard,
  Edit,
  Globe,
  KeyRound,
  Receipt,
  User,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppSelector } from '@/redux/hooks'
import { USER_PACKAGES } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { formatCurrency, formatDate, getInitialsFromName } from '@/utils/formatters'
import {
  mockInvoicesForClinic,
  mockNextRenewalDate,
  mockSubscriptionStartedAt,
  type ClinicInvoiceRow,
} from './clinicDetailsMock'

const COL_ACCENT = '#6737BE'

const tabListClass =
  'flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-border bg-card p-3  sm:flex-nowrap sm:overflow-x-auto sm:scrollbar-thin'

const tabTriggerClass = cn(
  'inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
  'text-muted-foreground hover:text-foreground',
  'data-[state=active]:bg-background data-[state=active]:text-[#6737BE] data-[state=active]:shadow-sm',
  'dark:data-[state=active]:bg-background',
  'data-[state=active]:shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
)

function packageLabel(plan: 'basic' | 'pro' | 'enterprise'): string {
  return USER_PACKAGES.find((p) => p.value === plan)?.label ?? plan
}

function invoiceStatusClass(status: ClinicInvoiceRow['status']) {
  if (status === 'Paid') return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
  if (status === 'Pending') return 'bg-amber-100 text-amber-900 dark:bg-amber-950/55 dark:text-amber-300'
  return 'bg-red-100 text-red-900 dark:bg-red-950/55 dark:text-red-300'
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-medium text-foreground">{children}</div>
    </div>
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
            Back to Clinic Management
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic details</h1>
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
            <p className="mt-1 text-sm text-muted-foreground">Clinic ID: CLN{clinic.id}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="flex flex-col gap-4">
        <TabsList className={tabListClass}>
          <TabsTrigger value="profile" className={tabTriggerClass}>
            <User className="h-4 w-4 shrink-0" strokeWidth={2} />
            Clinic profile
          </TabsTrigger>
          <TabsTrigger value="subscription" className={tabTriggerClass}>
            <CreditCard className="h-4 w-4 shrink-0" strokeWidth={2} />
            Subscription details
          </TabsTrigger>
          <TabsTrigger value="invoices" className={tabTriggerClass}>
            <Receipt className="h-4 w-4 shrink-0" strokeWidth={2} />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="password" className={tabTriggerClass}>
            <KeyRound className="h-4 w-4 shrink-0" strokeWidth={2} />
            Password reset
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <User className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">Profile details</CardTitle>
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
                <Separator className="sm:col-span-2" />
                <DetailField label="Staff">{clinic.staff}</DetailField>
                <DetailField label="Patients">{clinic.patients}</DetailField>
                <DetailField label="Status">
                  <span className="capitalize">{clinic.status}</span>
                </DetailField>
                <DetailField label="Package">{packageLabel(clinic.packagePlan)}</DetailField>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2 pt-6">
              <CreditCard className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              <CardTitle className="text-base font-semibold text-foreground">Subscription details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6 pt-0">
              <p className="text-sm text-muted-foreground">Current package and renewal timeline.</p>
              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                <DetailField label="Package">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white"
                    style={{ backgroundColor: COL_ACCENT }}
                  >
                    {packageLabel(clinic.packagePlan)}
                  </span>
                </DetailField>
                <DetailField label="Billing">Monthly</DetailField>
                <DetailField label="Subscribed since">{started}</DetailField>
                <DetailField label="Next renewal">{renewal}</DetailField>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Subscription data is mocked for this dashboard. Wire this tab to your billing API when ready.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

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
