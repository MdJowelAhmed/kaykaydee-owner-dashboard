import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  Clinic,
  ClinicAuditEntry,
  ClinicFeatureKey,
  ClinicFilters,
  ClinicPackagePlan,
  ClinicStatus,
  ClinicSupportTicket,
  PaginationState,
} from '@/types'
import { DEFAULT_PAGINATION, CLINIC_REVENUE_BUCKETS, CLINIC_PACKAGE_LABELS } from '@/utils/constants'
import { createId } from '@/utils/id'

const NAMES = [
  'Smart Clinic',
  'Zoya Clinic',
  'Star Medical',
  'Northside Care',
  'Wellness Hub',
  'Metro Health Center',
  'Care Plus Clinic',
  'Sunrise Medical',
]
const PACKAGES: ClinicPackagePlan[] = ['basic', 'pro', 'enterprise']
const CONTACT_NAMES = ['Ava Chen', 'Jordan Smith', 'Priya Patel', 'Sam Wilson', 'Taylor Brooks']
const SALESPEOPLE = [
  'Olivia Bennett',
  'Marcus Reed',
  'Hannah Cole',
  'Daniel Foster',
  'Sophia Nguyen',
]
const LOCATIONS = [
  { country: 'Australia', state: 'New South Wales' },
  { country: 'Australia', state: 'Victoria' },
  { country: 'Australia', state: 'Queensland' },
  { country: 'New Zealand', state: 'Auckland' },
  { country: 'United Kingdom', state: 'England' },
  { country: 'United States', state: 'California' },
  { country: 'United States', state: 'Texas' },
  { country: 'Canada', state: 'Ontario' },
]
const REFERRAL_SOURCES = [
  'Google Search',
  'Partner Referral',
  'Industry Conference',
  'Cold Outreach',
  'Existing Customer',
  'Social Media',
]
const TICKET_SUBJECTS = [
  'Billing discrepancy on latest invoice',
  'Cannot add new staff member',
  'AI summary not generating',
  'White-label logo upload issue',
  'Patient portal login error',
  'Request: bulk patient export',
]
const TICKET_STATUSES: ClinicSupportTicket['status'][] = [
  'open',
  'in_progress',
  'resolved',
  'closed',
]
const REVENUE_TIERS = [4200, 18500, 32000, 67000, 112000, 240000]

function planQuota(plan: ClinicPackagePlan): number | null {
  if (plan === 'basic') return 200
  if (plan === 'pro') return 1000
  return null
}

function buildSupportTickets(i: number): ClinicSupportTicket[] {
  const count = i % 4 // 0–3 tickets
  return Array.from({ length: count }, (_, k) => ({
    id: createId(),
    ref: `TKT-${2400 + i * 4 + k}`,
    subject: TICKET_SUBJECTS[(i + k) % TICKET_SUBJECTS.length],
    status: TICKET_STATUSES[(i + k) % TICKET_STATUSES.length],
    createdAt: new Date(Date.now() - (k + 1) * 36 * 3600 * 1000).toISOString(),
  }))
}

function buildMockClinics(): Clinic[] {
  const rows: Clinic[] = []
  const idBase = 1_458_118
  for (let i = 0; i < 50; i++) {
    const slug = NAMES[i % NAMES.length].toLowerCase().replace(/\s+/g, '')
    const plan = PACKAGES[i % PACKAGES.length]
    const location = LOCATIONS[i % LOCATIONS.length]
    const quota = planQuota(plan)
    const revenue = REVENUE_TIERS[i % REVENUE_TIERS.length] + (i % 7) * 1500
    rows.push({
      id: String(idBase + i),
      name: NAMES[i % NAMES.length],
      contact: `+61 ${2569 + (i % 900)} ${2100 + (i % 900)}`,
      email: `clinic${i}@health.test`,
      contactPerson: CONTACT_NAMES[i % CONTACT_NAMES.length],
      website: i % 5 === 0 ? '' : `https://www.${slug}${i % 3}.example`,
      staff: 3 + (i % 25),
      patients: 40 + i * 3,
      status: i % 13 === 0 ? 'suspended' : i % 7 === 0 ? 'deactive' : 'active',
      packagePlan: plan,
      country: location.country,
      state: location.state,
      revenue,
      salesperson: SALESPEOPLE[i % SALESPEOPLE.length],
      referralSource: REFERRAL_SOURCES[i % REFERRAL_SOURCES.length],
      billingCycle: i % 3 === 0 ? 'annual' : 'monthly',
      aiUsage: {
        used: quota ? (i * 37) % quota : 600 + ((i * 53) % 2600),
        quota,
        lastUsedAt: new Date(Date.now() - (i % 10) * 24 * 3600 * 1000).toISOString(),
      },
      features: {
        aiAssistant: plan !== 'basic' || i % 3 === 0,
        whiteLabel: plan === 'enterprise',
        advancedReporting: plan !== 'basic',
        patientPortal: i % 2 === 0,
      },
      supportTickets: buildSupportTickets(i),
      auditLog: [],
    })
  }
  return rows
}

const mockClinics = buildMockClinics()

function matchesRevenueBucket(revenue: number, bucket: string): boolean {
  const def = CLINIC_REVENUE_BUCKETS.find((b) => b.value === bucket)
  if (!def) return true
  return revenue >= def.min && revenue < def.max
}

