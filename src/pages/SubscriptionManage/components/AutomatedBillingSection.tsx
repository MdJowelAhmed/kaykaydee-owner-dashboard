import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RotateCw,
  ShieldOff,
  Clock,
  FileText,
  Repeat,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { toast } from 'sonner'
import {
  defaultBillingSettings,
  retryAttempts,
  autoInvoices,
  type BillingSettings,
  type RetryAttempt,
  type AutoInvoiceRow,
} from '../billingData'

const TH = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground'
const TD = 'px-4 py-3 text-sm text-card-foreground'

const RETRY_TONE: Record<RetryAttempt['status'], string> = {
  Scheduled: 'border-sky-200 bg-sky-50 text-sky-700',
  Retrying: 'border-amber-200 bg-amber-50 text-amber-700',
  Recovered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Failed: 'border-rose-200 bg-rose-50 text-rose-700',
}

const INVOICE_TONE: Record<AutoInvoiceRow['status'], string> = {
  Issued: 'border-sky-200 bg-sky-50 text-sky-700',
  Sent: 'border-violet-200 bg-violet-50 text-violet-700',
  Paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Overdue: 'border-rose-200 bg-rose-50 text-rose-700',
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AutomatedBillingSection() {
  const [settings, setSettings] = useState<BillingSettings>(defaultBillingSettings)

  const updateNumber = (key: keyof BillingSettings, value: string) => {
    const n = Math.max(0, Number(value) || 0)
    setSettings((prev) => ({ ...prev, [key]: n }))
  }

  const toggle = (key: keyof BillingSettings, next: boolean, label: string) => {
    setSettings((prev) => ({ ...prev, [key]: next }))
    toast.success(`${label} ${next ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Recurring billing" value={settings.recurringEnabled ? 'On' : 'Off'} helper={`${settings.retryAttempts} retries · ${settings.retryIntervalDays}d apart`} icon={Repeat} tint="bg-emerald-50 text-emerald-700" index={0} />
        <SummaryCard label="Grace period" value={`${settings.gracePeriodDays} days`} helper="Before suspension" icon={Clock} tint="bg-amber-50 text-amber-700" index={1} />
        <SummaryCard label="Active retries" value={retryAttempts.filter((r) => r.status === 'Scheduled' || r.status === 'Retrying').length.toString()} helper={`${retryAttempts.filter((r) => r.status === 'Failed').length} failed (terminal)`} icon={RotateCw} tint="bg-rose-50 text-rose-700" index={2} />
        <SummaryCard label="Invoices auto-generated" value={autoInvoices.length.toString()} helper="Last 30 days" icon={FileText} tint="bg-sky-50 text-sky-700" index={3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">Billing Rules</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure recurring billing, retries, grace periods, and auto-suspension
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <RuleRow
              icon={Repeat}
              title="Recurring billing"
              description="Automatically charge subscribers each cycle"
              checked={settings.recurringEnabled}
              onToggle={(v) => toggle('recurringEnabled', v, 'Recurring billing')}
            />
            <RuleRow
              icon={ShieldOff}
              title="Auto-suspend after failed retries"
              description="Suspend access after all retries are exhausted"
              checked={settings.autoSuspendOnFailure}
              onToggle={(v) => toggle('autoSuspendOnFailure', v, 'Auto-suspension')}
            />
            <RuleRow
              icon={FileText}
              title="Auto-generate invoices"
              description="Issue invoices on the first day of each cycle"
              checked={settings.autoInvoiceGeneration}
              onToggle={(v) => toggle('autoInvoiceGeneration', v, 'Auto-invoice generation')}
            />

            <div className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="retry-attempts" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Retry attempts
                </Label>
                <Input
                  id="retry-attempts"
                  type="number"
                  min={1}
                  max={10}
                  value={settings.retryAttempts}
                  onChange={(e) => updateNumber('retryAttempts', e.target.value)}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">Max retries per invoice</p>
              </div>
              <div>
                <Label htmlFor="retry-interval" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Retry interval (days)
                </Label>
                <Input
                  id="retry-interval"
                  type="number"
                  min={1}
                  max={30}
                  value={settings.retryIntervalDays}
                  onChange={(e) => updateNumber('retryIntervalDays', e.target.value)}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">Days between attempts</p>
              </div>
              <div>
                <Label htmlFor="grace-days" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Grace period (days)
                </Label>
                <Input
                  id="grace-days"
                  type="number"
                  min={0}
                  max={30}
                  value={settings.gracePeriodDays}
                  onChange={(e) => updateNumber('gracePeriodDays', e.target.value)}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">Until suspension</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.28 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">Failed Payment Retries</CardTitle>
            <p className="text-sm text-muted-foreground">
              Active retry queue and recent outcomes
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>Clinic</th>
                    <th className={TH}>Invoice</th>
                    <th className={TH}>Amount</th>
                    <th className={TH}>Attempt</th>
                    <th className={TH}>Reason</th>
                    <th className={TH}>Next retry</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {retryAttempts.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-medium')}>{row.clinic}</td>
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>
                        {row.invoiceRef}
                      </td>
                      <td className={TD}>{formatUsd(row.amount)}</td>
                      <td className={TD}>
                        {row.attempt} of {row.maxAttempts}
                      </td>
                      <td className={cn(TD, 'text-muted-foreground')}>{row.reason}</td>
                      <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                        {formatDateTime(row.nextRetryAt)}
                      </td>
                      <td className={TD}>
                        <Badge variant="outline" className={cn('font-medium', RETRY_TONE[row.status])}>
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.34 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">Auto-generated Invoices</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest invoices issued by the recurring billing job
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>Invoice</th>
                    <th className={TH}>Clinic</th>
                    <th className={TH}>Amount</th>
                    <th className={TH}>Cycle</th>
                    <th className={TH}>Generated</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {autoInvoices.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{row.ref}</td>
                      <td className={cn(TD, 'font-medium')}>{row.clinic}</td>
                      <td className={TD}>{formatUsd(row.amount)}</td>
                      <td className={cn(TD, 'capitalize text-muted-foreground')}>{row.cycle}</td>
                      <td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
                        {formatDateTime(row.generatedAt)}
                      </td>
                      <td className={TD}>
                        <Badge variant="outline" className={cn('font-medium', INVOICE_TONE[row.status])}>
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function RuleRow({
  icon: Icon,
  title,
  description,
  checked,
  onToggle,
}: {
  icon: React.ElementType
  title: string
  description: string
  checked: boolean
  onToggle: (next: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-card-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  )
}

function SummaryCard({
  label,
  value,
  helper,
  icon: Icon,
  tint,
  index,
}: {
  label: string
  value: string
  helper?: string
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
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </motion.div>
  )
}
