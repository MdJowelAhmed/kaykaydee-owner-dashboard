import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
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
import { DrawerWrapper } from '@/components/common/DrawerWrapper'
import { useUrlParams } from '@/hooks/useUrlState'
import { formatDate } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import { mockAdmins } from './adminData'
import { AdminTable } from './components/AdminTable'
import { AddEditAdminModal } from './components/AddEditAdminModal'
import {
  PERMISSION_OPTIONS,
  SCOPE_ITEMS,
  type AdminPermissionEntry,
  type AdminPermissionKey,
  type AdminRow,
} from './types'

const STATUS_FILTERS = [
  { value: 'all', label: 'Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const

export default function AdminManagePage() {
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const status = getParam('status', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [rows, setRows] = useState<AdminRow[]>(mockAdmins)
  const [detailRow, setDetailRow] = useState<AdminRow | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<AdminRow | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (!q) return true
      return (
        r.id.toLowerCase().includes(q) ||
        r.clinicName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.replace(/\s/g, '').toLowerCase().includes(q.replace(/\s/g, ''))
      )
    })
  }, [rows, search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))

  const paginated = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * limit
    return filtered.slice(start, start + limit)
  }, [filtered, page, limit, totalPages])

  const openCreate = () => {
    setModalMode('create')
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row: AdminRow) => {
    setModalMode('edit')
    setEditing(row)
    setModalOpen(true)
  }

  const handleSave = (payload: {
    clinicName: string
    email: string
    phone: string
    role: AdminRow['role']
    status: AdminRow['status']
    permissions: AdminPermissionEntry[]
  }) => {
    if (modalMode === 'create') {
      const newRow: AdminRow = {
        id: String(10000 + Math.floor(Math.random() * 90000)),
        clinicName: payload.clinicName,
        joinDate: new Date().toISOString(),
        role: payload.role,
        status: payload.status,
        email: payload.email,
        phone: payload.phone,
        permissions: payload.permissions,
      }
      setRows((prev) => [newRow, ...prev])
      setParams({ page: 1 })
    } else if (editing) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? {
                ...r,
                clinicName: payload.clinicName,
                email: payload.email,
                phone: payload.phone,
                role: payload.role,
                status: payload.status,
                permissions: payload.permissions,
              }
            : r
        )
      )
    }
  }

  const permissionLabel = (key: AdminPermissionKey) =>
    PERMISSION_OPTIONS.find((o) => o.value === key)?.label ?? key

  const scopeSummary = (entry: AdminPermissionEntry) => {
    const items = SCOPE_ITEMS[entry.key] ?? []
    if (entry.scope.type === 'all') {
      return items.length > 0 ? `All ${items.length}` : 'Full access'
    }
    return `${entry.scope.ids.length} of ${items.length}`
  }

  const scopeItemLabels = (entry: AdminPermissionEntry): string[] => {
    if (entry.scope.type === 'all') return []
    const items = SCOPE_ITEMS[entry.key] ?? []
    return entry.scope.ids
      .map((id) => items.find((i) => i.id === id)?.label)
      .filter((x): x is string => Boolean(x))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <Card className="overflow-hidden rounded-2xl bg-card shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h1 className="shrink-0 text-xl font-bold text-foreground">Admin Manage</h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
              <SearchInput
                value={search}
                onChange={(v) => setParams({ search: v, page: 1 })}
                placeholder="Search here"
                className="w-full sm:w-[320px]"
                inputClassName="h-11 rounded-full border-border bg-background text-foreground placeholder:text-muted-foreground"
              />

              <Select value={status} onValueChange={(v) => setParams({ status: v, page: 1 })}>
                <SelectTrigger className="h-11 w-full rounded-full border-border bg-background text-foreground sm:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                onClick={openCreate}
                className="h-11 shrink-0 gap-2 rounded-md bg-secondary px-5 text-secondary-foreground hover:bg-secondary/90"
              >
                <Plus className="h-5 w-5" />
                Add Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <CardContent className="p-0">
          <AdminTable rows={paginated} onInfo={setDetailRow} onEdit={openEdit} />

          <div className="border-t border-border px-4 sm:px-6">
            <Pagination
              variant="minimal"
              showItemsPerPage={false}
              currentPage={Math.min(page, totalPages)}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={limit}
              onPageChange={(p) => setParams({ page: p })}
            />
          </div>
        </CardContent>
      </Card>

      <AddEditAdminModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        mode={modalMode}
        admin={editing}
        onSave={handleSave}
      />

      <DrawerWrapper
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
        title="Admin details"
        description={detailRow ? `${detailRow.clinicName} · ${detailRow.id}` : undefined}
        size="xl"
      >
        {detailRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Admin Id</dt>
              <dd className="font-medium text-foreground">{detailRow.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium capitalize text-foreground">{detailRow.status}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Clinic name</dt>
              <dd className="font-medium text-foreground">{detailRow.clinicName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-medium text-foreground">
                {detailRow.role === 'head-admin' ? 'Head Admin' : 'Admin'}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all font-medium text-foreground">{detailRow.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium text-foreground">{detailRow.phone}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Join date</dt>
              <dd className="font-medium text-foreground">
                {formatDate(detailRow.joinDate, 'd MMM yyyy')}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Page permissions</dt>
              <dd className="mt-1 space-y-2">
                {detailRow.permissions && detailRow.permissions.length > 0 ? (
                  detailRow.permissions.map((entry) => {
                    const labels = scopeItemLabels(entry)
                    const isAll = entry.scope.type === 'all'
                    return (
                      <div
                        key={entry.key}
                        className="rounded-lg border border-border bg-muted/40 px-3 py-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {permissionLabel(entry.key)}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                              isAll
                                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-900 dark:bg-amber-950/55 dark:text-amber-300'
                            )}
                          >
                            {scopeSummary(entry)}
                          </span>
                        </div>
                        {!isAll && labels.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {labels.map((l) => (
                              <span
                                key={l}
                                className="rounded-full bg-card px-2 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {l}
                              </span>
                            ))}
                          </div>
                        )}
                        {!isAll && labels.length === 0 && (
                          <p className="mt-1 text-[11px] text-destructive">No items selected</p>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">No permissions</span>
                )}
              </dd>
            </div>
          </dl>
        )}
      </DrawerWrapper>
    </motion.div>
  )
}