function applyClinicFilters(list: Clinic[], filters: ClinicFilters): Clinic[] {
  let filtered = [...list]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.contact.includes(filters.search) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.salesperson.toLowerCase().includes(q)
    )
  }
  if (filters.status !== 'all') {
    filtered = filtered.filter((c) => c.status === filters.status)
  }
  if (filters.package !== 'all') {
    filtered = filtered.filter((c) => c.packagePlan === filters.package)
  }
  if (filters.country !== 'all') {
    filtered = filtered.filter((c) => c.country === filters.country)
  }
  if (filters.revenue !== 'all') {
    filtered = filtered.filter((c) => matchesRevenueBucket(c.revenue, filters.revenue))
  }
  if (filters.salesperson !== 'all') {
    filtered = filtered.filter((c) => c.salesperson === filters.salesperson)
  }
  return filtered
}

interface ClinicState {
  list: Clinic[]
  filteredList: Clinic[]
  filters: ClinicFilters
  pagination: PaginationState
  isLoading: boolean
}

const initialFilters: ClinicFilters = {
  search: '',
  status: 'all',
  package: 'all',
  country: 'all',
  revenue: 'all',
  salesperson: 'all',
}

const initialState: ClinicState = {
  list: mockClinics,
  filteredList: mockClinics,
  filters: initialFilters,
  pagination: {
    ...DEFAULT_PAGINATION,
    limit: 15,
    total: mockClinics.length,
    totalPages: Math.ceil(mockClinics.length / 15),
  },
  isLoading: false,
}

/** Apply a mutation to a clinic in both `list` and `filteredList`. */
function mutateClinic(state: ClinicState, id: string, fn: (clinic: Clinic) => void) {
  for (const collection of [state.list, state.filteredList]) {
    const clinic = collection.find((c) => c.id === id)
    if (clinic) fn(clinic)
  }
}

function makeAuditEntry(action: string, detail: string): ClinicAuditEntry {
  return {
    id: createId(),
    action,
    detail,
    actor: 'Super Admin',
    timestamp: new Date().toISOString(),
  }
}

const clinicSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ClinicFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredList = applyClinicFilters(state.list, state.filters)
      state.pagination.total = state.filteredList.length
      state.pagination.totalPages = Math.ceil(state.filteredList.length / state.pagination.limit)
      state.pagination.page = 1
    },
    addClinic: (state, action: PayloadAction<Clinic>) => {
      state.list = [action.payload, ...state.list]
      state.filteredList = applyClinicFilters(state.list, state.filters)
      state.pagination.total = state.filteredList.length
      state.pagination.totalPages = Math.ceil(state.filteredList.length / state.pagination.limit)
      state.pagination.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.totalPages = Math.ceil(state.filteredList.length / action.payload)
      state.pagination.page = 1
    },
    /** Quick action: suspend / reactivate / deactivate a clinic. */
    setClinicStatus: (state, action: PayloadAction<{ id: string; status: ClinicStatus }>) => {
      const { id, status } = action.payload
      const label =
        status === 'suspended' ? 'Clinic suspended' : status === 'active' ? 'Clinic reactivated' : 'Clinic deactivated'
      mutateClinic(state, id, (clinic) => {
        clinic.status = status
        clinic.auditLog.unshift(makeAuditEntry(label, `Status changed to ${status}.`))
      })
    },
    /** Quick action: upgrade / downgrade the subscription tier. */
    setClinicPackage: (
      state,
      action: PayloadAction<{ id: string; packagePlan: ClinicPackagePlan }>
    ) => {
      const { id, packagePlan } = action.payload
      mutateClinic(state, id, (clinic) => {
        const from = CLINIC_PACKAGE_LABELS[clinic.packagePlan] ?? clinic.packagePlan
        const to = CLINIC_PACKAGE_LABELS[packagePlan] ?? packagePlan
        if (clinic.packagePlan === packagePlan) return
        clinic.packagePlan = packagePlan
        clinic.auditLog.unshift(
          makeAuditEntry('Subscription changed', `Plan moved from ${from} to ${to}.`)
        )
      })
    },
    /** Quick action: enable / disable a clinic feature. */
    setClinicFeature: (
      state,
      action: PayloadAction<{ id: string; key: ClinicFeatureKey; value: boolean; label: string }>
    ) => {
      const { id, key, value, label } = action.payload
      mutateClinic(state, id, (clinic) => {
        clinic.features[key] = value
        clinic.auditLog.unshift(
          makeAuditEntry(
            `Feature ${value ? 'enabled' : 'disabled'}`,
            `${label} was ${value ? 'enabled' : 'disabled'}.`
          )
        )
      })
    },
    /** Quick action: reset the billing cycle and AI usage counter. */
    resetClinicBilling: (state, action: PayloadAction<{ id: string }>) => {
      const now = new Date().toISOString()
      mutateClinic(state, action.payload.id, (clinic) => {
        clinic.aiUsage.used = 0
        clinic.lastBillingResetAt = now
        clinic.auditLog.unshift(
          makeAuditEntry('Billing reset', 'Billing cycle and AI usage counter were reset.')
        )
      })
    },
    /** Generic securely-logged action (impersonation, announcements, etc.). */
    logClinicAction: (
      state,
      action: PayloadAction<{ id: string; action: string; detail: string }>
    ) => {
      const { id, action: name, detail } = action.payload
      mutateClinic(state, id, (clinic) => {
        clinic.auditLog.unshift(makeAuditEntry(name, detail))
      })
    },
  },
})

export const {
  setFilters,
  setPage,
  setLimit,
  addClinic,
  setClinicStatus,
  setClinicPackage,
  setClinicFeature,
  resetClinicBilling,
  logClinicAction,
} = clinicSlice.actions

export default clinicSlice.reducer
