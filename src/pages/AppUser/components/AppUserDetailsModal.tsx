import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { AppUserRow, AppUserStatus } from './AppUserTable'

interface AppUserDetails extends AppUserRow {
  status: AppUserStatus
}

interface AppUserDetailsModalProps {
  user: AppUserDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppUserDetailsModal({ user, open, onOpenChange }: AppUserDetailsModalProps) {
  if (!user) return null

  const isActive = user.status === 'active'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            App user details
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Basic profile and registration information for this app user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div>
            <p className="text-lg font-semibold text-slate-900">{user.patientName}</p>
            <p className="text-sm text-slate-500">
              ID <span className="font-mono text-slate-700">#{user.id}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant={isActive ? 'success' : 'error'}
                className="rounded-full text-xs font-medium capitalize"
              >
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline" className="rounded-full text-xs font-medium">
                App User
              </Badge>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
              </dt>
              <dd className="mt-1 text-sm text-slate-900 break-all">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Contact
              </dt>
              <dd className="mt-1 text-sm text-slate-900">{user.contactNo}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                User join date
              </dt>
              <dd className="mt-1 text-sm text-slate-900">{user.joinedDate}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Address
              </dt>
              <dd className="mt-1 text-sm text-slate-900">{user.address}</dd>
            </div>
          </dl>

          <div>
            <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              Notes
            </h4>
            <p className="text-sm text-slate-700">
              This mock data is for design only. Replace it with real app user details from your API
              when backend integration is ready.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

