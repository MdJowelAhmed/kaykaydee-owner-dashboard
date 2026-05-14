import { useEffect, useState } from 'react'
import { ModalWrapper, FormInput, FormTextarea } from '@/components/common'
import { Button } from '@/components/ui/button'

interface SendAnnouncementModalProps {
  open: boolean
  onClose: () => void
  clinicName: string
  onSend: (title: string, message: string) => void
}

export function SendAnnouncementModal({
  open,
  onClose,
  clinicName,
  onSend,
}: SendAnnouncementModalProps) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle('')
      setMessage('')
      setTouched(false)
    }
  }, [open])

  const titleError = touched && !title.trim() ? 'Title is required' : undefined
  const messageError = touched && !message.trim() ? 'Message is required' : undefined

  const handleSend = () => {
    setTouched(true)
    if (!title.trim() || !message.trim()) return
    onSend(title.trim(), message.trim())
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Send announcement"
      description={`Send an in-app announcement to ${clinicName}.`}
      size="md"
      className="rounded-2xl"
    >
      <div className="space-y-4 pt-2">
        <FormInput
          label="Title"
          required
          placeholder="e.g. Scheduled maintenance this weekend"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
        />
        <FormTextarea
          label="Message"
          required
          rows={4}
          placeholder="Write the announcement the clinic admin will see…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={messageError}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            className="bg-primary text-accent-foreground hover:bg-primary/90"
          >
            Send announcement
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}
