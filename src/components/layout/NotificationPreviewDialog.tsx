import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { NotificationListItem } from '@/components/common/NotificationListItem'
import {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_MODAL_PREVIEW_COUNT,
} from '@/mocks/notificationData'

export function NotificationPreviewDialog() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const preview = MOCK_NOTIFICATIONS.filter((n) => n.box === 'inbox').slice(
    0,
    NOTIFICATION_MODAL_PREVIEW_COUNT
  )

  const handleSeeAll = () => {
    setOpen(false)
    navigate('/notification')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-2xl border border-border text-muted-foreground  "
          aria-label="Open notifications"
          aria-expanded={open}
        >
          {/* <Camera className="h-5 w-5" /> */}

          <img src="/assets/notification.png" alt="Notification" className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={10}
        className="w-[min(100vw-2rem,22rem)] max-w-md gap-0 border-slate-200 bg-white p-0 shadow-lg rounded-2xl"
      >
        <div className="border-b border-slate-100 px-4 py-3 pr-3 text-left">
          <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
        </div>
        <div className="max-h-[min(60vh,380px)] overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin">
          {preview.map((item) => (
            <NotificationListItem key={item.id} item={item} className="shadow-none" />
          ))}
        </div>
        <div className="border-t border-slate-100 p-3">
          <Button
            type="button"
            className="w-full rounded-xl bg-[#6BBF2D] hover:bg-[#5aad26] text-white"
            onClick={handleSeeAll}
          >
            See All
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
