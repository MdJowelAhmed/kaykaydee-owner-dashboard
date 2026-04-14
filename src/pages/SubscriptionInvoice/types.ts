export type SubscriptionInvoicePackage = 'N/A' | 'Basic/y' | 'Premium/y' | 'Free Trial'

export type SubscriptionInvoiceStatus = 'paid' | 'pending' | 'overdue'

export interface SubscriptionInvoiceRow {
  id: string
  userName: string
  contact: string
  email: string
  package: SubscriptionInvoicePackage
  regDate: string
  status: SubscriptionInvoiceStatus
  dateline: string
  amount: string
}
