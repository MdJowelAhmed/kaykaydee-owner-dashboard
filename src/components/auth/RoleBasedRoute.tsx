import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { UserRole, hasRouteAccess, getDefaultRouteForRole } from '@/types/roles'

interface RoleBasedRouteProps {
  children: ReactNode
  allowedRoles: UserRole[]
  redirectTo?: string
}

export const RoleBasedRoute = ({
  children,
  allowedRoles,
}: RoleBasedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  const hasAccess = allowedRoles.includes(user.role as UserRole)

  if (!hasAccess) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />
  }

  return <>{children}</>
}

interface RouteGuardProps {
  children: ReactNode
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  const accessible = hasRouteAccess(user.role, location.pathname)

  if (!accessible) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />
  }

  return <>{children}</>
}
