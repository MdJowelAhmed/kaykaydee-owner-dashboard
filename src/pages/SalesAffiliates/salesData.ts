export type CommissionTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export interface SalesUser {
  id: string
  name: string
  email: string
  avatarUrl: string
  territory: string
  tier: CommissionTier
  commissionPct: number
  status: 'Active' | 'Onboarding' | 'Paused'
  joinedAt: string
  lastActivityAt: string
  clinicsOnboarded: number
  pipelineCount: number
}

export interface AffiliateMetrics {
  id: string
  salesUserId: string
  name: string
  avatarUrl: string
  clinicsOnboarded: number
  clinicsOnboardedDelta: number
  revenueGenerated: number
  monthlyRecurringCommission: number
  conversionRate: number
}

export interface CommissionMilestone {
  id: string
  name: string
  description: string
  threshold: number
  thresholdLabel: string
  bonusAmount: number
}

export interface CommissionTierRule {
  tier: CommissionTier
  recurringPct: number
  newClinicBonus: number
  requirement: string
  active: number
}

export type LeadStage = 'Lead' | 'Demo' | 'Trial' | 'Converted' | 'Lost'

export interface LeadRow {
  id: string
  clinic: string
  contactName: string
  email: string
  plan: 'Basic' | 'Advanced' | 'Premium'
  owner: string
  estValue: number
  stage: LeadStage
  source: 'Cold Outreach' | 'Inbound' | 'Referral' | 'Event' | 'Partner'
  updatedAt: string
  notes: string
}

export const salesUsers: SalesUser[] = [
  {
    id: 'SU-1001',
    name: 'Maria Lopez',
    email: 'maria.lopez@kaykaydee.health',
    avatarUrl: 'https://i.pravatar.cc/96?img=5',
    territory: 'West · California, Nevada, Arizona',
    tier: 'Platinum',
    commissionPct: 18,
    status: 'Active',
    joinedAt: '2025-08-12T09:00:00Z',
    lastActivityAt: '2026-05-14T08:42:00Z',
    clinicsOnboarded: 28,
    pipelineCount: 11,
  },
  {
    id: 'SU-1002',
    name: 'Tom Banks',
    email: 'tom.banks@kaykaydee.health',
    avatarUrl: 'https://i.pravatar.cc/96?img=33',
    territory: 'Northeast · NY, NJ, MA, CT',
    tier: 'Gold',
    commissionPct: 14,
    status: 'Active',
    joinedAt: '2025-11-04T09:00:00Z',
    lastActivityAt: '2026-05-13T16:18:00Z',
    clinicsOnboarded: 19,
    pipelineCount: 8,
  },
  {
    id: 'SU-1003',
    name: 'Priya Patel',
    email: 'priya.patel@kaykaydee.health',
    avatarUrl: 'https://i.pravatar.cc/96?img=47',
    territory: 'South · Texas, Florida, Georgia',
    tier: 'Silver',
    commissionPct: 10,
    status: 'Active',
    joinedAt: '2026-01-22T09:00:00Z',
    lastActivityAt: '2026-05-13T11:50:00Z',
    clinicsOnboarded: 12,
    pipelineCount: 14,
  },
  {
    id: 'SU-1004',
    name: 'David Okonkwo',
    email: 'david.okonkwo@kaykaydee.health',
    avatarUrl: 'https://i.pravatar.cc/96?img=60',
    territory: 'Canada · Ontario, BC, Alberta',
    tier: 'Gold',
    commissionPct: 14,
    status: 'Active',
    joinedAt: '2025-09-30T09:00:00Z',
    lastActivityAt: '2026-05-13T07:12:00Z',
    clinicsOnboarded: 17,
    pipelineCount: 6,
  },
  {
    id: 'SU-1005',
    name: 'Sarah Chen',
    email: 'sarah.chen@kaykaydee.health',
    avatarUrl: 'https://i.pravatar.cc/96?img=12',
    territory: 'EU · UK, Germany, Ireland',
    tier: 'Silver',
    commissionPct: 10,
    status: 'Onboarding',
    joinedAt: '2026-04-15T09:00:00Z',
    lastActivityAt: '2026-05-12T14:00:00Z',
    clinicsOnboarded: 2,
    pipelineCount: 9,
  },
  {
    id: 'SU-1006',
    name: 'K. Lee',
    email: 'k.lee@kaykaydee.health',
    avatarUrl: 'https://i.pravatar.cc/96?img=45',
    territory: 'APAC · Australia, NZ, Singapore',
    tier: 'Bronze',
    commissionPct: 7,
    status: 'Paused',
    joinedAt: '2025-12-01T09:00:00Z',
    lastActivityAt: '2026-04-28T10:30:00Z',
    clinicsOnboarded: 4,
    pipelineCount: 0,
  },
]

