// Auth roles — exactly three (dashboard: super-admin + admin only)
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  BUSINESS = 'business',
}

/** Legacy API/storage value; normalized to `UserRole.ADMIN` in `normalizeAuthRole`. */
export const LEGACY_ADMIN_ROLE_KEY = 'host' as const

/** Super Admin + Admin (non–super-admin operators). */
export const DASHBOARD_ALLOWED_ROLES: readonly UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
]

/** Map legacy `host` to admin for permission checks and persisted sessions. */
export function normalizeRoleKey(role: string): string {
  if (role === LEGACY_ADMIN_ROLE_KEY) return UserRole.ADMIN
  return role
}

export function canAccessDashboard(role: string): boolean {
  const key = normalizeRoleKey(role)
  return DASHBOARD_ALLOWED_ROLES.includes(key as UserRole)
}

const ALL_DASHBOARD_ROLES = [UserRole.SUPER_ADMIN, UserRole.ADMIN]

export interface RoutePermission {
  path: string
  allowedRoles: UserRole[]
  description?: string
}

/** Route → allowed roles (extend as you add routes) */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard': ALL_DASHBOARD_ROLES,
  '/users': [UserRole.SUPER_ADMIN],
  '/clinic-management': [UserRole.SUPER_ADMIN],
  '/controller': [UserRole.SUPER_ADMIN],
  '/subscription-packages': [UserRole.SUPER_ADMIN],
  '/subscription-invoice': [UserRole.SUPER_ADMIN],
  '/subscription-manage': [UserRole.SUPER_ADMIN],
  '/admin-manage': [UserRole.SUPER_ADMIN],
  '/app-user': [UserRole.SUPER_ADMIN],
  '/registered-users': [UserRole.SUPER_ADMIN],
  '/agency-management': [UserRole.SUPER_ADMIN],
  '/transactions-history': [UserRole.SUPER_ADMIN],
  '/settings/faq': [UserRole.SUPER_ADMIN],
  '/settings/terms': ALL_DASHBOARD_ROLES,
  '/settings/privacy': ALL_DASHBOARD_ROLES,
  '/settings/about-us': ALL_DASHBOARD_ROLES,
  '/cars': ALL_DASHBOARD_ROLES,
  '/booking-management': ALL_DASHBOARD_ROLES,
  '/my-listing': ALL_DASHBOARD_ROLES,
  '/calender': ALL_DASHBOARD_ROLES,
  '/clients': ALL_DASHBOARD_ROLES,
  '/reviews-ratings': ALL_DASHBOARD_ROLES,
  '/app-slider': ALL_DASHBOARD_ROLES,
  '/subscription': ALL_DASHBOARD_ROLES,
  '/notification': ALL_DASHBOARD_ROLES,
  '/support': ALL_DASHBOARD_ROLES,
  '/zealth-ai': ALL_DASHBOARD_ROLES,
  '/settings/profile': ALL_DASHBOARD_ROLES,
  '/settings/password': ALL_DASHBOARD_ROLES,
  '/categories': ALL_DASHBOARD_ROLES,
}

export const getDefaultRouteForRole = (role: string): string => {
  if (canAccessDashboard(role)) return '/dashboard'
  return '/auth/login'
}

export const hasRouteAccess = (userRole: string, routePath: string): boolean => {
  const role = normalizeRoleKey(userRole) as UserRole
  if (ROUTE_PERMISSIONS[routePath]) {
    return ROUTE_PERMISSIONS[routePath].includes(role)
  }

  const matchingRoute = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    routePath.startsWith(route)
  )

  if (matchingRoute) {
    return ROUTE_PERMISSIONS[matchingRoute].includes(role)
  }

  return false
}

/** Business may see scoped data on these areas */
export const shouldFilterData = (userRole: string, routePath: string): boolean => {
  const sharedRoutes = ['/cars', '/booking-management', '/calender']
  return (
    userRole === UserRole.BUSINESS &&
    sharedRoutes.some((route) => routePath.startsWith(route))
  )
}
