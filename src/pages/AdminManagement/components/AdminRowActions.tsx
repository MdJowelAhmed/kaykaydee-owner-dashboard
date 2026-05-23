import { Info, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminRowActionsProps {
  onInfo: () => void
  onEdit: () => void
  onDelete: () => void
}

export function AdminRowActions({ onInfo, onEdit, onDelete }: AdminRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
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
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-9 w-9 rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        onClick={onDelete}
        aria-label="Delete admin"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