export const affiliateMetrics: AffiliateMetrics[] = [
  {
    id: 'AM-1',
    salesUserId: 'SU-1001',
    name: 'Maria Lopez',
    avatarUrl: 'https://i.pravatar.cc/96?img=5',
    clinicsOnboarded: 28,
    clinicsOnboardedDelta: 4,
    revenueGenerated: 184_200,
    monthlyRecurringCommission: 2_980,
    conversionRate: 0.42,
  },
  {
    id: 'AM-2',
    salesUserId: 'SU-1002',
    name: 'Tom Banks',
    avatarUrl: 'https://i.pravatar.cc/96?img=33',
    clinicsOnboarded: 19,
    clinicsOnboardedDelta: 3,
    revenueGenerated: 121_900,
    monthlyRecurringCommission: 1_690,
    conversionRate: 0.36,
  },
  {
    id: 'AM-3',
    salesUserId: 'SU-1004',
    name: 'David Okonkwo',
    avatarUrl: 'https://i.pravatar.cc/96?img=60',
    clinicsOnboarded: 17,
    clinicsOnboardedDelta: 2,
    revenueGenerated: 98_400,
    monthlyRecurringCommission: 1_360,
    conversionRate: 0.34,
  },
  {
    id: 'AM-4',
    salesUserId: 'SU-1003',
    name: 'Priya Patel',
    avatarUrl: 'https://i.pravatar.cc/96?img=47',
    clinicsOnboarded: 12,
    clinicsOnboardedDelta: 5,
    revenueGenerated: 64_800,
    monthlyRecurringCommission: 820,
    conversionRate: 0.29,
  },
  {
    id: 'AM-5',
    salesUserId: 'SU-1006',
    name: 'K. Lee',
    avatarUrl: 'https://i.pravatar.cc/96?img=45',
    clinicsOnboarded: 4,
    clinicsOnboardedDelta: 0,
    revenueGenerated: 18_400,
    monthlyRecurringCommission: 190,
    conversionRate: 0.18,
  },
  {
    id: 'AM-6',
    salesUserId: 'SU-1005',
    name: 'Sarah Chen',
    avatarUrl: 'https://i.pravatar.cc/96?img=12',
    clinicsOnboarded: 2,
    clinicsOnboardedDelta: 2,
    revenueGenerated: 6_100,
    monthlyRecurringCommission: 92,
    conversionRate: 0.22,
  },
]

export const commissionTierRules: CommissionTierRule[] = [
  {
    tier: 'Bronze',
    recurringPct: 7,
    newClinicBonus: 50,
    requirement: '1–5 clinics in last 90 days',
    active: 1,
  },
  {
    tier: 'Silver',
    recurringPct: 10,
    newClinicBonus: 100,
    requirement: '6–15 clinics in last 90 days',
    active: 2,
  },
  {
    tier: 'Gold',
    recurringPct: 14,
    newClinicBonus: 200,
    requirement: '16–30 clinics in last 90 days',
    active: 2,
  },
  {
    tier: 'Platinum',
    recurringPct: 18,
    newClinicBonus: 400,
    requirement: '30+ clinics in last 90 days',
    active: 1,
  },
]

export const commissionMilestones: CommissionMilestone[] = [
  {
    id: 'BM-1',
    name: 'First Win',
    description: 'Awarded on closing the first paying clinic',
    threshold: 1,
    thresholdLabel: 'clinic',
    bonusAmount: 250,
  },
  {
    id: 'BM-2',
    name: 'Ramp Bonus',
    description: 'Awarded on reaching 10 onboarded clinics in 90 days',
    threshold: 10,
    thresholdLabel: 'clinics in 90d',
    bonusAmount: 1_000,
  },
  {
    id: 'BM-3',
    name: 'Volume Champion',
    description: 'Awarded on reaching $100K in cumulative ARR generated',
    threshold: 100_000,
    thresholdLabel: 'ARR generated',
    bonusAmount: 2_500,
  },
  {
    id: 'BM-4',
    name: 'Quarter Star',
    description: 'Top 3 sales user for a calendar quarter',
    threshold: 3,
    thresholdLabel: 'rank',
    bonusAmount: 5_000,
  },
]

