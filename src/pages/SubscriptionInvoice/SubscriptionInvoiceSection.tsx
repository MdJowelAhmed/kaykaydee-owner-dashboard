import { useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { useUrlParams } from '@/hooks/useUrlState'
import { SubscriptionInvoiceTable } from './components/SubscriptionInvoiceTable'
import { MOCK_SUBSCRIPTION_INVOICES } from './mockSubscriptionInvoices'
import {
  formatInvoiceDate,
  matchesDatelineFilter,
  matchesIssueDateFilter,
} from './utils'
import type { SubscriptionInvoiceRow } from './types'

const ISSUE_DATE_OPTIONS = [
  { value: 'all', label: 'Issue Date' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
] as const

const STATUS_OPTIONS = [
  { value: 'all', label: 'Status' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
] as const

const DATELINE_OPTIONS = [
  { value: 'all', label: 'Dateline' },
  { value: 'upcoming', label: 'Due in 14 days' },
  { value: 'overdue', label: 'Past due' },
  { value: 'later', label: 'Due after 14 days' },
] as const

export function SubscriptionInvoiceSection() {
  const { getParam, getNumberParam, setParams } = useUrlParams()

  const search = getParam('si_search', '')
  const issueDate = getParam('si_issueDate', 'all')
  const status = getParam('si_status', 'all')
  const dateline = getParam('si_dateline', 'all')
  const page = getNumberParam('si_page', 1)
  const limit = getNumberParam('si_limit', 15)

  const [detailRow, setDetailRow] = useState<SubscriptionInvoiceRow | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return MOCK_SUBSCRIPTION_INVOICES.filter((row) => {
      if (status !== 'all' && row.status !== status) return false
      if (!matchesIssueDateFilter(row, issueDate)) return false
      if (!matchesDatelineFilter(row, dateline)) return false
      if (!q) return true
      return (
        row.id.includes(q) ||
        row.pacId.toLowerCase().includes(q) ||
        row.userName.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.contact.replace(/\s/g, '').toLowerCase().includes(q.replace(/\s/g, ''))
      )
    })
  }, [search, issueDate, status, dateline])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))

  const paginated = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * limit
    return filtered.slice(start, start + limit)
  }, [filtered, page, limit, totalPages])

  const filterInputClass =
    'h-11 rounded-xl border-border bg-white dark:bg-background text-accent shadow-sm placeholder:text-accent'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="shrink-0 text-xl font-bold text-foreground">Subscription Invoice</h2>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-1 lg:items-center lg:justify-end lg:gap-3">
          <SearchInput
            value={search}
            onChange={(v) => setParams({ si_search: v, si_page: 1 })}
            placeholder="Search here"
            className="w-full lg:max-w-md lg:flex-1"
            inputClassName={filterInputClass}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Select
              value={issueDate}
              onValueChange={(v) => setParams({ si_issueDate: v, si_page: 1 })}
            >
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
                <SelectValue placeholder="Issue Date" />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_DATE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) => setParams({ si_status: v, si_page: 1 })}
            >
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={dateline}
              onValueChange={(v) => setParams({ si_dateline: v, si_page: 1 })}
            >
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
                <SelectValue placeholder="Dateline" />
              </SelectTrigger>
              <SelectContent>
                {DATELINE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card p-4 shadow-sm">
        <SubscriptionInvoiceTable
          rows={paginated}
          onDownload={(row) => {
            const payload = [
              `Subscription Invoice`,
              `Reg. ID: #${row.id}`,
              `Pac. ID: ${row.pacId}`,
              `User Name: ${row.userName}`,
              `Contact: ${row.contact}`,
              `Email: ${row.email}`,
              `Package: ${row.package}`,
              `Price: $${row.price}`,
              `Issue Date: ${formatInvoiceDate(row.issueDate)}`,
              `Dateline: ${formatInvoiceDate(row.dateline)}`,
              `Status: ${row.status}`,
            ].join('\n')
            const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `invoice_${row.id}.txt`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
          }}
          onInfo={setDetailRow}
        />

        <div className="border-t border-border px-4 sm:px-6">
          <Pagination
            variant="minimal"
            showItemsPerPage={false}
            currentPage={Math.min(page, totalPages)}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={limit}
            onPageChange={(p) => setParams({ si_page: p })}
          />
        </div>
      </div>

      <ModalWrapper
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
        title="Invoice details"
        description={detailRow ? `${detailRow.userName} · #${detailRow.id}` : undefined}
        size="md"
        className="max-w-2xl"
      >
        {detailRow && (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Reg. ID</dt>
              <dd className="font-medium text-foreground">#{detailRow.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pac. ID</dt>
              <dd className="font-medium text-foreground">{detailRow.pacId}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium capitalize text-foreground">{detailRow.status}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Contact</dt>
              <dd className="font-medium text-foreground">{detailRow.contact}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all font-medium text-foreground">{detailRow.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Package</dt>
              <dd className="font-medium text-foreground">{detailRow.package}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Price</dt>
              <dd className="font-medium text-foreground">${detailRow.price}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Issue Date</dt>
              <dd className="font-medium text-foreground">
                {formatInvoiceDate(detailRow.issueDate)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Dateline</dt>
              <dd className="font-medium text-foreground">
                {formatInvoiceDate(detailRow.dateline)}
              </dd>
            </div>
          </dl>
        )}
      </ModalWrapper>
    </div>
  )
}
