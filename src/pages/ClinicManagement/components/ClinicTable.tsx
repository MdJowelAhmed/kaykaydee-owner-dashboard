import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { Clinic } from '@/types'

interface ClinicTableProps {
  clinics: Clinic[]
  onInfo: (clinic: Clinic) => void
}

function clinicStatusPillClass(status: Clinic['status']) {
  if (status === 'active') {
    return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300'
  }
  return 'bg-red-100 text-red-900 dark:bg-red-950/55 dark:text-red-300'
}

/** Per-`th` background: reliable in all browsers + follows `var(--primary)` in light/dark */
const thBase =
  'bg-primary px-6 py-4 text-sm font-semibold text-accent-foreground first:rounded-tl-2xl last:rounded-tr-2xl'

export function ClinicTable({ clinics, onInfo }: ClinicTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="bg-primary text-accent-foreground">
            <th className={cn(thBase, 'text-left')}>S. Id</th>
            <th className={cn(thBase, 'text-left')}>clinic Name</th>
            <th className={cn(thBase, 'text-left')}>Contact</th>
            <th className={cn(thBase, 'text-left')}>Email</th>
            <th className={cn(thBase, 'text-left')}>Staff</th>
            <th className={cn(thBase, 'text-left')}>Patients</th>
            <th className={cn(thBase, 'text-left')}>Status</th>
            <th className={cn(thBase, 'text-right')}>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {clinics.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">
                No clinics found
              </td>
            </tr>
          ) : (
            clinics.map((clinic, index) => (
              <motion.tr
                key={clinic.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * index }}
                className="transition-colors hover:bg-muted/50"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-muted-foreground">#{clinic.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{clinic.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{clinic.contact}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="break-all text-sm text-foreground">{clinic.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm tabular-nums text-foreground">{clinic.staff}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm tabular-nums text-foreground">{clinic.patients}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
                      clinicStatusPillClass(clinic.status)
                    )}
                  >
                    {clinic.status === 'deactive' ? 'Deactive' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => onInfo(clinic)}
                      aria-label="Clinic details"
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
