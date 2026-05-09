import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
  import { cn } from '@/utils/cn'

export type PackageKind = 'free_trial' | 'basic' | 'pro' | 'enterprise' | 'none'

export interface RegisteredUserRow {
  id: string
  userName: string
  contactNo: string
  email: string
  packageKind: PackageKind
  regDateLabel: string
}

interface RegisteredUsersTableProps {
  users: RegisteredUserRow[]
  onInfoClick: (user: RegisteredUserRow) => void
}

function packageLabel(kind: PackageKind) {
  switch (kind) {
    case 'basic':
      return 'Basic/y'
    case 'pro':
      return 'Pro/y'
    case 'enterprise':
      return 'Premium/y'
    case 'free_trial':
      return 'Free Trial'
    case 'none':
    default:
      return 'N/A'
  }
}

const thBase =
  'bg-primary px-5 py-4 text-sm font-medium text-accent-foreground first:rounded-tl-xl last:rounded-tr-xl'
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'

export function RegisteredUsersTable({ users, onInfoClick }: RegisteredUsersTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl  bg-card ">
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>Reg. ID</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>User Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Contact</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Email</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Package</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Reg. Date</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>Action</th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-sm text-accent-foreground">
                No registered users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-muted/50">
                  <td className={bodyCell}>#{user.id}</td>
                <td className={bodyCell}>{user.userName}</td>
                <td className={bodyCell}>{user.contactNo}</td>
                <td className={bodyCell}>
                  <span className="break-all text-sm text-foreground">{user.email}</span>
                </td>
                <td className={bodyCell}>
                  <span className="inline-flex rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {packageLabel(user.packageKind)}
                    </span>
                </td>
                <td className={bodyCell}>{user.regDateLabel}</td>
                <td className={bodyCell}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="h-7 w-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="User details"
                    onClick={() => onInfoClick(user)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
