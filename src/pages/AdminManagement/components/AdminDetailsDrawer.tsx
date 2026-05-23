import { DrawerWrapper } from '@/components/common/DrawerWrapper'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import {
  ADMIN_ROLE_LABELS,
  ADMIN_STATUS_LABELS,
  PERMISSION_OPTIONS,
  SCOPE_ITEMS,
  type AdminPermissionEntry,
  type AdminPermissionKey,
  type AdminRow,
} from '../types'

interface AdminDetailsDrawerProps {
  admin: AdminRow | null
  open: boolean
  onClose: () => void
}

const permissionLabel = (key: AdminPermissionKey) =>
  PERMISSION_OPTIONS.find((o) => o.value === key)?.label ?? key

function scopeSummary(entry: AdminPermissionEntry): string {
  const items = SCOPE_ITEMS[entry.key] ?? []
  if (entry.scope.type === 'all') {
    return items.length > 0 ? `All ${items.length}` : 'Full access'
  }
  return `${entry.scope.ids.length} of ${items.length}`
}

function scopeItemLabels(entry: AdminPermissionEntry): string[] {
  if (entry.scope.type === 'all') return []
  const items = SCOPE_ITEMS[entry.key] ?? []
  return entry.scope.ids
    .map((id) => items.find((i) => i.id === id)?.label)
    .filter((x): x is string => Boolean(x))
}

export function AdminDetailsDrawer({ admin, open, onClose }: AdminDetailsDrawerProps) {
  return (
    <DrawerWrapper
      open={open}
      onClose={onClose}
      title="Admin details"
      description={admin ? `${admin.name} · #${admin.id}` : undefined}
      size="xl"
    >
      {admin && (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Admin ID</dt>
            <dd className="font-medium text-foreground">#{admin.id}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium text-foreground">{ADMIN_STATUS_LABELS[admin.status]}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Full name</dt>
            <dd className="font-medium text-foreground">{admin.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="font-medium text-foreground">{ADMIN_ROLE_LABELS[admin.role]}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Clinic</dt>
            <dd className="font-medium text-foreground">{admin.clinicName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium text-foreground">{admin.phone}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="break-all font-medium text-foreground">{admin.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Join date</dt>
            <dd className="font-medium text-foreground">
              {formatDate(admin.joinDate, 'd MMM yyyy')}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last login</dt>
            <dd className="font-medium text-foreground">
              {formatDate(admin.lastLogin, 'd MMM yyyy')}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Page permissions</dt>
            <dd className="mt-1 space-y-2">
              {admin.permissions && admin.permissions.length > 0 ? (
                admin.permissions.map((entry) => {
                  const labels = scopeItemLabels(entry)
                  const isAll = entry.scope.type === 'all'
                  return (
                    <div
                      key={entry.key}
                      className="rounded-lg border border-border bg-muted/40 px-3 py-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {permissionLabel(entry.key)}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                            isAll
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950/55 dark:text-amber-300'
                          )}
                        >
                          {scopeSummary(entry)}
                        </span>
                      </div>
                      {!isAll && labels.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {labels.map((l) => (
                            <span
                              key={l}
                              className="rounded-full bg-card px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      )}
                      {!isAll && labels.length === 0 && (
                        <p className="mt-1 text-[11px] text-destructive">No items selected</p>
                      )}
                    </div>
                  )
                })
              ) : (
                <span className="text-sm text-muted-foreground">No permissions</span>
              )}
            </dd>
          </div>
        </dl>
      )}
    </DrawerWrapper>
  )
}
