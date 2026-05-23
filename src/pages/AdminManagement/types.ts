export type AdminRole = 'super-admin' | 'admin' | 'manager'

export type AdminStatus = 'active' | 'inactive' | 'suspended'

export type AdminPermissionKey =
  | 'dashboard'
  | 'user-management'
  | 'clinic-management'
  | 'subscription-manage'
  | 'subscription-invoice'
  | 'sales-affiliates'
  | 'ai-management'
  | 'compliance-audit'
  | 'support-centre'
  | 'reports-analytics'
  | 'settings'

export type PermissionScope =
  | { type: 'all' }
  | { type: 'selected'; ids: string[] }

export interface AdminPermissionEntry {
  key: AdminPermissionKey
  scope: PermissionScope
}

export interface PermissionOption {
  value: AdminPermissionKey
  label: string
  scopeable?: boolean
}

export const PERMISSION_OPTIONS: PermissionOption[] = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'user-management', label: 'User Management', scopeable: true },
  { value: 'clinic-management', label: 'Clinic Management', scopeable: true },
  { value: 'subscription-manage', label: 'Subscription Manage', scopeable: true },
  { value: 'subscription-invoice', label: 'Subscription Invoice', scopeable: true },
  { value: 'sales-affiliates', label: 'Sales & Affiliates' },
  { value: 'ai-management', label: 'AI Management' },
  { value: 'compliance-audit', label: 'Compliance & Audit' },
  { value: 'support-centre', label: 'Support Centre' },
  { value: 'reports-analytics', label: 'Reports & Analytics' },
  { value: 'settings', label: 'Settings' },
]

export interface ScopeItem {
  id: string
  label: string
}

export const SCOPE_ITEMS: Partial<Record<AdminPermissionKey, ScopeItem[]>> = {
  'clinic-management': [
    { id: 'clinic-1', label: 'Alex Sadman Clinic' },
    { id: 'clinic-2', label: 'Zoya Clinic' },
    { id: 'clinic-3', label: 'Bright Smile Dental' },
    { id: 'clinic-4', label: 'Harbor Wellness' },
    { id: 'clinic-5', label: 'Northside Physio' },
    { id: 'clinic-6', label: 'City Care Center' },
    { id: 'clinic-7', label: 'GreenLeaf Medical' },
    { id: 'clinic-8', label: 'Sunrise Family Clinic' },
    { id: 'clinic-9', label: 'Riverside Health' },
    { id: 'clinic-10', label: 'Maple Pediatrics' },
  ],
  'user-management': [
    { id: 'user-1', label: 'Sarah Johnson' },
    { id: 'user-2', label: 'Michael Chen' },
    { id: 'user-3', label: 'Aisha Rahman' },
    { id: 'user-4', label: 'David Smith' },
    { id: 'user-5', label: 'Priya Patel' },
    { id: 'user-6', label: 'James Wilson' },
    { id: 'user-7', label: 'Emily Brown' },
    { id: 'user-8', label: 'Omar Khan' },
  ],
  'subscription-manage': [
    { id: 'plan-basic', label: 'Basic Plan' },
    { id: 'plan-standard', label: 'Standard Plan' },
    { id: 'plan-pro', label: 'Pro Plan' },
    { id: 'plan-enterprise', label: 'Enterprise Plan' },
  ],
  'subscription-invoice': [
    { id: 'inv-1001', label: 'INV-1001' },
    { id: 'inv-1002', label: 'INV-1002' },
    { id: 'inv-1003', label: 'INV-1003' },
    { id: 'inv-1004', label: 'INV-1004' },
    { id: 'inv-1005', label: 'INV-1005' },
    { id: 'inv-1006', label: 'INV-1006' },
  ],
}

export interface AdminRow {
  id: string
  name: string
  email: string
  phone: string
  clinicName: string
  joinDate: string
  lastLogin: string
  role: AdminRole
  status: AdminStatus
  permissions: AdminPermissionEntry[]
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  'super-admin': 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
}

export const ADMIN_STATUS_LABELS: Record<AdminStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
}
