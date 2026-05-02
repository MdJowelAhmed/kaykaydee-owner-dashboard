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

export function AppUserTable({ users, onStatusClick, onInfoClick }: AppUserTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr>
            <th className={cn(thBase, 'text-left')}>ID. No</th>
            <th className={cn(thBase, 'text-left')}>Patient Name</th>
            <th className={cn(thBase, 'text-left')}>Contact No</th>
            <th className={cn(thBase, 'text-left')}>Email</th>
            <th className={cn(thBase, 'text-left')}>Date</th>
            <th className={cn(thBase, 'text-left')}>User Join Date</th>
            <th className={cn(thBase, 'text-left')}>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                No app users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-muted/50">
                <td className="px-5 py-3 text-sm text-muted-foreground">#{user.id}</td>
                <td className="px-5 py-3 text-sm text-foreground">{user.patientName}</td>
                <td className="px-5 py-3 text-sm text-foreground">{user.contactNo}</td>
                <td className="px-5 py-3 text-sm text-foreground">{user.email}</td>
                <td className="px-5 py-3 text-sm text-foreground">{user.joinedDate}</td>
                <td className="max-w-[240px] truncate px-5 py-3 text-sm text-foreground">
                  {user.address}
                </td>
                <td className="px-5 py-3">
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
