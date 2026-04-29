import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type AppUserStatus = 'active' | 'inactive'

interface AppUserRow {
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
}

export function AppUserTable({ users, onStatusClick }: AppUserTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-5 py-4 text-left text-sm font-medium">ID. No</th>
            <th className="px-5 py-4 text-left text-sm font-medium">Patient Name</th>
            <th className="px-5 py-4 text-left text-sm font-medium">Contact No</th>
            <th className="px-5 py-4 text-left text-sm font-medium">Email</th>
            <th className="px-5 py-4 text-left text-sm font-medium">Date</th>
            <th className="px-5 py-4 text-left text-sm font-medium">User Join Date</th>
            <th className="px-5 py-4 text-left text-sm font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">
                No app users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3 text-sm text-[#666666]">#{user.id}</td>
                <td className="px-5 py-3 text-sm text-[#666666]">{user.patientName}</td>
                <td className="px-5 py-3 text-sm text-[#666666]">{user.contactNo}</td>
                <td className="px-5 py-3 text-sm text-[#666666]">{user.email}</td>
                <td className="px-5 py-3 text-sm text-[#666666]">{user.joinedDate}</td>
                <td className="px-5 py-3 text-sm text-[#666666] max-w-[240px] truncate">
                  {user.address}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-7 w-7 rounded-full text-[#6F6F6F] hover:bg-slate-100"
                      aria-label="User details"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => onStatusClick(user)}
                      className={cn(
                        'text-sm font-medium capitalize',
                        user.status === 'active' ? 'text-[#1CB84E]' : 'text-[#FF5A5F]'
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
