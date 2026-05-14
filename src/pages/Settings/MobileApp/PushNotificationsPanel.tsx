import { useState } from 'react'
import { Save, Send, Bell, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  defaultPushChannels,
  defaultPushSettings,
  type PushChannel,
  type PushSettings,
} from './mobileAppData'

export function PushNotificationsPanel() {
  const [settings, setSettings] = useState<PushSettings>(defaultPushSettings)
  const [channels, setChannels] = useState<PushChannel[]>(defaultPushChannels)

  const updateSetting = <K extends keyof PushSettings>(key: K, value: PushSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  const toggleChannel = (id: string, next: boolean) => {
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: next } : c)))
  }

  const handleSave = () => toast.success('Push notification settings saved')
  const handleTest = () => toast.success('Test push queued to your linked devices')

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-card-foreground">
            Master controls
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Platform-wide push notification behavior
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Push notifications</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Master switch for all mobile push deliveries
                </p>
              </div>
            </div>
            <Switch
              checked={settings.masterEnabled}
              onCheckedChange={(v) => updateSetting('masterEnabled', v)}
            />
          </div>

          <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                <Moon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Quiet hours</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Suppress non-urgent pushes during this window (local time)
                </p>
              </div>
            </div>
            <Switch
              checked={settings.quietHoursEnabled}
              onCheckedChange={(v) => updateSetting('quietHoursEnabled', v)}
            />
          </div>

          {settings.quietHoursEnabled && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Start
                </Label>
                <Input
                  className="mt-1"
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => updateSetting('quietHoursStart', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  End
                </Label>
                <Input
                  className="mt-1"
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => updateSetting('quietHoursEnd', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Default sound
                </Label>
                <Select
                  value={settings.defaultSound}
                  onValueChange={(v) =>
                    updateSetting('defaultSound', v as PushSettings['defaultSound'])
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="silent">Silent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-card-foreground">Channels</CardTitle>
          <p className="text-sm text-muted-foreground">
            Per-channel push delivery — disable a channel to stop all pushes of that type
          </p>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          {channels.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-card-foreground">{c.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
              </div>
              <Switch
                checked={c.enabled && settings.masterEnabled}
                disabled={!settings.masterEnabled}
                onCheckedChange={(v) => toggleChannel(c.id, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleTest} className="gap-2">
          <Send className="h-4 w-4" />
          Send test push
        </Button>
        <Button type="button" onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </div>
    </div>
  )
}
