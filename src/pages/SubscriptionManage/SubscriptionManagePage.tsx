import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { mockSubscriptionManagePackages } from './mockData'
import type { BillingCycle, FeatureGroup, SubscriptionManagePackage } from './types'
import { PackageCard } from './components/PackageCard'
import { AddEditPackageModal, type SaveManagePackageInput } from './components/AddEditPackageModal'
import { EditFeaturesModal } from './components/EditFeaturesModal'
import { CouponsSection } from './components/CouponsSection'
import { TierManagementSection } from './components/TierManagementSection'
import { AutomatedBillingSection } from './components/AutomatedBillingSection'
import { WhiteLabelSection } from './components/WhiteLabelSection'
import { createId } from '@/utils/id'

type TabKey = 'monthly' | 'annual' | 'trial'

const TAB_LABELS: Record<TabKey, string> = {
  monthly: 'Monthly Subscription',
  annual: 'Annual Subscription',
  trial: 'Free Trial',
}

type SectionKey = 'packages' | 'tiers' | 'coupons' | 'billing' | 'whitelabel'

const SECTION_LABELS: Record<SectionKey, string> = {
  packages: 'Subscription Management',
  tiers: 'Tier Management',
  coupons: 'Coupons & Promotions',
  billing: 'Automated Billing',
  whitelabel: 'White-Label Controls',
}

function newPackageBase(cycle: BillingCycle): SubscriptionManagePackage {
  const seed = mockSubscriptionManagePackages.find((p) => p.cycle === cycle)
  return {
    id: createId(),
    name: cycle === 'trial' ? 'Free Trial' : 'Basic',
    price: cycle === 'trial' ? 0 : 50,
    cycle,
    enabled: true,
    featureGroups: seed ? seed.featureGroups : [],
  }
}

function sumRevenue(packages: SubscriptionManagePackage[]) {
  return packages
    .filter((p) => p.enabled && p.cycle !== 'trial')
    .reduce((acc, p) => acc + p.price, 0)
}

export default function SubscriptionManagePage() {
  const [section, setSection] = useState<SectionKey>('packages')
  const [tab, setTab] = useState<TabKey>('monthly')
  const [packages, setPackages] = useState<SubscriptionManagePackage[]>(mockSubscriptionManagePackages)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<SubscriptionManagePackage | null>(null)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [featureTarget, setFeatureTarget] = useState<SubscriptionManagePackage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionManagePackage | null>(null)

  const filtered = useMemo(() => packages.filter((p) => p.cycle === tab), [packages, tab])

  const monthlyCount = packages.filter((p) => p.cycle === 'monthly' && p.enabled).length
  const monthlyRevenue = sumRevenue(packages.filter((p) => p.cycle === 'monthly'))
  const totalCount = packages.filter((p) => p.cycle !== 'trial' && p.enabled).length
  const totalRevenue = sumRevenue(packages)

  const openCreate = () => {
    setModalMode('create')
    setEditing(null)
    setModalOpen(true)
  }

  const handleSave = (payload: SaveManagePackageInput) => {
    const base = modalMode === 'edit' && editing ? editing : newPackageBase(payload.cycle)
    const next: SubscriptionManagePackage = {
      ...base,
      id: payload.id ?? base.id,
      name: payload.name,
      price: payload.price,
      cycle: payload.cycle,
      enabled: payload.enabled,
    }

    setPackages((prev) => {
      if (modalMode === 'create') return [next, ...prev]
      return prev.map((p) => (p.id === next.id ? next : p))
    })
  }

  const handleToggleEnabled = (id: string, enabled: boolean) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, enabled } : p)))
  }

  const openEditFeatures = (pkg: SubscriptionManagePackage) => {
    setFeatureTarget(pkg)
    setFeaturesOpen(true)
  }

  const saveFeatures = (nextGroups: FeatureGroup[]) => {
    if (!featureTarget) return
    setPackages((prev) =>
      prev.map((p) => (p.id === featureTarget.id ? { ...p, featureGroups: nextGroups } : p))
    )
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex w-full flex-wrap items-center gap-1 rounded-2xl border border-border bg-muted/40 p-1 lg:w-fit lg:rounded-full">
        {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSection(key)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              section === key
                ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {SECTION_LABELS[key]}
          </button>
        ))}
      </div>

      {section === 'tiers' ? (
        <TierManagementSection />
      ) : section === 'coupons' ? (
        <CouponsSection packages={packages} />
      ) : section === 'billing' ? (
        <AutomatedBillingSection />
      ) : section === 'whitelabel' ? (
        <WhiteLabelSection />
      ) : (
        <>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly subscription</p>
                <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{monthlyCount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground"> </p>
                <p className="mt-7 text-2xl font-semibold tabular-nums text-foreground">
                  ${monthlyRevenue.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Subscription</p>
                <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{totalCount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground"> </p>
                <p className="mt-7 text-2xl font-semibold tabular-nums text-foreground">
                  ${totalRevenue.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex w-fit items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
          {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                tab === key
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {TAB_LABELS[key]}
            </button>
          ))}
        </div>

        <Button
          type="button"
          onClick={openCreate}
          className="shrink-0 gap-2 rounded-md bg-primary text-accent-foreground hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Add New Package
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(0.06 * index, 0.4) }}
          >
            <PackageCard
              pkg={pkg}
              onToggleEnabled={(v) => handleToggleEnabled(pkg.id, v)}
              onEditFeatures={() => openEditFeatures(pkg)}
            />
            {/* <div className="mt-2 flex justify-end">
              <button
                type="button"
                className="text-xs text-destructive hover:underline"
                onClick={() => setDeleteTarget(pkg)}
              >
                Delete
              </button>
            </div> */}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-border bg-card py-12 text-center text-muted-foreground">
          No packages yet. Click “Add New Package” to create one.
        </p>
      )}
        </>
      )}

      <AddEditPackageModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        mode={modalMode}
        pkg={editing}
        onSave={handleSave}
      />

      <EditFeaturesModal
        open={featuresOpen}
        onClose={() => {
          setFeaturesOpen(false)
          setFeatureTarget(null)
        }}
        pkg={featureTarget}
        onSave={saveFeatures}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete package"
        description={
          deleteTarget
            ? `Remove the “${deleteTarget.name}” package?`
            : ''
        }
        confirmText="Delete"
      />
    </motion.div>
  )
}

