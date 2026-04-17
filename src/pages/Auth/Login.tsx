import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '@/redux/slices/authSlice'
import type { AuthUserRole } from '@/redux/slices/authSlice'
import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'
import { getDefaultRouteForRole, canAccessDashboard } from '@/types/roles'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

type DemoAccount = {
  id: string
  email: string
  password: string
  displayRole: string
  role: AuthUserRole
  firstName: string
  businessId?: string
  businessName?: string
}

/** Mock auth: Super Admin + Admin + Business (business is rejected at sign-in). */
const demoAccounts: DemoAccount[] = [
  {
    id: '1',
    email: 'superadmin@example.com',
    password: 'password',
    displayRole: 'Super Admin',
    role: 'super-admin',
    firstName: 'Super Admin',
  },
  // {
  //   id: '2',
  //   email: 'admin@example.com',
  //   password: 'password',
  //   displayRole: 'Admin',
  //   role: 'admin',
  //   firstName: 'Admin',
  // },
  // {
  //   id: '3',
  //   email: 'business@example.com',
  //   password: 'password',
  //   displayRole: 'Business (no access)',
  //   role: 'business',
  //   firstName: 'Business',
  //   businessId: 'business-demo-001',
  //   businessName: 'Demo Property Co.',
  // },
]

const ACCESS_DENIED_MESSAGE =
  'This dashboard is only for Super Admin and Admin accounts.'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const demoAccountsForDisplay = useMemo(
    () => demoAccounts.filter((a) => canAccessDashboard(a.role)),
    []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginStart())

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const found = demoAccounts.find(
        (u) => u.email === data.email && u.password === data.password
      )

      if (!found) {
        dispatch(loginFailure('Invalid email or password'))
        return
      }

      if (!canAccessDashboard(found.role)) {
        dispatch(loginFailure(ACCESS_DENIED_MESSAGE))
        return
      }

      dispatch(
        loginSuccess({
          user: {
            id: found.id,
            email: found.email,
            firstName: found.firstName,
            lastName: 'User',
            role: found.role,
            businessId: found.businessId,
            businessName: found.businessName,
          },
          token: `mock-jwt-token-${Date.now()}`,
        })
      )

      navigate(getDefaultRouteForRole(found.role), { replace: true })
    } catch {
      dispatch(loginFailure('An error occurred. Please try again.'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col items-center justify-center gap-3">
        <img src="/assets/logo.png" alt="" className="h-20 w-20" />
        <img src="/assets/logo3.png" alt="Kay Kay Dee" className="h-8 w-20 object-contain" />
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Hello There!</h1>
        <p className="text-muted-foreground">
        Please fill out this field to continue the registration
        </p>
      </div>

      {/* <div
        className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
        role="note"
      >
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>
          Only <strong>Super Admin</strong> and <strong>Admin</strong> roles can access this
          application. Other accounts cannot sign in here.
        </p>
      </div> */}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@organization.com"
              className={cn('pl-10', errors.email && 'border-destructive')}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={cn(
                'pl-10 pr-10',
                errors.password && 'border-destructive'
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-input"
              {...register('remember')}
            />
            <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
              Remember me for 30 days
            </Label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="shrink-0 text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          {!isLoading && (
            <>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-muted-foreground">
          Demo credentials 
        </span>
      </div>

      <div className="space-y-3 rounded-lg border bg-muted/50 p-4 text-sm">
        {demoAccountsForDisplay.map((acc, index) => (
          <div key={acc.id}>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{acc.displayRole}</p>
              <p>
                <span className="text-muted-foreground">Email:</span> {acc.email}
              </p>
              <p>
                <span className="text-muted-foreground">Pass:</span> {acc.password}
              </p>
            </div>
            {index < demoAccountsForDisplay.length - 1 && (
              <Separator className="my-3" />
            )}
          </div>
        ))}
       
      </div>
    </div>
  )
}
