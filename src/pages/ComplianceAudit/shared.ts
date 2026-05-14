export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export const TONE_CLASSES: Record<BadgeTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
}

export const TH =
  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground'
export const TD = 'px-4 py-3 text-sm text-card-foreground'

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}
