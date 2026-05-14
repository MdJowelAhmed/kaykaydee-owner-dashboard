import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppVersionsPanel } from './AppVersionsPanel'
import { PushNotificationsPanel } from './PushNotificationsPanel'
import { MaintenanceModePanel } from './MaintenanceModePanel'
import { WhiteLabelApprovalsPanel } from './WhiteLabelApprovalsPanel'

export default function MobileAppPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Tabs defaultValue="versions" className="space-y-4">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-white p-1 shadow-sm sm:w-auto">
          <TabsTrigger value="versions" className="px-3 py-2 text-sm">
            App Versions
          </TabsTrigger>
          <TabsTrigger value="push" className="px-3 py-2 text-sm">
            Push Notifications
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="px-3 py-2 text-sm">
            Maintenance Mode
          </TabsTrigger>
          <TabsTrigger value="approvals" className="px-3 py-2 text-sm">
            White-Label Approvals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="versions" className="mt-4">
          <AppVersionsPanel />
        </TabsContent>
        <TabsContent value="push" className="mt-4">
          <PushNotificationsPanel />
        </TabsContent>
        <TabsContent value="maintenance" className="mt-4">
          <MaintenanceModePanel />
        </TabsContent>
        <TabsContent value="approvals" className="mt-4">
          <WhiteLabelApprovalsPanel />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
