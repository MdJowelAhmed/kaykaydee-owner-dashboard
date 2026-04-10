import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Clinic, ClinicFilters, PaginationState } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

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
const PACKAGES: Clinic['packagePlan'][] = ['basic', 'pro', 'enterprise']

function buildMockClinics(): Clinic[] {
  const rows: Clinic[] = []
  let idBase = 1_458_118
  for (let i = 0; i < 50; i++) {
    rows.push({
      id: String(idBase + i),
      name: NAMES[i % NAMES.length],
      contact: `+61 ${2569 + (i % 900)} ${2100 + (i % 900)}`,
      email: `clinic${i}@health.test`,
      staff: 3 + (i % 25),
      patients: 40 + i * 3,
      status: i % 7 === 0 ? 'deactive' : 'active',
      packagePlan: PACKAGES[i % PACKAGES.length],
    })
  }
  return rows
}

const mockClinics = buildMockClinics()

interface ClinicState {
  list: Clinic[]
  filteredList: Clinic[]
  filters: ClinicFilters
  pagination: PaginationState
  isLoading: boolean
}

const initialState: ClinicState = {
  list: mockClinics,
  filteredList: mockClinics,
  filters: {
    search: '',
    status: 'all',
    package: 'all',
  },
  pagination: {
    ...DEFAULT_PAGINATION,
    limit: 15,
    total: mockClinics.length,
    totalPages: Math.ceil(mockClinics.length / 15),
  },
  isLoading: false,
}

const clinicSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ClinicFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      let filtered = [...state.list]

      if (state.filters.search) {
        const q = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.contact.includes(state.filters.search)
        )
      }

      if (state.filters.status !== 'all') {
        filtered = filtered.filter((c) => c.status === state.filters.status)
      }

      if (state.filters.package !== 'all') {
        filtered = filtered.filter((c) => c.packagePlan === state.filters.package)
      }

      state.filteredList = filtered
      state.pagination.total = filtered.length
      state.pagination.totalPages = Math.ceil(filtered.length / state.pagination.limit)
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
  },
})

export const { setFilters, setPage, setLimit } = clinicSlice.actions

export default clinicSlice.reducer
