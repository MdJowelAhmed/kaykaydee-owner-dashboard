import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import {
  ADMIN_ROLE_LABELS,
  ADMIN_STATUS_LABELS,
  PERMISSION_OPTIONS,
  SCOPE_ITEMS,
  type AdminPermissionEntry,
  type AdminPermissionKey,
  type AdminRow,
} from '../types'
import { AdminRowActions } from './AdminRowActions'

const PERMISSION_LABELS = PERMISSION_OPTIONS.reduce<Record<AdminPermissionKey, string>>(
  (acc, opt) => {
    acc[opt.value] = opt.label
    return acc
  },
  {} as Record<AdminPermissionKey, string>
)

function describeEntry(entry: AdminPermissionEntry): string {
  const label = PERMISSION_LABELS[entry.key] ?? entry.key
  const items = SCOPE_ITEMS[entry.key] ?? []
  if (entry.scope.type === 'all') {
    return items.length > 0 ? `${label} · All ${items.length}` : label
  }
  return `${label} · ${entry.scope.ids.length}/${items.length}`
}

function PermissionsCell({ permissions }: { permissions: AdminRow['permissions'] }) {
  if (!permissions || permissions.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  const visible = permissions.slice(0, 3)
  const remaining = permissions.length - visible.length

  return (
    <div className="flex max-w-[280px] flex-wrap gap-1">
      {visible.map((entry) => (
        <span
          key={entry.key}
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
            entry.scope.type === 'selected'
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/55 dark:text-amber-300'
              : 'bg-muted text-foreground'
          )}
          title={describeEntry(entry)}
        >
          {PERMISSION_LABELS[entry.key] ?? entry.key}
          {entry.scope.type === 'selected' && (
            <span className="ml-1 font-semibold">({entry.scope.ids.length})</span>
          )}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
          title={permissions.slice(3).map(describeEntry).join(', ')}
        >
          +{remaining} more
        </span>
      )}
    </div>
  )
}

function RolePill({ role }: { role: AdminRow['role'] }) {
  const tone =
    role === 'super-admin'
      ? 'bg-violet-100 text-violet-900 dark:bg-violet-950/55 dark:text-violet-300'
      : role === 'manager'
        ? 'bg-sky-100 text-sky-900 dark:bg-sky-950/55 dark:text-sky-300'
        : 'bg-muted text-foreground'
  return (
    <span
      className={cn(
        'inline-flex min-w-[110px] justify-center rounded-md px-3 py-1 text-xs font-medium',
        tone
      )}
    >
      {ADMIN_ROLE_LABELS[role]}
    </span>
  )
}

function StatusPill({ status }: { status: AdminRow['status'] }) {
  const tone =
    status === 'active'
      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
      : status === 'suspended'
        ? 'bg-red-100 text-red-900 dark:bg-red-950/55 dark:text-red-300'
        : 'bg-muted text-muted-foreground'
  return (
    <span
      className={cn(
        'inline-flex min-w-[90px] justify-center rounded-md px-3 py-1 text-xs font-semibold',
        tone
      )}
    >
      {ADMIN_STATUS_LABELS[status]}
    </span>
  )
}

interface AdminTableProps {
  rows: AdminRow[]
  onInfo: (row: AdminRow) => void
  onEdit: (row: AdminRow) => void
  onDelete: (row: AdminRow) => void
}

const headerBg = 'bg-[#E9EBF0] dark:bg-background'
const headerCell =
  'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'

export function AdminTable({ rows, onInfo, onEdit, onDelete }: AdminTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl bg-card">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr>
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>Admin ID</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Clinic</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Role</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Page permissions</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Last login</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>Action</th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-sm text-muted-foreground">
                No admins found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.04 * index, 0.4) }}
                className="transition-colors hover:bg-muted/40"
              >
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-muted-foreground">#{row.id}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-foreground">{row.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{row.email}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{row.clinicName}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{row.phone}</span>
                </td>
                <td className={bodyCell}>
                  <RolePill role={row.role} />
                </td>
                <td className={bodyCell}>
                  <PermissionsCell permissions={row.permissions} />
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">
                    {formatDate(row.lastLogin, 'd MMM yyyy')}
                  </span>
                </td>
                <td className={bodyCell}>
                  <StatusPill status={row.status} />
                </td>
                <td className={bodyCell}>
                  <AdminRowActions
                    onInfo={() => onInfo(row)}
                    onEdit={() => onEdit(row)}
                    onDelete={() => onDelete(row)}
                  />
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
