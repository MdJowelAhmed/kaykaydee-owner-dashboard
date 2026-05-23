import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormInput, FormSelect } from '@/components/common'
import { toast } from '@/utils/toast'
import { cn } from '@/utils/cn'
import {
  PERMISSION_OPTIONS,
  SCOPE_ITEMS,
  type AdminPermissionEntry,
  type AdminPermissionKey,
  type PermissionScope,
} from './types'
import { ScopePicker } from './components/ScopePicker'
import { addAdmin, getAdminById, updateAdmin } from './adminStore'
import type { SelectOption } from '@/types'

const ROLE_OPTIONS: SelectOption[] = [
  { value: 'super-admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

const PERMISSION_KEYS = PERMISSION_OPTIONS.map((p) => p.value) as [
  AdminPermissionKey,
  ...AdminPermissionKey[],
]

const scopeSchema: z.ZodType<PermissionScope> = z.union([
  z.object({ type: z.literal('all') }),
  z.object({
    type: z.literal('selected'),
    ids: z.array(z.string()).min(1, 'Select at least one item'),
  }),
])

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  clinicName: z.string().min(1, 'Clinic name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  role: z.enum(['super-admin', 'admin', 'manager']),
  status: z.enum(['active', 'inactive', 'suspended']),
  permissions: z
    .array(
      z.object({
        key: z.enum(PERMISSION_KEYS),
        scope: scopeSchema,
      })
    )
    .min(1, 'Select at least one page permission'),
})

type FormValues = z.infer<typeof schema>

interface AdminFormPageProps {
  mode: 'create' | 'edit'
}

export default function AdminFormPage({ mode }: AdminFormPageProps) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const editingAdmin = mode === 'edit' && id ? getAdminById(id) : null

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      clinicName: '',
      email: '',
      phone: '',
      role: 'admin',
      status: 'active',
      permissions: [],
    },
  })

  useEffect(() => {
    if (mode === 'edit' && editingAdmin) {
      reset({
        name: editingAdmin.name,
        clinicName: editingAdmin.clinicName,
        email: editingAdmin.email,
        phone: editingAdmin.phone,
        role: editingAdmin.role,
        status: editingAdmin.status,
        permissions: editingAdmin.permissions ?? [],
      })
    }
  }, [mode, editingAdmin, reset])

  const permissions = watch('permissions') ?? []
  const permissionMap = useMemo(() => {
    const m = new Map<AdminPermissionKey, AdminPermissionEntry>()
    permissions.forEach((p) => m.set(p.key, p))
    return m
  }, [permissions])

  const allSelected = permissions.length === PERMISSION_OPTIONS.length

  const updatePermissions = (next: AdminPermissionEntry[]) => {
    setValue('permissions', next, { shouldValidate: true, shouldDirty: true })
  }

  const togglePermission = (key: AdminPermissionKey, checked: boolean) => {
    if (checked) {
      if (permissionMap.has(key)) return
      updatePermissions([...permissions, { key, scope: { type: 'all' } }])
    } else {
      updatePermissions(permissions.filter((p) => p.key !== key))
    }
  }

  const updateScope = (key: AdminPermissionKey, scope: PermissionScope) => {
    updatePermissions(permissions.map((p) => (p.key === key ? { ...p, scope } : p)))
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      updatePermissions(
        PERMISSION_OPTIONS.map((opt) => ({ key: opt.value, scope: { type: 'all' } }))
      )
    } else {
      updatePermissions([])
    }
  }

  const onSubmit = (data: FormValues) => {
    const payload = {
      name: data.name.trim(),
      clinicName: data.clinicName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      role: data.role,
      status: data.status,
      permissions: data.permissions,
    }

    if (mode === 'create') {
      addAdmin(payload)
      toast({ variant: 'success', title: 'Admin added' })
    } else if (id) {
      const result = updateAdmin(id, payload)
      if (!result) {
        toast({ variant: 'destructive', title: 'Admin not found' })
        return
      }
      toast({ variant: 'success', title: 'Admin updated' })
    }

    navigate('/admin-management')
  }

  if (mode === 'edit' && !editingAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/admin-management')}
            aria-label="Back to admin management"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin not found</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          The admin you're trying to edit no longer exists.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate('/admin-management')}
          aria-label="Back to admin management"
          className="h-10 w-10 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {mode === 'create' ? 'Add admin' : 'Edit admin'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === 'create'
              ? 'Create a new admin and configure their page-level access.'
              : `Update ${editingAdmin?.name ?? 'admin'} details and adjust page-level access.`}
          </p>
        </div>
      </div>

      <form id="admin-form-page" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Personal information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Full name"
                required
                {...register('name')}
                error={errors.name?.message}
              />
              <FormInput
                label="Clinic name"
                required
                {...register('clinicName')}
                error={errors.clinicName?.message}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Email"
                type="email"
                required
                {...register('email')}
                error={errors.email?.message}
              />
              <FormInput
                label="Phone"
                required
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>
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
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-card shadow-sm">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base font-semibold text-foreground">
                Page permissions
                <span className="text-destructive ml-1">*</span>
              </CardTitle>
              <button
                type="button"
                onClick={() => toggleAll(!allSelected)}
                className="text-xs font-medium text-primary hover:underline"
              >
                {allSelected ? 'Clear all' : 'Select all'}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {PERMISSION_OPTIONS.map((opt) => {
                const entry = permissionMap.get(opt.value)
                const checked = !!entry
                const inputId = `perm-${opt.value}`
                const items = SCOPE_ITEMS[opt.value] ?? []
                const showScope = checked && opt.scopeable && items.length > 0

                return (
                  <div
                    key={opt.value}
                    className={cn(
                      'flex flex-col gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between',
                      checked && 'border-primary/40 bg-card'
                    )}
                  >
                    <Label
                      htmlFor={inputId}
                      className="flex flex-1 cursor-pointer items-center gap-2 text-sm font-medium text-foreground"
                    >
                      <Checkbox
                        id={inputId}
                        checked={checked}
                        onCheckedChange={(v) => togglePermission(opt.value, Boolean(v))}
                      />
                      <span>{opt.label}</span>
                    </Label>

                    {showScope && entry && (
                      <ScopePicker
                        label={opt.label}
                        items={items}
                        scope={entry.scope}
                        onChange={(scope) => updateScope(opt.value, scope)}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {errors.permissions && (
              <p className="mt-3 text-xs text-destructive">
                {typeof errors.permissions.message === 'string'
                  ? errors.permissions.message
                  : 'Fix permission errors above'}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin-management')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {mode === 'create' ? 'Add admin' : 'Save changes'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
