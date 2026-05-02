import type { User } from '@/types'

/** Status chip: readable in light & dark without hard white-on-saturated fills */
export function userStatusPillClass(status: User['status']): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
    case 'pending':
      return 'bg-amber-100 text-amber-900 dark:bg-amber-950/55 dark:text-amber-300'
    case 'blocked':
      return 'bg-red-100 text-red-900 dark:bg-red-950/55 dark:text-red-300'
    case 'inactive':
    default:
      return 'bg-muted text-muted-foreground'
  }
}
