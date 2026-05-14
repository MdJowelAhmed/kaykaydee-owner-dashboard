import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormSelect } from '@/components/common'
import { Button } from '@/components/ui/button'
import { USER_PACKAGES, CLINIC_STATUSES } from '@/utils/constants'
import type { Clinic, SelectOption } from '@/types'

const PACKAGE_OPTIONS: SelectOption[] = USER_PACKAGES.filter((o) => o.value !== 'all')
const STATUS_OPTIONS: SelectOption[] = CLINIC_STATUSES.filter((o) => o.value !== 'all')

const schema = z.object({
  name: z.string().min(1, 'Clinic name is required'),
  contact: z.string().min(1, 'Contact is required'),
  email: z.string().email('Enter a valid email'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  website: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+/i.test(val), {
      message: 'Use a full URL (https://…)',
    }),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State / region is required'),
  salesperson: z.string().min(1, 'Assigned salesperson is required'),
  referralSource: z.string().min(1, 'Referral source is required'),
  staff: z.coerce.number().int().min(0, 'Must be 0 or greater'),
  patients: z.coerce.number().int().min(0, 'Must be 0 or greater'),
  revenue: z.coerce.number().min(0, 'Must be 0 or greater'),
  status: z.enum(['active', 'deactive', 'suspended']),
  packagePlan: z.enum(['basic', 'pro', 'enterprise']),
})

type FormValues = z.infer<typeof schema>

const defaults: FormValues = {
  name: '',
  contact: '',
  email: '',
  contactPerson: '',
  website: '',
  country: '',
  state: '',
  salesperson: '',
  referralSource: '',
  staff: 1,
  patients: 0,
  revenue: 0,
  status: 'active',
  packagePlan: 'basic',
}

function planQuota(plan: FormValues['packagePlan']): number | null {
  if (plan === 'basic') return 200
  if (plan === 'pro') return 1000
  return null
}

interface AddClinicModalProps {
  open: boolean
  onClose: () => void
  onSave: (clinic: Clinic) => void
}

function newClinicId(): string {
  return String(Math.floor(1_000_000 + Math.random() * 8_999_999))
}

export function AddClinicModal({ open, onClose, onSave }: AddClinicModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  })

  useEffect(() => {
    if (open) reset(defaults)
  }, [open, reset])

  const onSubmit = (data: FormValues) => {
    onSave({
      id: newClinicId(),
      name: data.name.trim(),
      contact: data.contact.trim(),
      email: data.email.trim(),
      contactPerson: data.contactPerson.trim(),
      website: data.website.trim(),
      staff: data.staff,
      patients: data.patients,
      status: data.status,
      packagePlan: data.packagePlan,
      country: data.country.trim(),
      state: data.state.trim(),
      revenue: data.revenue,
      salesperson: data.salesperson.trim(),
      referralSource: data.referralSource.trim(),
      billingCycle: 'monthly',
      aiUsage: {
        used: 0,
        quota: planQuota(data.packagePlan),
        lastUsedAt: new Date().toISOString(),
      },
      features: {
        aiAssistant: data.packagePlan !== 'basic',
        whiteLabel: data.packagePlan === 'enterprise',
        advancedReporting: data.packagePlan !== 'basic',
        patientPortal: true,
      },
      supportTickets: [],
      auditLog: [],
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Add clinic"
      description="Enter clinic details. Connect to your API when the backend is ready."
      size="lg"
      className="rounded-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormInput
          label="Clinic name"
          required
          placeholder="e.g. Zoya Clinic"
          {...register('name')}
          error={errors.name?.message}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Contact"
            required
            placeholder="Phone number"
            {...register('contact')}
            error={errors.contact?.message}
          />
          <FormInput
            label="Email"
            type="email"
            required
            placeholder="clinic@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Contact person"
            required
            placeholder="Full name"
            {...register('contactPerson')}
            error={errors.contactPerson?.message}
          />
          <FormInput
            label="Website"
            placeholder="https://example.com"
            {...register('website')}
            error={errors.website?.message}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Country"
            required
            placeholder="e.g. Australia"
            {...register('country')}
            error={errors.country?.message}
          />
          <FormInput
            label="State / region"
            required
            placeholder="e.g. New South Wales"
            {...register('state')}
            error={errors.state?.message}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Assigned salesperson"
            required
            placeholder="Full name"
            {...register('salesperson')}
            error={errors.salesperson?.message}
          />
          <FormInput
            label="Referral source"
            required
            placeholder="e.g. Partner Referral"
            {...register('referralSource')}
            error={errors.referralSource?.message}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput
            label="Staff count"
            type="number"
            min={0}
            required
            {...register('staff')}
            error={errors.staff?.message}
          />
          <FormInput
            label="Patients count"
            type="number"
            min={0}
            required
            {...register('patients')}
            error={errors.patients?.message}
          />
          <FormInput
            label="Revenue (USD)"
            type="number"
            min={0}
            required
            {...register('revenue')}
            error={errors.revenue?.message}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="packagePlan"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Package"
                required
                value={field.value}
                options={PACKAGE_OPTIONS}
                onChange={field.onChange}
                error={errors.packagePlan?.message}
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
            Add clinic
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
