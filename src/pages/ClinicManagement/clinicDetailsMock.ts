import { addMonths, format, subMonths } from 'date-fns'

export type ClinicInvoiceStatus = 'Paid' | 'Pending' | 'Failed'

export interface ClinicInvoiceRow {
  id: string
  issuedAt: string
  amount: number
  status: ClinicInvoiceStatus
}

function seedFromId(id: string): number {
  return id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
}

export function mockInvoicesForClinic(clinicId: string): ClinicInvoiceRow[] {
  const s = seedFromId(clinicId)
  const count = 3 + (s % 4)
  const statuses: ClinicInvoiceStatus[] = ['Paid', 'Paid', 'Pending', 'Failed']
  return Array.from({ length: count }, (_, i) => ({
    id: `INV-${clinicId.slice(-4)}-${200 + i}`,
    issuedAt: format(subMonths(new Date(), i + (s % 4)), 'yyyy-MM-dd'),
    amount: [99, 149, 299, 499][(s + i) % 4],
    status: statuses[(s + i) % statuses.length],
  }))
}

/** Deterministic “next renewal” for demo UI. */
export function mockNextRenewalDate(clinicId: string): string {
  const s = seedFromId(clinicId)
  const monthsAhead = 1 + (s % 3)
  return format(addMonths(new Date(), monthsAhead), 'MMM d, yyyy')
}

export function mockSubscriptionStartedAt(clinicId: string): string {
  const s = seedFromId(clinicId)
  return format(subMonths(new Date(), 6 + (s % 12)), 'MMM d, yyyy')
}
