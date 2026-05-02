import { useNavigate } from 'react-router-dom'
import { LogOut, Moon, Settings, Sun, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleTheme } from '@/redux/slices/uiSlice'
import { logout } from '@/redux/slices/authSlice'
import { getInitials } from '@/utils/formatters'
import { NotificationPreviewDialog } from '@/components/layout/NotificationPreviewDialog'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DASHBOARD_HEADER_Z } from '@/components/layout/dashboardLayoutTokens'
import { cn } from '@/utils/cn'

export function Header() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.ui.theme)
  const { user } = useAppSelector((state) => state.auth)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      dispatch(logout())
      navigate('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
   <div
      className={cn(
        'fixed left-0 right-0 top-0 h-28 bg-background p-2',
        DASHBOARD_HEADER_Z
      )}
    >
     <header className="fixed left-0 right-0 top-0 z-[100] mx-5 mt-4 h-20 rounded-2xl bg-card shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-accent">{pageTitle}</h1>
            <p className="text-sm text-accent hidden sm:block">
              Welcome back, {user?.firstName || 'Admin'}
            </p>
          </div> */}

<div className="flex items-center gap-3">
            <div className="h-32 w-full mx-auto rounded-lg flex items-center justify-center ">
              <div className="text-primary text-white font-bold text-lg">
                <img src="/logo.png" alt="Booking Dashboard" className="h-20 w-32" />
              </div>
            </div>
            {/* {!sidebarCollapsed && (
              <span className="font-display font-bold text-xl text-accent">Dashboard</span>
            )} */}
          </div>
        </div>

        {/* Center - Search (hidden on mobile) */}
        {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search anything..."
              className="pl-9 bg-muted/50"
            />
          </div>
        </div> */}

        {/* Right side */}
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            onClick={() => dispatch(toggleTheme())}
            className="text-accent"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications — anchored popover under bell */}
          <NotificationPreviewDialog />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-white bg-primary" >
                    {getInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings/password')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLogoutDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        onSuccess={() => setLogoutDialogOpen(false)}
        title="Confirm logout"
        description="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        isLoading={isLoggingOut}
      />
    </header>
   </div>
  )
}
