import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User, UserFilters, UserAccessPermissions, UserSecurity, PaginationState } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

const ORGS = ['Smart Clinic', 'Care Plus Medical', 'Metro Health', 'Star Clinic', 'Wellness Hub']
const CLINICS = ['Star Clinic', 'Moon Clinic', 'North Medical', 'South Care', 'East Health']
const FIRST = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Priya', 'James', 'Olivia', 'Noah', 'Ava']
const LAST = ['Nguyen', 'Patel', 'Khan', 'Lee', 'Brown', 'Sharma', 'Wilson', 'Garcia', 'Miller', 'Chen']
const ROLES: User['role'][] = ['admin', 'user', 'moderator', 'editor']
const USER_TYPES: User['userType'][] = [
  'doctor',
  'physiotherapist',
  'allied-health',
  'receptionist',
  'clinic-admin',
  'salesperson',
  'support-staff',
  'super-admin',
]
const PACKAGES: NonNullable<User['packagePlan']>[] = ['basic', 'pro', 'enterprise']
const PERMISSION_SETS = [
  ['Patients: read/write', 'Appointments', 'Billing: view'],
  ['Patients: read', 'Reports', 'Settings: limited'],
  ['Full clinical records', 'Prescriptions', 'Staff management'],
  ['Dashboard', 'Patients: read', 'Inventory'],
]
const CITIES = ['Sydney, AU', 'Melbourne, AU', 'Brisbane, AU', 'Perth, AU', 'Auckland, NZ']
const DEVICE_NAMES = ['MacBook Pro', 'Windows PC', 'iPhone 15', 'iPad Air', 'Pixel 8']
const DEVICE_KINDS: User['security']['devices'][number]['kind'][] = [
  'desktop',
  'desktop',
  'mobile',
  'tablet',
  'mobile',
]

/** Access grants are seeded from the user's tier — Enterprise gets everything. */
function buildAccessPermissions(i: number, plan: NonNullable<User['packagePlan']>): UserAccessPermissions {
  const isSuperAdmin = USER_TYPES[i % USER_TYPES.length] === 'super-admin'
  return {
    billing: plan !== 'basic' || i % 2 === 0,
    ai: plan === 'enterprise' || i % 3 === 0,
    reporting: plan !== 'basic',
    whiteLabel: plan === 'enterprise',
    adminPrivileges: isSuperAdmin || i % 5 === 0,
  }
}

function buildSecurity(i: number, lastLogin: Date): UserSecurity {
  const ip = `103.${20 + (i % 200)}.${i % 256}.${(i * 7) % 256}`
  const loginActivity = Array.from({ length: 4 }, (_, k) => {
    const ts = new Date(lastLogin.getTime() - k * 86400000 - k * 3600000)
    return {
      id: `${i}-login-${k}`,
      timestamp: ts.toISOString(),
      device: DEVICE_NAMES[(i + k) % DEVICE_NAMES.length],
      location: CITIES[(i + k) % CITIES.length],
      ipAddress: `103.${20 + ((i + k) % 200)}.${(i + k) % 256}.${((i + k) * 7) % 256}`,
      status: (k === 2 && i % 4 === 0 ? 'failed' : 'success') as 'success' | 'failed',
    }
  })
  const devices = Array.from({ length: 2 + (i % 2) }, (_, k) => ({
    id: `${i}-device-${k}`,
    name: DEVICE_NAMES[(i + k) % DEVICE_NAMES.length],
    kind: DEVICE_KINDS[(i + k) % DEVICE_KINDS.length],
    lastActiveAt: new Date(lastLogin.getTime() - k * 86400000 * 2).toISOString(),
    location: CITIES[(i + k) % CITIES.length],
    current: k === 0,
  }))
  const suspiciousAlerts =
    i % 6 === 0
      ? [
          {
            id: `${i}-alert-0`,
            timestamp: new Date(lastLogin.getTime() - 2 * 3600000).toISOString(),
            reason: 'Login from an unrecognised device and location',
            location: CITIES[(i + 3) % CITIES.length],
            ipAddress: ip,
            resolved: false,
          },
        ]
      : []
  return {
    twoFactorEnabled: i % 3 !== 0,
    twoFactorEnforced: i % 4 === 0,
    lastPasswordResetAt:
      i % 2 === 0
        ? new Date(lastLogin.getTime() - (30 + (i % 60)) * 86400000).toISOString()
        : undefined,
    loginActivity,
    devices,
    suspiciousAlerts,
  }
}

