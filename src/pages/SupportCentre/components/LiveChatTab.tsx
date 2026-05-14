import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'
import { liveChatSessions, type ChatStatus, type LiveChatSession } from '../extraData'
import { toast } from '@/utils/toast'

const STATUS_TONE: Record<ChatStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  waiting: 'bg-amber-50 text-amber-700',
  resolved: 'bg-neutral-100 text-neutral-700',
}

const STATUS_LABEL: Record<ChatStatus, string> = {
  active: 'Active',
  waiting: 'Waiting',
  resolved: 'Resolved',
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function LiveChatTab() {
  const [selectedId, setSelectedId] = useState<string>(liveChatSessions[0]?.id ?? '')
  const [reply, setReply] = useState('')

  const selected = useMemo(
    () => liveChatSessions.find((s) => s.id === selectedId) ?? liveChatSessions[0] ?? null,
    [selectedId]
  )

  const summary = useMemo(() => {
    return {
      total: liveChatSessions.length,
      active: liveChatSessions.filter((s) => s.status === 'active').length,
      waiting: liveChatSessions.filter((s) => s.status === 'waiting').length,
      resolved: liveChatSessions.filter((s) => s.status === 'resolved').length,
    }
  }, [])

  const handleSend = () => {
    const text = reply.trim()
    if (!text) return
    setReply('')
    toast({ variant: 'success', title: 'Message sent' })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Active sessions" value={summary.active} icon={MessageCircle} tint="bg-emerald-50 text-emerald-700" index={0} />
        <SummaryCard label="Waiting for agent" value={summary.waiting} icon={Clock} tint="bg-amber-50 text-amber-700" index={1} />
        <SummaryCard label="Resolved today" value={summary.resolved} icon={CheckCircle2} tint="bg-sky-50 text-sky-700" index={2} />
        <SummaryCard label="Total today" value={summary.total} icon={MessageCircle} tint="bg-violet-50 text-violet-700" index={3} />
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-[320px_1fr]">
            <div className="border-b border-border lg:border-b-0 lg:border-r">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-card-foreground">Conversations</h3>
                <p className="text-xs text-muted-foreground">
                  {summary.active + summary.waiting} active
                </p>
              </div>
              <ul className="divide-y divide-border">
                {liveChatSessions.map((session) => (
                  <li key={session.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(session.id)}
                      className={cn(
                        'flex w-full gap-3 px-4 py-3 text-left transition-colors',
                        selectedId === session.id
                          ? 'bg-neutral-50'
                          : 'hover:bg-neutral-50/60'
                      )}
                    >
                      <img
                        src={session.avatarUrl}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-card-foreground">
                            {session.contactName}
                          </p>
                          {session.unread > 0 && (
                            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white">
                              {session.unread}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{session.clinic}</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {session.lastMessage}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
                              STATUS_TONE[session.status]
                            )}
                          >
                            {STATUS_LABEL[session.status]}
                          </span>
                          {session.status === 'waiting' && (
                            <span className="text-[10px] text-rose-600">
                              {session.waitingForMinutes}m waiting
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-h-[480px] flex-col">
              {selected ? (
                <ChatPanel session={selected} reply={reply} onReplyChange={setReply} onSend={handleSend} />
              ) : (
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                  Select a conversation to view
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tint,
  index,
}: {
  label: string
  value: number
  icon: React.ElementType
  tint: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', tint)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{value}</p>
    </motion.div>
  )
}

function ChatPanel({
  session,
  reply,
  onReplyChange,
  onSend,
}: {
  session: LiveChatSession
  reply: string
  onReplyChange: (v: string) => void
  onSend: () => void
}) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <img
          src={session.avatarUrl}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-card-foreground">
            {session.contactName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {session.contactRole} · {session.clinic}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
            STATUS_TONE[session.status]
          )}
        >
          {STATUS_LABEL[session.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-neutral-50/50 p-4">
        <div className="self-start max-w-[75%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-sm shadow-sm">
          <p>{session.lastMessage}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {session.contactName} · {relativeTime(session.startedAt)}
          </p>
        </div>
        {session.agent && (
          <div className="self-end max-w-[75%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm text-white shadow-sm">
            <p>Got it — checking on this now. I&apos;ll get back to you within a few minutes.</p>
            <p className="mt-1 text-[10px] text-white/70">{session.agent} · just now</p>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <Input
            value={reply}
            onChange={(e) => onReplyChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
            placeholder="Type a message…"
            className="flex-1"
          />
          <Button type="button" onClick={onSend} disabled={!reply.trim()} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
