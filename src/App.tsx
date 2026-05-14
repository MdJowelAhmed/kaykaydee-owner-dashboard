import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardAccessGuard } from '@/components/auth/DashboardAccessGuard'
import { RoleBasedRoute } from '@/components/auth/RoleBasedRoute'
import { UserRole, getDefaultRouteForRole, DASHBOARD_ALLOWED_ROLES } from '@/types/roles'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { loadUserFromStorage } from '@/redux/slices/authSlice'

// Auth Pages
import { Login, ForgotPassword, VerifyEmail, ResetPassword } from '@/pages/Auth'

// Dashboard Pages
import Dashboard from '@/pages/Dashboard'
import UserList from '@/pages/Users/UserList'
import UserDetails from '@/pages/Users/UserDetails'
import ClinicManagementPage from '@/pages/ClinicManagement/ClinicManagementPage'
import ClinicDetailsPage from '@/pages/ClinicManagement/ClinicDetailsPage'
import CategoryList from '@/pages/Categories/CategoryList'
import SettingsLayout from '@/pages/Settings/SettingsLayout'
import ProfileSettings from '@/pages/Settings/Profile/ProfileSettings'
import ChangePassword from '@/pages/Settings/ChangePassword/ChangePassword'
import TermsSettings from '@/pages/Settings/Terms/TermsSettings'
import PrivacySettings from '@/pages/Settings/Privacy/PrivacySettings'
import AboutUsSettings from '@/pages/Settings/AboutUs/AboutUsSettings'
import GlobalSettingsPage from '@/pages/Settings/GlobalSettings/GlobalSettingsPage'
import MobileAppPage from '@/pages/Settings/MobileApp/MobileAppPage'
import Calender from './pages/calender/Calender'
import TransactionsHistory from './pages/transictions-history/TransactionsHistory'
import Subscription from './pages/Subscription/Subscription'
import NotificationPage from './pages/Notification/NotificationPage'
import SubscriptionPackagePage from './pages/SubscriptionPackage/SubscriptionPackagePage'
import SubscriptionInvoicePage from './pages/SubscriptionInvoice/SubscriptionInvoicePage'
import SubscriptionManagePage from './pages/SubscriptionManage/SubscriptionManagePage'
import AdminManagePage from './pages/AdminManage/AdminManagePage'
import ReportsAnalyticsPage from './pages/ReportsAnalytics/ReportsAnalyticsPage'
import ComplianceAuditPage from './pages/ComplianceAudit/ComplianceAuditPage'
import AIManagementPage from './pages/AIManagement/AIManagementPage'
import SalesAffiliatesPage from './pages/SalesAffiliates/SalesAffiliatesPage'
import ZealthAIPage from './pages/ZealthAI/ZealthAIPage'
import Support from './pages/Support/Support'
import SupportCentrePage from './pages/SupportCentre/SupportCentrePage'
import FAQ from './pages/FAQ/FAQ'
import NotFound from './pages/NotFound/NotFound'

function AppToaster() {
  const theme = useAppSelector((state) => state.ui.theme)
  return <Toaster position="top-right" richColors closeButton theme={theme} />
}

// Component to redirect based on user role
function RoleBasedRedirect() {
  const { user } = useAppSelector((state) => state.auth)
  
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  const home = getDefaultRouteForRole(user.role)
  return <Navigate to={home} replace />
}

function App() {
  const dispatch = useAppDispatch()

  // Load user from storage on app mount
  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  return (
    <TooltipProvider>
      <Routes>
        {/* Auth Routes - No sidebar/header */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardAccessGuard>
                <DashboardLayout />
              </DashboardAccessGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<RoleBasedRedirect />} />
          
          {/* Dashboard — Super Admin + Admin only */}
          <Route
            path="dashboard"
            element={
              <RoleBasedRoute allowedRoles={[...DASHBOARD_ALLOWED_ROLES]}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          
          {/* User Management - Super Admin Only */}
          <Route 
            path="users" 
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <UserList />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="users/:id" 
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <UserDetails />
              </RoleBasedRoute>
            } 
          />

          <Route
            path="clinic-management"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <ClinicManagementPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="clinic-management/:id"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <ClinicDetailsPage />
              </RoleBasedRoute>
            }
          />
          
      
          
          {/* Transactions History - Super Admin Only */}
          <Route 
            path="transactions-history" 
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <TransactionsHistory />
              </RoleBasedRoute>
            } 
          />


          <Route
            path="subscription-packages"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <SubscriptionPackagePage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="subscription-invoice"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <SubscriptionInvoicePage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="subscription-manage"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <SubscriptionManagePage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="admin-manage"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <AdminManagePage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="reports-analytics"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <ReportsAnalyticsPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="compliance-audit"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <ComplianceAuditPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="ai-management"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <AIManagementPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="sales-affiliates"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <SalesAffiliatesPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="zealth-ai"
            element={
              <RoleBasedRoute allowedRoles={[...DASHBOARD_ALLOWED_ROLES]}>
                <ZealthAIPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="subscription"
            element={
              <RoleBasedRoute allowedRoles={[...DASHBOARD_ALLOWED_ROLES]}>
                <Subscription />
              </RoleBasedRoute>
            }
          />

          <Route
            path="notification"
            element={
              <RoleBasedRoute allowedRoles={[...DASHBOARD_ALLOWED_ROLES]}>
                <NotificationPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="support"
            element={
              <RoleBasedRoute allowedRoles={[...DASHBOARD_ALLOWED_ROLES]}>
                <Support />
              </RoleBasedRoute>
            }
          />

          <Route
            path="support-centre"
            element={
              <RoleBasedRoute allowedRoles={[...DASHBOARD_ALLOWED_ROLES]}>
                <SupportCentrePage />
              </RoleBasedRoute>
            }
          />

          
     
          
          {/* Calendar — Super Admin + Admin */}
          <Route 
            path="calender" 
            element={
              <RoleBasedRoute allowedRoles={[...DASHBOARD_ALLOWED_ROLES]}>
                <Calender />
              </RoleBasedRoute>
            } 
          />
          
          
          
          {/* Category Management */}
          <Route
            path="categories"
            element={
              <RoleBasedRoute allowedRoles={[...DASHBOARD_ALLOWED_ROLES]}>
                <CategoryList />
              </RoleBasedRoute>
            }
          />
          
          {/* Settings — shared header + tab nav (SettingsLayout) */}
          <Route
            path="settings"
            element={
              <RoleBasedRoute allowedRoles={[...DASHBOARD_ALLOWED_ROLES]}>
                <SettingsLayout />
              </RoleBasedRoute>
            }
          >
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="password" element={<ChangePassword />} />
            <Route
              path="global"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <GlobalSettingsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="mobile"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <MobileAppPage />
                </RoleBasedRoute>
              }
            />
            <Route path="terms" element={<TermsSettings />} />
            <Route path="privacy" element={<PrivacySettings />} />
            <Route path="about-us" element={<AboutUsSettings />} />
            <Route
              path="faq"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <FAQ />
                </RoleBasedRoute>
              }
            />
          </Route>
        </Route>

        {/* Catch all - 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AppToaster />
    </TooltipProvider>
  )
}

export default App
