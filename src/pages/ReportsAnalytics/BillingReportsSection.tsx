import { useMemo } from 'react'
import { AlertTriangle, FileWarning, Undo2, Receipt } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MetricCard } from './MetricCard'
import { cn } from '@/utils/cn'
import {
  failedPayments,
  outstandingInvoices,
  refunds,
  transactionLogs,
} from './reportsData'

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
}

function StatusPill({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={cn('font-medium', TONE_CLASSES[tone])}>
      {children}
    </Badge>
  )
}

const TH = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground'
const TD = 'px-4 py-3 text-sm text-card-foreground'

export function BillingReportsSection() {
  const failedTotal = useMemo(
    () => failedPayments.reduce((sum, r) => sum + r.amount, 0),
    []
  )
  const outstandingTotal = useMemo(
    () => outstandingInvoices.reduce((sum, r) => sum + r.amount, 0),
    []
  )
  const refundsTotal = useMemo(
    () => refunds.filter((r) => r.status === 'Processed').reduce((sum, r) => sum + r.amount, 0),
    []
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Failed Payments"
          value={formatUsd(failedTotal)}
          change={-2.4}
          changeLabel="vs last month"
          icon={AlertTriangle}
          index={0}
          invertedChange
        />
        <MetricCard
          title="Outstanding Invoices"
          value={formatUsd(outstandingTotal)}
          change={4.1}
          changeLabel="vs last month"
          icon={FileWarning}
          index={1}
          invertedChange
        />
        <MetricCard
          title="Refunds (Processed)"
          value={formatUsd(refundsTotal)}
          change={-1.2}
          changeLabel="vs last month"
          icon={Undo2}
          index={2}
          invertedChange
        />
        <MetricCard
          title="Transactions (Month)"
          value={`${transactionLogs.length}`}
          change={6.8}
          changeLabel="vs last month"
          icon={Receipt}
          index={3}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Failed Payments
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Recent declined or unsuccessful charges
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Clinic</th>
                    <th className={TH}>Amount</th>
                    <th className={TH}>Reason</th>
                    <th className={TH}>Attempts</th>
                    <th className={TH}>Attempted</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {failedPayments.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{row.id}</td>
                      <td className={cn(TD, 'font-medium')}>{row.clinic}</td>
                      <td className={TD}>{formatUsd(row.amount)}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{row.reason}</td>
                      <td className={TD}>{row.attempts}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{formatDate(row.attemptedAt)}</td>
                      <td className={TD}>
                        <StatusPill
                          tone={
                            row.status === 'Recovered'
                              ? 'success'
                              : row.status === 'Retrying'
                                ? 'warning'
                                : 'danger'
                          }
                        >
                          {row.status}
                        </StatusPill>
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
        transition={{ duration: 0.35, delay: 0.28 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Outstanding Invoices
            </CardTitle>
            <p className="text-sm text-muted-foreground">Unpaid invoices and overdue accounts</p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>Invoice</th>
                    <th className={TH}>Clinic</th>
                    <th className={TH}>Amount</th>
                    <th className={TH}>Due</th>
                    <th className={TH}>Overdue</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {outstandingInvoices.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{row.id}</td>
                      <td className={cn(TD, 'font-medium')}>{row.clinic}</td>
                      <td className={TD}>{formatUsd(row.amount)}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{formatDate(row.dueDate)}</td>
                      <td className={TD}>
                        {row.daysOverdue > 0 ? (
                          <span className="font-semibold text-rose-600">{row.daysOverdue}d</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className={TD}>
                        <StatusPill
                          tone={
                            row.status === 'Overdue'
                              ? 'danger'
                              : row.status === 'Pending'
                                ? 'warning'
                                : 'info'
                          }
                        >
                          {row.status}
                        </StatusPill>
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
        transition={{ duration: 0.35, delay: 0.34 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Refund Tracking
            </CardTitle>
            <p className="text-sm text-muted-foreground">Recent refunds across clinics</p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Clinic</th>
                    <th className={TH}>Amount</th>
                    <th className={TH}>Reason</th>
                    <th className={TH}>Date</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {refunds.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{row.id}</td>
                      <td className={cn(TD, 'font-medium')}>{row.clinic}</td>
                      <td className={TD}>{formatUsd(row.amount)}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{row.reason}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{formatDate(row.refundedAt)}</td>
                      <td className={TD}>
                        <StatusPill
                          tone={
                            row.status === 'Processed'
                              ? 'success'
                              : row.status === 'Pending'
                                ? 'warning'
                                : 'danger'
                          }
                        >
                          {row.status}
                        </StatusPill>
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
        transition={{ duration: 0.35, delay: 0.4 }}
      >
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-card-foreground">
              Transaction Logs
            </CardTitle>
            <p className="text-sm text-muted-foreground">Full ledger of recent transactions</p>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-y border-border bg-neutral-50">
                  <tr>
                    <th className={TH}>ID</th>
                    <th className={TH}>Clinic</th>
                    <th className={TH}>Type</th>
                    <th className={TH}>Method</th>
                    <th className={TH}>Amount</th>
                    <th className={TH}>Date</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactionLogs.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50">
                      <td className={cn(TD, 'font-mono text-xs text-muted-foreground')}>{row.id}</td>
                      <td className={cn(TD, 'font-medium')}>{row.clinic}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{row.type}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{row.method}</td>
                      <td className={TD}>{formatUsd(row.amount)}</td>
                      <td className={cn(TD, 'text-muted-foreground')}>{formatDate(row.date)}</td>
                      <td className={TD}>
                        <StatusPill
                          tone={
                            row.status === 'Paid'
                              ? 'success'
                              : row.status === 'Pending'
                                ? 'warning'
                                : row.status === 'Refunded'
                                  ? 'info'
                                  : 'danger'
                          }
                        >
                          {row.status}
                        </StatusPill>
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
