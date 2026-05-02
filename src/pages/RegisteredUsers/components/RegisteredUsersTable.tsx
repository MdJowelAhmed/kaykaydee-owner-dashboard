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

export function RegisteredUsersTable({ users, onInfoClick }: RegisteredUsersTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr className="bg-primary text-accent-foreground">
            <th className={cn(thBase, 'text-left')}>Reg. ID</th>
            <th className={cn(thBase, 'text-left')}>User Name</th>
            <th className={cn(thBase, 'text-left')}>Contact</th>
            <th className={cn(thBase, 'text-left')}>Email</th>
            <th className={cn(thBase, 'text-left')}>Package</th>
            <th className={cn(thBase, 'text-left')}>Reg. Date</th>
            <th className={cn(thBase, 'text-right')}>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                No registered users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-muted/50">
                <td className="px-5 py-3 text-sm text-muted-foreground">#{user.id}</td>
                <td className="px-5 py-3 text-sm text-foreground">{user.userName}</td>
                <td className="px-5 py-3 text-sm text-foreground">{user.contactNo}</td>
                <td className="px-5 py-3 text-sm text-foreground">{user.email}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {packageLabel(user.packageKind)}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-foreground">{user.regDateLabel}</td>
                <td className="px-5 py-3 text-right">
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
