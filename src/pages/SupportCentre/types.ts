import type { SelectOption } from '@/types'

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TicketCategory =
  | 'billing'
  | 'technical'
  | 'account'
  | 'general'
  | 'feature_request'

export type TicketMessageSender = 'requester' | 'support'

export interface TicketMessage {
  id: string
  sender: TicketMessageSender
  authorName: string
  text: string
  /** ISO timestamp. */
  sentAt: string
}

export interface SupportTicket {
  id: string
  /** Human-facing reference, e.g. TKT-1042. */
  ref: string
  subject: string
  /** Clinic or user that raised the ticket. */
  requesterName: string
  requesterEmail: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  /** ISO timestamps. */
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  billing: 'Billing',
  technical: 'Technical',
  account: 'Account',
  general: 'General',
  feature_request: 'Feature Request',
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

/** `'all'` sentinel + every status, for the toolbar filter. */
export const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Status' },
  ...(Object.keys(STATUS_LABELS) as TicketStatus[]).map((value) => ({
    value,
    label: STATUS_LABELS[value],
  })),
]

export const PRIORITY_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Priority' },
  ...(Object.keys(PRIORITY_LABELS) as TicketPriority[]).map((value) => ({
    value,
    label: PRIORITY_LABELS[value],
  })),
]

/** Status options for the detail drawer's status changer (no `'all'`). */
export const STATUS_SELECT_OPTIONS: SelectOption[] = (
  Object.keys(STATUS_LABELS) as TicketStatus[]
).map((value) => ({ value, label: STATUS_LABELS[value] }))
