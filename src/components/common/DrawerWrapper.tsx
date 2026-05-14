import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DrawerWrapperProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses: Record<NonNullable<DrawerWrapperProps['size']>, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-2xl',
}

export function DrawerWrapper({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  size = 'lg',
}: DrawerWrapperProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col bg-background shadow-xl outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out duration-300',
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
            sizeClasses[size],
            className
          )}
        >
          <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-lg font-semibold leading-tight tracking-tight text-foreground">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">{children}</div>

          {footer && (
            <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
