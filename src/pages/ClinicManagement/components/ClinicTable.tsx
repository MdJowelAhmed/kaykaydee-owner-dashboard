import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { Clinic } from '@/types'

interface ClinicTableProps {
  clinics: Clinic[]
  onInfo: (clinic: Clinic) => void
}

export function ClinicTable({ clinics, onInfo }: ClinicTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            <th className="px-6 py-4 text-left text-sm font-semibold">S. Id</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">clinic Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Staff</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Patients</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {clinics.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
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
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-600">#{clinic.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{clinic.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{clinic.contact}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 break-all">{clinic.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm tabular-nums text-slate-700">{clinic.staff}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm tabular-nums text-slate-700">{clinic.patients}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
                      clinic.status === 'active'
                        ? 'bg-teal-500 text-white'
                        : 'bg-red-500 text-white'
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
                      className="h-9 w-9 rounded-full text-[#1A284B] hover:bg-slate-100"
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
