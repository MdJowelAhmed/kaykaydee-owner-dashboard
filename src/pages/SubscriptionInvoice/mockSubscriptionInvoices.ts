import type { SubscriptionInvoiceRow } from './types'

const NAMES = [
  'Zoya Clinic',
  'Bright Smile Dental',
  'Harbor Wellness',
  'Northside Physio',
  'City Care Center',
  'GreenLeaf Medical',
  'Peak Performance PT',
  'Sunrise Dermatology',
  'Metro Family Health',
  'Riverbend Clinic',
]

const PACKAGES: SubscriptionInvoiceRow['package'][] = [
  'N/A',
  'Basic/y',
  'Premium/y',
  'Free Trial',
]

const STATUSES: SubscriptionInvoiceRow['status'][] = ['paid', 'pending', 'overdue']

function padId(n: number) {
  return String(265800 + n)
}

/** Deterministic mock list for filters & pagination (no API yet). */
export function buildMockSubscriptionInvoices(total = 150): SubscriptionInvoiceRow[] {
  return Array.from({ length: total }, (_, i) => {
    const day = 1 + (i % 28)
    const month = 1 + (i % 12)
    const year = 2025 + (i % 2)
    const reg = new Date(year, month - 1, day)
    const due = new Date(reg)
    due.setDate(due.getDate() + 30 + (i % 45))

    return {
      id: padId(i + 1),
      userName: NAMES[i % NAMES.length] + (i > 9 ? ` ${Math.floor(i / 10)}` : ''),
      contact: `+61 ${2000 + (i % 7999)} ${1000 + (i % 8999)}`,
      email: `clinic${i + 1}.demo@mail.com`,
      package: PACKAGES[i % PACKAGES.length],
      regDate: reg.toISOString(),
      status: STATUSES[i % STATUSES.length],
      dateline: due.toISOString(),
      amount: (49 + (i % 5) * 20).toFixed(2),
    }
  })
}

export const MOCK_SUBSCRIPTION_INVOICES = buildMockSubscriptionInvoices(150)
