import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
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

function formatDateTime(iso?: string) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function formatDateJoined(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function fullAddress(user: User) {
  const parts = [user.address, user.city, user.country].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
}

const PACKAGE_LABELS: Record<NonNullable<User['packagePlan']>, string> = {
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

interface UserDetailsModalProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsModal({ user, open, onOpenChange }: UserDetailsModalProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl sm:rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold text-foreground">User details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Extended profile and access information for this account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-2 sm:flex-row sm:items-start">
          <div className="flex shrink-0 justify-center sm:justify-start">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-24 w-24 rounded-2xl border border-border bg-muted/40 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
                No photo
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-lg font-semibold text-foreground">{userDisplayName(user)}</p>
            <p className="text-sm text-muted-foreground">
              ID <span className="font-mono text-foreground">#{user.id}</span>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span
                className={cn(
                  'inline-flex rounded-full px-3 py-0.5 text-xs font-medium capitalize',
                  userStatusPillClass(user.status)
                )}
              >
                {user.status}
              </span>
              <Badge variant="outline" className="rounded-full font-normal">
                {ROLE_LABELS[user.role]}
              </Badge>
              {user.packagePlan && (
                <Badge variant="outline" className="rounded-full font-normal">
                  {PACKAGE_LABELS[user.packagePlan]}
                </Badge>
              )}
            </div>
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
            <dd className="mt-1 text-sm text-foreground">{user.phone}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Legal name
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {user.firstName} {user.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Clinic
            </dt>
            <dd className="mt-1 text-sm text-foreground">{user.clinicName ?? '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Full address
            </dt>
            <dd className="mt-1 text-sm text-foreground">{fullAddress(user)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Date of joining
            </dt>
            <dd className="mt-1 text-sm text-foreground">{formatDateJoined(user.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last login
            </dt>
            <dd className="mt-1 text-sm text-foreground">{formatDateTime(user.lastLoginAt)}</dd>
          </div>
        </dl>

        <div>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Permissions &amp; access
          </h4>
          {user.permissions?.length ? (
            <ul className="flex flex-wrap gap-2">
              {user.permissions.map((p) => (
                <li key={p}>
                  <span className="inline-flex rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No permission metadata.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
