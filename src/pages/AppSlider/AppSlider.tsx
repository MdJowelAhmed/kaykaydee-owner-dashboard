import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/DataTable'
import { Pagination } from '@/components/common/Pagination'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { TableColumn } from '@/types'
import { formatDate } from '@/utils/formatters'
import { useUrlNumber } from '@/hooks/useUrlState'
import { cn } from '@/utils/cn'
import { mockAppSliders, type AppSliderItem } from './sliderData'
import { CreateEditSliderModal } from './components/CreateEditSliderModal'
import { SliderRowActionMenu } from './components/SliderRowActionMenu'

function SliderStatusPill({ status }: { status: AppSliderItem['status'] }) {
  const isOngoing = status === 'ongoing'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium',
        isOngoing
          ? 'bg-[#E7F6D5] border-[#6BBF2D] text-[#2E6A0D]'
          : 'bg-orange-50 border-orange-300 text-orange-800'
      )}
    >
      {isOngoing ? 'Ongoing' : 'Pending'}
    </span>
  )
}

function nextDisplaySerial(sliders: AppSliderItem[]): string {
  const nums = sliders.map((s) => parseInt(s.displaySerial.replace(/^#/, ''), 10)).filter(Number.isFinite)
  const next = (nums.length ? Math.max(...nums) : 1000) + 1
  return `#${next}`
}

export default function AppSlider() {
  const [page, setPage] = useUrlNumber('page', 1)
  const [limit, setLimit] = useUrlNumber('limit', 10)

  const [sliders, setSliders] = useState<AppSliderItem[]>(mockAppSliders)
  const [createEditOpen, setCreateEditOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingSlider, setEditingSlider] = useState<AppSliderItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AppSliderItem | null>(null)

  const totalItems = sliders.length
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))

  const pageItems = useMemo(() => {
    const start = (page - 1) * limit
    return sliders.slice(start, start + limit)
  }, [sliders, page, limit])

  const columns: TableColumn<AppSliderItem>[] = useMemo(
    () => [
      {
        key: 'displaySerial',
        label: 'S.No',
        render: (_v, row) => (
          <span className="font-medium text-slate-700">{row.displaySerial}</span>
        ),
      },
      {
        key: 'imageUrl',
        label: 'Image',
        render: (_v, row) => (
          <div className="h-12 w-28 overflow-hidden rounded-md border border-slate-200 bg-muted">
            <img
              src={row.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ),
      },
      {
        key: 'createdAt',
        label: 'Date',
        render: (_v, row) => (
          <span className="text-slate-700">
            {formatDate(row.createdAt, 'd MMMM, yyyy')}
          </span>
        ),
      },
      { key: 'name', label: 'Name' },
      { key: 'buttonLabel', label: 'Button' },
      {
        key: 'status',
        label: 'Status',
        render: (_v, row) => <SliderStatusPill status={row.status} />,
      },
    ],
    []
  )

  const openCreate = () => {
    setModalMode('create')
    setEditingSlider(null)
    setCreateEditOpen(true)
  }

  const openEdit = (slider: AppSliderItem) => {
    setModalMode('edit')
    setEditingSlider(slider)
    setCreateEditOpen(true)
  }

  const handleSave = (payload: {
    name: string
    buttonLabel: string
    imageUrl: string
    status: AppSliderItem['status']
  }) => {
    if (modalMode === 'create') {
      setSliders((prev) => {
        const displaySerial = nextDisplaySerial(prev)
        return [
        {
          id: crypto.randomUUID(),
          displaySerial,
          imageUrl: payload.imageUrl,
          createdAt: new Date().toISOString(),
          name: payload.name,
          buttonLabel: payload.buttonLabel,
          status: payload.status,
        },
        ...prev,
      ]
      })
    } else if (editingSlider) {
      setSliders((prev) =>
        prev.map((s) =>
          s.id === editingSlider.id
            ? {
                ...s,
                imageUrl: payload.imageUrl,
                name: payload.name,
                buttonLabel: payload.buttonLabel,
              }
            : s
        )
      )
    }
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setSliders((prev) => prev.filter((s) => s.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2d2d2d] md:text-3xl">
            App Slider
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Manage home banners and promotional slides shown in the guest app
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          className="rounded-full bg-[#6BBF2D] hover:bg-[#5aad26] text-white shrink-0 gap-2"
        >
          <Plus className="h-5 w-5" />
          Create New Slider
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={pageItems}
        rowKeyExtractor={(row) => row.id}
        headerRowClassName="bg-[#6BBF2D] text-white"
        actionsColumnTitle=""
        actions={(row) => (
          <SliderRowActionMenu
            slider={row}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        )}
        className="shadow-sm border-slate-200"
        emptyMessage="No sliders yet. Create your first banner."
      />

      <div className="border-t border-slate-100 pt-2">
        <Pagination
          currentPage={Math.min(page, totalPages)}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={setPage}
          onItemsPerPageChange={(n) => {
            setLimit(n)
            setPage(1)
          }}
        />
      </div>

      <CreateEditSliderModal
        open={createEditOpen}
        onClose={() => {
          setCreateEditOpen(false)
          setEditingSlider(null)
        }}
        mode={modalMode}
        slider={editingSlider}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete slider"
        description={
          deleteTarget
            ? `Remove “${deleteTarget.name}” from the app slider list? This cannot be undone.`
            : ''
        }
        confirmText="Delete"
      />
    </motion.div>
  )
}
