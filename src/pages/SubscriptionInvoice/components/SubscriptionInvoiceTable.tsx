import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Info } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatInvoiceDate } from '../utils'
import type { SubscriptionInvoiceRow } from '../types'

interface SubscriptionInvoiceTableProps {
  rows: SubscriptionInvoiceRow[]
  onDownload: (row: SubscriptionInvoiceRow) => void
  onInfo: (row: SubscriptionInvoiceRow) => void
}

const thBase =
  'bg-primary px-6 py-4 text-sm font-semibold text-accent-foreground first:rounded-tl-xl last:rounded-tr-xl'

export function SubscriptionInvoiceTable({ rows, onDownload, onInfo }: SubscriptionInvoiceTableProps) {
  return (
    <div className="w-full overflow-auto rounded-xl">
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr>
            <th className={cn(thBase, 'text-left')}>Reg. ID</th>
            <th className={cn(thBase, 'text-left')}>Pac. ID</th>
            <th className={cn(thBase, 'text-left')}>User Name</th>
            <th className={cn(thBase, 'text-left')}>Contact</th>
            <th className={cn(thBase, 'text-left')}>Email</th>
            <th className={cn(thBase, 'text-left')}>Package</th>
            <th className={cn(thBase, 'text-left')}>price</th>
            <th className={cn(thBase, 'text-left')}>Issue Date</th>
            <th className={cn(thBase, 'text-left')}>Dateline</th>
            <th className={cn(thBase, 'text-right')}>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-6 py-10 text-center text-sm text-muted-foreground">
                No subscription invoices found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.04 * index, 0.4) }}
                className="transition-colors hover:bg-muted/50"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-muted-foreground">#{row.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-muted-foreground">{row.pacId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{row.userName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{row.contact}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="break-all text-sm text-foreground">{row.email}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className="rounded-full border-border bg-muted px-3 font-medium text-foreground"
                  >
                    {row.package}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">${row.price}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{formatInvoiceDate(row.issueDate)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{formatInvoiceDate(row.dateline)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => onDownload(row)}
                      aria-label="Download invoice"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => onInfo(row)}
                      aria-label="Invoice details"
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
