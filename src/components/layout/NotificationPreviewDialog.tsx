import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NotificationListItem } from '@/components/common/NotificationListItem'
import {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_MODAL_PREVIEW_COUNT,
} from '@/mocks/notificationData'

interface NotificationPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationPreviewDialog({ open, onOpenChange }: NotificationPreviewDialogProps) {
  const navigate = useNavigate()
  const preview = MOCK_NOTIFICATIONS.slice(0, NOTIFICATION_MODAL_PREVIEW_COUNT)

  const handleSeeAll = () => {
    onOpenChange(false)
    navigate('/notification')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 sm:max-w-md overflow-hidden">
        <DialogHeader className="border-b border-slate-100 px-6 py-4 pr-14 text-left">
          <DialogTitle className="text-lg font-semibold">Notifications</DialogTitle>
        </DialogHeader>
        <div className="max-h-[min(70vh,420px)] overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
          {preview.map((item) => (
            <NotificationListItem key={item.id} item={item} className="shadow-none" />
          ))}
        </div>
        <div className="border-t border-slate-100 p-4">
          <Button
            type="button"
            className="w-full rounded-xl bg-[#6BBF2D] hover:bg-[#5aad26] text-white"
            onClick={handleSeeAll}
          >
            See All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
