const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export type RevenueTrendRow = {
  month: string
  mrr: number
  arr: number
}

export type TierRevenueRow = {
  tier: string
  revenue: number
  share: number
  color: string
}

export type RegionRevenueRow = {
  region: string
  country: string
  clinics: number
  revenue: number
}

export type CustomerMetricTrendRow = {
  month: string
  churn: number
  ltv: number
  cac: number
  arpc: number
}

export type FailedPaymentRow = {
  id: string
  clinic: string
  amount: number
  reason: string
  attemptedAt: string
  attempts: number
  status: 'Retrying' | 'Failed' | 'Recovered'
}

export type OutstandingInvoiceRow = {
  id: string
  clinic: string
  amount: number
  dueDate: string
  daysOverdue: number
  status: 'Pending' | 'Overdue' | 'Sent'
}

export type RefundRow = {
  id: string
  clinic: string
  amount: number
  reason: string
  refundedAt: string
  status: 'Processed' | 'Pending' | 'Rejected'
}

export type TransactionLogRow = {
  id: string
  clinic: string
  type: 'Subscription' | 'One-time' | 'Refund' | 'Failed'
  amount: number
  method: 'Card' | 'ACH' | 'Wire'
  status: 'Paid' | 'Refunded' | 'Pending' | 'Failed'
  date: string
}

const REVENUE_MRR: readonly number[] = [
  18500, 21200, 24800, 27600, 30100, 33400, 36900, 39800, 42600, 45900, 48800, 52400,
]

export const revenueTrend: RevenueTrendRow[] = MONTHS.map((month, i) => ({
  month,
  mrr: REVENUE_MRR[i] ?? 0,
  arr: (REVENUE_MRR[i] ?? 0) * 12,
}))

export const currentMrr = REVENUE_MRR[REVENUE_MRR.length - 1] ?? 0
export const previousMrr = REVENUE_MRR[REVENUE_MRR.length - 2] ?? 0
export const currentArr = currentMrr * 12
export const previousArr = previousMrr * 12

export const revenueByTier: TierRevenueRow[] = [
  { tier: 'Enterprise', revenue: 24800, share: 47, color: '#14b8a6' },
  { tier: 'Professional', revenue: 17400, share: 33, color: '#7946CD' },
  { tier: 'Basic', revenue: 10200, share: 20, color: '#E055FA' },
]

export const revenueByRegion: RegionRevenueRow[] = [
  { region: 'California', country: 'USA', clinics: 28, revenue: 14200 },
  { region: 'Texas', country: 'USA', clinics: 19, revenue: 9800 },
  { region: 'New York', country: 'USA', clinics: 17, revenue: 8600 },
  { region: 'Florida', country: 'USA', clinics: 14, revenue: 6900 },
  { region: 'Ontario', country: 'Canada', clinics: 11, revenue: 5400 },
  { region: 'Greater London', country: 'UK', clinics: 9, revenue: 4700 },
  { region: 'New South Wales', country: 'Australia', clinics: 7, revenue: 2800 },
]

export const customerMetricsTrend: CustomerMetricTrendRow[] = MONTHS.map((month, i) => ({
  month,
  churn: Math.max(0.5, 3.6 - i * 0.18),
  ltv: 4200 + i * 180,
  cac: 720 - i * 18,
  arpc: 380 + i * 14,
}))

export const failedPayments: FailedPaymentRow[] = [
  {
    id: 'FP-10421',
    clinic: 'Bayview Family Clinic',
    amount: 499,
    reason: 'Insufficient funds',
    attemptedAt: '2026-05-12',
    attempts: 2,
    status: 'Retrying',
  },
  {
    id: 'FP-10422',
    clinic: 'Northside Dental',
    amount: 199,
    reason: 'Card expired',
    attemptedAt: '2026-05-11',
    attempts: 3,
    status: 'Failed',
  },
  {
    id: 'FP-10423',
    clinic: 'Sunrise Pediatrics',
    amount: 299,
    reason: 'Bank decline',
    attemptedAt: '2026-05-10',
    attempts: 1,
    status: 'Retrying',
  },
  {
    id: 'FP-10424',
    clinic: 'Westend Wellness',
    amount: 899,
    reason: 'Authentication required',
    attemptedAt: '2026-05-09',
    attempts: 2,
    status: 'Recovered',
  },
  {
    id: 'FP-10425',
    clinic: 'Hillcrest Vision',
    amount: 149,
    reason: 'Insufficient funds',
    attemptedAt: '2026-05-08',
    attempts: 3,
    status: 'Failed',
  },
]

