import { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
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
import { ClinicTable } from './components/ClinicTable'
import { AddClinicModal } from './components/AddClinicModal'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setFilters, setPage, setLimit, addClinic } from '@/redux/slices/clinicSlice'
import { useUrlParams } from '@/hooks/useUrlState'
import { USER_PACKAGES, CLINIC_STATUSES, CLINIC_REVENUE_BUCKETS } from '@/utils/constants'
import type { Clinic } from '@/types'

export default function ClinicManagementPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { list, filteredList, pagination } = useAppSelector((state) => state.clinics)
  const [addClinicOpen, setAddClinicOpen] = useState(false)

  const { getParam, getNumberParam, setParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const status = getParam('status', 'all')
  const packageFilter = getParam('package', 'all')
  const country = getParam('country', 'all')
  const revenue = getParam('revenue', 'all')
  const salesperson = getParam('salesperson', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  // Filter options are derived from the data so they stay in sync.
  const countryOptions = useMemo(() => {
    const unique = Array.from(new Set(list.map((c) => c.country))).sort()
    return [{ value: 'all', label: 'All Countries' }, ...unique.map((c) => ({ value: c, label: c }))]
  }, [list])

  const salespersonOptions = useMemo(() => {
    const unique = Array.from(new Set(list.map((c) => c.salesperson))).sort()
    return [
      { value: 'all', label: 'All Salespeople' },
      ...unique.map((s) => ({ value: s, label: s })),
    ]
  }, [list])

  useEffect(() => {
    dispatch(
      setFilters({
        search,
        status: status as Clinic['status'] | 'all',
        package: (packageFilter === 'all' ? 'all' : packageFilter) as Clinic['packagePlan'] | 'all',
        country,
        revenue,
        salesperson,
      })
    )
  }, [search, status, packageFilter, country, revenue, salesperson, dispatch])

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

  const handlePackageFilter = (value: string) => {
    setParams({ package: value, page: 1 })
  }

  const handleCountryFilter = (value: string) => {
    setParams({ country: value, page: 1 })
  }

  const handleRevenueFilter = (value: string) => {
    setParams({ revenue: value, page: 1 })
  }

  const handleSalespersonFilter = (value: string) => {
    setParams({ salesperson: value, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    setParam('page', newPage)
  }

  const handleAddClinic = () => {
    setAddClinicOpen(true)
  }

  const handleSaveNewClinic = (clinic: Clinic) => {
    dispatch(addClinic(clinic))
    setParams({ page: 1 })
    toast.success('Clinic added', { description: clinic.name })
  }

  const handleOpenClinic = (clinic: Clinic) => {
    navigate(`/clinic-management/${clinic.id}`)
  }

  const filterInputClass =
    'h-11 rounded-xl border-border bg-white dark:bg-background text-accent shadow-sm placeholder:text-accent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Search and filter every clinic on the platform, then open a profile to manage it.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleAddClinic}
            className="h-11 shrink-0 rounded-full bg-secondary px-5 text-secondary-foreground hover:bg-secondary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Clinics
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search by name, country, state or salesperson…"
            className="w-full"
            inputClassName={filterInputClass}
          />
          <div className="flex flex-wrap gap-3">
            <Select value={packageFilter} onValueChange={handlePackageFilter}>
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[170px] ${filterInputClass}`}>
                <SelectValue placeholder="Subscription tier" />
              </SelectTrigger>
              <SelectContent>
                {USER_PACKAGES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={country} onValueChange={handleCountryFilter}>
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[180px] ${filterInputClass}`}>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={revenue} onValueChange={handleRevenueFilter}>
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[170px] ${filterInputClass}`}>
                <SelectValue placeholder="Revenue" />
              </SelectTrigger>
              <SelectContent>
                {CLINIC_REVENUE_BUCKETS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={salesperson} onValueChange={handleSalespersonFilter}>
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[190px] ${filterInputClass}`}>
                <SelectValue placeholder="Salesperson" />
              </SelectTrigger>
              <SelectContent>
                {salespersonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={handleStatusFilter}>
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[150px] ${filterInputClass}`}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {CLINIC_STATUSES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden p-4 rounded-2xl  bg-card shadow-sm">
        <div className="">
          <ClinicTable clinics={paginatedData} onOpenClinic={handleOpenClinic} />
        </div>
      </div>

      <Pagination
        currentPage={Math.min(pagination.page, totalPages)}
        totalPages={totalPages}
        totalItems={filteredList.length}
        itemsPerPage={pagination.limit}
        onPageChange={handlePageChange}
        showItemsPerPage={false}
        variant="minimal"
        className="px-1"
      />

      <AddClinicModal
        open={addClinicOpen}
        onClose={() => setAddClinicOpen(false)}
        onSave={handleSaveNewClinic}
      />
    </motion.div>
  )
}
