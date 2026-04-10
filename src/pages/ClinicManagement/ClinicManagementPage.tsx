import { useMemo, useEffect } from 'react'
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
import { ClinicTable } from './components/ClinicTable'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setFilters, setPage, setLimit } from '@/redux/slices/clinicSlice'
import { useUrlParams } from '@/hooks/useUrlState'
import { USER_PACKAGES, CLINIC_STATUSES } from '@/utils/constants'
import type { Clinic } from '@/types'

export default function ClinicManagementPage() {
  const dispatch = useAppDispatch()
  const { filteredList, pagination } = useAppSelector((state) => state.clinics)

  const { getParam, getNumberParam, setParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const status = getParam('status', 'all')
  const packageFilter = getParam('package', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  useEffect(() => {
    dispatch(
      setFilters({
        search,
        status: status as Clinic['status'] | 'all',
        package: (packageFilter === 'all' ? 'all' : packageFilter) as Clinic['packagePlan'] | 'all',
      })
    )
  }, [search, status, packageFilter, dispatch])

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

  const handlePageChange = (newPage: number) => {
    setParam('page', newPage)
  }

  const handleAddClinic = () => {
    toast.message('Add clinic', { description: 'Connect this action to your API when ready.' })
  }

  const handleInfo = (clinic: Clinic) => {
    toast.message(clinic.name, {
      description: `${clinic.email} · ${clinic.staff} staff · ${clinic.patients} patients`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8"
    >
      <Card className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3 min-w-0 sm:flex-row sm:items-center">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full sm:flex-1 sm:max-w-xl"
                inputClassName="h-11 rounded-full border-slate-200 bg-white"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select value={packageFilter} onValueChange={handlePackageFilter}>
                  <SelectTrigger className="h-11 w-full sm:w-44 rounded-full border-slate-200 bg-white">
                    <SelectValue placeholder="Package" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_PACKAGES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="h-11 w-full sm:w-44 rounded-full border-slate-200 bg-white">
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
            <Button
              type="button"
              onClick={handleAddClinic}
              className="h-11 shrink-0 rounded-full bg-[#1A284B] px-5 text-white hover:bg-[#1A284B]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Clinics
            </Button>
          </div>
        </CardContent>
      </Card>

      <ClinicTable clinics={paginatedData} onInfo={handleInfo} />

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
    </motion.div>
  )
}