export const leads: LeadRow[] = [
  {
    id: 'L-9001',
    clinic: 'Brookline Orthodontics',
    contactName: 'Dr. Jamie Wu',
    email: 'jamie.wu@brookline.health',
    plan: 'Advanced',
    owner: 'Maria Lopez',
    estValue: 1_788,
    stage: 'Demo',
    source: 'Inbound',
    updatedAt: '2026-05-13T15:20:00Z',
    notes: 'Demo scheduled for Friday. Strong fit, has 9 clinicians.',
  },
  {
    id: 'L-9002',
    clinic: 'Maplewood Dermatology',
    contactName: 'Office Manager',
    email: 'office@maplewoodderm.com',
    plan: 'Premium',
    owner: 'Tom Banks',
    estValue: 4_188,
    stage: 'Trial',
    source: 'Referral',
    updatedAt: '2026-05-13T11:00:00Z',
    notes: 'Trial converts on day 10 unless cancelled. Decision-maker engaged.',
  },
  {
    id: 'L-9003',
    clinic: 'Coastal Wellness Group',
    contactName: 'Dr. Naomi Park',
    email: 'naomi@coastalwellness.io',
    plan: 'Basic',
    owner: 'Priya Patel',
    estValue: 588,
    stage: 'Lead',
    source: 'Cold Outreach',
    updatedAt: '2026-05-13T09:42:00Z',
    notes: 'Replied to outreach, exploring vendors. Send case study next.',
  },
  {
    id: 'L-9004',
    clinic: 'Greenfield Health',
    contactName: 'James Wilson',
    email: 'james@greenfield.health',
    plan: 'Advanced',
    owner: 'Maria Lopez',
    estValue: 1_788,
    stage: 'Converted',
    source: 'Event',
    updatedAt: '2026-05-12T16:00:00Z',
    notes: 'Closed at HIMSS booth follow-up. Annual contract.',
  },
  {
    id: 'L-9005',
    clinic: 'Hillside Mental Health',
    contactName: 'Dr. R. Patel',
    email: 'r.patel@hillsidemh.org',
    plan: 'Premium',
    owner: 'David Okonkwo',
    estValue: 4_188,
    stage: 'Demo',
    source: 'Partner',
    updatedAt: '2026-05-12T13:30:00Z',
    notes: 'Partner-referred from BehavioralCo. Decision next week.',
  },
  {
    id: 'L-9006',
    clinic: 'Riverpath Family Clinic',
    contactName: 'Front Desk',
    email: 'admin@riverpath.health',
    plan: 'Basic',
    owner: 'Sarah Chen',
    estValue: 588,
    stage: 'Lost',
    source: 'Cold Outreach',
    updatedAt: '2026-05-11T10:00:00Z',
    notes: 'Went with a free open-source EMR. Worth re-engaging in 6 months.',
  },
  {
    id: 'L-9007',
    clinic: 'Summit Sports Medicine',
    contactName: 'Dr. Aisha Khan',
    email: 'aisha@summit-sm.com',
    plan: 'Advanced',
    owner: 'Tom Banks',
    estValue: 1_788,
    stage: 'Trial',
    source: 'Inbound',
    updatedAt: '2026-05-13T08:00:00Z',
    notes: 'Trial day 4 — heavy AI dictation usage already. Push annual.',
  },
  {
    id: 'L-9008',
    clinic: 'Lakeside Mental Health',
    contactName: 'Practice Manager',
    email: 'ops@lakeside-mh.com',
    plan: 'Premium',
    owner: 'Priya Patel',
    estValue: 4_188,
    stage: 'Lead',
    source: 'Referral',
    updatedAt: '2026-05-12T11:00:00Z',
    notes: 'Referred by Maplewood Dermatology. Hot — book demo this week.',
  },
  {
    id: 'L-9009',
    clinic: 'Westmount Family Care',
    contactName: 'Dr. Alex Wong',
    email: 'alex@westmount.care',
    plan: 'Advanced',
    owner: 'David Okonkwo',
    estValue: 1_788,
    stage: 'Converted',
    source: 'Cold Outreach',
    updatedAt: '2026-05-14T08:42:00Z',
    notes: 'Just signed. Monthly start, plan to upsell annual after 60 days.',
  },
  {
    id: 'L-9010',
    clinic: 'Harborline Wellness',
    contactName: 'Dr. Mei Tanaka',
    email: 'mei@harborline.io',
    plan: 'Basic',
    owner: 'Sarah Chen',
    estValue: 588,
    stage: 'Lost',
    source: 'Inbound',
    updatedAt: '2026-05-10T15:00:00Z',
    notes: 'Budget pulled this quarter. Revisit in Q3.',
  },
]