export const outstandingInvoices: OutstandingInvoiceRow[] = [
  {
    id: 'INV-20821',
    clinic: 'Lakeside Medical',
    amount: 1299,
    dueDate: '2026-05-01',
    daysOverdue: 13,
    status: 'Overdue',
  },
  {
    id: 'INV-20822',
    clinic: 'Brookline Orthodontics',
    amount: 599,
    dueDate: '2026-05-10',
    daysOverdue: 4,
    status: 'Overdue',
  },
  {
    id: 'INV-20823',
    clinic: 'Greenfield Health',
    amount: 899,
    dueDate: '2026-05-20',
    daysOverdue: 0,
    status: 'Sent',
  },
  {
    id: 'INV-20824',
    clinic: 'Pinecrest Physiotherapy',
    amount: 349,
    dueDate: '2026-05-22',
    daysOverdue: 0,
    status: 'Pending',
  },
  {
    id: 'INV-20825',
    clinic: 'Riverstone Cardiology',
    amount: 1899,
    dueDate: '2026-04-28',
    daysOverdue: 16,
    status: 'Overdue',
  },
]

export const refunds: RefundRow[] = [
  {
    id: 'RF-50021',
    clinic: 'Maplewood Dermatology',
    amount: 199,
    reason: 'Duplicate charge',
    refundedAt: '2026-05-12',
    status: 'Processed',
  },
  {
    id: 'RF-50022',
    clinic: 'Cedar Hill Clinic',
    amount: 499,
    reason: 'Plan downgrade',
    refundedAt: '2026-05-09',
    status: 'Processed',
  },
  {
    id: 'RF-50023',
    clinic: 'Harborview ENT',
    amount: 89,
    reason: 'Service issue',
    refundedAt: '2026-05-07',
    status: 'Pending',
  },
  {
    id: 'RF-50024',
    clinic: 'Summit Sports Medicine',
    amount: 299,
    reason: 'Trial refund',
    refundedAt: '2026-05-05',
    status: 'Processed',
  },
  {
    id: 'RF-50025',
    clinic: 'Glenwood Family Health',
    amount: 149,
    reason: 'Billing error',
    refundedAt: '2026-05-03',
    status: 'Rejected',
  },
]

export const transactionLogs: TransactionLogRow[] = [
  {
    id: 'TX-91102',
    clinic: 'Bayview Family Clinic',
    type: 'Subscription',
    amount: 499,
    method: 'Card',
    status: 'Paid',
    date: '2026-05-13',
  },
  {
    id: 'TX-91103',
    clinic: 'Northside Dental',
    type: 'Subscription',
    amount: 199,
    method: 'Card',
    status: 'Failed',
    date: '2026-05-13',
  },
  {
    id: 'TX-91104',
    clinic: 'Maplewood Dermatology',
    type: 'Refund',
    amount: 199,
    method: 'Card',
    status: 'Refunded',
    date: '2026-05-12',
  },
  {
    id: 'TX-91105',
    clinic: 'Greenfield Health',
    type: 'One-time',
    amount: 89,
    method: 'ACH',
    status: 'Paid',
    date: '2026-05-12',
  },
  {
    id: 'TX-91106',
    clinic: 'Sunrise Pediatrics',
    type: 'Subscription',
    amount: 299,
    method: 'Card',
    status: 'Pending',
    date: '2026-05-11',
  },
  {
    id: 'TX-91107',
    clinic: 'Riverstone Cardiology',
    type: 'Subscription',
    amount: 1899,
    method: 'Wire',
    status: 'Paid',
    date: '2026-05-11',
  },
  {
    id: 'TX-91108',
    clinic: 'Cedar Hill Clinic',
    type: 'Refund',
    amount: 499,
    method: 'Card',
    status: 'Refunded',
    date: '2026-05-09',
  },
  {
    id: 'TX-91109',
    clinic: 'Westend Wellness',
    type: 'Subscription',
    amount: 899,
    method: 'Card',
    status: 'Paid',
    date: '2026-05-09',
  },
]

export const reportsYears = ['2026', '2025', '2024'] as const
