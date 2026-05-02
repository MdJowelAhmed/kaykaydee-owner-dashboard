import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
  /** Classes for the search field shell (border, radius, height, colors). */
  inputClassName?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
  inputClassName,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, debounceMs, onChange, value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className={cn('w-full min-w-0', className)}>
      {/* Flex row (no absolute icons) keeps height stable in flex parents and avoids overlap/z weirdness */}
      <div
        className={cn(
          'flex h-11 w-full min-w-0 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-accent ring-offset-background transition-colors',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          inputClassName
        )}
      >
        <Search
          className="pointer-events-none h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'h-auto min-h-0 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 shadow-none',
            'text-accent placeholder:text-muted-foreground',
            'focus-visible:ring-0 focus-visible:ring-offset-0'
          )}
        />
        {localValue ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 shrink-0"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
