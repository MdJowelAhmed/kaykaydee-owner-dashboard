import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PackageKind = 'free_trial' | 'basic' | 'pro' | 'enterprise' | 'none'

interface RegisteredUserRow {
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

export function RegisteredUsersTable({ users, onInfoClick }: RegisteredUsersTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr className="bg-[#F5F6F8] text-[#868686]">
            <th className="px-5 py-4 text-left text-sm font-medium">Reg. ID</th>
            <th className="px-5 py-4 text-left text-sm font-medium">User Name</th>
            <th className="px-5 py-4 text-left text-sm font-medium">Contact</th>
            <th className="px-5 py-4 text-left text-sm font-medium">Email</th>
            <th className="px-5 py-4 text-left text-sm font-medium">Package</th>
            <th className="px-5 py-4 text-left text-sm font-medium">Reg. Date</th>
            <th className="px-5 py-4 text-right text-sm font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                No registered users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3 text-sm text-[#666666]">#{user.id}</td>
                <td className="px-5 py-3 text-sm text-[#666666]">{user.userName}</td>
                <td className="px-5 py-3 text-sm text-[#666666]">{user.contactNo}</td>
                <td className="px-5 py-3 text-sm text-[#666666]">{user.email}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex rounded-md bg-[#EDEFF3] px-3 py-1 text-xs font-medium text-[#6F6F6F]">
                    {packageLabel(user.packageKind)}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-[#666666]">{user.regDateLabel}</td>
                <td className="px-5 py-3 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="h-7 w-7 rounded-full text-[#6F6F6F] hover:bg-slate-100"
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

