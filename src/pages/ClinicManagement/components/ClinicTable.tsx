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

const headerBg = 'bg-[#E9EBF0] dark:bg-background'
const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'

export function ClinicTable({ clinics, onInfo }: ClinicTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl  bg-card ">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>S. No</th>
         
            <th className={cn(headerCell, headerBg, 'text-left')}>clinic Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Contact</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Email</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Staff</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Patients</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>Action</th>
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * index }}
                className="transition-colors hover:bg-muted/50"
              >
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-muted-foreground">#{clinic.id}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{clinic.name}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{clinic.contact}</span>
                </td>
                <td className={bodyCell}>
                  <span className="break-all text-sm text-foreground">{clinic.email}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm tabular-nums text-foreground">{clinic.staff}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm tabular-nums text-foreground">{clinic.patients}</span>
                </td>
                <td className={bodyCell}>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
                      clinicStatusPillClass(clinic.status)
                    )}
                  >
                    {clinic.status === 'deactive' ? 'Deactive' : 'Active'}
                  </span>
                </td>
                <td className={bodyCell}>
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
