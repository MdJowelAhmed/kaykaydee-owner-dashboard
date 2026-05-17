import type { Clinic, ClinicSupportTicket } from '@/types'
import type { SupportTicket, TicketCategory } from './types'

const CATEGORY_MAP: Record<ClinicSupportTicket['category'], TicketCategory> = {
  Billing: 'billing',
  Technical: 'technical',
  Account: 'account',
  'Feature Request': 'feature_request',
  General: 'general',
}

export function clinicTicketToSupportTicket(
  ticket: ClinicSupportTicket,
  clinic: Pick<Clinic, 'name' | 'email'>
): SupportTicket {
  return {
    id: ticket.id,
    ref: ticket.ref,
    subject: ticket.subject,
    requesterName: clinic.name,
    requesterEmail: clinic.email,
    category: CATEGORY_MAP[ticket.category] ?? 'general',
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    messages: [
      {
        id: `${ticket.id}-init`,
        sender: 'requester',
        authorName: clinic.name,
        text: ticket.description,
        sentAt: ticket.createdAt,
      },
    ],
  }
}

export function buildClinicSupportTickets(clinics: Clinic[]): SupportTicket[] {
  return clinics.flatMap((clinic) =>
    clinic.supportTickets.map((t) => clinicTicketToSupportTicket(t, clinic))
  )
}
