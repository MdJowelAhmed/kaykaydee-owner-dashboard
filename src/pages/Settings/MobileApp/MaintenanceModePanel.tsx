import { useState } from 'react'
import { AlertTriangle, Save, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { toast } from 'sonner'
import { defaultMaintenance, type MaintenanceWindow } from './mobileAppData'

export function MaintenanceModePanel() {
  const [settings, setSettings] = useState<MaintenanceWindow>(defaultMaintenance)
  const [emailDraft, setEmailDraft] = useState('')

  const update = <K extends keyof MaintenanceWindow>(key: K, value: MaintenanceWindow[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  const addToAllowList = () => {
    const email = emailDraft.trim().toLowerCase()
    if (!email || !email.includes('@') || settings.allowList.includes(email)) return
    update('allowList', [...settings.allowList, email])
    setEmailDraft('')
  }

  const removeFromAllowList = (email: string) => {
    update(
      'allowList',
      settings.allowList.filter((e) => e !== email)
    )
  }

  const handleSave = () => toast.success('Maintenance settings saved')

  return (
    <div className="space-y-6">
      {settings.enabled && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <p className="font-semibold text-rose-700">Maintenance mode is active</p>
            <p className="mt-0.5 text-sm text-rose-700/80">
              All non-allowlisted users see the maintenance banner. Disable below to restore
              access.
            </p>
          </div>
        </div>
      )}

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-card-foreground">
            Maintenance window
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Block app and dashboard access during planned downtime
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div>
              <p className="font-semibold text-card-foreground">Enable maintenance mode</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Allowlisted emails can still sign in
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(v) => update('enabled', v)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Scheduled start
              </Label>
              <Input
                type="datetime-local"
                className="mt-1"
                value={settings.scheduledStart}
                onChange={(e) => update('scheduledStart', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Scheduled end
              </Label>
              <Input
                type="datetime-local"
                className="mt-1"
                value={settings.scheduledEnd}
                onChange={(e) => update('scheduledEnd', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Banner message
            </Label>
            <Textarea
              rows={3}
              className="mt-1"
              value={settings.banner}
              onChange={(e) => update('banner', e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Shown to users when they hit a maintenance page or open the mobile app
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-card-foreground">Allowlist</CardTitle>
          <p className="text-sm text-muted-foreground">
            These emails can still sign in during maintenance — typically on-call and ops
          </p>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              placeholder="oncall@kaykaydee.health"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addToAllowList()
                }
              }}
            />
            <Button type="button" onClick={addToAllowList} className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {settings.allowList.map((email) => (
              <li
                key={email}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border border-border',
                  'bg-card px-2.5 py-1 text-xs font-medium text-card-foreground'
                )}
              >
                <span className="font-mono">{email}</span>
                <button
                  type="button"
                  onClick={() => removeFromAllowList(email)}
                  className="ml-1 text-muted-foreground hover:text-rose-600"
                  aria-label={`Remove ${email}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
            {settings.allowList.length === 0 && (
              <li className="text-xs text-muted-foreground">No emails on the allowlist yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </div>
    </div>
  )
}
