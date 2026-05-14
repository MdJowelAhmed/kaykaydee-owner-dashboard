import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuditLogsSection } from './AuditLogsSection'
import { ComplianceAlertsSection } from './ComplianceAlertsSection'
import { DataGovernanceSection } from './DataGovernanceSection'

export default function ComplianceAuditPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">Compliance &amp; Audit</h1>
        <p className="text-sm text-muted-foreground">
          Monitor regulatory compliance, audit trails, and data governance across the platform
        </p>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList className="h-11 w-full justify-start gap-1 rounded-xl bg-white p-1 shadow-sm sm:w-auto">
          <TabsTrigger value="audit" className="px-4 py-2 text-sm">
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="alerts" className="px-4 py-2 text-sm">
            Compliance Alerts
          </TabsTrigger>
          <TabsTrigger value="governance" className="px-4 py-2 text-sm">
            Data Governance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="mt-4">
          <AuditLogsSection />
        </TabsContent>
        <TabsContent value="alerts" className="mt-4">
          <ComplianceAlertsSection />
        </TabsContent>
        <TabsContent value="governance" className="mt-4">
          <DataGovernanceSection />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
