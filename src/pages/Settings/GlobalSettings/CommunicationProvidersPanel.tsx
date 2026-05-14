import { useState } from 'react'
import { Mail, MessageSquare, Save, Send } from 'lucide-react'
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
import { toast } from 'sonner'
import { SettingsCard, FieldRow, ToggleRow } from './SettingsCard'
import {
  defaultCommunication,
  type CommunicationSettings,
  type EmailProvider,
  type SmsProvider,
} from './globalSettingsData'

export function CommunicationProvidersPanel() {
  const [settings, setSettings] = useState<CommunicationSettings>(defaultCommunication)

  const update = <K extends keyof CommunicationSettings>(
    key: K,
    value: CommunicationSettings[K]
  ) => setSettings((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => toast.success('Communication providers saved')
  const handleSendTest = (channel: 'email' | 'sms') =>
    toast.success(`Test ${channel} queued`)

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Email provider"
        description="Transactional and notification email"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
            <Mail className="h-3.5 w-3.5" />
            Active
          </span>
        }
      >
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Provider
            </Label>
            <Select
              value={settings.emailProvider}
              onValueChange={(v) => update('emailProvider', v as EmailProvider)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
                <SelectItem value="ses">AWS SES</SelectItem>
                <SelectItem value="mailgun">Mailgun</SelectItem>
                <SelectItem value="postmark">Postmark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Daily send limit
            </Label>
            <Input
              className="mt-1"
              type="number"
              min={0}
              value={settings.emailDailyLimit}
              onChange={(e) => update('emailDailyLimit', Number(e.target.value) || 0)}
            />
          </div>
        </FieldRow>
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              From address
            </Label>
            <Input
              className="mt-1"
              type="email"
              value={settings.emailFrom}
              onChange={(e) => update('emailFrom', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Reply-to address
            </Label>
            <Input
              className="mt-1"
              type="email"
              value={settings.emailReplyTo}
              onChange={(e) => update('emailReplyTo', e.target.value)}
            />
          </div>
        </FieldRow>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            API key
          </Label>
          <Input
            className="mt-1 font-mono text-xs"
            type="password"
            value={settings.emailApiKey}
            onChange={(e) => update('emailApiKey', e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => handleSendTest('email')}
          >
            <Send className="h-4 w-4" />
            Send test email
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard
        title="SMS provider"
        description="Two-factor codes, urgent alerts, and patient reminders"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <MessageSquare className="h-3.5 w-3.5" />
            {settings.smsEnabled ? 'Active' : 'Disabled'}
          </span>
        }
      >
        <ToggleRow
          title="Enable SMS sending"
          description="Master switch for all outbound SMS"
          control={
            <Switch
              checked={settings.smsEnabled}
              onCheckedChange={(v) => update('smsEnabled', v)}
            />
          }
        />
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Provider
            </Label>
            <Select
              value={settings.smsProvider}
              onValueChange={(v) => update('smsProvider', v as SmsProvider)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="vonage">Vonage</SelectItem>
                <SelectItem value="plivo">Plivo</SelectItem>
                <SelectItem value="messagebird">MessageBird</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Daily send limit
            </Label>
            <Input
              className="mt-1"
              type="number"
              min={0}
              value={settings.smsDailyLimit}
              onChange={(e) => update('smsDailyLimit', Number(e.target.value) || 0)}
            />
          </div>
        </FieldRow>
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sender ID
            </Label>
            <Input
              className="mt-1"
              value={settings.smsSenderId}
              onChange={(e) => update('smsSenderId', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              API key / SID
            </Label>
            <Input
              className="mt-1 font-mono text-xs"
              type="password"
              value={settings.smsApiKey}
              onChange={(e) => update('smsApiKey', e.target.value)}
            />
          </div>
        </FieldRow>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => handleSendTest('sms')}
            disabled={!settings.smsEnabled}
          >
            <Send className="h-4 w-4" />
            Send test SMS
          </Button>
        </div>
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
