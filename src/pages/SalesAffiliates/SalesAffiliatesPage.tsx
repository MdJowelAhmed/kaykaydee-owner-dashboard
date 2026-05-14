import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SalesUsersSection } from './SalesUsersSection'
import { AffiliateTrackingSection } from './AffiliateTrackingSection'
import { CommissionDashboardSection } from './CommissionDashboardSection'
import { LeadPipelineSection } from './LeadPipelineSection'

export default function SalesAffiliatesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">Sales &amp; Affiliates</h1>
        <p className="text-sm text-muted-foreground">
          Sales accounts, affiliate performance, commission rules, and lead pipeline
        </p>
      </div>

      <Tabs defaultValue="sales-users" className="space-y-4">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-white p-1 shadow-sm sm:w-auto">
          <TabsTrigger value="sales-users" className="px-3 py-2 text-sm">
            Sales User Management
          </TabsTrigger>
          <TabsTrigger value="affiliates" className="px-3 py-2 text-sm">
            Affiliate Tracking
          </TabsTrigger>
          <TabsTrigger value="commissions" className="px-3 py-2 text-sm">
            Commission Dashboard
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="px-3 py-2 text-sm">
            Lead Pipeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales-users" className="mt-4">
          <SalesUsersSection />
        </TabsContent>
        <TabsContent value="affiliates" className="mt-4">
          <AffiliateTrackingSection />
        </TabsContent>
        <TabsContent value="commissions" className="mt-4">
          <CommissionDashboardSection />
        </TabsContent>
        <TabsContent value="pipeline" className="mt-4">
          <LeadPipelineSection />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
