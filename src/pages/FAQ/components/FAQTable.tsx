import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import type { FAQ } from '@/types'

interface FAQTableProps {
  faqs: FAQ[]
  onEdit: (faq: FAQ) => void
  onDelete: (faq: FAQ) => void
}

export function FAQTable({
  faqs,
  onEdit,
  onDelete,
}: FAQTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-primary text-accent-foreground">
            <th className="px-6 py-4 text-left text-sm font-bold">Question</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Answer</th>
            {/* <th className="px-6 py-4 text-left text-sm font-bold">Created At</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Updated At</th> */}
            <th className="px-6 py-4 text-right text-sm font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {faqs.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-8 text-center text-accent "
              >
                No FAQs found
              </td>
            </tr>
          ) : (
            faqs.map((faq, index) => (
              <motion.tr
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Question Column */}
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-accent">
                    {faq.question}
                  </span>
                </td>

                {/* Answer Column */}
                <td className="px-6 py-4">
                  <span className="text-sm text-accent line-clamp-2 max-w-lg">
                    {faq.answer}
                  </span>
                </td>

                {/* Created At Column */}
                {/* <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {formatDate(faq.createdAt, 'dd MMM yyyy HH:mm')}
                  </span>
                </td> */}

                {/* Updated At Column */}
                {/* <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {formatDate(faq.updatedAt, 'dd MMM yyyy HH:mm')}
                  </span>
                </td> */}

                {/* Actions Column */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(faq)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button> */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(faq)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(faq)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
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

