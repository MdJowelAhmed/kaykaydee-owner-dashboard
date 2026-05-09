import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export type AppUserStatus = 'active' | 'inactive'

export interface AppUserRow {
  id: string
  patientName: string
  contactNo: string
  email: string
  joinedDate: string
  address: string
  status: AppUserStatus
}

interface AppUserTableProps {
  users: AppUserRow[]
  onStatusClick: (user: AppUserRow) => void
  onInfoClick?: (user: AppUserRow) => void
}

const thBase =
  'bg-primary px-5 py-4 text-sm font-medium text-accent-foreground first:rounded-tl-2xl last:rounded-tr-2xl'
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'

export function AppUserTable({ users, onStatusClick, onInfoClick }: AppUserTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl  bg-card ">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr>
              <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>ID. No</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Patient Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Contact No</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Email</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Date</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>User Join Date</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>Action</th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-8 text-center text-sm text-accent-foreground">
                No app users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-muted/50">
                  <td className={bodyCell}>#{user.id}</td>
                <td className={bodyCell}>{user.patientName}</td>
                <td className={bodyCell}>{user.contactNo}</td>
                <td className={bodyCell}>
                  <span className="break-all text-sm text-foreground">{user.email}</span>
                </td>
                <td className={bodyCell}>{user.joinedDate}</td>
                  <td className={bodyCell}>
                    <span className="break-all text-sm text-foreground">{user.address}</span>
                </td>
                <td className={bodyCell}>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-7 w-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="User details"
                      onClick={() => onInfoClick?.(user)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => onStatusClick(user)}
                      className={cn(
                        'text-sm font-medium capitalize hover:underline',
                        user.status === 'active'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      )}
                    >
                      {user.status}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
