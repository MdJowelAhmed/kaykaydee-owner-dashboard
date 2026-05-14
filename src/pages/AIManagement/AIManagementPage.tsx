import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GovernanceSection } from './GovernanceSection'
import { AnalyticsSection } from './AnalyticsSection'
import { SafetySection } from './SafetySection'

export default function AIManagementPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">AI Management</h1>
        <p className="text-sm text-muted-foreground">
          Govern usage, cost, prompts, moderation, adoption, and safety controls for platform AI
        </p>
      </div>

      <Tabs defaultValue="governance" className="space-y-4">
        <TabsList className="h-11 w-full justify-start gap-1 rounded-xl bg-white p-1 shadow-sm sm:w-auto">
          <TabsTrigger value="governance" className="px-4 py-2 text-sm">
            AI Governance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="px-4 py-2 text-sm">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="safety" className="px-4 py-2 text-sm">
            AI Safety
          </TabsTrigger>
        </TabsList>

        <TabsContent value="governance" className="mt-4">
          <GovernanceSection />
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <AnalyticsSection />
        </TabsContent>
        <TabsContent value="safety" className="mt-4">
          <SafetySection />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
