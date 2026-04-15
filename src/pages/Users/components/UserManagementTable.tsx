import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { User } from '@/types'

const ROLE_LABELS: Record<User['role'], string> = {
  admin: 'Admin',
  user: 'Staff',
  moderator: 'Doctor',
  editor: 'Doctor',
}

function userDisplayName(user: User) {
  return user.organizationName?.trim() || `${user.firstName} ${user.lastName}`.trim()
}

function statusPillClass(status: User['status']) {
  switch (status) {
    case 'active':
      return 'bg-slate-700 text-white'
    case 'pending':
      return 'bg-amber-600 text-white'
    case 'blocked':
      return 'bg-red-700 text-white'
    case 'inactive':
    default:
      return 'bg-slate-500 text-white'
  }
}

interface UserManagementTableProps {
  users: User[]
  onOpenDetails: (user: User) => void
}

export function UserManagementTable({ users, onOpenDetails }: UserManagementTableProps) {
  return (
    <div className="w-full overflow-auto rounded-b-xl">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="bg-slate-100 text-slate-800">
            <th className="px-6 py-4 text-left text-sm font-semibold">S. No</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">User Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Clinics</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {users.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="transition-colors hover:bg-slate-50/80"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-800">#{user.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{userDisplayName(user)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{ROLE_LABELS[user.role]}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{user.clinicName ?? '—'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{user.phone}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700 break-all">{user.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex min-w-[90px] items-center justify-center rounded-full px-3 py-1 text-center text-xs font-medium capitalize',
                      statusPillClass(user.status)
                    )}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                      aria-label="View details"
                      onClick={() => onOpenDetails(user)}
                    >
                      <Info className="h-5 w-5" strokeWidth={2} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
