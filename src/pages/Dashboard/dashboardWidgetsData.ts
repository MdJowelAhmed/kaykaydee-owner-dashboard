export type ActivityKind =
  | 'clinic_onboarded'
  | 'subscription_upgraded'
  | 'failed_payment'
  | 'ai_spike'
  | 'support_ticket'

export interface ActivityEvent {
  id: string
  kind: ActivityKind
  title: string
  detail: string
  clinic: string
  amount?: number
  timestamp: string
}

export interface OutstandingInvoiceLite {
  ref: string
  clinic: string
  amount: number
  daysOverdue: number
}

export interface ChurnRiskRow {
  clinic: string
  plan: 'Basic' | 'Advanced' | 'Premium'
  reason: string
  riskScore: number
}

export interface FailedPaymentLite {
  ref: string
  clinic: string
  amount: number
  reason: string
}

export interface AITopClinic {
  clinic: string
  plan: 'Basic' | 'Advanced' | 'Premium' | 'Enterprise'
  weeklyRequests: number
  share: number
}

export type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance'

export interface SystemService {
  id: string
  name: string
  description: string
  status: ServiceStatus
  uptimeWindowPct: number
  latencyMs: number | null
  region: string
}

export interface ErrorLogRow {
  id: string
  service: string
  message: string
  severity: 'Info' | 'Warning' | 'Error' | 'Fatal'
  occurredAt: string
  occurrences: number
}

export const liveActivity: ActivityEvent[] = [
  {
    id: 'EV-1',
    kind: 'clinic_onboarded',
    title: 'New clinic onboarded',
    detail: 'Westmount Family Care joined on the Advanced plan',
    clinic: 'Westmount Family Care',
    timestamp: '2026-05-14T08:42:00Z',
  },
  {
    id: 'EV-2',
    kind: 'subscription_upgraded',
    title: 'Subscription upgraded',
    detail: 'Bayview Family Clinic upgraded from Advanced → Premium',
    clinic: 'Bayview Family Clinic',
    amount: 349,
    timestamp: '2026-05-14T08:31:00Z',
  },
  {
    id: 'EV-3',
    kind: 'failed_payment',
    title: 'Failed payment',
    detail: 'Hillcrest Vision · Visa •••• 4521 declined (insufficient funds)',
    clinic: 'Hillcrest Vision',
    amount: 149,
    timestamp: '2026-05-14T08:20:00Z',
  },
  {
    id: 'EV-4',
    kind: 'ai_spike',
    title: 'AI usage spike',
    detail: 'Riverstone Cardiology +312% above hourly baseline',
    clinic: 'Riverstone Cardiology',
    timestamp: '2026-05-14T08:08:00Z',
  },
  {
    id: 'EV-5',
    kind: 'support_ticket',
    title: 'New support ticket',
    detail: 'TKT-1052 · "Cannot upload patient documents" · High priority',
    clinic: 'Sunrise Pediatrics',
    timestamp: '2026-05-14T07:55:00Z',
  },
  {
    id: 'EV-6',
    kind: 'subscription_upgraded',
    title: 'Annual switch',
    detail: 'Northside Dental moved from monthly to annual Advanced',
    clinic: 'Northside Dental',
    amount: 1430,
    timestamp: '2026-05-14T07:40:00Z',
  },
  {
    id: 'EV-7',
    kind: 'support_ticket',
    title: 'Bug report filed',
    detail: 'BUG-7401 · Add Staff form 500 — Critical',
    clinic: 'Westend Wellness',
    timestamp: '2026-05-14T07:14:00Z',
  },
  {
    id: 'EV-8',
    kind: 'clinic_onboarded',
    title: 'New clinic onboarded',
    detail: 'Harborline Wellness joined on the Basic plan',
    clinic: 'Harborline Wellness',
    timestamp: '2026-05-14T06:50:00Z',
  },
]

export const financialSnapshot = {
  revenueToday: 8420,
  revenueTodayChangePct: 12.4,
  revenueMonth: 142_300,
  revenueMonthChangePct: 8.1,
  outstandingTotal: 12_440,
  outstandingCount: 7,
  failedPaymentsTotal: 2_995,
  failedPaymentsCount: 5,
  churnRiskCount: 4,
  churnRiskValue: 11_980,
}

export const outstandingInvoicesLite: OutstandingInvoiceLite[] = [
  { ref: 'INV-20821', clinic: 'Lakeside Medical', amount: 1299, daysOverdue: 13 },
  { ref: 'INV-20825', clinic: 'Riverstone Cardiology', amount: 1899, daysOverdue: 16 },
  { ref: 'INV-20822', clinic: 'Brookline Orthodontics', amount: 599, daysOverdue: 4 },
  { ref: 'INV-20824', clinic: 'Pinecrest Physiotherapy', amount: 349, daysOverdue: 0 },
]

