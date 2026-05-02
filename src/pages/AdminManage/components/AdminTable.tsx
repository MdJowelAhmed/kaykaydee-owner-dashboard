import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import type { AdminRow } from '../types'
import { AdminRowActions } from './AdminRowActions'

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
      <table className="w-full min-w-[980px]">
        <thead>
          <tr>
            <th className={cn(thBase, 'text-left')}>Admin Id</th>
            <th className={cn(thBase, 'text-left')}>clinic Name</th>
            <th className={cn(thBase, 'text-left')}>Join Date</th>
            <th className={cn(thBase, 'text-left')}>Role</th>
            <th className={cn(thBase, 'text-left')}>Status</th>
            <th className={cn(thBase, 'text-right')}>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
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
