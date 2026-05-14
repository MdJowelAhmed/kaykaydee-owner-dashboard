import { useEffect, useState } from 'react'
import { AlertTriangle, Clock } from 'lucide-react'
import { ModalWrapper, FormInput } from '@/components/common'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'
import type { User } from '@/types'

/**
 * Password the super admin must re-enter to confirm a destructive delete.
 * Mock dashboard — matches the demo account. Replace with a real
 * `verifyPassword` API call once the backend is wired up.
 */
const ADMIN_CONFIRM_PASSWORD = 'password'

interface DeleteUserModalProps {
  user: User | null
  open: boolean
  onClose: () => void
  onConfirm: (userId: string) => void
}

export function DeleteUserModal({ user, open, onClose, onConfirm }: DeleteUserModalProps) {
  const [step, setStep] = useState<'confirm' | 'password'>('confirm')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Always restart at the confirm step when the modal (re)opens.
  useEffect(() => {
    if (open) {
      setStep('confirm')
      setPassword('')
      setError('')
    }
  }, [open])

  if (!user) return null

  const userName = `${user.firstName} ${user.lastName}`.trim() || user.email

  const handleDelete = () => {
    if (password !== ADMIN_CONFIRM_PASSWORD) {
      setError('Incorrect password. Please try again.')
      return
    }
    onConfirm(user.id)
    toast({
      variant: 'success',
      title: 'User deleted',
      description: `${userName} has been removed.`,
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={step === 'confirm' ? 'Delete user' : 'Confirm your password'}
      description={
        step === 'confirm'
          ? `Are you sure you want to delete ${userName}? This action cannot be undone.`
          : `Enter your password to permanently delete ${userName}.`
      }
      size="sm"
      className="rounded-2xl"
    >
      <div className="space-y-5 pt-2">
        <div className="flex items-start gap-3 rounded-xl bg-destructive/10 p-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">
            {step === 'confirm'
              ? 'This permanently removes the user and all associated access.'
              : 'For security, re-enter your password to complete this action.'}
          </p>
        </div>

        {step === 'confirm' && (
          <div className="flex items-start gap-3 rounded-xl bg-warning/10 p-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p className="text-sm text-warning">
              Warning: If you do not contact us within 24 hours, your account will be
              permanently deleted.
            </p>
          </div>
        )}

        {step === 'password' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleDelete()
            }}
          >
            <FormInput
              label="Password"
              type="password"
              autoFocus
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              error={error}
            />
          </form>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {step === 'confirm' ? (
            <Button
              type="button"
              className="bg-red-500 text-white hover:bg-red-500/90"
              onClick={() => setStep('password')}
            >
              Yes, continue
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-red-500 text-white hover:bg-red-500/90"
              disabled={!password.trim()}
              onClick={handleDelete}
            >
              Delete user
            </Button>
          )}
        </div>
      </div>
    </ModalWrapper>
  )
}
