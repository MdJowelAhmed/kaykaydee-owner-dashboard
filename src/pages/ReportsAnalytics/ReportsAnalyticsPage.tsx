import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RevenueMetricsSection } from './RevenueMetricsSection'
import { CustomerMetricsSection } from './CustomerMetricsSection'
import { BillingReportsSection } from './BillingReportsSection'

export default function ReportsAnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">Reports &amp; Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Financial, customer, and billing insights across the platform
        </p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="h-11 w-full justify-start gap-1 rounded-xl bg-white p-1 shadow-sm sm:w-auto">
          <TabsTrigger value="revenue" className="px-4 py-2 text-sm">
            Revenue &amp; Financial
          </TabsTrigger>
          <TabsTrigger value="customer" className="px-4 py-2 text-sm">
            Customer Metrics
          </TabsTrigger>
          <TabsTrigger value="billing" className="px-4 py-2 text-sm">
            Billing Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <RevenueMetricsSection />
        </TabsContent>
        <TabsContent value="customer" className="mt-4">
          <CustomerMetricsSection />
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <BillingReportsSection />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