export const churnRiskRows: ChurnRiskRow[] = [
  { clinic: 'Cedar Hill Clinic', plan: 'Basic', reason: '3 failed payments · low AI adoption', riskScore: 82 },
  { clinic: 'Hillcrest Vision', plan: 'Basic', reason: 'Card expired · no logins in 14 days', riskScore: 71 },
  { clinic: 'Westend Wellness', plan: 'Premium', reason: 'Open critical bug · CSAT 3.9', riskScore: 64 },
  { clinic: 'Greenfield Health', plan: 'Advanced', reason: 'Refund request open · downgrade signal', riskScore: 58 },
]

export const recentFailedPayments: FailedPaymentLite[] = [
  { ref: 'FP-10421', clinic: 'Bayview Family Clinic', amount: 499, reason: 'Insufficient funds' },
  { ref: 'FP-10422', clinic: 'Northside Dental', amount: 199, reason: 'Card expired' },
  { ref: 'FP-10425', clinic: 'Hillcrest Vision', amount: 149, reason: 'Insufficient funds' },
]

export const aiUsageSnapshot = {
  totalRequestsMonth: 318_000,
  requestsChangePct: 13.2,
  dictationMinutes: 24_800,
  dictationChangePct: 9.8,
  costMonth: 5_720,
  costChangePct: 11.4,
  revenueAttributedMonth: 142_300,
}

export const aiTopClinics: AITopClinic[] = [
  { clinic: 'Bayview Family Clinic', plan: 'Enterprise', weeklyRequests: 8200, share: 28 },
  { clinic: 'Riverstone Cardiology', plan: 'Enterprise', weeklyRequests: 6900, share: 23 },
  { clinic: 'Westend Wellness', plan: 'Premium', weeklyRequests: 2105, share: 7 },
  { clinic: 'Northside Dental', plan: 'Advanced', weeklyRequests: 1980, share: 7 },
  { clinic: 'Maplewood Dermatology', plan: 'Advanced', weeklyRequests: 1640, share: 6 },
]

export const systemServices: SystemService[] = [
  {
    id: 'api',
    name: 'Core API',
    description: 'REST + GraphQL gateway',
    status: 'operational',
    uptimeWindowPct: 99.98,
    latencyMs: 142,
    region: 'us-east-1',
  },
  {
    id: 'web',
    name: 'Web App',
    description: 'Owner dashboard and clinic portal',
    status: 'operational',
    uptimeWindowPct: 99.99,
    latencyMs: 280,
    region: 'global',
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    description: 'iOS + Android clinician apps',
    status: 'degraded',
    uptimeWindowPct: 99.74,
    latencyMs: 410,
    region: 'global',
  },
  {
    id: 'db',
    name: 'Primary Database',
    description: 'Postgres cluster (write + read replicas)',
    status: 'operational',
    uptimeWindowPct: 99.999,
    latencyMs: 18,
    region: 'us-east-1',
  },
  {
    id: 'ai',
    name: 'AI Inference',
    description: 'Hosted model serving',
    status: 'operational',
    uptimeWindowPct: 99.92,
    latencyMs: 1620,
    region: 'multi',
  },
  {
    id: 'jobs',
    name: 'Billing Jobs',
    description: 'Nightly invoice + retry workers',
    status: 'maintenance',
    uptimeWindowPct: 99.6,
    latencyMs: null,
    region: 'us-east-1',
  },
]

export const errorLogs: ErrorLogRow[] = [
  {
    id: 'ERR-9001',
    service: 'Mobile App',
    message: 'OutOfMemory on dashboard load — iOS 15 devices',
    severity: 'Error',
    occurredAt: '2026-05-14T07:42:00Z',
    occurrences: 22,
  },
  {
    id: 'ERR-9002',
    service: 'Core API',
    message: 'Stripe webhook timeout (10s) — invoice.payment_failed',
    severity: 'Warning',
    occurredAt: '2026-05-14T06:18:00Z',
    occurrences: 5,
  },
  {
    id: 'ERR-9003',
    service: 'AI Inference',
    message: 'Token budget exceeded for clinic CL-008 — request throttled',
    severity: 'Info',
    occurredAt: '2026-05-14T05:55:00Z',
    occurrences: 3,
  },
  {
    id: 'ERR-9004',
    service: 'Billing Jobs',
    message: 'Retry worker partial failure — 2 invoices not re-attempted',
    severity: 'Error',
    occurredAt: '2026-05-14T02:40:00Z',
    occurrences: 1,
  },
]
