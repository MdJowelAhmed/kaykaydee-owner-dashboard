import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, StatusBadge } from '@/components/common'
import { formatDate } from '@/utils/formatters'
import type { TableColumn } from '@/types'
import { CATEGORY_LABELS, type SupportTicket } from '../types'
import { PriorityBadge } from './PriorityBadge'

interface SupportTicketTableProps {
  rows: SupportTicket[]
  onView: (ticket: SupportTicket) => void
}

export function SupportTicketTable({ rows, onView }: SupportTicketTableProps) {
  const columns: TableColumn<SupportTicket>[] = [
    {
      key: 'ref',
      label: 'Ticket',
      render: (_v, row) => (
        <div>
          <p className="font-semibold text-foreground">{row.ref}</p>
          <p className="mt-0.5 max-w-[280px] truncate text-xs text-muted-foreground">
            {row.subject}
          </p>
        </div>
      ),
    },
    {
      key: 'requesterName',
      label: 'Requester',
      render: (_v, row) => (
        <div>
          <p className="text-foreground">{row.requesterName}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.requesterEmail}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (_v, row) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {CATEGORY_LABELS[row.category]}
        </span>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (_v, row) => <PriorityBadge priority={row.priority} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_v, row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (_v, row) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDate(row.createdAt, 'd MMM yyyy')}
        </span>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={rows}
      rowKeyExtractor={(row) => row.id}
      onRowClick={onView}
      emptyMessage="No support tickets found."
      actions={(row) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onView(row)}
          aria-label={`View ${row.ref}`}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
    />
  )
}
