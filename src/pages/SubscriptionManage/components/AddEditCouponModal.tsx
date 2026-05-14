import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ModalWrapper, FormInput, FormTextarea } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/utils/toast'
import type { Coupon, CouponType, SubscriptionManagePackage } from '../types'

/** `${name} · Monthly` style label that disambiguates same-named packages. */
export function packageLabel(pkg: SubscriptionManagePackage) {
  const cycle =
    pkg.cycle === 'trial' ? 'Trial' : pkg.cycle === 'annual' ? 'Annual' : 'Monthly'
  return `${pkg.name} · ${cycle}`
}

const ALL_PACKAGES = 'all'

const schema = z
  .object({
    code: z
      .string()
      .min(3, 'Code must be at least 3 characters')
      .regex(/^[A-Za-z0-9]+$/, 'Use letters and numbers only'),
    description: z.string().min(1, 'Description is required'),
    packageId: z.string().min(1, 'Select a package'),
    type: z.enum(['percentage', 'fixed']),
    value: z.coerce.number().positive('Value must be greater than 0'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    usageLimit: z
      .string()
      .optional()
      .refine((v) => !v || Number(v) > 0, 'Usage limit must be greater than 0'),
    enabled: z.boolean(),
  })
  .refine((d) => d.type !== 'percentage' || d.value <= 100, {
    message: 'Percentage cannot exceed 100',
    path: ['value'],
  })
  .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })

type FormValues = z.infer<typeof schema>

export type SaveCouponInput = {
  id?: string
  code: string
  description: string
  packageId: string | null
  type: CouponType
  value: number
  startDate: string
  endDate: string
  usageLimit: number | null
  enabled: boolean
}

interface AddEditCouponModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  coupon: Coupon | null
  packages: SubscriptionManagePackage[]
  onSave: (payload: SaveCouponInput) => void
}

const defaults: FormValues = {
  code: '',
  description: '',
  packageId: ALL_PACKAGES,
  type: 'percentage',
  value: 10,
  startDate: '',
  endDate: '',
  usageLimit: '',
  enabled: true,
}

export function AddEditCouponModal({
  open,
  onClose,
  mode,
  coupon,
  packages,
  onSave,
}: AddEditCouponModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  })

  const type = watch('type')

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && coupon) {
      reset({
        code: coupon.code,
        description: coupon.description,
        packageId: coupon.packageId ?? ALL_PACKAGES,
        type: coupon.type,
        value: coupon.value,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        usageLimit: coupon.usageLimit != null ? String(coupon.usageLimit) : '',
        enabled: coupon.status === 'active',
      })
    } else {
      reset(defaults)
    }
  }, [open, mode, coupon, reset])

  const onSubmit = (data: FormValues) => {
    onSave({
      id: mode === 'edit' && coupon ? coupon.id : undefined,
      code: data.code.trim().toUpperCase(),
      description: data.description.trim(),
      packageId: data.packageId === ALL_PACKAGES ? null : data.packageId,
      type: data.type,
      value: data.value,
      startDate: data.startDate,
      endDate: data.endDate,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
      enabled: data.enabled,
    })
    toast({
      variant: 'success',
      title: mode === 'create' ? 'Coupon created' : 'Coupon updated',
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add new coupon' : 'Edit coupon'}
      size="md"
      className="rounded-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormInput
          label="Coupon code"
          required
          placeholder="WELCOME20"
          className="uppercase"
          {...register('code')}
          error={errors.code?.message}
        />

        <FormTextarea
          label="Description"
          required
          rows={2}
          placeholder="New clinic onboarding discount"
          {...register('description')}
          error={errors.description?.message}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Applies to <span className="text-destructive">*</span>
          </label>
          <select
            className="h-10 w-full rounded-md border border-input bg-input px-3 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            {...register('packageId')}
          >
            <option value={ALL_PACKAGES}>All packages</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {packageLabel(pkg)}
              </option>
            ))}
          </select>
          {errors.packageId?.message && (
            <p className="text-xs text-destructive">{errors.packageId.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Discount type <span className="text-destructive">*</span>
            </label>
            <select
              className="h-10 w-full rounded-md border border-input bg-input px-3 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              {...register('type')}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed amount ($)</option>
            </select>
          </div>
          <FormInput
            label={type === 'percentage' ? 'Discount (%)' : 'Discount ($)'}
            type="number"
            step={type === 'percentage' ? '1' : '0.01'}
            min={0}
            required
            {...register('value')}
            error={errors.value?.message}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Start date"
            type="date"
            required
            {...register('startDate')}
            error={errors.startDate?.message}
          />
          <FormInput
            label="End date"
            type="date"
            required
            {...register('endDate')}
            error={errors.endDate?.message}
          />
        </div>

        <FormInput
          label="Usage limit"
          type="number"
          min={1}
          placeholder="Leave empty for unlimited"
          helperText="Maximum number of times this coupon can be redeemed."
          {...register('usageLimit')}
          error={errors.usageLimit?.message}
        />

        <Controller
          name="enabled"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Active</p>
                <p className="text-xs text-muted-foreground">
                  Allow customers to redeem this coupon
                </p>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-accent-foreground hover:bg-primary/90">
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
