import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { RegisteredUserRow, PackageKind } from './RegisteredUsersTable'

interface RegisteredUserDetailsModalProps {
  user: (RegisteredUserRow & {
    status: 'active' | 'inactive'
    dateline: 'subscription' | 'member'
    regDateIso: string
  }) | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function packageBadgeLabel(kind: PackageKind) {
  switch (kind) {
    case 'basic':
      return 'Basic yearly'
    case 'pro':
      return 'Pro yearly'
    case 'enterprise':
      return 'Premium yearly'
    case 'free_trial':
      return 'Free trial'
    case 'none':
    default:
      return 'No package'
  }
}

export function RegisteredUserDetailsModal({
  user,
  open,
  onOpenChange,
}: RegisteredUserDetailsModalProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Registered user details
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Overview of this app user&apos;s registration and package information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div>
            <p className="text-lg font-semibold text-slate-900">{user.userName}</p>
            <p className="text-sm text-slate-500">
              Reg. ID <span className="font-mono text-slate-700">#{user.id}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="rounded-full text-xs font-medium capitalize border-slate-300 text-slate-700"
              >
                {user.status === 'active' ? 'Active user' : 'Inactive user'}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full text-xs font-medium capitalize border-slate-300 text-slate-700"
              >
                {user.dateline === 'subscription' ? 'Subscription' : 'Member'}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full text-xs font-medium border-slate-300 text-slate-700"
              >
                {packageBadgeLabel(user.packageKind)}
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
                Registration date
              </dt>
              <dd className="mt-1 text-sm text-slate-900">{user.regDateLabel}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Registration timestamp
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {new Date(user.regDateIso).toLocaleString()}
              </dd>
            </div>
          </dl>

          <div>
            <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              Notes
            </h4>
            <p className="text-sm text-slate-700">
              This is demo data for design and interaction only. Connect this view to your real
              user detail API when backend is ready.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

