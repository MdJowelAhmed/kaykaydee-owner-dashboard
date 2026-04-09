import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, ImageUploader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/utils/formatters'
import { MAX_IMAGE_SIZE } from '@/utils/constants'
import { toast } from '@/utils/toast'
import type { AppSliderItem } from '../sliderData'

const sliderFormSchema = z.object({
  name: z.string().min(1, 'Banner name is required'),
  buttonLabel: z.string().min(1, 'Button name is required'),
})

type SliderFormData = z.infer<typeof sliderFormSchema>

interface CreateEditSliderModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  slider?: AppSliderItem | null
  onSave: (payload: {
    name: string
    buttonLabel: string
    imageUrl: string
    status: AppSliderItem['status']
  }) => void
}

export function CreateEditSliderModal({
  open,
  onClose,
  mode,
  slider,
  onSave,
}: CreateEditSliderModalProps) {
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [existingUrl, setExistingUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SliderFormData>({
    resolver: zodResolver(sliderFormSchema),
    defaultValues: {
      name: '',
      buttonLabel: '',
    },
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && slider) {
      reset({
        name: slider.name,
        buttonLabel: slider.buttonLabel,
      })
      setBannerFile(null)
      setExistingUrl(slider.imageUrl)
    } else {
      reset({ name: '', buttonLabel: '' })
      setBannerFile(null)
      setExistingUrl(null)
    }
  }, [open, mode, slider, reset])

  const imageValue: string | File | null =
    bannerFile ?? (existingUrl && !bannerFile ? existingUrl : null)

  const onSubmit = async (data: SliderFormData) => {
    const hasImage = bannerFile !== null || (mode === 'edit' && existingUrl)
    if (!hasImage) {
      toast({
        variant: 'destructive',
        title: 'Please upload a banner image',
      })
      return
    }

    setIsSubmitting(true)
    try {
      let imageUrl = existingUrl ?? ''
      if (bannerFile) {
        imageUrl = URL.createObjectURL(bannerFile)
      }
      onSave({
        name: data.name.trim(),
        buttonLabel: data.buttonLabel.trim(),
        imageUrl,
        status: mode === 'create' ? 'pending' : slider?.status ?? 'ongoing',
      })
      toast({
        variant: 'success',
        title: mode === 'create' ? 'Slider created' : 'Slider updated',
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Create Slider' : 'Edit Slider'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
        <div>
          <ImageUploader
            key={`${mode}-${slider?.id ?? 'new'}`}
            value={imageValue}
            onChange={(file) => {
              setBannerFile(file)
              setExistingUrl(null)
            }}
            maxSize={MAX_IMAGE_SIZE}
            emptyTitle="Upload Banner"
            emptyDescription={
              <p className="text-sm text-muted-foreground">
                <span className="text-blue-600 font-medium">Click here</span>
                <span className="text-xs block mt-1">
                  JPG, PNG, WebP (max {formatFileSize(MAX_IMAGE_SIZE)})
                </span>
              </p>
            }
          />
        </div>

        <FormInput
          label="Banner Name"
          placeholder="Discount Banner"
          required
          {...register('name')}
          error={errors.name?.message}
        />

        <FormInput
          label="Button Name"
          placeholder="Explore Now"
          required
          {...register('buttonLabel')}
          error={errors.buttonLabel?.message}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#6BBF2D] hover:bg-[#5aad26] text-white"
          >
            {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
