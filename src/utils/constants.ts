import type { SelectOption, UserAccessPermissionKey } from '@/types'

export const USER_ROLES: SelectOption[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'editor', label: 'Editor' },
  { value: 'user', label: 'User' },
]

export const USER_STATUSES: SelectOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
]

/** Display labels for the platform-wide staff classifications. */
export const USER_TYPE_LABELS: Record<string, string> = {
  doctor: 'Doctor',
  physiotherapist: 'Physiotherapist',
  'allied-health': 'Allied Health',
  receptionist: 'Receptionist',
  'clinic-admin': 'Clinic Admin',
  salesperson: 'Salesperson',
  'support-staff': 'Support Staff',
  'super-admin': 'Super Admin',
}

/** User-type filter options for User Management (prefixed with the `all` sentinel). */
export const USER_TYPES: SelectOption[] = [
  { value: 'all', label: 'All User Types' },
  ...Object.entries(USER_TYPE_LABELS).map(([value, label]) => ({ value, label })),
]

/** Grant/revoke access toggles shown on the user's Permissions tab. */
export const USER_ACCESS_PERMISSIONS: {
  key: UserAccessPermissionKey
  label: string
  description: string
}[] = [
  {
    key: 'billing',
    label: 'Billing access',
    description: 'View and manage invoices, subscriptions and payment methods.',
  },
  {
    key: 'ai',
    label: 'AI access',
    description: 'Use Zealth AI features such as clinical auto-summarisation.',
  },
  {
    key: 'reporting',
    label: 'Reporting access',
    description: 'View analytics dashboards and export reports.',
  },
  {
    key: 'whiteLabel',
    label: 'White-label access',
    description: 'Apply custom branding across the clinic workspace.',
  },
  {
    key: 'adminPrivileges',
    label: 'Admin privileges',
    description: 'Manage staff, roles and clinic-wide settings.',
  },
]

export const USER_PACKAGES: SelectOption[] = [
  { value: 'all', label: 'All packages' },
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

export const CLINIC_STATUSES: SelectOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'deactive', label: 'Deactive' },
  { value: 'suspended', label: 'Suspended' },
]

/** Subscription tier labels for clinics (mirrors `USER_PACKAGES` without the `all` sentinel). */
export const CLINIC_PACKAGE_LABELS: Record<string, string> = {
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

/** Revenue filter buckets for the clinic directory. */
export const CLINIC_REVENUE_BUCKETS: { value: string; label: string; min: number; max: number }[] = [
  { value: 'all', label: 'All Revenue', min: 0, max: Infinity },
  { value: '0-10k', label: 'Under $10k', min: 0, max: 10_000 },
  { value: '10k-50k', label: '$10k – $50k', min: 10_000, max: 50_000 },
  { value: '50k-100k', label: '$50k – $100k', min: 50_000, max: 100_000 },
  { value: '100k+', label: '$100k+', min: 100_000, max: Infinity },
]

/** Toggleable per-clinic features shown in Quick Actions. */
export const CLINIC_FEATURE_FLAGS: { key: string; label: string; description: string }[] = [
  {
    key: 'aiAssistant',
    label: 'AI Assistant',
    description: 'Zealth AI clinical summarisation and assistance.',
  },
  {
    key: 'whiteLabel',
    label: 'White-label',
    description: 'Custom branding across the clinic workspace.',
  },
  {
    key: 'advancedReporting',
    label: 'Advanced Reporting',
    description: 'Analytics dashboards and exportable reports.',
  },
  {
    key: 'patientPortal',
    label: 'Patient Portal',
    description: 'Self-service portal for the clinic’s patients.',
  },
]

export const PRODUCT_STATUSES: SelectOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'draft', label: 'Draft' },
  { value: 'out_of_stock', label: 'Out of Stock' },
]

export const CATEGORY_STATUSES: SelectOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const ITEMS_PER_PAGE_OPTIONS = [15, 10, 25, 50, 100]

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
}

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-success/10', text: 'text-success' },
  blocked: { bg: 'bg-destructive/10', text: 'text-destructive' },
  pending: { bg: 'bg-warning/10', text: 'text-warning' },
  inactive: { bg: 'bg-muted', text: 'text-muted-foreground' },
  expired: { bg: 'bg-destructive/10', text: 'text-destructive' },
  draft: { bg: 'bg-muted', text: 'text-muted-foreground' },
  open: { bg: 'bg-warning/10', text: 'text-warning' },
  in_progress: { bg: 'bg-primary/10', text: 'text-primary' },
  resolved: { bg: 'bg-success/10', text: 'text-success' },
  closed: { bg: 'bg-muted', text: 'text-muted-foreground' },
  out_of_stock: { bg: 'bg-destructive/10', text: 'text-destructive' },
  Pending: { bg: 'bg-orange-100', text: 'text-orange-800' },
  Completed: { bg: 'bg-green-100', text: 'text-green-800' },
  Failed: { bg: 'bg-red-100', text: 'text-red-800' },
  Cancelled: { bg: 'bg-gray-100', text: 'text-gray-800' },
}

export const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin: { bg: 'bg-primary/10', text: 'text-primary' },
  moderator: { bg: 'bg-warning/10', text: 'text-warning' },
  editor: { bg: 'bg-success/10', text: 'text-success' },
  user: { bg: 'bg-muted', text: 'text-muted-foreground' },
}

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB












