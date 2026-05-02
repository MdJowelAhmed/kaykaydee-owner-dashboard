import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormSelect } from '@/components/common'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'
import type { AdminRole, AdminRow, AdminStatus } from '../types'
import type { SelectOption } from '@/types'

const ROLE_OPTIONS: SelectOption[] = [
  { value: 'head-admin', label: 'Head Admin' },
  { value: 'admin', label: 'Admin' },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const schema = z.object({
  clinicName: z.string().min(1, 'Clinic name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  role: z.enum(['head-admin', 'admin']),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

interface AddEditAdminModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  admin: AdminRow | null
  onSave: (payload: { clinicName: string; email: string; phone: string; role: AdminRole; status: AdminStatus }) => void
}

export function AddEditAdminModal({ open, onClose, mode, admin, onSave }: AddEditAdminModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clinicName: '',
      email: '',
      phone: '',
      role: 'admin',
      status: 'active',
    },
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && admin) {
      reset({
        clinicName: admin.clinicName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        status: admin.status,
      })
    } else {
      reset({
        clinicName: '',
        email: '',
        phone: '',
        role: 'admin',
        status: 'active',
      })
    }
  }, [open, mode, admin, reset])

  const onSubmit = (data: FormValues) => {
    onSave({
      clinicName: data.clinicName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      role: data.role,
      status: data.status,
    })
    toast({ variant: 'success', title: mode === 'create' ? 'Admin added' : 'Admin updated' })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add admin' : 'Edit admin'}
      size="md"
      className="rounded-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormInput
          label="Clinic name"
          required
          {...register('clinicName')}
          error={errors.clinicName?.message}
        />
        <FormInput label="Email" type="email" required {...register('email')} error={errors.email?.message} />
        <FormInput label="Phone" required {...register('phone')} error={errors.phone?.message} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Role"
                required
                value={field.value}
                options={ROLE_OPTIONS}
                onChange={field.onChange}
                error={errors.role?.message}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Status"
                required
                value={field.value}
                options={STATUS_OPTIONS}
                onChange={field.onChange}
                error={errors.status?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            {mode === 'create' ? 'Add' : 'Save'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}

