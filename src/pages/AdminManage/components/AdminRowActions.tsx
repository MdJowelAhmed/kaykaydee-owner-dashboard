import { Info, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminRowActionsProps {
  onInfo: () => void
  onEdit: () => void
}

export function AdminRowActions({ onInfo, onEdit }: AdminRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onInfo}
        aria-label="Admin details"
      >
        <Info className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onEdit}
        aria-label="Edit admin"
      >
        <Pencil className="h-5 w-5" />
      </Button>
    </div>
  )
}
