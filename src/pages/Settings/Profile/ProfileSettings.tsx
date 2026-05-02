import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'
import { toast } from '@/utils/toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  designation: z.enum(['Admin', 'Manager', 'Staff']),
  contact: z.string().min(5, 'Please enter a valid contact'),
  email: z.string().email('Please enter a valid email'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  address: z.string().min(3, 'Address is required'),
  nationalId: z.string().min(6, 'National ID is required'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [avatar] = useState(
    'https://images.unsplash.com/photo-1520975693411-6a2411c1d7b1?auto=format&fit=crop&w=600&q=80'
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Admin Zabia',
      designation: 'Admin',
      contact: '+131255',
      email: 'zabia@gmail.com',
      dateOfBirth: '2024-12-17',
      gender: 'Female',
      address: '76/4 R no. 60/1 Rue des Saints-Paris, 75005 Paris',
      nationalId: '45872347687',
    },
  })

  const status = 'Active'
  const helloName = useMemo(() => `Hello! ${watch('name') || 'Admin'}`, [watch])
  const roleLabel = useMemo(() => watch('designation') || 'Admin', [watch])
  const idLabel = 'ID 6351651'

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Profile data:', data)

    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    })

    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Top profile banner */}
      <Card className="overflow-hidden rounded-2xl  bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-stretch gap-5 p-4 sm:p-5">
            <div className="h-[110px] w-[140px] shrink-0 overflow-hidden rounded-xl bg-card ring-1 ring-white/10">
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-accent truncate">{helloName}</p>
                <p className="mt-1 text-xs text-accent">{roleLabel}</p>
                <p className="mt-2 text-xs text-accent">{idLabel}</p>
              </div>
              <span className="inline-flex items-center rounded-full  px-4 py-1 text-xs font-medium text-accent ring-1 ring-primary/40">
                {status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form card */}
      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className={cn(errors.name && 'text-destructive')}>Name</Label>
                <Input
                  {...register('name')}
                  className="bg-background border-slate-200 rounded-md"
                  placeholder="Name"
                />
                {errors.name?.message && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.designation && 'text-destructive')}>Designation</Label>
                <Controller
                  control={control}
                  name="designation"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 bg-background border-slate-200 rounded-md">
                        <SelectValue placeholder="Designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.designation?.message && (
                  <p className="text-xs text-destructive">{errors.designation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.contact && 'text-destructive')}>Contact</Label>
                <Input
                  {...register('contact')}
                  className="bg-background border-slate-200 rounded-md"
                  placeholder="Contact"
                />
                {errors.contact?.message && (
                  <p className="text-xs text-destructive">{errors.contact.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.email && 'text-destructive')}>Email</Label>
                <Input
                  {...register('email')}
                  className="bg-background border-slate-200 rounded-md"
                  placeholder="Email"
                  type="email"
                />
                {errors.email?.message && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.dateOfBirth && 'text-destructive')}>Date of Birth</Label>
                <Input
                  {...register('dateOfBirth')}
                  className="bg-background border-slate-200 rounded-md"
                  type="date"
                />
                {errors.dateOfBirth?.message && (
                  <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.gender && 'text-destructive')}>Gender</Label>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 bg-background border-slate-200 rounded-md">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender?.message && (
                  <p className="text-xs text-destructive">{errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.address && 'text-destructive')}>Address</Label>
                <Input
                  {...register('address')}
                  className="bg-background border-slate-200 rounded-md"
                  placeholder="Address"
                />
                {errors.address?.message && (
                  <p className="text-xs text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(errors.nationalId && 'text-destructive')}>National ID</Label>
                <Input
                  {...register('nationalId')}
                  className="bg-background border-slate-200 rounded-md"
                  placeholder="National ID"
                />
                {errors.nationalId?.message && (
                  <p className="text-xs text-destructive">{errors.nationalId.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
              <label className="flex items-center gap-3 text-xs text-accent select-none">
                <Checkbox checked={confirm} onCheckedChange={(v) => setConfirm(v === true)} />
                Confirm changes of your profile info, this will save permanently.
              </label>

              <Button
                type="submit"
                className="h-11 w-full sm:w-auto px-10 rounded-xl bg-primary text-accent-foreground hover:bg-primary/90"
                isLoading={isSubmitting}
                disabled={!confirm || isSubmitting}
              >
                Save &amp; Change
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}












