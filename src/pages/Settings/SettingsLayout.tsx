import type { ElementType } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  Building2,
  FileCheck,
  HelpCircle,
  Info,
  KeyRound,
  ShieldAlert,
} from 'lucide-react'
import { useAppSelector } from '@/redux/hooks'
import { UserRole, normalizeRoleKey, DASHBOARD_ALLOWED_ROLES } from '@/types/roles'
import { cn } from '@/utils/cn'

const triggerClass =
  'inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-accent transition-colors hover:text-foreground'

const listClass =
  'flex h-auto min-h-12 w-full flex-wrap items-center justify-start gap-1 rounded-xl border border-border bg-card p-1.5'

interface SettingsTabDef {
  to: string
  label: string
  Icon: ElementType
  allowedRoles: UserRole[]
}

const SETTINGS_TABS: SettingsTabDef[] = [
  {
    to: '/settings/profile',
    label: 'profile',
    Icon: Building2,
    allowedRoles: [...DASHBOARD_ALLOWED_ROLES],
  },
  {
    to: '/settings/password',
    label: 'Change password',
    Icon: KeyRound,
    allowedRoles: [...DASHBOARD_ALLOWED_ROLES],
  },
  {
    to: '/settings/about-us',
    label: 'About us',
    Icon: Info,
    allowedRoles: [...DASHBOARD_ALLOWED_ROLES],
  },
  {
    to: '/settings/terms',
    label: 'Terms & conditions',
    Icon: FileCheck,
    allowedRoles: [...DASHBOARD_ALLOWED_ROLES],
  },
  {
    to: '/settings/privacy',
    label: 'Privacy policy',
    Icon: ShieldAlert,
    allowedRoles: [...DASHBOARD_ALLOWED_ROLES],
  },
  {
    to: '/settings/faq',
    label: 'Manage FAQ',
    Icon: HelpCircle,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
]

function filterTabsByRole(user: { role: string } | null): SettingsTabDef[] {
  if (!user) return []
  const role = normalizeRoleKey(user.role) as UserRole
  return SETTINGS_TABS.filter((t) => t.allowedRoles.includes(role))
}

export default function SettingsLayout() {
  const { user } = useAppSelector((state) => state.auth)
  const tabs = filterTabsByRole(user)

  return (
    <div className="mx-auto flex w-full  flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-accent">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, subscription, and clinic information.
        </p>
      </div>

      <nav className={listClass} aria-label="Settings sections">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                triggerClass,
                isActive && 'rounded-md bg-background text-primary shadow-sm dark:bg-muted/60'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="min-h-[320px]">
        <Outlet />
      </div>
    </div>
  )
}
