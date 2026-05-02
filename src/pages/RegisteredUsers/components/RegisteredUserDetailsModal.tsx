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
  user:
    | (RegisteredUserRow & {
        status: 'active' | 'inactive'
        dateline: 'subscription' | 'member'
        regDateIso: string
      })
    | null
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
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Registered user details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Overview of this app user&apos;s registration and package information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div>
            <p className="text-lg font-semibold text-foreground">{user.userName}</p>
            <p className="text-sm text-muted-foreground">
              Reg. ID <span className="font-mono text-foreground">#{user.id}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-border text-xs font-medium capitalize text-foreground"
              >
                {user.status === 'active' ? 'Active user' : 'Inactive user'}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-border text-xs font-medium capitalize text-foreground"
              >
                {user.dateline === 'subscription' ? 'Subscription' : 'Member'}
              </Badge>
              <Badge variant="outline" className="rounded-full border-border text-foreground">
                {packageBadgeLabel(user.packageKind)}
              </Badge>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 break-all text-sm text-foreground">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Contact
              </dt>
              <dd className="mt-1 text-sm text-foreground">{user.contactNo}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Registration date
              </dt>
              <dd className="mt-1 text-sm text-foreground">{user.regDateLabel}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Registration timestamp
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {new Date(user.regDateIso).toLocaleString()}
              </dd>
            </div>
          </dl>

          <div>
            <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Notes
            </h4>
            <p className="text-sm text-foreground/90">
              This is demo data for design and interaction only. Connect this view to your real
              user detail API when backend is ready.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
