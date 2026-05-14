export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export type Tier = 'Basic' | 'Professional' | 'Enterprise'

export type AIUsageMonthRow = {
  month: string
  requests: number
  tokens: number
  cost: number
}

export type AIFeatureUsageRow = {
  feature: string
  description: string
  requests: number
  share: number
  avgLatencyMs: number
}

export type AITierLimitRow = {
  tier: Tier
  monthlyRequests: number
  tokenCeiling: number
  usedRequests: number
  features: string[]
}

export type AIPromptRow = {
  id: string
  name: string
  feature: string
  version: string
  owner: string
  status: 'Draft' | 'Active' | 'Deprecated'
  lastEdited: string
}

export type ModerationSeverity = 'Low' | 'Medium' | 'High'

export type AIModerationFlag = {
  id: string
  feature: string
  category: 'PHI Leak' | 'Hallucination' | 'Toxic Output' | 'Off-topic' | 'Bias'
  clinic: string
  user: string
  severity: ModerationSeverity
  flaggedAt: string
  status: 'Pending Review' | 'Resolved' | 'Escalated'
}

export type AIAdoptionRow = {
  clinic: string
  plan: Tier
  activeUsers: number
  totalUsers: number
  weeklyRequests: number
}

export type AINoteAuditRow = {
  id: string
  clinic: string
  clinician: string
  patientRef: string
  feature: string
  reviewedBy: string | null
  acceptedTokens: number
  editedTokens: number
  reviewedAt: string | null
  status: 'Pending Review' | 'Accepted' | 'Edited' | 'Rejected'
}

export type ComplianceLogRow = {
  id: string
  event: string
  actor: string
  context: string
  timestamp: string
  severity: 'Info' | 'Warning' | 'Critical'
}

export type AIOverrideRule = {
  id: string
  scope: string
  description: string
  state: 'on' | 'off'
  updatedBy: string
  updatedAt: string
}

const USAGE_REQUESTS: readonly number[] = [
  42000, 58000, 71000, 89000, 108000, 132000, 161000, 184000, 212000, 246000, 281000, 318000,
]

export const usageTrend: AIUsageMonthRow[] = MONTHS.map((month, i) => ({
  month,
  requests: USAGE_REQUESTS[i] ?? 0,
  tokens: (USAGE_REQUESTS[i] ?? 0) * 480,
  cost: (USAGE_REQUESTS[i] ?? 0) * 0.018,
}))

export const featureUsage: AIFeatureUsageRow[] = [
  {
    feature: 'Clinical Note Summarization',
    description: 'Generates SOAP-format summaries from raw notes',
    requests: 118400,
    share: 37,
    avgLatencyMs: 1620,
  },
  {
    feature: 'Voice Dictation',
    description: 'Transcribes clinician voice into structured text',
    requests: 92200,
    share: 29,
    avgLatencyMs: 880,
  },
  {
    feature: 'Patient Q&A Assist',
    description: 'Answers clinician questions about patient history',
    requests: 51800,
    share: 16,
    avgLatencyMs: 1450,
  },
  {
    feature: 'Billing Code Suggestion',
    description: 'Recommends CPT/ICD codes from clinical context',
    requests: 33100,
    share: 10,
    avgLatencyMs: 720,
  },
  {
    feature: 'Auto-translation',
    description: 'Translates patient communications across 24 languages',
    requests: 22500,
    share: 8,
    avgLatencyMs: 540,
  },
]

export const tierLimits: AITierLimitRow[] = [
  {
    tier: 'Basic',
    monthlyRequests: 200,
    tokenCeiling: 100_000,
    usedRequests: 158,
    features: ['Summarization', 'Translation'],
  },
  {
    tier: 'Professional',
    monthlyRequests: 2_000,
    tokenCeiling: 1_500_000,
    usedRequests: 1_420,
    features: ['Summarization', 'Voice Dictation', 'Translation', 'Q&A Assist'],
  },
  {
    tier: 'Enterprise',
    monthlyRequests: 25_000,
    tokenCeiling: 20_000_000,
    usedRequests: 18_900,
    features: ['All features', 'Custom prompts', 'Priority routing'],
  },
]

