import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import {
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
  return (
    <span className="inline-flex min-w-[110px] justify-center rounded-md bg-muted px-3 py-1 text-xs font-medium text-foreground">
      {role === 'head-admin' ? 'Head Admin' : 'Admin'}
    </span>
  )
}

function StatusPill({ status }: { status: AdminRow['status'] }) {
  const isActive = status === 'active'
  return (
    <span
      className={cn(
        'inline-flex min-w-[90px] justify-center rounded-md px-3 py-1 text-xs font-semibold',
        isActive
          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
          : 'bg-muted text-muted-foreground'
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

interface AdminTableProps {
  rows: AdminRow[]
  onInfo: (row: AdminRow) => void
  onEdit: (row: AdminRow) => void
}

const thBase =
  'bg-primary px-6 py-4 text-sm font-semibold text-accent-foreground first:rounded-tl-2xl last:rounded-tr-2xl'

export function AdminTable({ rows, onInfo, onEdit }: AdminTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr>
            <th className={cn(thBase, 'text-left')}>Admin Id</th>
            <th className={cn(thBase, 'text-left')}>clinic Name</th>
            <th className={cn(thBase, 'text-left')}>Join Date</th>
            <th className={cn(thBase, 'text-left')}>Role</th>
            <th className={cn(thBase, 'text-left')}>Page Permissions</th>
            <th className={cn(thBase, 'text-left')}>Status</th>
            <th className={cn(thBase, 'text-right')}>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-sm text-muted-foreground">
                No admins found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.04 * index, 0.4) }}
                className="transition-colors hover:bg-muted/50"
              >
                <td className="px-6 py-4 text-sm text-muted-foreground">{row.id}</td>
                <td className="px-6 py-4 text-sm text-foreground">{row.clinicName}</td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatDate(row.joinDate, 'd MMM yyyy')}
                </td>
                <td className="px-6 py-4">
                  <RolePill role={row.role} />
                </td>
                <td className="px-6 py-4">
                  <PermissionsCell permissions={row.permissions} />
                </td>
                <td className="px-6 py-4">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-6 py-4">
                  <AdminRowActions onInfo={() => onInfo(row)} onEdit={() => onEdit(row)} />
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
