import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { RegisteredUsersTable, type RegisteredUserRow } from './components/RegisteredUsersTable'
import { RegisteredUserDetailsModal } from './components/RegisteredUserDetailsModal'

type UserStatus = 'active' | 'inactive'
type Dateline = 'subscription' | 'member'
type PackageKind = 'free_trial' | 'basic' | 'pro' | 'enterprise' | 'none'

type RegisteredUserForState = RegisteredUserRow & {
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

function createMockUsers(): RegisteredUserForState[] {
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
  const [selectedUser, setSelectedUser] = useState<RegisteredUserForState | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const [users] = useState<RegisteredUserForState[]>(mockUsers)

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

  const paginatedUsers: RegisteredUserRow[] = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage])

  const handleInfoClick = (user: RegisteredUserRow) => {
    const full = users.find((u) => u.id === user.id && u.email === user.email)
    setSelectedUser(full ?? { ...user, regDateIso: new Date().toISOString(), status: 'active', dateline: 'subscription' })
    setDetailsOpen(true)
  }

  const filterInputClass =
    'h-11 rounded-xl border-border bg-white dark:bg-background text-accent shadow-sm placeholder:text-accent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="overflow-hidden">
        <div>
         
         

            <div className="flex flex-wrap items-center justify-end gap-3">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value)
                setCurrentPage(1)
              }}
              placeholder="Search here"
              className="w-full lg:max-w-xl"
              inputClassName={filterInputClass}
            />
              <Select
                value={regDateFilter}
                onValueChange={(value) => {
                  setRegDateFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
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
                <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
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
                <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
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
       
      </div>

      <div className="overflow-hidden p-4 rounded-2xl border border-border bg-card shadow-sm">
        <div className="">
          <RegisteredUsersTable users={paginatedUsers} onInfoClick={handleInfoClick} />

          <div className="border-t border-border px-4 sm:px-6">
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
        </div>
      </div>

      <RegisteredUserDetailsModal
        user={selectedUser}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setSelectedUser(null)
        }}
      />
    </motion.div>
  )
}