export const prompts: AIPromptRow[] = [
  {
    id: 'PR-2101',
    name: 'soap_summary_v3',
    feature: 'Clinical Note Summarization',
    version: '3.2.1',
    owner: 'Dr. Amelia Park',
    status: 'Active',
    lastEdited: '2026-05-09T11:24:00Z',
  },
  {
    id: 'PR-2102',
    name: 'dictation_normalizer_v2',
    feature: 'Voice Dictation',
    version: '2.5.0',
    owner: 'AI Platform Team',
    status: 'Active',
    lastEdited: '2026-05-04T15:10:00Z',
  },
  {
    id: 'PR-2103',
    name: 'cpt_code_recommender',
    feature: 'Billing Code Suggestion',
    version: '1.8.3',
    owner: 'Finance Engineering',
    status: 'Active',
    lastEdited: '2026-04-28T09:48:00Z',
  },
  {
    id: 'PR-2104',
    name: 'patient_translation_pro',
    feature: 'Auto-translation',
    version: '4.0.0',
    owner: 'Localization Team',
    status: 'Draft',
    lastEdited: '2026-05-12T17:55:00Z',
  },
  {
    id: 'PR-2105',
    name: 'soap_summary_v2',
    feature: 'Clinical Note Summarization',
    version: '2.4.5',
    owner: 'Dr. Amelia Park',
    status: 'Deprecated',
    lastEdited: '2026-02-18T08:30:00Z',
  },
]

export const moderationFlags: AIModerationFlag[] = [
  {
    id: 'MF-5501',
    feature: 'Clinical Note Summarization',
    category: 'PHI Leak',
    clinic: 'Westend Wellness',
    user: 'Dr. David Okonkwo',
    severity: 'High',
    flaggedAt: '2026-05-13T10:22:00Z',
    status: 'Escalated',
  },
  {
    id: 'MF-5502',
    feature: 'Voice Dictation',
    category: 'Hallucination',
    clinic: 'Bayview Family Clinic',
    user: 'Dr. Sarah Chen',
    severity: 'Medium',
    flaggedAt: '2026-05-12T14:42:00Z',
    status: 'Pending Review',
  },
  {
    id: 'MF-5503',
    feature: 'Patient Q&A Assist',
    category: 'Off-topic',
    clinic: 'Sunrise Pediatrics',
    user: 'Dr. Priya Patel',
    severity: 'Low',
    flaggedAt: '2026-05-12T11:18:00Z',
    status: 'Resolved',
  },
  {
    id: 'MF-5504',
    feature: 'Billing Code Suggestion',
    category: 'Bias',
    clinic: 'Greenfield Health',
    user: 'James Wilson',
    severity: 'Medium',
    flaggedAt: '2026-05-11T09:50:00Z',
    status: 'Pending Review',
  },
  {
    id: 'MF-5505',
    feature: 'Clinical Note Summarization',
    category: 'Toxic Output',
    clinic: 'Cedar Hill Clinic',
    user: 'Dr. K. Lee',
    severity: 'High',
    flaggedAt: '2026-05-10T17:05:00Z',
    status: 'Escalated',
  },
]

const TIME_SAVED_MINS: readonly number[] = [22, 24, 27, 31, 33, 36, 38, 41, 43, 46, 48, 52]

export const dictationTimeSaved = MONTHS.map((month, i) => ({
  month,
  minutesPerClinician: TIME_SAVED_MINS[i] ?? 0,
}))

export const adoptionByClinic: AIAdoptionRow[] = [
  { clinic: 'Bayview Family Clinic', plan: 'Enterprise', activeUsers: 42, totalUsers: 48, weeklyRequests: 8200 },
  { clinic: 'Northside Dental', plan: 'Professional', activeUsers: 11, totalUsers: 14, weeklyRequests: 1980 },
  { clinic: 'Sunrise Pediatrics', plan: 'Professional', activeUsers: 9, totalUsers: 12, weeklyRequests: 1340 },
  { clinic: 'Westend Wellness', plan: 'Professional', activeUsers: 14, totalUsers: 22, weeklyRequests: 2105 },
  { clinic: 'Maplewood Dermatology', plan: 'Professional', activeUsers: 8, totalUsers: 9, weeklyRequests: 1640 },
  { clinic: 'Riverstone Cardiology', plan: 'Enterprise', activeUsers: 35, totalUsers: 41, weeklyRequests: 6900 },
  { clinic: 'Cedar Hill Clinic', plan: 'Basic', activeUsers: 3, totalUsers: 6, weeklyRequests: 210 },
  { clinic: 'Greenfield Health', plan: 'Professional', activeUsers: 12, totalUsers: 18, weeklyRequests: 1810 },
]

