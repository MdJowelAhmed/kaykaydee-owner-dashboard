import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { SearchInput } from '@/components/common/SearchInput'
import { FilterDropdown } from '@/components/common/FilterDropdown'
import { Pagination } from '@/components/common/Pagination'
import { useUrlParams } from '@/hooks/useUrlState'
import { useAppSelector } from '@/redux/hooks'
import { toast } from '@/utils/toast'
import { createId } from '@/utils/id'
import { mockSupportTickets } from '../mockData'
import { buildClinicSupportTickets } from '../clinicTicketAdapter'
import {
  PRIORITY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  STATUS_LABELS,
  type SupportTicket,
  type TicketStatus,
} from '../types'
import { SupportTicketTable } from './SupportTicketTable'
import { TicketDetailDrawer } from './TicketDetailDrawer'

const STAT_CARDS: { key: 'total' | TicketStatus; label: string }[] = [
  { key: 'total', label: 'Total Tickets' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
]

export function TicketsTab() {
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const status = getParam('status', 'all')
  const priority = getParam('priority', 'all')
  const ticketRefParam = getParam('ticket', '')
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 10)

  const clinics = useAppSelector((state) => state.clinics.list)

  const [tickets, setTickets] = useState<SupportTicket[]>(() => [
    ...buildClinicSupportTickets(clinics),
    ...mockSupportTickets,
  ])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!ticketRefParam) return
    const match = tickets.find((t) => t.ref === ticketRefParam)
    if (match) {
      setActiveId(match.id)
    } else {
      toast({
        variant: 'info',
        title: 'Ticket not found',
        description: `No ticket matches ${ticketRefParam} in Support Centre.`,
      })
      setParams({ ticket: null })
    }
  }, [ticketRefParam, tickets, setParams])

  const closeDrawer = () => {
    setActiveId(null)
    if (ticketRefParam) setParams({ ticket: null })
  }

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      in_progress: tickets.filter((t) => t.status === 'in_progress').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
      closed: tickets.filter((t) => t.status === 'closed').length,
    }),
    [tickets]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tickets.filter((t) => {
      if (status !== 'all' && t.status !== status) return false
      if (priority !== 'all' && t.priority !== priority) return false
      if (!q) return true
      return (
        t.ref.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.requesterName.toLowerCase().includes(q) ||
        t.requesterEmail.toLowerCase().includes(q)
      )
    })
  }, [tickets, search, status, priority])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const safePage = Math.min(page, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * limit
    return filtered.slice(start, start + limit)
  }, [filtered, safePage, limit])

  const activeTicket = useMemo(
    () => tickets.find((t) => t.id === activeId) ?? null,
    [tickets, activeId]
  )

  const handleReply = (ticketId: string, text: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: t.status === 'closed' ? t.status : 'in_progress',
              updatedAt: new Date().toISOString(),
              messages: [
                ...t.messages,
                {
                  id: createId(),
                  sender: 'support' as const,
                  authorName: 'Support Team',
                  text,
                  sentAt: new Date().toISOString(),
                },
              ],
            }
          : t
      )
    )
    toast({ variant: 'success', title: 'Reply sent' })
  }

  const handleStatusChange = (ticketId: string, nextStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: nextStatus, updatedAt: new Date().toISOString() }
          : t
      )
    )
    toast({ variant: 'success', title: `Marked as ${STATUS_LABELS[nextStatus]}` })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <Card
            key={card.key}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">
                {stats[card.key]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <SearchInput
          value={search}
          onChange={(value) => setParams({ search: value, page: 1 })}
          placeholder="Search tickets, requester…"
          className="w-full sm:max-w-xs"
        />
        <FilterDropdown
          value={status}
          options={STATUS_FILTER_OPTIONS}
          onChange={(value) => setParams({ status: value, page: 1 })}
          placeholder="All Status"
          className="w-full sm:w-auto"
        />
        <FilterDropdown
          value={priority}
          options={PRIORITY_FILTER_OPTIONS}
          onChange={(value) => setParams({ priority: value, page: 1 })}
          placeholder="All Priority"
          className="w-full sm:w-auto"
        />
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <SupportTicketTable
          rows={paginated}
          onView={(t) => setParams({ ticket: t.ref })}
        />

        <div className="border-t border-border px-2 pt-2 sm:px-4">
          <Pagination
            variant="minimal"
            showItemsPerPage={false}
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={limit}
            onPageChange={(newPage) => setParams({ page: newPage })}
          />
        </div>
      </div>

      <TicketDetailDrawer
        open={!!activeTicket}
        onClose={closeDrawer}
        ticket={activeTicket}
        onReply={handleReply}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
