import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'
import { formatInvoiceDate } from '../utils'
import type { SubscriptionInvoiceRow } from '../types'

interface SubscriptionInvoiceTableProps {
  rows: SubscriptionInvoiceRow[]
  onInfo: (row: SubscriptionInvoiceRow) => void
}

export function SubscriptionInvoiceTable({ rows, onInfo }: SubscriptionInvoiceTableProps) {
  return (
    <div className="w-full overflow-auto rounded-xl">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            <th className="px-6 py-3.5 text-left text-sm font-semibold first:rounded-tl-xl">
              Reg. ID
            </th>
            <th className="px-6 py-3.5 text-left text-sm font-semibold">User Name</th>
            <th className="px-6 py-3.5 text-left text-sm font-semibold">Contact</th>
            <th className="px-6 py-3.5 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-3.5 text-left text-sm font-semibold">Package</th>
            <th className="px-6 py-3.5 text-left text-sm font-semibold">Reg. Date</th>
            <th className="px-6 py-3.5 text-right text-sm font-semibold last:rounded-tr-xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-slate-500 text-sm">
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
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-500">#{row.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{row.userName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{row.contact}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700 break-all">{row.email}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className="rounded-full border-0 bg-slate-100 text-slate-700 font-medium px-3"
                  >
                    {row.package}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{formatInvoiceDate(row.regDate)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-9 w-9 rounded-full text-slate-500 hover:text-secondary hover:bg-slate-100"
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
