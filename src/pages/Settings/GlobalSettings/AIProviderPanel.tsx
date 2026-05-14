import { useState } from 'react'
import { Save, Sparkles } from 'lucide-react'
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
  defaultAIProvider,
  type AIProvider,
  type AIProviderSettings,
} from './globalSettingsData'

const MODEL_OPTIONS: Record<AIProvider, { value: string; label: string }[]> = {
  anthropic: [
    { value: 'claude-opus-4-7', label: 'Claude Opus 4.7' },
    { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
    { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
  ],
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  ],
  azure: [
    { value: 'gpt-4o-azure', label: 'GPT-4o (Azure)' },
    { value: 'gpt-4-azure', label: 'GPT-4 (Azure)' },
  ],
  gemini: [
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  ],
}

export function AIProviderPanel() {
  const [settings, setSettings] = useState<AIProviderSettings>(defaultAIProvider)

  const update = <K extends keyof AIProviderSettings>(
    key: K,
    value: AIProviderSettings[K]
  ) => setSettings((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    toast.success('AI provider settings saved')
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Provider"
        description="Primary model provider and automatic fallback"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            Powering AI features
          </span>
        }
      >
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Primary provider
            </Label>
            <Select
              value={settings.primary}
              onValueChange={(v) => update('primary', v as AIProvider)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="azure">Azure OpenAI</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Fallback provider
            </Label>
            <Select
              value={settings.fallback}
              onValueChange={(v) => update('fallback', v as AIProvider | 'none')}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="azure">Azure OpenAI</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FieldRow>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            API key
          </Label>
          <Input
            className="mt-1 font-mono text-xs"
            type="password"
            value={settings.apiKey}
            onChange={(e) => update('apiKey', e.target.value)}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Model defaults"
        description="Per-feature settings may override these"
      >
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Default model
            </Label>
            <Select
              value={settings.defaultModel}
              onValueChange={(v) => update('defaultModel', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS[settings.primary].map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Max tokens
            </Label>
            <Input
              className="mt-1"
              type="number"
              min={256}
              max={32_000}
              value={settings.maxTokens}
              onChange={(e) => update('maxTokens', Number(e.target.value) || 0)}
            />
          </div>
        </FieldRow>
        <FieldRow>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Temperature (0–1)
            </Label>
            <Input
              className="mt-1"
              type="number"
              step="0.1"
              min={0}
              max={1}
              value={settings.temperature}
              onChange={(e) => update('temperature', Number(e.target.value) || 0)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Lower is more deterministic — recommended 0.3–0.5 for clinical text
            </p>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Monthly budget ($)
            </Label>
            <Input
              className="mt-1"
              type="number"
              min={0}
              value={settings.monthlyBudget}
              onChange={(e) => update('monthlyBudget', Number(e.target.value) || 0)}
            />
          </div>
        </FieldRow>
        <ToggleRow
          title="Cost alerts"
          description="Notify owners when 80% of monthly AI budget is consumed"
          control={
            <Switch
              checked={settings.costAlerts}
              onCheckedChange={(v) => update('costAlerts', v)}
            />
          }
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
