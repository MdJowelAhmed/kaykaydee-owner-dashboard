import { useEffect, useMemo, useState } from 'react'
import { Search, Settings2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/cn'
import type { PermissionScope } from '../types'

interface ScopePickerProps {
  label: string
  items: { id: string; label: string }[]
  scope: PermissionScope
  onChange: (scope: PermissionScope) => void
}

export function ScopePicker({ label, items, scope, onChange }: ScopePickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const isAll = scope.type === 'all'
  const selectedIds = scope.type === 'selected' ? scope.ids : []

  const summary = isAll ? `All ${items.length}` : `${selectedIds.length} of ${items.length}`

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => i.label.toLowerCase().includes(q))
  }, [items, query])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const toggleItem = (id: string, checked: boolean) => {
    const base = scope.type === 'selected' ? scope.ids : items.map((i) => i.id)
    const next = checked ? Array.from(new Set([...base, id])) : base.filter((x) => x !== id)
    onChange({ type: 'selected', ids: next })
  }

  const setAll = () => onChange({ type: 'all' })
  const clearAll = () => onChange({ type: 'selected', ids: [] })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted',
            isAll ? 'text-primary' : 'text-foreground'
          )}
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span>{summary}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-xs font-semibold text-foreground">{label} access</p>
          <div className="flex items-center gap-2 text-[11px]">
            <button type="button" onClick={setAll} className="text-primary hover:underline">
              All
            </button>
            <span className="text-border">·</span>
            <button
              type="button"
              onClick={clearAll}
              className="text-muted-foreground hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="border-b border-border px-2 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">No matches</p>
          ) : (
            filteredItems.map((item) => {
              const checked = isAll || selectedIds.includes(item.id)
              const id = `scope-${item.id}`
              return (
                <label
                  key={item.id}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(v) => toggleItem(item.id, Boolean(v))}
                  />
                  <span className="text-foreground">{item.label}</span>
                </label>
              )
            })
          )}
        </div>
        {scope.type === 'selected' && selectedIds.length === 0 && (
          <p className="border-t border-border px-3 py-2 text-[11px] text-destructive">
            Select at least one item, or switch to All access.
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}
