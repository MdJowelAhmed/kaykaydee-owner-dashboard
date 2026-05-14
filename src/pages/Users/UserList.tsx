import { useMemo, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
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
import { UserManagementTable } from './components/UserManagementTable'
import { UserDetailsModal } from './components/UserDetailsModal'
import { DeleteUserModal } from './components/DeleteUserModal'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setFilters, setPage, setLimit, deleteUser } from '@/redux/slices/userSlice'
import { useUrlParams } from '@/hooks/useUrlState'
import { USER_STATUSES, USER_TYPES } from '@/utils/constants'
import type { User, UserType } from '@/types'

export default function UserList() {
  const dispatch = useAppDispatch()
  const { filteredList, pagination } = useAppSelector((state) => state.users)

  const { getParam, getNumberParam, setParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const status = getParam('status', 'all')
  const userType = getParam('type', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const { list } = useAppSelector((state) => state.users)
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Read the live record so permission/security edits reflect instantly.
  const detailsUser = useMemo(
    () => list.find((u) => u.id === detailsUserId) ?? null,
    [list, detailsUserId]
  )

  const userToDelete = useMemo(
    () => list.find((u) => u.id === deleteUserId) ?? null,
    [list, deleteUserId]
  )

  useEffect(() => {
    dispatch(
      setFilters({
        search,
        status: status as User['status'] | 'all',
        role: 'all',
        userType: userType as UserType | 'all',
        package: 'all',
      })
    )
  }, [search, status, userType, dispatch])

  useEffect(() => {
    dispatch(setPage(page))
  }, [page, dispatch])

  useEffect(() => {
    dispatch(setLimit(limit))
  }, [limit, dispatch])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pagination.limit))

  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit
    return filteredList.slice(startIndex, startIndex + pagination.limit)
  }, [filteredList, pagination.page, pagination.limit])

  const handleSearch = (value: string) => {
    setParams({ search: value, page: 1 })
  }

  const handleStatusFilter = (value: string) => {
    setParams({ status: value, page: 1 })
  }

  const handleUserTypeFilter = (value: string) => {
    setParams({ type: value, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    setParam('page', newPage)
  }

  const handleItemsPerPageChange = (newLimit: number) => {
    setParams({ limit: newLimit, page: 1 })
  }

  const handleOpenDetails = useCallback((user: User) => {
    setDetailsUserId(user.id)
    setDetailsOpen(true)
  }, [])

  const handleOpenDelete = useCallback((user: User) => {
    setDeleteUserId(user.id)
    setDeleteOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(
    (userId: string) => {
      dispatch(deleteUser(userId))
    },
    [dispatch]
  )
    const filterInputClass =
    'h-11 rounded-xl border-border bg-white dark:bg-background text-accent shadow-sm placeholder:text-accent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="overflow-hidden">
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <h1 className="shrink-0 text-xl font-bold text-foreground lg:min-w-[200px]">
              User Management
            </h1>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 justify-end">
              <div className="flex items-center justify-end gap-4">
                <SearchInput
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search here"
                  className="w-[500px] flex-1"
                  inputClassName={filterInputClass}
                />
                <Select value={userType} onValueChange={handleUserTypeFilter}>
                  <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[180px] ${filterInputClass}`}>
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_TYPES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={handleStatusFilter}>
                  <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_STATUSES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl  bg-card shadow-sm">
        <CardContent className="p-4">
          <UserManagementTable
            users={paginatedData}
            onOpenDetails={handleOpenDetails}
            onDelete={handleOpenDelete}
          />

          <div className="border-t border-border px-4 sm:px-6">
            <Pagination
              variant="minimal"
              currentPage={Math.min(pagination.page, totalPages)}
              totalPages={totalPages}
              totalItems={filteredList.length}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPage={false}
            />
          </div>
        </CardContent>
      </Card>

      <UserDetailsModal
        user={detailsUser}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setDetailsUserId(null)
        }}
      />

      <DeleteUserModal
        user={userToDelete}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteUserId(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </motion.div>
  )
}
