import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import { CLINIC_PACKAGE_LABELS } from '@/utils/constants'
import type { Clinic } from '@/types'

interface ClinicTableProps {
  clinics: Clinic[]
  onOpenClinic: (clinic: Clinic) => void
}

function clinicStatusPillClass(status: Clinic['status']) {
  if (status === 'active') {
    return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
  }
  if (status === 'suspended') {
    return 'bg-amber-100 text-amber-900 dark:bg-amber-950/55 dark:text-amber-300'
  }
  return 'bg-red-100 text-red-900 dark:bg-red-950/55 dark:text-red-300'
}

function statusLabel(status: Clinic['status']) {
  if (status === 'suspended') return 'Suspended'
  return status === 'deactive' ? 'Deactive' : 'Active'
}

const headerBg = 'bg-[#E9EBF0] dark:bg-background'
const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'

export function ClinicTable({ clinics, onOpenClinic }: ClinicTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl bg-card">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr>
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>S. No</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Clinic name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Country / State</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Subscription tier</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Revenue</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Salesperson</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>
              <span className="sr-only">Open details</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {clinics.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-accent-foreground">
                No clinics found
              </td>
            </tr>
          ) : (
            clinics.map((clinic, index) => (
              <motion.tr
                key={clinic.id}
                role="button"
                tabIndex={0}
                aria-label={`Open clinic ${clinic.name}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * index }}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => onOpenClinic(clinic)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onOpenClinic(clinic)
                  }
                }}
              >
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-muted-foreground">#{clinic.id}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-foreground">{clinic.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{clinic.email}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{clinic.country}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{clinic.state}</span>
                </td>
                <td className={bodyCell}>
                  <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {CLINIC_PACKAGE_LABELS[clinic.packagePlan] ?? clinic.packagePlan}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm tabular-nums text-foreground">
                    {formatCurrency(clinic.revenue)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{clinic.salesperson}</span>
                </td>
                <td className={bodyCell}>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      clinicStatusPillClass(clinic.status)
                    )}
                  >
                    {statusLabel(clinic.status)}
                  </span>
                </td>
                <td className={bodyCell}>
                  <div className="flex justify-end text-muted-foreground" aria-hidden>
                    <ChevronRight className="h-5 w-5" />
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
