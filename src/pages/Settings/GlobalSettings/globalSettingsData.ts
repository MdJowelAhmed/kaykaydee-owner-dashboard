export type PaymentProvider = 'stripe' | 'paypal' | 'square'

export interface PaymentGatewaySettings {
  primaryProvider: PaymentProvider
  testMode: boolean
  currency: 'USD' | 'CAD' | 'GBP' | 'EUR' | 'AUD'
  stripePublishableKey: string
  stripeSecretKey: string
  stripeWebhookSecret: string
  paypalEnabled: boolean
  paypalClientId: string
  bankWireEnabled: boolean
  acceptedCards: string[]
}

export type AIProvider = 'openai' | 'anthropic' | 'azure' | 'gemini'

export interface AIProviderSettings {
  primary: AIProvider
  fallback: AIProvider | 'none'
  apiKey: string
  defaultModel: string
  maxTokens: number
  temperature: number
  monthlyBudget: number
  costAlerts: boolean
}

export type EmailProvider = 'sendgrid' | 'ses' | 'mailgun' | 'postmark'
export type SmsProvider = 'twilio' | 'vonage' | 'plivo' | 'messagebird'

export interface CommunicationSettings {
  emailProvider: EmailProvider
  emailFrom: string
  emailReplyTo: string
  emailApiKey: string
  emailDailyLimit: number
  smsProvider: SmsProvider
  smsSenderId: string
  smsApiKey: string
  smsDailyLimit: number
  smsEnabled: boolean
}

export interface BrandingDefaults {
  platformName: string
  tagline: string
  primaryColor: string
  accentColor: string
  logoUrl: string
  faviconUrl: string
  defaultEmailFooter: string
  supportEmail: string
}

export type NotificationChannel = 'email' | 'in_app' | 'slack' | 'sms'

export interface NotificationRule {
  id: string
  event: string
  description: string
  enabled: boolean
  channels: NotificationChannel[]
  threshold?: number
  thresholdLabel?: string
}

export const defaultPaymentGateway: PaymentGatewaySettings = {
  primaryProvider: 'stripe',
  testMode: false,
  currency: 'USD',
  stripePublishableKey: 'pk_live_••••••••••••••••••2c4f',
  stripeSecretKey: 'sk_live_••••••••••••••••••e9a1',
  stripeWebhookSecret: 'whsec_••••••••••••••••••aa42',
  paypalEnabled: true,
  paypalClientId: 'AaB7•••••••••••••••••••xZ4',
  bankWireEnabled: false,
  acceptedCards: ['Visa', 'Mastercard', 'Amex'],
}

export const defaultAIProvider: AIProviderSettings = {
  primary: 'anthropic',
  fallback: 'openai',
  apiKey: 'sk-ant-••••••••••••••••••••••6f',
  defaultModel: 'claude-sonnet-4-6',
  maxTokens: 4096,
  temperature: 0.4,
  monthlyBudget: 8000,
  costAlerts: true,
}

export const defaultCommunication: CommunicationSettings = {
  emailProvider: 'sendgrid',
  emailFrom: 'no-reply@kaykaydee.health',
  emailReplyTo: 'support@kaykaydee.health',
  emailApiKey: 'SG.••••••••••••••••••.•••••••',
  emailDailyLimit: 50_000,
  smsProvider: 'twilio',
  smsSenderId: 'KAYKAYDEE',
  smsApiKey: 'AC•••••••••••••••••••••',
  smsDailyLimit: 10_000,
  smsEnabled: true,
}

export const defaultBranding: BrandingDefaults = {
  platformName: 'KayKaydee Health',
  tagline: 'The all-in-one clinic OS',
  primaryColor: '#14b8a6',
  accentColor: '#7946CD',
  logoUrl: 'https://placehold.co/240x80/14b8a6/ffffff?text=KayKaydee',
  faviconUrl: 'https://placehold.co/64x64/14b8a6/ffffff?text=K',
  defaultEmailFooter: 'KayKaydee Health · 100 Health Ave, Suite 200, San Francisco, CA',
  supportEmail: 'support@kaykaydee.health',
}

export const defaultNotificationRules: NotificationRule[] = [
  {
    id: 'NR-1',
    event: 'Failed payment',
    description: 'When a recurring charge fails on any clinic',
    enabled: true,
    channels: ['email', 'in_app'],
    threshold: 1,
    thresholdLabel: 'after retries',
  },
  {
    id: 'NR-2',
    event: 'Churn risk threshold',
    description: 'Notify CSMs when a clinic crosses the churn-risk threshold',
    enabled: true,
    channels: ['email', 'slack'],
    threshold: 70,
    thresholdLabel: 'risk score',
  },
  {
    id: 'NR-3',
    event: 'AI usage spike',
    description: 'Spike in AI requests vs the rolling hourly baseline',
    enabled: true,
    channels: ['in_app', 'slack'],
    threshold: 250,
    thresholdLabel: '% above baseline',
  },
  {
    id: 'NR-4',
    event: 'Support SLA breach',
    description: 'Ticket open past its SLA target',
    enabled: true,
    channels: ['email', 'in_app'],
  },
  {
    id: 'NR-5',
    event: 'Security incident',
    description: 'PHI leak, suspicious login, or brute-force attempts',
    enabled: true,
    channels: ['email', 'sms', 'slack'],
  },
  {
    id: 'NR-6',
    event: 'Marketing & feature digest',
    description: 'Weekly digest of platform-wide updates',
    enabled: false,
    channels: ['email'],
  },
]
