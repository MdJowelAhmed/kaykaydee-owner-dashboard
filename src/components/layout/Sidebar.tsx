import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Lock,
  FileText,
  Shield,
  Info,
  Receipt,
  Layers,
  UserCog,
  Sparkles,
  LogOut,
  Users,
  UserRound,
  Building2,
  HelpCircle,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleSidebar } from '@/redux/slices/uiSlice'
import { cn } from '@/utils/cn'
import { UserRole, normalizeRoleKey } from '@/types/roles'
import { Button } from '../ui/button'
import { logout } from '@/redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import {
  DASHBOARD_HEADER_H,
  DASHBOARD_HEADER_SIDEBAR_GAP,
  DASHBOARD_SIDEBAR_V_INSET,
} from '@/components/layout/dashboardLayoutTokens'
import { getRoleDisplayName } from '@/utils/roleHelpers'

/** Sidebar AI strip + progress card (matches design reference) */
const COL_AI_FROM = '#6737BE'
const COL_AI_TO = '#E055FA'
// const COL_CARD_FROM = '#44A9C4'
// const COL_CARD_MID = '#48DAC9'
// const COL_CARD_TO = '#E055FA'
// const COL_PROGRESS_FILL = '#48DAC9'

const ZEALTH_AI_HREF = '/zealth-ai' as const

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  allowedRoles?: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'User Management',
    href: '/users',
    icon: Users,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Clinic Management',
    href: '/clinic-management',
    icon: Building2,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Registered User',
    href: '/registered-users',
    icon: UserRound,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Subscription Invoice',
    href: '/subscription-invoice',
    icon: Receipt,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Subscription Manage',
    href: '/subscription-manage',
    icon: Layers,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'App User',
    href: '/app-user',
    icon: UserRound,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Admin Manage',
    href: '/admin-manage',
    icon: UserCog,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Zealth AI',
    href: ZEALTH_AI_HREF,
    icon: Sparkles,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
]

const settingsItems: NavItem[] = [
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: User,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'About Us',
    href: '/settings/about-us',
    icon: Info,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'FAQ',
    href: '/settings/faq',
    icon: HelpCircle,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Password',
    href: '/settings/password',
    icon: Lock,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'Terms',
    href: '/settings/terms',
    icon: FileText,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'Privacy',
    href: '/settings/privacy',
    icon: Shield,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
]

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

  const mainNavItems = navItems.filter((item) => item.href !== ZEALTH_AI_HREF)
  const zealthAiItem = navItems.find((item) => item.href === ZEALTH_AI_HREF)

  const filteredMain = filterNavByRole(mainNavItems, user)
  const filteredSettingsItems = filterNavByRole(settingsItems, user)
  const filteredZealth = zealthAiItem ? filterNavByRole([zealthAiItem], user) : []
  const showZealth = filteredZealth.length > 0

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
      <svg
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sidebar-ai-nav-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COL_AI_FROM} />
            <stop offset="100%" stopColor={COL_AI_TO} />
          </linearGradient>
        </defs>
      </svg>
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

          {filteredMain.length > 0 && (filteredSettingsItems.length > 0 || showZealth) && (
            <SidebarDivider />
          )}

          {filteredSettingsItems.map((item) => (
            <SidebarNavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}

          {showZealth &&
            (filteredMain.length > 0 || filteredSettingsItems.length > 0) && <SidebarDivider />}

          {showZealth &&
            filteredZealth.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                collapsed={sidebarCollapsed}
                variant="ai"
              />
            ))}

          {/* {!sidebarCollapsed && (
            <div className="mt-3 px-1">
              <div
                className="relative overflow-hidden rounded-2xl p-4 text-white shadow-md"
                style={{
                  background: `linear-gradient(to right, ${COL_CARD_FROM}, ${COL_CARD_MID}, ${COL_CARD_TO})`,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(255,255,255,0.2),transparent_50%)]" />
                <div className="relative flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Crown className="h-5 w-5 text-white" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-white">
                    50% Completed
                  </span>
                </div>
                <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full shadow-sm transition-all duration-500"
                    style={{ width: '50%', backgroundColor: COL_PROGRESS_FILL }}
                  />
                </div>
              </div>
            </div>
          )} */}
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

  const linkContent = (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200',
          collapsed && 'justify-center px-2',
          variant === 'default' && [
            'text-accent hover:bg-muted/50 hover:text-accent',
            isActive && 'bg-background font-medium text-accent shadow-sm',
          ],
          variant === 'ai' && [
            'hover:bg-[#6737BE]/10',
            isActive && 'bg-[#6737BE]/15 font-medium shadow-sm dark:bg-[#6737BE]/20',
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
                (isActive ? 'text-accent' : 'text-accent/75')
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
