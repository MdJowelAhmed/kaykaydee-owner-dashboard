import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AppSliderItem } from '../sliderData'

interface SliderRowActionMenuProps {
  slider: AppSliderItem
  onEdit: (slider: AppSliderItem) => void
  onDelete: (slider: AppSliderItem) => void
}

export function SliderRowActionMenu({ slider, onEdit, onDelete }: SliderRowActionMenuProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-[#6BBF2D] text-[#0C5822] hover:bg-[#CEF8DA]"
        onClick={() => onEdit(slider)}
      >
        <Edit className="h-4 w-4 mr-1.5" />
        Edit
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-destructive/40 text-destructive hover:bg-destructive/10"
        onClick={() => onDelete(slider)}
      >
        <Trash2 className="h-4 w-4 mr-1.5" />
        Delete
      </Button>
    </div>
  )
}
