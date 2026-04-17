import { Badge } from '@/components/ui/badge'
import { Shield, Building2, Briefcase } from 'lucide-react'
import { cn } from '@/utils/cn'
import { UserRole, LEGACY_ADMIN_ROLE_KEY } from '@/types/roles'
import { getRoleDisplayName } from '@/utils/roleHelpers'

interface RoleBadgeProps {
  role: string
  className?: string
  showIcon?: boolean
}

type BadgeTier = 'superAdmin' | 'admin' | 'business'

function badgeTier(role: string): BadgeTier {
  if (role === UserRole.SUPER_ADMIN) return 'superAdmin'
  if (role === UserRole.ADMIN || role === LEGACY_ADMIN_ROLE_KEY) return 'admin'
  return 'business'
}

export function RoleBadge({ role, className, showIcon = true }: RoleBadgeProps) {
  const tier = badgeTier(role)

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 font-medium border-0',
        tier === 'superAdmin' &&
          'bg-amber-100 text-amber-900 hover:bg-amber-200/90',
        tier === 'admin' &&
          'bg-purple-100 text-purple-800 hover:bg-purple-200/90',
        tier === 'business' &&
          'bg-blue-100 text-blue-800 hover:bg-blue-200/90',
        className
      )}
    >
      {showIcon &&
        (tier === 'superAdmin' ? (
          <Shield className="h-3 w-3" />
        ) : tier === 'admin' ? (
          <Building2 className="h-3 w-3" />
        ) : (
          <Briefcase className="h-3 w-3" />
        ))}
      {getRoleDisplayName(role)}
    </Badge>
  )
}