export const noteAudits: AINoteAuditRow[] = [
  {
    id: 'NA-9001',
    clinic: 'Bayview Family Clinic',
    clinician: 'Dr. Sarah Chen',
    patientRef: 'P-4821',
    feature: 'Clinical Note Summarization',
    reviewedBy: null,
    acceptedTokens: 0,
    editedTokens: 0,
    reviewedAt: null,
    status: 'Pending Review',
  },
  {
    id: 'NA-9002',
    clinic: 'Northside Dental',
    clinician: 'Dr. Amelia Park',
    patientRef: 'P-5102',
    feature: 'Voice Dictation',
    reviewedBy: 'Dr. Amelia Park',
    acceptedTokens: 612,
    editedTokens: 84,
    reviewedAt: '2026-05-13T13:42:00Z',
    status: 'Edited',
  },
  {
    id: 'NA-9003',
    clinic: 'Maplewood Dermatology',
    clinician: 'Dr. Emily Rodriguez',
    patientRef: 'P-3219',
    feature: 'Clinical Note Summarization',
    reviewedBy: 'Dr. Emily Rodriguez',
    acceptedTokens: 540,
    editedTokens: 0,
    reviewedAt: '2026-05-13T11:08:00Z',
    status: 'Accepted',
  },
  {
    id: 'NA-9004',
    clinic: 'Westend Wellness',
    clinician: 'Dr. David Okonkwo',
    patientRef: 'P-6011',
    feature: 'Voice Dictation',
    reviewedBy: 'Dr. David Okonkwo',
    acceptedTokens: 0,
    editedTokens: 0,
    reviewedAt: '2026-05-12T16:18:00Z',
    status: 'Rejected',
  },
  {
    id: 'NA-9005',
    clinic: 'Riverstone Cardiology',
    clinician: 'Dr. M. Patel',
    patientRef: 'P-7704',
    feature: 'Patient Q&A Assist',
    reviewedBy: null,
    acceptedTokens: 0,
    editedTokens: 0,
    reviewedAt: null,
    status: 'Pending Review',
  },
]

export const complianceLogs: ComplianceLogRow[] = [
  {
    id: 'CL-3301',
    event: 'AI moderation policy v2.4 published',
    actor: 'Michael Ross',
    context: 'Added stricter PHI detection thresholds',
    timestamp: '2026-05-13T09:00:00Z',
    severity: 'Info',
  },
  {
    id: 'CL-3302',
    event: 'PHI leak flag escalated to compliance',
    actor: 'System',
    context: 'MF-5501 · Westend Wellness · Clinical Note Summarization',
    timestamp: '2026-05-13T10:22:00Z',
    severity: 'Critical',
  },
  {
    id: 'CL-3303',
    event: 'Prompt soap_summary_v3 activated',
    actor: 'Dr. Amelia Park',
    context: 'Replaced soap_summary_v2 (deprecated)',
    timestamp: '2026-05-09T11:24:00Z',
    severity: 'Info',
  },
  {
    id: 'CL-3304',
    event: 'Manual override engaged for Voice Dictation',
    actor: 'Michael Ross',
    context: 'Disabled auto-finalize across all clinics for 24h',
    timestamp: '2026-05-08T19:15:00Z',
    severity: 'Warning',
  },
  {
    id: 'CL-3305',
    event: 'Tier limit raised for Enterprise plan',
    actor: 'Sarah Chen',
    context: 'Monthly requests 20k → 25k',
    timestamp: '2026-05-05T14:00:00Z',
    severity: 'Info',
  },
]

export const overrideRules: AIOverrideRule[] = [
  {
    id: 'OR-1',
    scope: 'Global · all features',
    description: 'Master kill switch — disables every AI feature platform-wide',
    state: 'on',
    updatedBy: 'Michael Ross',
    updatedAt: '2026-04-22T08:00:00Z',
  },
  {
    id: 'OR-2',
    scope: 'Clinical Note Summarization',
    description: 'Require clinician review before notes are auto-finalized',
    state: 'on',
    updatedBy: 'Compliance Team',
    updatedAt: '2026-05-09T12:00:00Z',
  },
  {
    id: 'OR-3',
    scope: 'Voice Dictation',
    description: 'Auto-finalize transcripts on >95% confidence',
    state: 'off',
    updatedBy: 'Michael Ross',
    updatedAt: '2026-05-08T19:15:00Z',
  },
  {
    id: 'OR-4',
    scope: 'Billing Code Suggestion',
    description: 'Require human confirmation before posting codes to invoices',
    state: 'on',
    updatedBy: 'Finance Engineering',
    updatedAt: '2026-05-01T10:30:00Z',
  },
  {
    id: 'OR-5',
    scope: 'Patient Q&A Assist',
    description: 'Block outputs that reference medications or dosages',
    state: 'on',
    updatedBy: 'Compliance Team',
    updatedAt: '2026-04-30T16:00:00Z',
  },
]
