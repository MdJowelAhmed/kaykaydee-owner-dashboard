import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { RegisteredUsersTable } from './components/RegisteredUsersTable'

type UserStatus = 'active' | 'inactive'
type Dateline = 'subscription' | 'member'
type PackageKind = 'free_trial' | 'basic' | 'pro' | 'enterprise' | 'none'

interface RegisteredUserRow {
  id: string
  userName: string
  contactNo: string
  email: string
  packageKind: PackageKind
  regDateLabel: string
  regDateIso: string
  status: UserStatus
  dateline: Dateline
}

const REG_DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'Reg. Date' },
  { value: 'last-7-days', label: 'Last 7 days' },
  { value: 'last-30-days', label: 'Last 30 days' },
  { value: 'this-year', label: 'This year' },
]

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const DATELINE_FILTER_OPTIONS = [
  { value: 'all', label: 'Dateline' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'member', label: 'Member' },
]

function formatRegDateLabel(iso: string) {
  const d = new Date(iso)
  const day = d.getDate()
  const monthShort = d
    .toLocaleString('en-US', { month: 'short' })
    .replace('.', '')
    .toLowerCase()
  const year = d.getFullYear()
  return `${day},${monthShort} ${year}`
}

function createMockUsers(): RegisteredUserRow[] {
  const total = 150
  const baseDate = new Date('2026-01-02T12:00:00Z')

  return Array.from({ length: total }, (_, index) => {
    const regDateIso = new Date(baseDate.getTime() + (index % 4) * 86400000).toISOString()

    let packageKind: PackageKind
    if (index % 13 === 0) packageKind = 'free_trial'
    else if (index % 9 === 0) packageKind = 'none'
    else if (index % 5 === 0) packageKind = 'enterprise'
    else if (index % 2 === 0) packageKind = 'basic'
    else packageKind = 'pro'

    const dateline: Dateline = packageKind === 'none' ? 'member' : 'subscription'
    const status: UserStatus = index % 6 === 0 ? 'inactive' : 'active'

    return {
      id: '265853',
      userName: 'Zoya Clinic',
      contactNo: `+61 ${2569 + (index % 900)} ${2569 + (index % 900)}`,
      email: 'amar.tcli@gmail.com',
      packageKind,
      regDateIso,
      regDateLabel: formatRegDateLabel(regDateIso),
      status,
      dateline,
    }
  })
}

const mockUsers = createMockUsers()

export default function RegisteredUsersPage() {
  const [search, setSearch] = useState('')
  const [regDateFilter, setRegDateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [datelineFilter, setDatelineFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [users] = useState<RegisteredUserRow[]>(mockUsers)

  const itemsPerPage = 15

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    const normalizedQuery = q.length ? q : null

    const baseNow = new Date('2026-01-02T12:00:00Z')
    const nowMs = baseNow.getTime()

    return users.filter((user) => {
      const matchesSearch =
        !normalizedQuery ||
        user.id.toLowerCase().includes(normalizedQuery) ||
        user.userName.toLowerCase().includes(normalizedQuery) ||
        user.contactNo.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery)

      if (!matchesSearch) return false

      if (statusFilter !== 'all' && user.status !== statusFilter) return false
      if (datelineFilter !== 'all' && user.dateline !== datelineFilter) return false

      if (regDateFilter !== 'all') {
        const regMs = new Date(user.regDateIso).getTime()
        const diffMs = nowMs - regMs
        const within7Days = diffMs >= 0 && diffMs <= 7 * 86400000
        const within30Days = diffMs >= 0 && diffMs <= 30 * 86400000
        const thisYear = new Date(user.regDateIso).getFullYear() === baseNow.getFullYear()

        if (regDateFilter === 'last-7-days' && !within7Days) return false
        if (regDateFilter === 'last-30-days' && !within30Days) return false
        if (regDateFilter === 'this-year' && !thisYear) return false
      }

      return true
    })
  }, [users, search, regDateFilter, statusFilter, datelineFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage])

  const handleInfoClick = (user: { userName: string; email: string; contactNo: string }) => {
    toast.message(user.userName, {
      description: `${user.email} · ${user.contactNo}`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value)
                setCurrentPage(1)
              }}
              placeholder="Search here"
              className="w-full lg:max-w-xl"
              inputClassName="h-11 rounded-full border-slate-200 bg-white"
            />

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Select
                value={regDateFilter}
                onValueChange={(value) => {
                  setRegDateFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-full sm:w-44 rounded-full bg-[#F5F6F8] border-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REG_DATE_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-full sm:w-36 rounded-full bg-[#F5F6F8] border-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={datelineFilter}
                onValueChange={(value) => {
                  setDatelineFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-full sm:w-36 rounded-full bg-[#F5F6F8] border-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATELINE_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardContent className="p-0">
          <RegisteredUsersTable users={paginatedUsers} onInfoClick={handleInfoClick} />

          <div className="border-t border-slate-100 px-4 sm:px-6">
            <Pagination
              variant="minimal"
              currentPage={Math.min(currentPage, totalPages)}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={undefined}
              showItemsPerPage={false}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
