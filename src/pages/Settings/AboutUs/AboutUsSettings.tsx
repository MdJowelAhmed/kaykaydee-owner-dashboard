import { useMemo, useState } from 'react'
import { Info, Pencil, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { SearchInput } from '@/components/common/SearchInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from '@/utils/toast'
import { useAppSelector } from '@/redux/hooks'
import { UserRole } from '@/types/roles'
import { cn } from '@/utils/cn'

/** Default copy used as textarea placeholder on create and as fallback if body is left empty */
const ABOUT_FORM_DEFAULTS = {
  titlePlaceholder: 'e.g. Our Mission, Our Values',
  bodyPlaceholder:
    'Shpitze is an on-demand professional platform for the dental industry, offering a one-stop solution for temporary and flexible staffing. We aim to bring dental practices and qualified dental professionals together in a streamlined and efficient manner.',
} as const

/** Example section titles — surfaced in title field placeholder on create */
const SAMPLE_SECTION_TITLE_HINTS = ['Our Story', 'Our Vision', 'Our Goal'] as const

type DateFilter = 'all' | '7d' | '30d' | '90d'

export type AboutSection = {
  id: string
  title: string
  body: string
  updatedAt: number
}

function daysAgoMs(days: number) {
  return Date.now() - days * 24 * 60 * 60 * 1000
}

const initialSections: AboutSection[] = [
  {
    id: 'our-story',
    title: 'Our Story',
    body: 'Hello every one welcome to the about us page, here you can add your content and it will be displayed on the About Us page. It can be edited later.',
    updatedAt: daysAgoMs(2),
  },
  {
    id: 'our-vision',
    title: 'Our Vision',
    body: 'Hello every one welcome to the about us page, here you can add your content and it will be displayed on the About Us page. It can be edited later.',
    updatedAt: daysAgoMs(10),
  },
  {
    id: 'our-goal',
    title: 'Our Goal',
    body: 'hello world',
    updatedAt: daysAgoMs(40),
  },
]

function formatDisplayDate(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts))
}

function matchesDateFilter(updatedAt: number, filter: DateFilter) {
  if (filter === 'all') return true
  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90
  return Date.now() - updatedAt <= days * 24 * 60 * 60 * 1000
}

export default function AboutUsSettings() {
  const { user } = useAppSelector((state) => state.auth)
  const canManage = user?.role === UserRole.SUPER_ADMIN

  const [sections, setSections] = useState<AboutSection[]>(initialSections)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')

  type ModalMode = 'create' | 'edit'
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formTitle, setFormTitle] = useState('')
  const [formBody, setFormBody] = useState('')
  const [saving, setSaving] = useState(false)

  const titleFieldPlaceholder =
    modalMode === 'create'
      ? `${ABOUT_FORM_DEFAULTS.titlePlaceholder} (${SAMPLE_SECTION_TITLE_HINTS.join(', ')})`
      : undefined
  const bodyFieldPlaceholder =
    modalMode === 'create' ? ABOUT_FORM_DEFAULTS.bodyPlaceholder : undefined

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return sections.filter((s) => {
      if (!matchesDateFilter(s.updatedAt, dateFilter)) return false
      if (!q) return true
      return (
        s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
      )
    })
  }, [sections, search, dateFilter])

  const closeModal = () => {
    setModalOpen(false)
    setModalMode('create')
    setEditingId(null)
    setFormTitle('')
    setFormBody('')
  }

  const openAdd = () => {
    setModalMode('create')
    setEditingId(null)
    setFormTitle('')
    setFormBody('')
    setModalOpen(true)
  }

  const openEdit = (section: AboutSection) => {
    setModalMode('edit')
    setEditingId(section.id)
    setFormTitle(section.title)
    setFormBody(section.body)
    setModalOpen(true)
  }

  const handleModalSave = async () => {
    const title = formTitle.trim()
    if (!title) {
      toast({
        title: 'Title required',
        description: 'Please enter a section title.',
        variant: 'destructive',
      })
      return
    }
    const bodyTrimmed = formBody.trim()
    const bodyToStore =
      bodyTrimmed ||
      (modalMode === 'create' ? ABOUT_FORM_DEFAULTS.bodyPlaceholder : '')

    if (modalMode === 'edit' && !bodyTrimmed) {
      toast({
        title: 'Content required',
        description: 'Please enter section content.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))

    if (modalMode === 'create') {
      const next: AboutSection = {
        id: crypto.randomUUID(),
        title,
        body: bodyToStore,
        updatedAt: Date.now(),
      }
      setSections((prev) => [...prev, next])
      toast({
        title: 'Template added',
        description: `"${title}" has been added.`,
      })
    } else if (editingId) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, title, body: bodyTrimmed, updatedAt: Date.now() }
            : s
        )
      )
      toast({
        title: 'Section updated',
        description: `"${title}" has been saved.`,
      })
    }

    setSaving(false)
    closeModal()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="-mx-6 -mt-6 mb-0 min-h-[calc(100vh-5rem)] bg-[#F3F4F6] px-6 pb-10 pt-6 lg:-mx-8 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search here"
            className="w-full sm:w-[min(100%,280px)] sm:ml-auto"
            inputClassName=" rounded-lg border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] shadow-sm"
          />
          <Select
            value={dateFilter}
            onValueChange={(v) => setDateFilter(v as DateFilter)}
          >
            <SelectTrigger className=" w-full rounded-lg border-[#E5E7EB] bg-white text-[#374151] shadow-sm sm:w-[140px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Date</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          {canManage && (
            <Button
              type="button"
              onClick={openAdd}
              className="rounded-md  px-4 font-medium text-white "
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#6B7280] shadow-sm">
              No sections match your search or date filter.
            </div>
          ) : (
            filtered.map((section) => (
              <article
                key={section.id}
                className="flex gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold text-[#111827]">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                    {section.body}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-center justify-center gap-3 sm:flex-row">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#374151]"
                        aria-label={`About ${section.title}`}
                      >
                        <Info className="h-5 w-5" strokeWidth={1.75} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="max-w-xs border-[#E5E7EB] bg-white text-left text-[#374151] shadow-md"
                    >
                      <p className="font-medium text-[#111827]">
                        {section.title}
                      </p>
                      <p className="mt-1 text-xs text-[#6B7280]">
                        Last updated: {formatDisplayDate(section.updatedAt)}
                      </p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        {section.body.length} characters
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  {canManage && (
                    <button
                      type="button"
                      onClick={() => openEdit(section)}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#374151]'
                      )}
                      aria-label={`Edit ${section.title}`}
                    >
                      <Pencil className="h-5 w-5" strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) closeModal()
        }}
      >
        <DialogContent className="max-w-2xl border-[#E5E7EB] bg-white">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'create' ? 'Add template' : 'Edit section'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'create'
                ? 'Create a new About Us block. Fields start empty; hints come from your default templates.'
                : 'Update the title and content for this About Us block.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="about-modal-title">Title</Label>
              <Input
                id="about-modal-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder={titleFieldPlaceholder}
                className="rounded-lg border-[#E5E7EB]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="about-modal-body">Content</Label>
              <Textarea
                id="about-modal-body"
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                placeholder={bodyFieldPlaceholder}
                rows={6}
                className="resize-y rounded-lg border-[#E5E7EB] text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleModalSave}
              isLoading={saving}
              className="bg-[#1E293B] text-white hover:bg-[#334155]"
            >
              {modalMode === 'create' ? 'Save' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
