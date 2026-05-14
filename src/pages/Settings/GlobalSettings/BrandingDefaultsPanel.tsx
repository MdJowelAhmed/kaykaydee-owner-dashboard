import { useState } from 'react'
import { Save, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { SettingsCard, FieldRow } from './SettingsCard'
import { defaultBranding, type BrandingDefaults } from './globalSettingsData'

export function BrandingDefaultsPanel() {
  const [settings, setSettings] = useState<BrandingDefaults>(defaultBranding)

  const update = <K extends keyof BrandingDefaults>(key: K, value: BrandingDefaults[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => toast.success('Branding defaults saved')

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Identity"
        description="Platform-wide name and tagline used in headers, emails, and footers"
      >
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Platform name
            </Label>
            <Input
              className="mt-1"
              value={settings.platformName}
              onChange={(e) => update('platformName', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Support email
            </Label>
            <Input
              className="mt-1"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => update('supportEmail', e.target.value)}
            />
          </div>
        </FieldRow>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tagline
          </Label>
          <Input
            className="mt-1"
            value={settings.tagline}
            onChange={(e) => update('tagline', e.target.value)}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Logo &amp; favicon"
        description="PNG or SVG · 240×80 logo, 64×64 favicon recommended"
      >
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Logo URL
            </Label>
            <Input
              className="mt-1"
              value={settings.logoUrl}
              onChange={(e) => update('logoUrl', e.target.value)}
            />
            <div className="mt-3 flex h-20 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-neutral-50">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Favicon URL
            </Label>
            <Input
              className="mt-1"
              value={settings.faviconUrl}
              onChange={(e) => update('faviconUrl', e.target.value)}
            />
            <div className="mt-3 flex h-20 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-neutral-50">
              {settings.faviconUrl ? (
                <img
                  src={settings.faviconUrl}
                  alt="Favicon preview"
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>
        </FieldRow>
      </SettingsCard>

      <SettingsCard
        title="Brand colors"
        description="Default theme colors for new clinics and emails"
      >
        <FieldRow>
          <ColorInput
            label="Primary color"
            value={settings.primaryColor}
            onChange={(v) => update('primaryColor', v)}
          />
          <ColorInput
            label="Accent color"
            value={settings.accentColor}
            onChange={(v) => update('accentColor', v)}
          />
        </FieldRow>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Preview
          </p>
          <div className="flex flex-1 items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: settings.primaryColor }}
            >
              Primary
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: settings.accentColor }}
            >
              Accent
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{
                background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.accentColor})`,
              }}
            >
              Gradient
            </span>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Email footer"
        description="Appended to every outbound transactional email"
      >
        <Textarea
          rows={3}
          value={settings.defaultEmailFooter}
          onChange={(e) => update('defaultEmailFooter', e.target.value)}
        />
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

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-md border border-border bg-card"
          aria-label={`${label} picker`}
        />
        <Input
          className="font-mono text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
