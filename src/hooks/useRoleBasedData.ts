import { useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { UserRole, canAccessDashboard } from '@/types/roles'

interface DataItem {
  businessId?: string
  userId?: string
  [key: string]: string | number | undefined
}

/** Super Admin and Admin see all rows; Business sees only its scope. */
export const useRoleBasedData = <T extends DataItem>(data: T[]): T[] => {
  const { user } = useAppSelector((state) => state.auth)

  return useMemo(() => {
    if (!user) return []

    if (canAccessDashboard(user.role)) {
      return data
    }

    if (user.role === UserRole.BUSINESS && user.businessId) {
      return data.filter(
        (item) =>
          item.businessId === user.businessId || item.userId === user.id
      )
    }

    return []
  }, [data, user])
}

/** True when the logged-in user is Admin (non–super-admin). */
export const useIsAdmin = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.role === UserRole.ADMIN
}

/** @deprecated Use `useIsAdmin` (legacy name for the admin role). */
export const useIsHost = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.role === UserRole.ADMIN
}

export const useIsBusiness = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.role === UserRole.BUSINESS
}

export const useBusinessId = (): string | undefined => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.businessId
}

export const useCanModifyItem = (item: DataItem): boolean => {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return false

  if (canAccessDashboard(user.role)) {
    return true
  }

  if (user.role === UserRole.BUSINESS) {
    return item.businessId === user.businessId || item.userId === user.id
  }

  return false
}
