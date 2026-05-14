export type TierKey = 'basic' | 'advanced' | 'premium' | 'enterprise'

export type TierStatus = 'active' | 'future'

export interface TierFeature {
  label: string
  included: boolean
}

export interface SubscriptionTier {
  key: TierKey
  name: string
  tagline: string
  status: TierStatus
  monthlyPrice: number
  annualPrice: number
  trialDays: number
  subscribers: number
  highlights: TierFeature[]
  whiteLabel: boolean
}

export interface BillingSettings {
  recurringEnabled: boolean
  retryAttempts: number
  retryIntervalDays: number
  gracePeriodDays: number
  autoSuspendOnFailure: boolean
  autoInvoiceGeneration: boolean
  invoicePrefix: string
}

export interface RetryAttempt {
  id: string
  clinic: string
  invoiceRef: string
  amount: number
  attempt: number
  maxAttempts: number
  nextRetryAt: string
  reason: string
  status: 'Scheduled' | 'Retrying' | 'Recovered' | 'Failed'
}

export interface AutoInvoiceRow {
  id: string
  ref: string
  clinic: string
  amount: number
  cycle: 'monthly' | 'annual'
  generatedAt: string
  status: 'Issued' | 'Sent' | 'Paid' | 'Overdue'
}

export interface BrandingRequest {
  id: string
  clinic: string
  plan: 'Premium' | 'Enterprise'
  submittedBy: string
  logoUrl: string
  primaryColor: string
  submittedAt: string
  status: 'Pending Review' | 'Approved' | 'Rejected'
  reviewer: string | null
}

export interface WhiteLabelClinic {
  id: string
  clinic: string
  plan: 'Premium' | 'Enterprise'
  enabled: boolean
  domain: string
  primaryColor: string
  lastDeployedAt: string | null
}

