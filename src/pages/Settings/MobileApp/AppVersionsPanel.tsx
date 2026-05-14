import { useState } from 'react'
import { motion } from 'framer-motion'
import { Apple, Save, ExternalLink, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { defaultAppVersions, type AppVersionInfo } from './mobileAppData'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function AppVersionsPanel() {
  const [versions, setVersions] = useState<AppVersionInfo[]>(defaultAppVersions)

  const updateAt = (idx: number, patch: Partial<AppVersionInfo>) => {
    setVersions((prev) => prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)))
  }

  const handleSave = () => toast.success('App versions saved')

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {versions.map((v, i) => (
          <motion.div
            key={v.platform}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="rounded-2xl bg-card shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                      {v.platform === 'iOS' ? (
                        <Apple className="h-5 w-5" />
                      ) : (
                        <Smartphone className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-card-foreground">
                        {v.platform}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Released {formatDate(v.releasedAt)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={v.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Store <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Current version
                    </Label>
                    <Input
                      className="mt-1 font-mono text-sm"
                      value={v.current}
                      onChange={(e) => updateAt(i, { current: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Minimum supported
                    </Label>
                    <Input
                      className="mt-1 font-mono text-sm"
                      value={v.minSupported}
                      onChange={(e) => updateAt(i, { minSupported: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div>
                    <p className="font-semibold text-card-foreground">Force update</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Block usage below the minimum version until users upgrade
                    </p>
                  </div>
                  <Switch
                    checked={v.forceUpdate}
                    onCheckedChange={(c) => updateAt(i, { forceUpdate: c })}
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Release notes
                  </Label>
                  <Textarea
                    rows={4}
                    className="mt-1 font-mono text-xs"
                    value={v.releaseNotes}
                    onChange={(e) => updateAt(i, { releaseNotes: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </div>
    </div>
  )
}
