import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Search, Settings2 } from 'lucide-react'
import { DrawerWrapper, FormInput, FormSelect } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/utils/toast'
import { cn } from '@/utils/cn'
import {
  PERMISSION_OPTIONS,
  SCOPE_ITEMS,
  type AdminPermissionEntry,
  type AdminPermissionKey,
  type AdminRole,
  type AdminRow,
  type AdminStatus,
  type PermissionScope,
} from '../types'
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

interface AddEditAdminModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  admin: AdminRow | null
  onSave: (payload: {
    name: string
    clinicName: string
    email: string
    phone: string
    role: AdminRole
    status: AdminStatus
    permissions: AdminPermissionEntry[]
  }) => void
}

export function AddEditAdminModal({
  open,
  onClose,
  mode,
  admin,
  onSave,
}: AddEditAdminModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
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
    if (!open) return
    if (mode === 'edit' && admin) {
      reset({
        name: admin.name,
        clinicName: admin.clinicName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        status: admin.status,
        permissions: admin.permissions ?? [],
      })
    } else {
      reset({
        name: '',
        clinicName: '',
        email: '',
        phone: '',
        role: 'admin',
        status: 'active',
        permissions: [],
      })
    }
  }, [open, mode, admin, reset])

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
    onSave({
      name: data.name.trim(),
      clinicName: data.clinicName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      role: data.role,
      status: data.status,
      permissions: data.permissions,
    })
    toast({
      variant: 'success',
      title: mode === 'create' ? 'Admin added' : 'Admin updated',
    })
    onClose()
  }

  return (
    <DrawerWrapper
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add admin' : 'Edit admin'}
      description={
        mode === 'create'
          ? 'Create a new admin and configure their page-level access.'
          : 'Update admin details and adjust page-level access.'
      }
      size="xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="admin-management-form"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {mode === 'create' ? 'Add' : 'Save'}
          </Button>
        </>
      }
    >
      <form
        id="admin-management-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className={errors.permissions ? 'text-destructive' : undefined}>
              Page permissions
              <span className="text-destructive ml-1">*</span>
            </Label>
            <button
              type="button"
              onClick={() => toggleAll(!allSelected)}
              className="text-xs font-medium text-primary hover:underline"
            >
              {allSelected ? 'Clear all' : 'Select all'}
            </button>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
            {PERMISSION_OPTIONS.map((opt) => {
              const entry = permissionMap.get(opt.value)
              const checked = !!entry
              const id = `perm-${opt.value}`
              const items = SCOPE_ITEMS[opt.value] ?? []
              const showScope = checked && opt.scopeable && items.length > 0

              return (
                <div
                  key={opt.value}
                  className={cn(
                    'flex flex-col gap-2 rounded-md border border-transparent px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between',
                    checked && 'border-border bg-card'
                  )}
                >
                  <label
                    htmlFor={id}
                    className="flex flex-1 cursor-pointer items-center gap-2 text-sm text-foreground"
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(v) => togglePermission(opt.value, Boolean(v))}
                    />
                    <span>{opt.label}</span>
                  </label>

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
            <p className="text-xs text-destructive">
              {typeof errors.permissions.message === 'string'
                ? errors.permissions.message
                : 'Fix permission errors above'}
            </p>
          )}
        </div>
      </form>
    </DrawerWrapper>
  )
}

interface ScopePickerProps {
  label: string
  items: { id: string; label: string }[]
  scope: PermissionScope
  onChange: (scope: PermissionScope) => void
}

function ScopePicker({ label, items, scope, onChange }: ScopePickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const isAll = scope.type === 'all'
  const selectedIds = scope.type === 'selected' ? scope.ids : []

  const summary = isAll ? `All ${items.length}` : `${selectedIds.length} of ${items.length}`

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => i.label.toLowerCase().includes(q))
  }, [items, query])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const toggleItem = (id: string, checked: boolean) => {
    const base = scope.type === 'selected' ? scope.ids : items.map((i) => i.id)
    const next = checked ? Array.from(new Set([...base, id])) : base.filter((x) => x !== id)
    onChange({ type: 'selected', ids: next })
  }

  const setAll = () => onChange({ type: 'all' })
  const clearAll = () => onChange({ type: 'selected', ids: [] })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted',
            isAll ? 'text-primary' : 'text-foreground'
          )}
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span>{summary}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-xs font-semibold text-foreground">{label} access</p>
          <div className="flex items-center gap-2 text-[11px]">
            <button type="button" onClick={setAll} className="text-primary hover:underline">
              All
            </button>
            <span className="text-border">·</span>
            <button
              type="button"
              onClick={clearAll}
              className="text-muted-foreground hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="border-b border-border px-2 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">No matches</p>
          ) : (
            filteredItems.map((item) => {
              const checked = isAll || selectedIds.includes(item.id)
              const id = `scope-${item.id}`
              return (
                <label
                  key={item.id}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(v) => toggleItem(item.id, Boolean(v))}
                  />
                  <span className="text-foreground">{item.label}</span>
                </label>
              )
            })
          )}
        </div>
        {scope.type === 'selected' && selectedIds.length === 0 && (
          <p className="border-t border-border px-3 py-2 text-[11px] text-destructive">
            Select at least one item, or switch to All access.
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}