export const tiers: SubscriptionTier[] = [
  {
    key: 'basic',
    name: 'Basic',
    tagline: 'Solo practitioners getting started',
    status: 'active',
    monthlyPrice: 49,
    annualPrice: 470,
    trialDays: 14,
    subscribers: 184,
    whiteLabel: false,
    highlights: [
      { label: 'Up to 3 clinicians', included: true },
      { label: 'Patient management', included: true },
      { label: 'Appointment scheduling', included: true },
      { label: 'AI summarization (limited)', included: true },
      { label: 'Voice dictation', included: false },
      { label: 'White-label branding', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    key: 'advanced',
    name: 'Advanced',
    tagline: 'Growing clinics with multiple seats',
    status: 'active',
    monthlyPrice: 149,
    annualPrice: 1430,
    trialDays: 14,
    subscribers: 312,
    whiteLabel: false,
    highlights: [
      { label: 'Up to 15 clinicians', included: true },
      { label: 'Patient management', included: true },
      { label: 'Appointment scheduling', included: true },
      { label: 'AI summarization (full)', included: true },
      { label: 'Voice dictation', included: true },
      { label: 'White-label branding', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    tagline: 'Multi-location practices with branding',
    status: 'active',
    monthlyPrice: 349,
    annualPrice: 3349,
    trialDays: 30,
    subscribers: 96,
    whiteLabel: true,
    highlights: [
      { label: 'Unlimited clinicians', included: true },
      { label: 'Patient management', included: true },
      { label: 'Appointment scheduling', included: true },
      { label: 'AI summarization (full)', included: true },
      { label: 'Voice dictation', included: true },
      { label: 'White-label branding', included: true },
      { label: 'Priority support', included: true },
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    tagline: 'Health systems & networks (coming soon)',
    status: 'future',
    monthlyPrice: 0,
    annualPrice: 0,
    trialDays: 60,
    subscribers: 0,
    whiteLabel: true,
    highlights: [
      { label: 'Unlimited clinicians', included: true },
      { label: 'Patient management', included: true },
      { label: 'Appointment scheduling', included: true },
      { label: 'AI summarization (custom limits)', included: true },
      { label: 'Voice dictation', included: true },
      { label: 'White-label branding', included: true },
      { label: 'Priority support & dedicated CSM', included: true },
      { label: 'On-prem / private cloud option', included: true },
    ],
  },
]

export const defaultBillingSettings: BillingSettings = {
  recurringEnabled: true,
  retryAttempts: 3,
  retryIntervalDays: 3,
  gracePeriodDays: 7,
  autoSuspendOnFailure: true,
  autoInvoiceGeneration: true,
  invoicePrefix: 'INV-',
}

export const retryAttempts: RetryAttempt[] = [
  {
    id: 'RT-4401',
    clinic: 'Bayview Family Clinic',
    invoiceRef: 'INV-20821',
    amount: 499,
    attempt: 2,
    maxAttempts: 3,
    nextRetryAt: '2026-05-15T09:00:00Z',
    reason: 'Insufficient funds',
    status: 'Scheduled',
  },
  {
    id: 'RT-4402',
    clinic: 'Northside Dental',
    invoiceRef: 'INV-20822',
    amount: 199,
    attempt: 3,
    maxAttempts: 3,
    nextRetryAt: '2026-05-14T11:00:00Z',
    reason: 'Card expired',
    status: 'Retrying',
  },
  {
    id: 'RT-4403',
    clinic: 'Sunrise Pediatrics',
    invoiceRef: 'INV-20823',
    amount: 299,
    attempt: 1,
    maxAttempts: 3,
    nextRetryAt: '2026-05-13T20:00:00Z',
    reason: 'Bank decline',
    status: 'Recovered',
  },
  {
    id: 'RT-4404',
    clinic: 'Hillcrest Vision',
    invoiceRef: 'INV-20825',
    amount: 149,
    attempt: 3,
    maxAttempts: 3,
    nextRetryAt: '2026-05-12T08:00:00Z',
    reason: 'Insufficient funds',
    status: 'Failed',
  },
]

export const autoInvoices: AutoInvoiceRow[] = [
  {
    id: 'AI-77001',
    ref: 'INV-30021',
    clinic: 'Bayview Family Clinic',
    amount: 349,
    cycle: 'monthly',
    generatedAt: '2026-05-13T02:00:00Z',
    status: 'Sent',
  },
  {
    id: 'AI-77002',
    ref: 'INV-30022',
    clinic: 'Northside Dental',
    amount: 149,
    cycle: 'monthly',
    generatedAt: '2026-05-13T02:00:00Z',
    status: 'Paid',
  },
  {
    id: 'AI-77003',
    ref: 'INV-30023',
    clinic: 'Maplewood Dermatology',
    amount: 1430,
    cycle: 'annual',
    generatedAt: '2026-05-12T02:00:00Z',
    status: 'Issued',
  },
  {
    id: 'AI-77004',
    ref: 'INV-30024',
    clinic: 'Cedar Hill Clinic',
    amount: 49,
    cycle: 'monthly',
    generatedAt: '2026-05-11T02:00:00Z',
    status: 'Overdue',
  },
  {
    id: 'AI-77005',
    ref: 'INV-30025',
    clinic: 'Riverstone Cardiology',
    amount: 3349,
    cycle: 'annual',
    generatedAt: '2026-05-10T02:00:00Z',
    status: 'Paid',
  },
]

export const brandingRequests: BrandingRequest[] = [
  {
    id: 'BR-9001',
    clinic: 'Bayview Family Clinic',
    plan: 'Premium',
    submittedBy: 'Sarah Chen',
    logoUrl: 'https://placehold.co/96x96/14b8a6/ffffff?text=B',
    primaryColor: '#14b8a6',
    submittedAt: '2026-05-12T14:20:00Z',
    status: 'Pending Review',
    reviewer: null,
  },
  {
    id: 'BR-9002',
    clinic: 'Riverstone Cardiology',
    plan: 'Premium',
    submittedBy: 'Dr. M. Patel',
    logoUrl: 'https://placehold.co/96x96/7946CD/ffffff?text=R',
    primaryColor: '#7946CD',
    submittedAt: '2026-05-10T10:05:00Z',
    status: 'Approved',
    reviewer: 'Michael Ross',
  },
  {
    id: 'BR-9003',
    clinic: 'Maplewood Dermatology',
    plan: 'Premium',
    submittedBy: 'Dr. Emily Rodriguez',
    logoUrl: 'https://placehold.co/96x96/E055FA/ffffff?text=M',
    primaryColor: '#E055FA',
    submittedAt: '2026-05-08T16:45:00Z',
    status: 'Rejected',
    reviewer: 'Michael Ross',
  },
  {
    id: 'BR-9004',
    clinic: 'Hillcrest Vision',
    plan: 'Premium',
    submittedBy: 'James Wilson',
    logoUrl: 'https://placehold.co/96x96/f59e0b/ffffff?text=H',
    primaryColor: '#f59e0b',
    submittedAt: '2026-05-13T09:30:00Z',
    status: 'Pending Review',
    reviewer: null,
  },
]

export const whiteLabelClinics: WhiteLabelClinic[] = [
  {
    id: 'WL-1',
    clinic: 'Riverstone Cardiology',
    plan: 'Premium',
    enabled: true,
    domain: 'care.riverstone.health',
    primaryColor: '#7946CD',
    lastDeployedAt: '2026-05-11T08:30:00Z',
  },
  {
    id: 'WL-2',
    clinic: 'Bayview Family Clinic',
    plan: 'Premium',
    enabled: false,
    domain: 'portal.bayview.health',
    primaryColor: '#14b8a6',
    lastDeployedAt: null,
  },
  {
    id: 'WL-3',
    clinic: 'Maplewood Dermatology',
    plan: 'Premium',
    enabled: false,
    domain: 'app.maplewoodderm.com',
    primaryColor: '#E055FA',
    lastDeployedAt: null,
  },
  {
    id: 'WL-4',
    clinic: 'Westend Wellness',
    plan: 'Premium',
    enabled: true,
    domain: 'portal.westend.com',
    primaryColor: '#26578C',
    lastDeployedAt: '2026-04-28T11:00:00Z',
  },
]
