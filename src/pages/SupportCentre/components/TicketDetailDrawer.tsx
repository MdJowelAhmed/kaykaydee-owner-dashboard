import { useEffect, useRef, useState } from 'react'
import { SendHorizonal } from 'lucide-react'
import { DrawerWrapper, FormSelect, StatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import {
  CATEGORY_LABELS,
  STATUS_SELECT_OPTIONS,
  type SupportTicket,
  type TicketStatus,
} from '../types'
import { PriorityBadge } from './PriorityBadge'

interface TicketDetailDrawerProps {
  open: boolean
  onClose: () => void
  ticket: SupportTicket | null
  onReply: (ticketId: string, text: string) => void
  onStatusChange: (ticketId: string, status: TicketStatus) => void
}

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{children}</dd>
    </div>
  )
}

export function TicketDetailDrawer({
  open,
  onClose,
  ticket,
  onReply,
  onStatusChange,
}: TicketDetailDrawerProps) {
  const [draft, setDraft] = useState('')
  const threadEndRef = useRef<HTMLDivElement>(null)

  // Reset the composer whenever a different ticket is opened.
  useEffect(() => {
    setDraft('')
  }, [ticket?.id])

  // Keep the latest message in view as the thread grows.
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: 'end' })
  }, [ticket?.messages.length])

  if (!ticket) return null

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    onReply(ticket.id, text)
    setDraft('')
  }

  return (
    <DrawerWrapper
      open={open}
      onClose={onClose}
      title={ticket.ref}
      description={ticket.subject}
      size="xl"
      footer={
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-3">
          <MetaItem label="Requester">{ticket.requesterName}</MetaItem>
          <MetaItem label="Email">
            <span className="break-all">{ticket.requesterEmail}</span>
          </MetaItem>
          <MetaItem label="Category">{CATEGORY_LABELS[ticket.category]}</MetaItem>
          <MetaItem label="Priority">
            <PriorityBadge priority={ticket.priority} />
          </MetaItem>
          <MetaItem label="Status">
            <StatusBadge status={ticket.status} />
          </MetaItem>
          <MetaItem label="Created">{formatDate(ticket.createdAt, 'd MMM yyyy, h:mm a')}</MetaItem>
        </dl>

        <FormSelect
          label="Update status"
          value={ticket.status}
          options={STATUS_SELECT_OPTIONS}
          onChange={(value) => onStatusChange(ticket.id, value as TicketStatus)}
          className="max-w-xs"
        />

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Conversation</h3>
          <div className="space-y-4">
            {ticket.messages.map((message) => {
              const isSupport = message.sender === 'support'
              return (
                <div
                  key={message.id}
                  className={cn('flex', isSupport ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                      isSupport
                        ? 'bg-primary/10 text-foreground'
                        : 'bg-muted text-foreground'
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs font-semibold text-foreground">
                        {message.authorName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(message.sentAt, 'd MMM, h:mm a')}
                      </span>
                    </div>
                    <p className="mt-1 leading-relaxed">{message.text}</p>
                  </div>
                </div>
              )
            })}
            <div ref={threadEndRef} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Reply</label>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Type your reply…"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Press ⌘/Ctrl + Enter to send</p>
            <Button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim()}
              className="gap-2 bg-primary text-accent-foreground hover:bg-primary/90"
            >
              <SendHorizonal className="h-4 w-4" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    </DrawerWrapper>
  )
}
