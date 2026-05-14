import { useState } from 'react'
import { Eye, EyeOff, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
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
  defaultPaymentGateway,
  type PaymentGatewaySettings,
  type PaymentProvider,
} from './globalSettingsData'

const CARD_OPTIONS = ['Visa', 'Mastercard', 'Amex', 'Discover', 'JCB'] as const

export function PaymentGatewayPanel() {
  const [settings, setSettings] = useState<PaymentGatewaySettings>(defaultPaymentGateway)
  const [showKey, setShowKey] = useState(false)

  const update = <K extends keyof PaymentGatewaySettings>(
    key: K,
    value: PaymentGatewaySettings[K]
  ) => setSettings((prev) => ({ ...prev, [key]: value }))

  const toggleCard = (card: string) => {
    setSettings((prev) => ({
      ...prev,
      acceptedCards: prev.acceptedCards.includes(card)
        ? prev.acceptedCards.filter((c) => c !== card)
        : [...prev.acceptedCards, card],
    }))
  }

  const handleSave = () => {
    toast.success('Payment gateway settings saved')
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Primary provider"
        description="Default checkout and recurring billing provider"
      >
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Provider
            </Label>
            <Select
              value={settings.primaryProvider}
              onValueChange={(v) => update('primaryProvider', v as PaymentProvider)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Currency
            </Label>
            <Select
              value={settings.currency}
              onValueChange={(v) => update('currency', v as PaymentGatewaySettings['currency'])}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD — US Dollar</SelectItem>
                <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
                <SelectItem value="GBP">GBP — British Pound</SelectItem>
                <SelectItem value="EUR">EUR — Euro</SelectItem>
                <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FieldRow>

        <ToggleRow
          title="Test mode"
          description="Route all transactions through provider sandbox keys"
          control={
            <Switch
              checked={settings.testMode}
              onCheckedChange={(v) => update('testMode', v)}
            />
          }
        />
      </SettingsCard>

      <SettingsCard
        title="Stripe credentials"
        description="API keys are masked. Rotate by pasting a new value."
      >
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Publishable key
            </Label>
            <Input
              className="mt-1 font-mono text-xs"
              value={settings.stripePublishableKey}
              onChange={(e) => update('stripePublishableKey', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Secret key
            </Label>
            <div className="mt-1 flex gap-2">
              <Input
                className="font-mono text-xs"
                type={showKey ? 'text' : 'password'}
                value={settings.stripeSecretKey}
                onChange={(e) => update('stripeSecretKey', e.target.value)}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => setShowKey((v) => !v)}
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </FieldRow>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Webhook signing secret
          </Label>
          <Input
            className="mt-1 font-mono text-xs"
            value={settings.stripeWebhookSecret}
            onChange={(e) => update('stripeWebhookSecret', e.target.value)}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Alternative payment methods"
        description="Enable secondary providers and bank wire"
      >
        <ToggleRow
          title="PayPal"
          description="Allow checkout via PayPal"
          control={
            <Switch
              checked={settings.paypalEnabled}
              onCheckedChange={(v) => update('paypalEnabled', v)}
            />
          }
        />
        {settings.paypalEnabled && (
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              PayPal client ID
            </Label>
            <Input
              className="mt-1 font-mono text-xs"
              value={settings.paypalClientId}
              onChange={(e) => update('paypalClientId', e.target.value)}
            />
          </div>
        )}
        <ToggleRow
          title="Bank wire / ACH"
          description="Allow Enterprise plans to pay via wire transfer"
          control={
            <Switch
              checked={settings.bankWireEnabled}
              onCheckedChange={(v) => update('bankWireEnabled', v)}
            />
          }
        />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Accepted card brands
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {CARD_OPTIONS.map((card) => (
              <label key={card} className="flex items-center gap-2 text-sm text-card-foreground">
                <Checkbox
                  checked={settings.acceptedCards.includes(card)}
                  onCheckedChange={() => toggleCard(card)}
                />
                {card}
              </label>
            ))}
          </div>
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
