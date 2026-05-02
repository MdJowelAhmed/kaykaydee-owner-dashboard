import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="space-y-1.5 ">
        {label && (
          <Label htmlFor={inputId} className={cn(error && 'text-accent')}>
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          className={cn(className, 'bg-input')}
          error={!!error}
          {...props}
        />
          {error && <p className="text-xs text-accent">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'













