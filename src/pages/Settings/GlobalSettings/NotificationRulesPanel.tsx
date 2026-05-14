import { useState } from 'react'
import { Mail, MessageSquare, Slack, Bell, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/utils/cn'
import { toast } from 'sonner'
import { SettingsCard } from './SettingsCard'
import {
  defaultNotificationRules,
  type NotificationChannel,
  type NotificationRule,
} from './globalSettingsData'

const CHANNEL_META: Record<NotificationChannel, { label: string; icon: React.ElementType }> = {
  email: { label: 'Email', icon: Mail },
  in_app: { label: 'In-app', icon: Bell },
  slack: { label: 'Slack', icon: Slack },
  sms: { label: 'SMS', icon: MessageSquare },
}

const ALL_CHANNELS: NotificationChannel[] = ['email', 'in_app', 'slack', 'sms']

export function NotificationRulesPanel() {
  const [rules, setRules] = useState<NotificationRule[]>(defaultNotificationRules)

  const toggleEnabled = (id: string, next: boolean) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: next } : r)))
  }

  const toggleChannel = (id: string, channel: NotificationChannel) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              channels: r.channels.includes(channel)
                ? r.channels.filter((c) => c !== channel)
                : [...r.channels, channel],
            }
          : r
      )
    )
  }

  const updateThreshold = (id: string, value: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id && r.threshold !== undefined ? { ...r, threshold: value } : r))
    )
  }

  const handleSave = () => toast.success('Notification rules saved')

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Notification rules"
        description="Configure who hears about what, and how — per-event delivery channels and thresholds"
      >
        <ul className="space-y-3">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-card-foreground">{rule.event}</p>
                    {!rule.enabled && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-700">
                        Disabled
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{rule.description}</p>
                </div>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(v) => toggleEnabled(rule.id, v)}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Channels:
                </p>
                {ALL_CHANNELS.map((channel) => {
                  const { label, icon: Icon } = CHANNEL_META[channel]
                  const active = rule.channels.includes(channel)
                  return (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => toggleChannel(rule.id, channel)}
                      disabled={!rule.enabled}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                        active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground',
                        !rule.enabled && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  )
                })}
              </div>

              {rule.threshold !== undefined && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs">
                  <span className="font-semibold uppercase tracking-wide text-muted-foreground">
                    Trigger when:
                  </span>
                  <Input
                    type="number"
                    className="h-8 w-24"
                    value={rule.threshold}
                    onChange={(e) => updateThreshold(rule.id, Number(e.target.value) || 0)}
                    disabled={!rule.enabled}
                  />
                  <span className="text-muted-foreground">{rule.thresholdLabel}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </SettingsCard>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </div>
    </div>
  )
}
