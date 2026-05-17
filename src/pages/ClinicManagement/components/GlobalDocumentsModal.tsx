import { useMemo, useState } from 'react'
import { Download, ExternalLink, FileText, Search, Upload } from 'lucide-react'
import { ModalWrapper } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'
import { toast } from '@/utils/toast'

interface GlobalDocument {
  id: string
  title: string
  category: 'Legal' | 'Compliance' | 'Onboarding' | 'Marketing'
  format: 'PDF' | 'DOCX' | 'Link'
  sizeLabel: string
  updatedAt: string
  description: string
}

const GLOBAL_DOCUMENTS: GlobalDocument[] = [
  {
    id: 'doc-tos',
    title: 'Terms of Service',
    category: 'Legal',
    format: 'PDF',
    sizeLabel: '412 KB',
    updatedAt: 'Apr 02, 2026',
    description: 'Master terms shared with every clinic on the platform.',
  },
  {
    id: 'doc-privacy',
    title: 'Privacy Policy',
    category: 'Legal',
    format: 'PDF',
    sizeLabel: '298 KB',
    updatedAt: 'Mar 18, 2026',
    description: 'Data handling and privacy practices for all clinics.',
  },
  {
    id: 'doc-baa',
    title: 'Business Associate Agreement (BAA)',
    category: 'Compliance',
    format: 'DOCX',
    sizeLabel: '186 KB',
    updatedAt: 'Feb 27, 2026',
    description: 'HIPAA-compliant BAA template required for onboarding.',
  },
  {
    id: 'doc-onboarding',
    title: 'Clinic Onboarding Guide',
    category: 'Onboarding',
    format: 'PDF',
    sizeLabel: '1.4 MB',
    updatedAt: 'Apr 22, 2026',
    description: 'Step-by-step setup playbook delivered to every new clinic.',
  },
  {
    id: 'doc-brand',
    title: 'Brand & White-label Kit',
    category: 'Marketing',
    format: 'Link',
    sizeLabel: 'External',
    updatedAt: 'May 05, 2026',
    description: 'Logos, color tokens, and email templates for partner clinics.',
  },
]

const CATEGORY_BADGE: Record<GlobalDocument['category'], string> = {
  Legal: 'bg-purple-100 text-purple-900 dark:bg-purple-950/55 dark:text-purple-300',
  Compliance: 'bg-blue-100 text-blue-900 dark:bg-blue-950/55 dark:text-blue-300',
  Onboarding: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/55 dark:text-emerald-300',
  Marketing: 'bg-amber-100 text-amber-900 dark:bg-amber-950/55 dark:text-amber-300',
}

interface GlobalDocumentsModalProps {
  open: boolean
  onClose: () => void
  clinicName: string
}

export function GlobalDocumentsModal({ open, onClose, clinicName }: GlobalDocumentsModalProps) {
  const [query, setQuery] = useState('')

  const documents = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return GLOBAL_DOCUMENTS
    return GLOBAL_DOCUMENTS.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q)
    )
  }, [query])

  const handleDownload = (doc: GlobalDocument) => {
    toast({
      variant: 'info',
      title: doc.format === 'Link' ? 'Opening document' : 'Download started',
      description: `${doc.title} — shared with ${clinicName}.`,
    })
  }

  const handleUpload = () => {
    toast({
      variant: 'info',
      title: 'Upload new document',
      description: 'Hook this action up to your documents service when ready.',
    })
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Global documents"
      description={`Shared resources available to ${clinicName} and every other clinic.`}
      size="xl"
      className="rounded-2xl"
    >
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents…"
              className="rounded-full pl-9"
            />
          </div>
          <Button
            type="button"
            onClick={handleUpload}
            className="gap-2 rounded-full bg-primary text-accent-foreground hover:bg-primary/90"
          >
            <Upload className="h-4 w-4" />
            Upload document
          </Button>
        </div>

        {documents.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No documents match “{query}”.
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{doc.title}</p>
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold',
                          CATEGORY_BADGE[doc.category]
                        )}
                      >
                        {doc.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{doc.description}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {doc.format} · {doc.sizeLabel} · Updated {doc.updatedAt}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full"
                    onClick={() => handleDownload(doc)}
                  >
                    {doc.format === 'Link' ? (
                      <>
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}
