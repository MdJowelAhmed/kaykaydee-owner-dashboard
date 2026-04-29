import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { AppUserTable, type AppUserRow } from './components/AppUserTable'
import { AppUserDetailsModal } from './components/AppUserDetailsModal'

const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'Date' },
  { value: 'last-7-days', label: 'Last 7 days' },
  { value: 'last-30-days', label: 'Last 30 days' },
  { value: 'this-year', label: 'This year' },
]

function createMockUsers(): AppUserRow[] {
  const total = 150
  return Array.from({ length: total }, (_, index) => ({
    id: `265853-${index + 1}`,
    patientName: 'Zoya Clinic',
    contactNo: '+99654165654',
    email: 'zaya@gmail.com',
    joinedDate: '2 Jan 2026',
    address: '2972 Westheimer Rd, Santa Ana, Illinois 85486',
    status: index % 5 === 0 || index % 11 === 0 ? 'inactive' : 'active',
  }))
}

const mockUsers = createMockUsers()

export default function AppUserPage() {
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AppUserRow | null>(null)
  const [detailsUser, setDetailsUser] = useState<AppUserRow | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [users, setUsers] = useState<AppUserRow[]>(mockUsers)

  const itemsPerPage = 15

  const filteredUsers = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        user.id.toLowerCase().includes(normalizedQuery) ||
        user.patientName.toLowerCase().includes(normalizedQuery) ||
        user.contactNo.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery)

      const matchesDate = dateFilter === 'all' ? true : true

      return matchesSearch && matchesDate
    })
  }, [users, search, dateFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage])

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleDateFilter = (value: string) => {
    setDateFilter(value)
    setCurrentPage(1)
  }

  const handleIncludePatient = () => {
    toast.message('Include Patient', {
      description: 'Connect this button to Add Patient flow or API.',
    })
  }

  const handleStatusClick = (user: AppUserRow) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleInfoClick = (user: AppUserRow) => {
    setDetailsUser(user)
    setDetailsOpen(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return

    setIsUpdatingStatus(true)
    try {
      setUsers((prev) =>
        prev.map((item) =>
          item.id === selectedUser.id
            ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
            : item
        )
      )
      toast.success(`Status updated for ${selectedUser.patientName}`)
      setDialogOpen(false)
      setSelectedUser(null)
    } finally {
      setIsUpdatingStatus(false)
    }
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
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end w-full">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full sm:max-w-xl"
                inputClassName="h-11 rounded-xl border-slate-200 bg-white"
              />
              <Select value={dateFilter} onValueChange={handleDateFilter}>
                <SelectTrigger className="h-11 w-full sm:w-36 rounded-xl border-slate-200 bg-white">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={handleIncludePatient}
              className="h-11 shrink-0 rounded-xl bg-[#1A284B] px-5 text-white hover:bg-[#1A284B]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Include Patient
            </Button>
          </div>
        </CardContent>
      </Card>

      <AppUserTable
        users={paginatedUsers}
        onStatusClick={handleStatusClick}
        onInfoClick={handleInfoClick}
      />

      <Pagination
        currentPage={Math.min(currentPage, totalPages)}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        showItemsPerPage={false}
        variant="minimal"
        className="px-1"
      />

      <ConfirmDialog
        open={dialogOpen}
        onClose={() => {
          if (isUpdatingStatus) return
          setDialogOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleConfirmStatusChange}
        onSuccess={() => {
          setDialogOpen(false)
          setSelectedUser(null)
        }}
        title="Change user status?"
        description={`This will mark ${selectedUser?.patientName ?? 'this user'} as ${
          selectedUser?.status === 'active' ? 'inactive' : 'active'
        }.`}
        confirmText="Yes, Change"
        cancelText="Cancel"
        variant="warning"
        isLoading={isUpdatingStatus}
      />

      <AppUserDetailsModal
        user={detailsUser}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) {
            setDetailsUser(null)
          }
        }}
      />
    </motion.div>
  )
}
