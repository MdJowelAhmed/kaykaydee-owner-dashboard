import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RevenueMetricsSection } from '../ReportsAnalytics/RevenueMetricsSection'
import { CustomerMetricsSection } from '../ReportsAnalytics/CustomerMetricsSection'
import { BillingReportsSection } from '../ReportsAnalytics/BillingReportsSection'
import { SubscriptionInvoiceSection } from './SubscriptionInvoiceSection'

export default function SubscriptionInvoicePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Revenue &amp; Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Financial dashboard — MRR, ARR, churn, LTV, CAC, refunds and full transaction logs.
        </p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="h-11 w-full justify-start gap-1 rounded-xl bg-white p-1 shadow-sm sm:w-auto">
          <TabsTrigger value="revenue" className="px-4 py-2 text-sm">
            Revenue Metrics
          </TabsTrigger>
          <TabsTrigger value="customer" className="px-4 py-2 text-sm">
            Customer Metrics
          </TabsTrigger>
          <TabsTrigger value="billing" className="px-4 py-2 text-sm">
            Billing Reports
          </TabsTrigger>
          <TabsTrigger value="invoices" className="px-4 py-2 text-sm">
            Subscription Invoice
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
        <TabsContent value="invoices" className="mt-4">
          <SubscriptionInvoiceSection />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
