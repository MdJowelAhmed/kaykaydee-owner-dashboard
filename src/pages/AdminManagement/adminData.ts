import {
  PERMISSION_OPTIONS,
  SCOPE_ITEMS,
  type AdminPermissionEntry,
  type AdminPermissionKey,
  type AdminRole,
  type AdminRow,
  type AdminStatus,
} from './types'

const CLINICS = [
  'Alex Sadman Clinic',
  'Zoya Clinic',
  'Bright Smile Dental',
  'Harbor Wellness',
  'Northside Physio',
  'City Care Center',
  'GreenLeaf Medical',
  'Sunrise Family Clinic',
  'Riverside Health',
  'Maple Pediatrics',
]

const FIRST_NAMES = [
  'Sarah',
  'Michael',
  'Aisha',
  'David',
  'Priya',
  'James',
  'Emily',
  'Omar',
  'Hannah',
  'Lucas',
  'Maya',
  'Daniel',
]

const LAST_NAMES = [
  'Johnson',
  'Chen',
  'Rahman',
  'Smith',
  'Patel',
  'Wilson',
  'Brown',
  'Khan',
  'Garcia',
  'Anderson',
  'Lopez',
  'Lee',
]

const ALL_PERMISSION_KEYS = PERMISSION_OPTIONS.map((o) => o.value)

function fullAccess(key: AdminPermissionKey): AdminPermissionEntry {
  return { key, scope: { type: 'all' } }
}

function scopedAccess(key: AdminPermissionKey, ids: string[]): AdminPermissionEntry {
  return { key, scope: { type: 'selected', ids } }
}

const SUPER_ADMIN_PERMISSIONS: AdminPermissionEntry[] = ALL_PERMISSION_KEYS.map(fullAccess)

function defaultAdminPermissions(seed: number): AdminPermissionEntry[] {
  const clinicItems = SCOPE_ITEMS['clinic-management'] ?? []
  const userItems = SCOPE_ITEMS['user-management'] ?? []
  const clinicPicks = [
    seed % clinicItems.length,
    (seed + 2) % clinicItems.length,
    (seed + 4) % clinicItems.length,
  ]
  const clinicIds = Array.from(
    new Set(clinicPicks.map((i) => clinicItems[i]?.id).filter(Boolean))
  ) as string[]
  const userIds = [userItems[seed % userItems.length]?.id].filter(Boolean) as string[]

  return [
    fullAccess('dashboard'),
    scopedAccess('clinic-management', clinicIds),
    scopedAccess('user-management', userIds),
    fullAccess('support-centre'),
    fullAccess('settings'),
  ]
}

function managerPermissions(seed: number): AdminPermissionEntry[] {
  const clinicItems = SCOPE_ITEMS['clinic-management'] ?? []
  const ids = [clinicItems[seed % clinicItems.length]?.id].filter(Boolean) as string[]
  return [
    fullAccess('dashboard'),
    scopedAccess('clinic-management', ids),
    fullAccess('reports-analytics'),
  ]
}

function pickRole(i: number): AdminRole {
  if (i % 17 === 0) return 'super-admin'
  if (i % 5 === 0) return 'manager'
  return 'admin'
}

function pickStatus(i: number): AdminStatus {
  if (i % 11 === 0) return 'suspended'
  if (i % 7 === 0) return 'inactive'
  return 'active'
}

function makeAdmin(i: number): AdminRow {
  const first = FIRST_NAMES[i % FIRST_NAMES.length]
  const last = LAST_NAMES[(i * 3) % LAST_NAMES.length]
  const name = `${first} ${last}`
  const day = 1 + (i % 28)
  const month = 1 + (i % 12)
  const year = 2024 + (i % 2)
  const joinDate = new Date(year, month - 1, day).toISOString()
  const lastLogin = new Date(2026, 4, Math.max(1, 23 - (i % 23))).toISOString()
  const role = pickRole(i)
  const status = pickStatus(i)

  let permissions: AdminPermissionEntry[]
  if (role === 'super-admin') permissions = SUPER_ADMIN_PERMISSIONS
  else if (role === 'manager') permissions = managerPermissions(i)
  else permissions = defaultAdminPermissions(i)

  return {
    id: String(23598 + i),
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@kaykaydee.io`,
    phone: `+61 ${2000 + (i % 7999)} ${1000 + (i % 8999)}`,
    clinicName: CLINICS[i % CLINICS.length],
    joinDate,
    lastLogin,
    role,
    status,
    permissions,
  }
}

export const mockAdmins: AdminRow[] = Array.from({ length: 64 }, (_, i) => makeAdmin(i))
