import { useEffect, useMemo, useState } from 'react'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { FeatureGroup, SubscriptionManagePackage } from '../types'

interface EditFeaturesModalProps {
  open: boolean
  onClose: () => void
  pkg: SubscriptionManagePackage | null
  onSave: (nextGroups: FeatureGroup[]) => void
}

export function EditFeaturesModal({ open, onClose, pkg, onSave }: EditFeaturesModalProps) {
  const initial = useMemo(() => pkg?.featureGroups ?? [], [pkg])
  const [groups, setGroups] = useState<FeatureGroup[]>(initial)

  useEffect(() => {
    if (!open) return
    setGroups(initial)
  }, [open, initial])

  const toggleItem = (groupId: string, itemId: string, enabled: boolean) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              items: g.items.map((it) => (it.id === itemId ? { ...it, enabled } : it)),
            }
      )
    )
  }

  const handleSave = () => {
    onSave(groups)
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Edit features"
      description={pkg ? `${pkg.name} · ${pkg.cycle}` : undefined}
      size="full"
      className="rounded-2xl"
    >
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.id} className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
            </div>
            <div className="px-6 py-2">
              <div className="grid grid-cols-1 gap-0">
                <div className="grid grid-cols-2 py-3 text-xs font-semibold text-muted-foreground">
                  <div>Feature</div>
                  <div className="text-right">Status</div>
                </div>
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-2 items-center border-t border-border py-4"
                  >
                    <div className="text-sm text-foreground">{item.label}</div>
                    <div className="flex justify-end">
                      <Switch
                        checked={item.enabled}
                        onCheckedChange={(v) => toggleItem(group.id, item.id, v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
          >
            Save changes
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}
