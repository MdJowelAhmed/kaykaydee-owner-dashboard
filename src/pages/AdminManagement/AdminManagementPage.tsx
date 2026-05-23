import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
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
import { useUrlParams } from '@/hooks/useUrlState'
import { toast } from '@/utils/toast'
import { mockAdmins } from './adminData'
import { AdminTable } from './components/AdminTable'
import { AddEditAdminModal } from './components/AddEditAdminModal'
import { AdminDetailsDrawer } from './components/AdminDetailsDrawer'
import {
  type AdminPermissionEntry,
  type AdminRole,
  type AdminRow,
  type AdminStatus,
} from './types'

const STATUS_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
] as const

const ROLE_FILTERS = [
  { value: 'all', label: 'All Roles' },
  { value: 'super-admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
] as const

export default function AdminManagementPage() {
  const { getParam, getNumberParam, setParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const status = getParam('status', 'all')
  const role = getParam('role', 'all')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [rows, setRows] = useState<AdminRow[]>(mockAdmins)
  const [detailRow, setDetailRow] = useState<AdminRow | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<AdminRow | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminRow | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (role !== 'all' && r.role !== role) return false
      if (!q) return true
      return (
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.clinicName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.replace(/\s/g, '').toLowerCase().includes(q.replace(/\s/g, ''))
      )
    })
  }, [rows, search, status, role])

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
    name: string
    clinicName: string
    email: string
    phone: string
    role: AdminRole
    status: AdminStatus
    permissions: AdminPermissionEntry[]
  }) => {
    if (modalMode === 'create') {
      const newRow: AdminRow = {
        id: String(10000 + Math.floor(Math.random() * 90000)),
        name: payload.name,
        clinicName: payload.clinicName,
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
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
                name: payload.name,
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

  const confirmDelete = () => {
    if (!pendingDelete) return
    setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id))
    toast({ variant: 'success', title: 'Admin removed', description: pendingDelete.name })
    setPendingDelete(null)
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Admin Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage platform admins and the pages each one can access.
            </p>
          </div>
          <Button
            type="button"
            onClick={openCreate}
            className="h-11 shrink-0 rounded-full bg-secondary px-5 text-secondary-foreground hover:bg-secondary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <SearchInput
            value={search}
            onChange={(v) => setParams({ search: v, page: 1 })}
            placeholder="Search by name, clinic, email or phone…"
            className="w-full"
            inputClassName={filterInputClass}
          />
          <div className="flex flex-wrap gap-3">
            <Select value={role} onValueChange={(v) => setParams({ role: v, page: 1 })}>
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[180px] ${filterInputClass}`}>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_FILTERS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setParams({ status: v, page: 1 })}>
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[170px] ${filterInputClass}`}>
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
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card p-4 shadow-sm">
        <AdminTable
          rows={paginated}
          onInfo={setDetailRow}
          onEdit={openEdit}
          onDelete={setPendingDelete}
        />
      </div>

      <Pagination
        currentPage={Math.min(page, totalPages)}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={limit}
        onPageChange={(p) => setParam('page', p)}
        showItemsPerPage={false}
        variant="minimal"
        className="px-1"
      />

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

      <AdminDetailsDrawer
        admin={detailRow}
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Remove admin"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.name} from the admin list? This cannot be undone.`
            : ''
        }
        confirmText="Remove"
        variant="danger"
      />
    </motion.div>
  )
}
