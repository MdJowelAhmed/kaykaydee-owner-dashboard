import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { FAQTable } from './components/FAQTable'
import { AddEditFAQModal } from './components/AddEditFAQModal'
// import { ViewFAQModal } from './components/ViewFAQModal'
import { DeleteFAQModal } from './components/DeleteFAQModal'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setFilters, setPage, setLimit, deleteFAQ } from '@/redux/slices/faqSlice'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'
import { toast } from '@/utils/toast'
import type { FAQ } from '@/types'

const FAQ = () => {
  const dispatch = useAppDispatch()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null)

  // URL state management
  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  // Redux state
  const { filteredList, pagination } = useAppSelector((state) => state.faqs)

  // Sync URL state with Redux filters
  useEffect(() => {
    dispatch(
      setFilters({
        search: searchQuery,
      })
    )
  }, [searchQuery, dispatch])

  // Sync URL pagination with Redux
  useEffect(() => {
    dispatch(setPage(currentPage))
  }, [currentPage, dispatch])

  useEffect(() => {
    dispatch(setLimit(itemsPerPage))
  }, [itemsPerPage, dispatch])

  // Pagination
  const totalPages = pagination.totalPages
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit
    return filteredList.slice(startIndex, startIndex + pagination.limit)
  }, [filteredList, pagination.page, pagination.limit])

  // Handlers
  // const handleView = (faq: FAQ) => {
  //   setSelectedFAQ(faq)
  //   setIsViewModalOpen(true)
  // }

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq)
    setIsModalOpen(true)
  }

  const handleDelete = (faq: FAQ) => {
    setSelectedFAQ(faq)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedFAQ) {
      dispatch(deleteFAQ(selectedFAQ.id))
      toast({
        title: 'FAQ Deleted',
        description: 'FAQ has been deleted successfully.',
      })
      setSelectedFAQ(null)
    }
  }

  const handleAddNew = () => {
    setSelectedFAQ(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFAQ(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-xl font-bold text-slate-800">FAQ</CardTitle>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search questions & answers"
              className="w-[300px]"
            />

            {/* Filter Dropdown */}
            {/* <FAQFilterDropdown
              value={positionFilter as FAQPosition | 'all'}
              onChange={setPositionFilter}
            /> */}

            {/* Add New FAQ Button */}
            <Button
              onClick={handleAddNew}
              className="bg-primary-foreground hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New FAQ
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table */}
          <FAQTable
            faqs={paginatedData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={filteredList.length}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit FAQ Modal */}
      <AddEditFAQModal
        open={isModalOpen}
        onClose={handleCloseModal}
        faq={selectedFAQ}
      />

      {/* View FAQ Modal - Commented out as View button is hidden */}
      {/* <ViewFAQModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedFAQ(null)
        }}
        faq={selectedFAQ}
      /> */}

      {/* Delete FAQ Modal */}
      <DeleteFAQModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedFAQ(null)
        }}
        faq={selectedFAQ}
        onConfirm={handleConfirmDelete}
      />
    </motion.div>
  )
}

export default FAQ