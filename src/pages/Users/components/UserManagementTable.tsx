import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { User } from '@/types'
import { userStatusPillClass } from '@/pages/Users/userStatusStyles'

const ROLE_LABELS: Record<User['role'], string> = {
  admin: 'Admin',
  user: 'Staff',
  moderator: 'Doctor',
  editor: 'Doctor',
}

function userDisplayName(user: User) {
  return user.organizationName?.trim() || `${user.firstName} ${user.lastName}`.trim()
}

interface UserManagementTableProps {
  users: User[]
  onOpenDetails: (user: User) => void
}

/** Per-cell: many browsers ignore `tr` background; `th` gets `var(--primary)` so light/dark switches correctly */
const thBase =
  'bg-primary px-6 py-4 text-sm font-semibold text-accent-foreground first:rounded-tl-xl last:rounded-tr-xl'

export function UserManagementTable({ users, onOpenDetails }: UserManagementTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
    return (
    <div className="w-full overflow-auto rounded-b-xl">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>S. No</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>User Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Role</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Clinics</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Contact</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Email</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>Action</th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {users.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-accent-foreground">
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
                className="transition-colors hover:bg-muted/50"
              >
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-foreground">#{user.id}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{userDisplayName(user)}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{ROLE_LABELS[user.role]}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{user.clinicName ?? '—'}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{user.phone}</span>
                </td>
                <td className={bodyCell}>
                  <span className="break-all text-sm text-foreground">{user.email}</span>
                </td>
                <td className={bodyCell}>
                  <span
                    className={cn(
                      'inline-flex min-w-[90px] items-center justify-center rounded-full px-3 py-1 text-center text-xs font-medium capitalize',
                      userStatusPillClass(user.status)
                    )}
                  >
                    {user.status}
                  </span>
                </td>
                <td className={bodyCell}>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
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
