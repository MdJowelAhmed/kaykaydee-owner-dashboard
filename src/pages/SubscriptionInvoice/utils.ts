import type { SubscriptionInvoiceRow } from './types'

export function formatInvoiceDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const MS_DAY = 86400000

export function matchesIssueDateFilter(row: SubscriptionInvoiceRow, filter: string): boolean {
  if (filter === 'all') return true
  const issued = new Date(row.issueDate).getTime()
  const now = Date.now()
  if (filter === '7d') return issued >= now - 7 * MS_DAY && issued <= now
  if (filter === '30d') return issued >= now - 30 * MS_DAY && issued <= now
  if (filter === '90d') return issued >= now - 90 * MS_DAY && issued <= now
  return true
}

export function matchesDatelineFilter(row: SubscriptionInvoiceRow, filter: string): boolean {
  if (filter === 'all') return true
  const due = new Date(row.dateline).getTime()
  const now = Date.now()
  if (filter === 'upcoming') return due >= now && due <= now + 14 * MS_DAY
  if (filter === 'overdue') return due < now
  if (filter === 'later') return due > now + 14 * MS_DAY
  return true
}
