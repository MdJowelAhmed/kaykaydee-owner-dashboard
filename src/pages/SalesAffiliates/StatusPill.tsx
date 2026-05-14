import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { TONE_CLASSES, type BadgeTone } from './shared'

export function StatusPill({
  tone,
  children,
}: {
  tone: BadgeTone
  children: React.ReactNode
}) {
  return (
    <Badge variant="outline" className={cn('font-medium', TONE_CLASSES[tone])}>
      {children}
    </Badge>
  )
}
