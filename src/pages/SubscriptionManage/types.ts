export type BillingCycle = 'monthly' | 'annual' | 'trial'

export interface FeatureItem {
  id: string
  label: string
  enabled: boolean
}

export interface FeatureGroup {
  id: string
  title: string
  items: FeatureItem[]
}

export interface SubscriptionManagePackage {
  id: string
  name: string
  price: number
  cycle: BillingCycle
  enabled: boolean
  featureGroups: FeatureGroup[]
}

/** Discount delivery method for a coupon. */
export type CouponType = 'percentage' | 'fixed'

/** Stored coupon state. `expired` is also derived at render time from `endDate`. */
export type CouponStatus = 'active' | 'inactive' | 'expired'

export interface Coupon {
  id: string
  /** Uppercased redemption code, e.g. WELCOME20. */
  code: string
  description: string
  /** Package this coupon applies to; `null` means all packages. */
  packageId: string | null
  type: CouponType
  /** Percentage (0–100) when `type === 'percentage'`, USD amount when `'fixed'`. */
  value: number
  /** ISO date (yyyy-mm-dd). */
  startDate: string
  /** ISO date (yyyy-mm-dd). */
  endDate: string
  /** Max redemptions; `null` means unlimited. */
  usageLimit: number | null
  usedCount: number
  status: CouponStatus
}

