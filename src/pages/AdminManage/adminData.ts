import {
  PERMISSION_OPTIONS,
  SCOPE_ITEMS,
  type AdminPermissionEntry,
  type AdminPermissionKey,
  type AdminRow,
} from './types'

const CLINICS = [
  'Alex Sadman',
  'Zoya Clinic',
  'Bright Smile Dental',
  'Harbor Wellness',
  'Northside Physio',
  'City Care Center',
  'GreenLeaf Medical',
]

const ALL_PERMISSION_KEYS = PERMISSION_OPTIONS.map((o) => o.value)

function fullAccess(key: AdminPermissionKey): AdminPermissionEntry {
  return { key, scope: { type: 'all' } }
}

function scopedAccess(key: AdminPermissionKey, ids: string[]): AdminPermissionEntry {
  return { key, scope: { type: 'selected', ids } }
}

const HEAD_ADMIN_PERMISSIONS: AdminPermissionEntry[] = ALL_PERMISSION_KEYS.map(fullAccess)

function defaultAdminPermissions(seed: number): AdminPermissionEntry[] {
  const clinicItems = SCOPE_ITEMS['clinic-management'] ?? []
  // Pick 3 clinics deterministically based on seed.
  const picks = [seed % clinicItems.length, (seed + 2) % clinicItems.length, (seed + 5) % clinicItems.length]
  const ids = Array.from(new Set(picks.map((i) => clinicItems[i]?.id).filter(Boolean))) as string[]

  return [
    fullAccess('dashboard'),
    scopedAccess('clinic-management', ids),
    fullAccess('zealth-ai'),
    fullAccess('settings'),
  ]
}

function makeAdmin(i: number): AdminRow {
  const day = 1 + (i % 28)
  const month = 1 + (i % 12)
  const year = 2025 + (i % 2)
  const join = new Date(year, month - 1, day).toISOString()
  const role: AdminRow['role'] = i % 9 === 0 ? 'head-admin' : 'admin'

  return {
    id: String(23598 + i),
    clinicName: CLINICS[i % CLINICS.length],
    joinDate: join,
    role,
    status: i % 7 === 0 ? 'inactive' : 'active',
    email: `admin${i + 1}@demo.mail`,
    phone: `+61 ${2000 + (i % 7999)} ${1000 + (i % 8999)}`,
    permissions: role === 'head-admin' ? HEAD_ADMIN_PERMISSIONS : defaultAdminPermissions(i),
  }
}

export const mockAdmins: AdminRow[] = Array.from({ length: 150 }, (_, i) => makeAdmin(i))
