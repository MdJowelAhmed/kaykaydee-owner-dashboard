import React, { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Settings,
  Receipt,
  Layers,
  LogOut,
  Users,
  Building2,
  LifeBuoy,
  BarChart3,
  ShieldCheck,
  BrainCircuit,
  HeartHandshake,
  UserCog,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleSidebar } from '@/redux/slices/uiSlice'
import { cn } from '@/utils/cn'
import { UserRole, normalizeRoleKey, DASHBOARD_ALLOWED_ROLES } from '@/types/roles'
import { Button } from '../ui/button'
import { logout } from '@/redux/slices/authSlice'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import {
  DASHBOARD_HEADER_H,
  DASHBOARD_HEADER_SIDEBAR_GAP,
  DASHBOARD_SIDEBAR_V_INSET,
} from '@/components/layout/dashboardLayoutTokens'
import { getRoleDisplayName } from '@/utils/roleHelpers'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  allowedRoles?: UserRole[]
  /** Treat as active when pathname starts with this (e.g. `/settings` for all settings tabs). */
  activePathPrefix?: string
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'Clinics',
    href: '/clinic-management',
    icon: Building2,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Admin Management',
    href: '/admin-management',
    icon: UserCog,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Subscriptions',
    href: '/subscription-manage',
    icon: Layers,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Revenue & Billing',
    href: '/subscription-invoice',
    icon: Receipt,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Sales & Affiliates',
    href: '/sales-affiliates',
    icon: HeartHandshake,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'AI Management',
    href: '/ai-management',
    icon: BrainCircuit,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Compliance & Audit',
    href: '/compliance-audit',
    icon: ShieldCheck,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Support Centre',
    href: '/support-centre',
    icon: LifeBuoy,
    allowedRoles: [...DASHBOARD_ALLOWED_ROLES],
  },
  {
    title: 'Reports & Analytics',
    href: '/reports-analytics',
    icon: BarChart3,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
]

/** Single entry → `SettingsLayout` tabs (profile, password, about, terms, privacy, FAQ). */
const settingsNavItem: NavItem = {
  title: 'Settings',
  href: '/settings/profile',
  icon: Settings,
  allowedRoles: [...DASHBOARD_ALLOWED_ROLES],
  activePathPrefix: '/settings',
}

function filterNavByRole(items: NavItem[], user: { role: string } | null): NavItem[] {
  return items.filter((item) => {
    if (!item.allowedRoles) return true
    if (!user) return false
    const role = normalizeRoleKey(user.role) as UserRole
    return item.allowedRoles.includes(role)
  })
}

export function Sidebar() {
  const dispatch = useAppDispatch()
  const { sidebarCollapsed } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const filteredMain = filterNavByRole(navItems, user)
  const settingsItem = filterNavByRole([settingsNavItem], user)[0]

  const belowHeaderGap = `calc(${DASHBOARD_HEADER_H} + ${DASHBOARD_HEADER_SIDEBAR_GAP})`
  const sidebarTop = `calc(${belowHeaderGap} + ${DASHBOARD_SIDEBAR_V_INSET})`

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email || ''
    : ''

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      dispatch(logout())
      toast.success('User logged out successfully')
      navigate('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity',
          sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        style={{ top: belowHeaderGap }}
        onClick={() => dispatch(toggleSidebar())}
      />

      <aside
        className={cn(
          'fixed left-0 z-40 flex flex-col overflow-hidden bg-card shadow-lg transition-all duration-300',
          'ml-4 rounded-[2rem] lg:ml-5',
          sidebarCollapsed ? 'w-[80px]' : 'w-[230px]',
          'lg:translate-x-0',
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        )}
        style={{ top: sidebarTop, bottom: DASHBOARD_SIDEBAR_V_INSET }}
      >
        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-thin px-3 pb-2 pt-4">
          {filteredMain.map((item) => (
            <SidebarNavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}

          {filteredMain.length > 0 && settingsItem && <SidebarDivider />}
          {settingsItem && (
            <SidebarNavItem key={settingsItem.href} item={settingsItem} collapsed={sidebarCollapsed} />
          )}
        </nav>

        <div className="mt-auto space-y-3 border-t border-border px-3 py-1">
          {!sidebarCollapsed && user && (
            <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-inner ring-2 ring-background">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" strokeWidth={1.75} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-accent">{displayName}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplayName(user.role)}</p>
              </div>
            </div>
          )}

          {sidebarCollapsed && user && (
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-11 w-11 cursor-default items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-inner ring-2 ring-background">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-accent">
                  <p className="font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleDisplayName(user.role)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mx-auto flex h-10 w-10 text-accent hover:text-accent"
                  onClick={() => setLogoutDialogOpen(true)}
                  aria-label="Log Out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-accent">
                Log Out
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={() => setLogoutDialogOpen(true)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                'text-accent transition-colors',
                'hover:bg-muted/60 hover:text-accent'
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      <ConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        onSuccess={() => setLogoutDialogOpen(false)}
        title="Confirm logout"
        description="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="danger"
        isLoading={isLoggingOut}
      />
    </>
  )
}

function SidebarDivider() {
  return <div className="my-3 border-t border-border" role="presentation" />
}

interface SidebarNavItemProps {
  item: NavItem
  collapsed: boolean
  variant?: 'default' | 'ai'
}

function SidebarNavItem({ item, collapsed, variant = 'default' }: SidebarNavItemProps) {
  const Icon = item.icon
  const location = useLocation()
  const prefixActive =
    item.activePathPrefix != null &&
    (location.pathname === item.activePathPrefix ||
      location.pathname.startsWith(`${item.activePathPrefix}/`))

  const linkContent = (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200',
          collapsed && 'justify-center px-2',
          variant === 'default' && [
            'text-accent hover:bg-muted/50 hover:text-accent',
            (isActive || prefixActive) && 'bg-background font-medium text-accent shadow-sm',
          ],
          variant === 'ai' && [
            'hover:bg-[#6737BE]/10',
            (isActive || prefixActive) && 'bg-[#6737BE]/15 font-medium shadow-sm dark:bg-[#6737BE]/20',
          ]
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-[1.125rem] w-[1.125rem] shrink-0',
              variant === 'default' &&
                ((isActive || prefixActive) ? 'text-accent' : 'text-accent/75')
            )}
            size={18}
            strokeWidth={1.75}
            stroke={variant === 'ai' ? 'url(#sidebar-ai-nav-gradient)' : 'currentColor'}
          />
          {!collapsed &&
            (variant === 'ai' ? (
              <span className="bg-gradient-to-r from-[#6737BE] to-[#E055FA] bg-clip-text font-medium text-transparent">
                {item.title}
              </span>
            ) : (
              <span>{item.title}</span>
            ))}
        </>
      )}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="text-accent">
          {item.title}
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}
