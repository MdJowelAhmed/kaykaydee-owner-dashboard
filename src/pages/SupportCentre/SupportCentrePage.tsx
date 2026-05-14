import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TicketsTab } from './components/TicketsTab'
import { PriorityQueueTab } from './components/PriorityQueueTab'
import { LiveChatTab } from './components/LiveChatTab'
import { BugReportsTab } from './components/BugReportsTab'
import { FeatureRequestsTab } from './components/FeatureRequestsTab'
import { ClinicHistoryTab } from './components/ClinicHistoryTab'

export default function SupportCentrePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">Support Centre</h1>
        <p className="text-sm text-muted-foreground">
          Manage tickets, live chat, bugs, feature requests, and clinic support history
        </p>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-white p-1 shadow-sm sm:w-auto">
          <TabsTrigger value="tickets" className="px-4 py-2 text-sm">
            Tickets
          </TabsTrigger>
          <TabsTrigger value="priority" className="px-4 py-2 text-sm">
            Priority Queue
          </TabsTrigger>
          <TabsTrigger value="chat" className="px-4 py-2 text-sm">
            Live Chat
          </TabsTrigger>
          <TabsTrigger value="bugs" className="px-4 py-2 text-sm">
            Bug Reports
          </TabsTrigger>
          <TabsTrigger value="features" className="px-4 py-2 text-sm">
            Feature Requests
          </TabsTrigger>
          <TabsTrigger value="history" className="px-4 py-2 text-sm">
            Clinic History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-4">
          <TicketsTab />
        </TabsContent>
        <TabsContent value="priority" className="mt-4">
          <PriorityQueueTab />
        </TabsContent>
        <TabsContent value="chat" className="mt-4">
          <LiveChatTab />
        </TabsContent>
        <TabsContent value="bugs" className="mt-4">
          <BugReportsTab />
        </TabsContent>
        <TabsContent value="features" className="mt-4">
          <FeatureRequestsTab />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <ClinicHistoryTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
