import { Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="h-screen flex bg-[#f3f4f7]">
      {/* Left side - Branding */}
      <div className=" flex lg:w-1/2   overflow-hidden my-6 rounded-2xl">
        {/* Background Pattern */}
        {/* <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div> */}
<img src="/assets/auth.webp" alt="auth-bg" className="w-full h-full object-contain rounded-2xl" />
     
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12  ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}