function buildMockUsers(): User[] {
  const users: User[] = []
  for (let i = 0; i < 150; i++) {
    const id = String(1_458_100 + i)
    const created = new Date(2024, i % 12, (i % 28) + 1)
    const lastLogin = new Date(created.getTime() + (i % 20) * 86400000 + 3600000 * (i % 12))
    const plan = PACKAGES[i % PACKAGES.length]
    users.push({
      id,
      firstName: FIRST[i % FIRST.length],
      lastName: LAST[i % LAST.length],
      organizationName: ORGS[i % ORGS.length],
      clinicName: CLINICS[i % CLINICS.length],
      email: `user${i}.cli@gmail.com`,
      phone: `+61 ${2569 + (i % 900)} ${2569 + (i % 900)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      role: ROLES[i % ROLES.length],
      userType: USER_TYPES[i % USER_TYPES.length],
      status: i % 9 === 0 ? 'pending' : i % 11 === 0 ? 'inactive' : 'active',
      packagePlan: plan,
      membershipType: i % 2 === 0 ? 'subscription' : 'member',
      createdAt: created.toISOString(),
      updatedAt: new Date().toISOString(),
      address: `${100 + (i % 80)} George Street`,
      city: 'Sydney',
      country: 'Australia',
      lastLoginAt: lastLogin.toISOString(),
      permissions: PERMISSION_SETS[i % PERMISSION_SETS.length],
      accessPermissions: buildAccessPermissions(i, plan),
      security: buildSecurity(i, lastLogin),
    })
  }
  return users
}

const mockUsers = buildMockUsers()

interface UserState {
  list: User[]
  filteredList: User[]
  selectedUser: User | null
  filters: UserFilters
  pagination: PaginationState
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  list: mockUsers,
  filteredList: mockUsers,
  selectedUser: null,
  filters: {
    search: '',
    status: 'all',
    role: 'all',
    userType: 'all',
    package: 'all',
  },
  pagination: {
    ...DEFAULT_PAGINATION,
    total: mockUsers.length,
    totalPages: Math.ceil(mockUsers.length / DEFAULT_PAGINATION.limit),
  },
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload
      state.filteredList = action.payload
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      let filtered = [...state.list]

      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.phone.includes(state.filters.search) ||
            user.organizationName?.toLowerCase().includes(searchLower) ||
            user.clinicName?.toLowerCase().includes(searchLower)
        )
      }

      if (state.filters.status !== 'all') {
        filtered = filtered.filter((user) => user.status === state.filters.status)
      }

      if (state.filters.role !== 'all') {
        filtered = filtered.filter((user) => user.role === state.filters.role)
      }

      if (state.filters.userType !== 'all') {
        filtered = filtered.filter((user) => user.userType === state.filters.userType)
      }

      if (state.filters.package !== 'all') {
        filtered = filtered.filter((user) => user.packagePlan === state.filters.package)
      }

      state.filteredList = filtered
      state.pagination.total = filtered.length
      state.pagination.totalPages = Math.ceil(filtered.length / state.pagination.limit)
      state.pagination.page = 1
    },
    clearFilters: (state) => {
      state.filters = { search: '', status: 'all', role: 'all', userType: 'all', package: 'all' }
      state.filteredList = state.list
      state.pagination.total = state.list.length
      state.pagination.totalPages = Math.ceil(state.list.length / state.pagination.limit)
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
    updateUserStatus: (state, action: PayloadAction<{ id: string; status: User['status'] }>) => {
      const { id, status } = action.payload
      const userIndex = state.list.findIndex((u) => u.id === id)
      if (userIndex !== -1) {
        state.list[userIndex].status = status
        state.list[userIndex].updatedAt = new Date().toISOString()
      }
      const filteredIndex = state.filteredList.findIndex((u) => u.id === id)
      if (filteredIndex !== -1) {
        state.filteredList[filteredIndex].status = status
        state.filteredList[filteredIndex].updatedAt = new Date().toISOString()
      }
    },
    /** Grant/revoke a single access flag for a user. */
    updateUserAccessPermission: (
      state,
      action: PayloadAction<{
        id: string
        key: keyof User['accessPermissions']
        value: boolean
      }>
    ) => {
      const { id, key, value } = action.payload
      const now = new Date().toISOString()
      for (const collection of [state.list, state.filteredList]) {
        const user = collection.find((u) => u.id === id)
        if (user) {
          user.accessPermissions[key] = value
          user.updatedAt = now
        }
      }
    },
    /** Patch a user's security posture (2FA, password reset, alerts, devices). */
    updateUserSecurity: (
      state,
      action: PayloadAction<{ id: string; patch: Partial<User['security']> }>
    ) => {
      const { id, patch } = action.payload
      const now = new Date().toISOString()
      for (const collection of [state.list, state.filteredList]) {
        const user = collection.find((u) => u.id === id)
        if (user) {
          user.security = { ...user.security, ...patch }
          user.updatedAt = now
        }
      }
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.unshift(action.payload)
      state.filteredList.unshift(action.payload)
      state.pagination.total += 1
      state.pagination.totalPages = Math.ceil(state.filteredList.length / state.pagination.limit)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const userIndex = state.list.findIndex((u) => u.id === action.payload.id)
      if (userIndex !== -1) {
        state.list[userIndex] = { ...action.payload, updatedAt: new Date().toISOString() }
      }
      const filteredIndex = state.filteredList.findIndex((u) => u.id === action.payload.id)
      if (filteredIndex !== -1) {
        state.filteredList[filteredIndex] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((u) => u.id !== action.payload)
      state.filteredList = state.filteredList.filter((u) => u.id !== action.payload)
      state.pagination.total -= 1
      state.pagination.totalPages = Math.ceil(state.filteredList.length / state.pagination.limit)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setUsers,
  setSelectedUser,
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  updateUserStatus,
  updateUserAccessPermission,
  updateUserSecurity,
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
} = userSlice.actions

export default userSlice.reducer
