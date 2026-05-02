import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ModalWrapper, FormInput } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/utils/toast'
import type { BillingCycle, SubscriptionManagePackage } from '../types'

const schema = z.object({
  name: z.string().min(1, 'Package name is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  cycle: z.enum(['monthly', 'annual', 'trial']),
  enabled: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export type SaveManagePackageInput = {
  id?: string
  name: string
  price: number
  cycle: BillingCycle
  enabled: boolean
}

interface AddEditPackageModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  pkg: SubscriptionManagePackage | null
  onSave: (payload: SaveManagePackageInput) => void
}

const defaults: FormValues = {
  name: '',
  price: 50,
  cycle: 'monthly',
  enabled: true,
}

export function AddEditPackageModal({
  open,
  onClose,
  mode,
  pkg,
  onSave,
}: AddEditPackageModalProps) {
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
    if (!open) return
    if (mode === 'edit' && pkg) {
      reset({
        name: pkg.name,
        price: pkg.price,
        cycle: pkg.cycle,
        enabled: pkg.enabled,
      })
    } else {
      reset(defaults)
    }
  }, [open, mode, pkg, reset])

  const onSubmit = (data: FormValues) => {
    onSave({
      id: mode === 'edit' && pkg ? pkg.id : undefined,
      name: data.name.trim(),
      price: data.price,
      cycle: data.cycle,
      enabled: data.enabled,
    })
    toast({
      variant: 'success',
      title: mode === 'create' ? 'Package created' : 'Package updated',
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add new package' : 'Edit package'}
      size="md"
      className="rounded-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormInput
          label="Package name"
          required
          placeholder="Basic"
          {...register('name')}
          error={errors.name?.message}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Price (USD)"
            type="number"
            step="0.01"
            min={0}
            required
            {...register('price')}
            error={errors.price?.message}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Billing cycle <span className="text-destructive">*</span>
            </label>
            <select
              className="h-10 w-full rounded-md border border-input  px-3 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              {...register('cycle')}
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="trial">Free trial</option>
            </select>
            {errors.cycle?.message && (
              <p className="text-xs text-destructive">{errors.cycle.message}</p>
            )}
          </div>
        </div>

        <Controller
          name="enabled"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Enable</p>
                <p className="text-xs text-muted-foreground">
                  Make this package available to users
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

