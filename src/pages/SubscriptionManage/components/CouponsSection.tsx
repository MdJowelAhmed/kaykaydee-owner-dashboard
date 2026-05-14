import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable, StatusBadge } from '@/components/common'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { createId } from '@/utils/id'
import { toast } from '@/utils/toast'
import type { TableColumn } from '@/types'
import { mockCoupons } from '../mockData'
import type { Coupon, CouponStatus, SubscriptionManagePackage } from '../types'
import { AddEditCouponModal, packageLabel, type SaveCouponInput } from './AddEditCouponModal'

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Stored status, but a past end date always reads as expired. */
function effectiveStatus(coupon: Coupon): CouponStatus {
  if (coupon.status === 'inactive') return 'inactive'
  const end = new Date(coupon.endDate)
  if (!Number.isNaN(end.getTime()) && end < new Date()) return 'expired'
  return coupon.status
}

function formatDiscount(coupon: Coupon) {
  return coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`
}

interface CouponsSectionProps {
  packages: SubscriptionManagePackage[]
}

export function CouponsSection({ packages }: CouponsSectionProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)

  const rows = useMemo(
    () => coupons.map((c) => ({ ...c, status: effectiveStatus(c) })),
    [coupons]
  )

  const packageNameById = useMemo(() => {
    const map = new Map<string, string>()
    packages.forEach((pkg) => map.set(pkg.id, packageLabel(pkg)))
    return map
  }, [packages])

  const resolvePackage = (packageId: string | null) =>
    packageId == null ? 'All packages' : packageNameById.get(packageId) ?? 'Unknown package'

  const activeCount = rows.filter((c) => c.status === 'active').length
  const totalRedemptions = coupons.reduce((acc, c) => acc + c.usedCount, 0)

  const openCreate = () => {
    setModalMode('create')
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (coupon: Coupon) => {
    setModalMode('edit')
    setEditing(coupon)
    setModalOpen(true)
  }

  const handleSave = (payload: SaveCouponInput) => {
    if (modalMode === 'edit' && payload.id) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === payload.id
            ? {
                ...c,
                code: payload.code,
                description: payload.description,
                packageId: payload.packageId,
                type: payload.type,
                value: payload.value,
                startDate: payload.startDate,
                endDate: payload.endDate,
                usageLimit: payload.usageLimit,
                status: payload.enabled ? 'active' : 'inactive',
              }
            : c
        )
      )
      return
    }

    const next: Coupon = {
      id: createId(),
      code: payload.code,
      description: payload.description,
      packageId: payload.packageId,
      type: payload.type,
      value: payload.value,
      startDate: payload.startDate,
      endDate: payload.endDate,
      usageLimit: payload.usageLimit,
      usedCount: 0,
      status: payload.enabled ? 'active' : 'inactive',
    }
    setCoupons((prev) => [next, ...prev])
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    toast({ variant: 'success', title: 'Coupon deleted' })
    setDeleteTarget(null)
  }

  const columns: TableColumn<Coupon>[] = [
    {
      key: 'code',
      label: 'Code',
      render: (_v, row) => (
        <div>
          <p className="font-semibold tracking-wide text-foreground">{row.code}</p>
          <p className="mt-0.5 max-w-[240px] truncate text-xs text-muted-foreground">
            {row.description}
          </p>
        </div>
      ),
    },
    {
      key: 'value',
      label: 'Discount',
      render: (_v, row) => (
        <span className="font-medium text-foreground">{formatDiscount(row)}</span>
      ),
    },
    {
      key: 'packageId',
      label: 'Applies to',
      render: (_v, row) => (
        <span className="whitespace-nowrap text-foreground">{resolvePackage(row.packageId)}</span>
      ),
    },
    {
      key: 'startDate',
      label: 'Validity',
      render: (_v, row) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDate(row.startDate)} – {formatDate(row.endDate)}
        </span>
      ),
    },
    {
      key: 'usedCount',
      label: 'Usage',
      render: (_v, row) => (
        <span className="tabular-nums text-foreground">
          {row.usedCount}
          <span className="text-muted-foreground">
            {' / '}
            {row.usageLimit ?? '∞'}
          </span>
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_v, row) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Active Coupons</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Redemptions</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">
              {totalRedemptions}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">Coupons &amp; Promotions</h2>
        <Button
          type="button"
          onClick={openCreate}
          className="shrink-0 gap-2 rounded-md bg-primary text-accent-foreground hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Add Coupon
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        rowKeyExtractor={(row) => row.id}
        emptyMessage="No coupons yet. Click “Add Coupon” to create one."
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => openEdit(row)}
              aria-label={`Edit ${row.code}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => setDeleteTarget(row)}
              aria-label={`Delete ${row.code}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <AddEditCouponModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        mode={modalMode}
        coupon={editing}
        packages={packages}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete coupon"
        description={deleteTarget ? `Remove the “${deleteTarget.code}” coupon?` : ''}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
