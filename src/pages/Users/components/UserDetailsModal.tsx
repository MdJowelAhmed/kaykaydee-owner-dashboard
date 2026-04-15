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

function statusPillClass(status: User['status']) {
  switch (status) {
    case 'active':
      return 'bg-slate-700 text-white'
    case 'pending':
      return 'bg-amber-600 text-white'
    case 'blocked':
      return 'bg-red-700 text-white'
    case 'inactive':
    default:
      return 'bg-slate-500 text-white'
  }
}

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            User details
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Extended profile and access information for this account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start pt-2">
          <div className="flex shrink-0 justify-center sm:justify-start">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-24 w-24 rounded-2xl border border-slate-200 bg-slate-50 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                No photo
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-lg font-semibold text-slate-900">{userDisplayName(user)}</p>
            <p className="text-sm text-slate-500">
              ID <span className="font-mono text-slate-700">#{user.id}</span>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span
                className={cn(
                  'inline-flex rounded-full px-3 py-0.5 text-xs font-medium capitalize',
                  statusPillClass(user.status)
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
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Email
            </dt>
            <dd className="mt-1 text-sm text-slate-900 break-all">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Contact
            </dt>
            <dd className="mt-1 text-sm text-slate-900">{user.phone}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Legal name
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {user.firstName} {user.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Clinic
            </dt>
            <dd className="mt-1 text-sm text-slate-900">{user.clinicName ?? '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Full address
            </dt>
            <dd className="mt-1 text-sm text-slate-900">{fullAddress(user)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Date of joining
            </dt>
            <dd className="mt-1 text-sm text-slate-900">{formatDateJoined(user.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Last login
            </dt>
            <dd className="mt-1 text-sm text-slate-900">{formatDateTime(user.lastLoginAt)}</dd>
          </div>
        </dl>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
            Permissions &amp; access
          </h4>
          {user.permissions?.length ? (
            <ul className="flex flex-wrap gap-2">
              {user.permissions.map((p) => (
                <li key={p}>
                  <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No permission metadata.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
