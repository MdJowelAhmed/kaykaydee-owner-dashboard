import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormSelect } from '@/components/common'
import { Button } from '@/components/ui/button'
import type { SubscriptionRow, SubscriptionStatus } from '../subscriptionData'
import { toast } from '@/utils/toast'

const schema = z.object({
  packageName: z.string().min(1, 'Package name is required'),
  purchasedAt: z.string().min(1, 'Date is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  status: z.enum(['active', 'expired']),
})

type FormValues = z.infer<typeof schema>

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
]

interface EditSubscriptionModalProps {
  open: boolean
  onClose: () => void
  subscription: SubscriptionRow | null
  onSave: (id: string, data: Omit<FormValues, never>) => void
}

function toInputDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

export function EditSubscriptionModal({
  open,
  onClose,
  subscription,
  onSave,
}: EditSubscriptionModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      packageName: '',
      purchasedAt: '',
      price: 0,
      status: 'active',
    },
  })

  useEffect(() => {
    if (!open || !subscription) return
    reset({
      packageName: subscription.packageName,
      purchasedAt: toInputDate(subscription.purchasedAt),
      price: subscription.price,
      status: subscription.status,
    })
  }, [open, subscription, reset])

  const onSubmit = (data: FormValues) => {
    if (!subscription) {
      toast({ variant: 'destructive', title: 'Nothing to edit' })
      return
    }
    const purchasedAt = new Date(data.purchasedAt + 'T12:00:00.000Z').toISOString()
    onSave(subscription.id, {
      packageName: data.packageName.trim(),
      purchasedAt,
      price: data.price,
      status: data.status as SubscriptionStatus,
    })
    toast({
      variant: 'success',
      title: 'Subscription updated',
    })
    onClose()
  }

  return (
    <ModalWrapper open={open} onClose={onClose} title="Edit subscription" size="md">
      {subscription && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <FormInput
            label="Package"
            required
            {...register('packageName')}
            error={errors.packageName?.message}
          />
          <FormInput
            label="Date"
            type="date"
            required
            {...register('purchasedAt')}
            error={errors.purchasedAt?.message}
          />
          <FormInput
            label="Price"
            type="number"
            step="0.01"
            min={0}
            required
            {...register('price')}
            error={errors.price?.message}
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
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6BBF2D] hover:bg-[#5aad26] text-white"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </ModalWrapper>
  )
}
