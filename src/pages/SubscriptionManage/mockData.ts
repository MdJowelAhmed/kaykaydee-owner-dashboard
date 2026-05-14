import type { BillingCycle, Coupon, FeatureGroup, SubscriptionManagePackage } from './types'
import { createId } from '@/utils/id'

function seedGroups(): FeatureGroup[] {
  return [
    {
      id: 'core',
      title: 'Core Features',
      items: [
        { id: 'basic-pm', label: 'Basic Patient Management', enabled: true },
        { id: 'appointment', label: 'Appointment Scheduling', enabled: true },
        { id: 'notes', label: 'Clinical Notes', enabled: false },
      ],
    },
    {
      id: 'ai',
      title: 'AI Features',
      items: [
        { id: 'auto-summary-1', label: 'Clinical Auto–Summarization', enabled: true },
        { id: 'auto-summary-2', label: 'Clinical Auto–Summarization', enabled: true },
        { id: 'auto-summary-3', label: 'Clinical Auto–Summarization', enabled: false },
      ],
    },
    {
      id: 'billing',
      title: 'Billing Features',
      items: [
        { id: 'basic-invoicing', label: 'Basic Invoicing', enabled: true },
        { id: 'reminders', label: 'Automated Payment Reminders', enabled: true },
        { id: 'bulk', label: 'Bulk Invoice Processing', enabled: false },
      ],
    },
  ]
}

function makePackage(
  name: string,
  price: number,
  cycle: BillingCycle,
  enabled: boolean
): SubscriptionManagePackage {
  return {
    id: createId(),
    name,
    price,
    cycle,
    enabled,
    featureGroups: seedGroups(),
  }
}

export const mockSubscriptionManagePackages: SubscriptionManagePackage[] = [
  makePackage('Basic', 50, 'monthly', true),
  makePackage('Advanced', 50, 'monthly', true),
  makePackage('Premium', 50, 'monthly', true),
  makePackage('Basic', 399, 'annual', true),
  makePackage('Advanced', 499, 'annual', false),
  makePackage('Premium', 599, 'annual', true),
  makePackage('Free Trial', 0, 'trial', true),
]

function makeCoupon(coupon: Omit<Coupon, 'id'>): Coupon {
  return { id: createId(), ...coupon }
}

export const mockCoupons: Coupon[] = [
  makeCoupon({
    code: 'WELCOME20',
    description: 'New clinic onboarding discount',
    packageId: null,
    type: 'percentage',
    value: 20,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 132,
    status: 'active',
  }),
  makeCoupon({
    code: 'ANNUAL50',
    description: '$50 off the Basic annual plan',
    packageId: mockSubscriptionManagePackages[3]?.id ?? null,
    type: 'fixed',
    value: 50,
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    usageLimit: 200,
    usedCount: 47,
    status: 'active',
  }),
  makeCoupon({
    code: 'SUMMER15',
    description: 'Seasonal promotion for the Premium monthly plan',
    packageId: mockSubscriptionManagePackages[2]?.id ?? null,
    type: 'percentage',
    value: 15,
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    usageLimit: null,
    usedCount: 0,
    status: 'inactive',
  }),
  makeCoupon({
    code: 'EARLYBIRD',
    description: 'Early access launch offer',
    packageId: null,
    type: 'percentage',
    value: 30,
    startDate: '2025-10-01',
    endDate: '2026-01-31',
    usageLimit: 1000,
    usedCount: 884,
    status: 'expired',
  }),
]

