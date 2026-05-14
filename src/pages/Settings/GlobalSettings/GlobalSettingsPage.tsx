import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PaymentGatewayPanel } from './PaymentGatewayPanel'
import { AIProviderPanel } from './AIProviderPanel'
import { CommunicationProvidersPanel } from './CommunicationProvidersPanel'
import { BrandingDefaultsPanel } from './BrandingDefaultsPanel'
import { NotificationRulesPanel } from './NotificationRulesPanel'

export default function GlobalSettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Tabs defaultValue="payment" className="space-y-4">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-white p-1 shadow-sm sm:w-auto">
          <TabsTrigger value="payment" className="px-3 py-2 text-sm">
            Payment Gateway
          </TabsTrigger>
          <TabsTrigger value="ai" className="px-3 py-2 text-sm">
            AI Provider
          </TabsTrigger>
          <TabsTrigger value="comms" className="px-3 py-2 text-sm">
            Email &amp; SMS
          </TabsTrigger>
          <TabsTrigger value="branding" className="px-3 py-2 text-sm">
            Branding Defaults
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-3 py-2 text-sm">
            Notification Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="mt-4">
          <PaymentGatewayPanel />
        </TabsContent>
        <TabsContent value="ai" className="mt-4">
          <AIProviderPanel />
        </TabsContent>
        <TabsContent value="comms" className="mt-4">
          <CommunicationProvidersPanel />
        </TabsContent>
        <TabsContent value="branding" className="mt-4">
          <BrandingDefaultsPanel />
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <NotificationRulesPanel />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
