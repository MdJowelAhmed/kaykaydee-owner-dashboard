export interface AppVersionInfo {
  platform: 'iOS' | 'Android'
  current: string
  minSupported: string
  forceUpdate: boolean
  releaseNotes: string
  releasedAt: string
  storeUrl: string
}

export interface PushChannel {
  id: string
  name: string
  description: string
  enabled: boolean
}

export interface PushSettings {
  masterEnabled: boolean
  quietHoursEnabled: boolean
  quietHoursStart: string
  quietHoursEnd: string
  defaultSound: 'default' | 'silent' | 'urgent'
}

export interface MaintenanceWindow {
  enabled: boolean
  scheduledStart: string
  scheduledEnd: string
  banner: string
  allowList: string[]
}

export interface AppSubmission {
  id: string
  clinic: string
  plan: 'Premium' | 'Enterprise'
  platform: 'iOS' | 'Android'
  bundleId: string
  version: string
  submittedBy: string
  submittedAt: string
  status: 'Pending Review' | 'Approved' | 'Rejected'
  reviewer: string | null
}

export const defaultAppVersions: AppVersionInfo[] = [
  {
    platform: 'iOS',
    current: '4.12.0',
    minSupported: '4.6.0',
    forceUpdate: false,
    releaseNotes:
      '• New AI dictation onboarding\n• Fixed crash on dashboard load for older devices\n• Performance improvements',
    releasedAt: '2026-05-12T15:30:00Z',
    storeUrl: 'https://apps.apple.com/app/kaykaydee/id1234567890',
  },
  {
    platform: 'Android',
    current: '4.11.2',
    minSupported: '4.5.0',
    forceUpdate: false,
    releaseNotes: '• Offline-mode improvements\n• Patient documents upload fixes',
    releasedAt: '2026-05-10T10:00:00Z',
    storeUrl: 'https://play.google.com/store/apps/details?id=health.kaykaydee',
  },
]

export const defaultPushChannels: PushChannel[] = [
  {
    id: 'appointments',
    name: 'Appointments',
    description: 'Confirmations, reminders, reschedules, cancellations',
    enabled: true,
  },
  {
    id: 'billing',
    name: 'Billing',
    description: 'Payment confirmations, failed payments, invoices',
    enabled: true,
  },
  {
    id: 'clinical',
    name: 'Clinical updates',
    description: 'New patient messages, lab results, urgent notes',
    enabled: true,
  },
  {
    id: 'marketing',
    name: 'Product & marketing',
    description: 'Feature announcements, tips, newsletters',
    enabled: false,
  },
  {
    id: 'security',
    name: 'Security alerts',
    description: 'Suspicious sign-ins, password changes, device approvals',
    enabled: true,
  },
]

export const defaultPushSettings: PushSettings = {
  masterEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  defaultSound: 'default',
}

export const defaultMaintenance: MaintenanceWindow = {
  enabled: false,
  scheduledStart: '2026-05-18T02:00',
  scheduledEnd: '2026-05-18T04:00',
  banner:
    'We are performing scheduled maintenance. Some features may be unavailable for a short period.',
  allowList: ['ops@kaykaydee.health', 'oncall@kaykaydee.health'],
}

export const defaultSubmissions: AppSubmission[] = [
  {
    id: 'SUB-1001',
    clinic: 'Bayview Family Clinic',
    plan: 'Premium',
    platform: 'iOS',
    bundleId: 'health.bayview.ios',
    version: '4.12.0',
    submittedBy: 'Sarah Chen',
    submittedAt: '2026-05-13T10:14:00Z',
    status: 'Pending Review',
    reviewer: null,
  },
  {
    id: 'SUB-1002',
    clinic: 'Riverstone Cardiology',
    plan: 'Premium',
    platform: 'Android',
    bundleId: 'health.riverstone.android',
    version: '4.11.2',
    submittedBy: 'Dr. M. Patel',
    submittedAt: '2026-05-12T16:42:00Z',
    status: 'Approved',
    reviewer: 'Michael Ross',
  },
  {
    id: 'SUB-1003',
    clinic: 'Westend Wellness',
    plan: 'Premium',
    platform: 'iOS',
    bundleId: 'health.westend.ios',
    version: '4.10.0',
    submittedBy: 'Dr. David Okonkwo',
    submittedAt: '2026-05-09T09:00:00Z',
    status: 'Rejected',
    reviewer: 'Michael Ross',
  },
  {
    id: 'SUB-1004',
    clinic: 'Maplewood Dermatology',
    plan: 'Premium',
    platform: 'Android',
    bundleId: 'health.maplewoodderm.android',
    version: '4.12.0',
    submittedBy: 'Dr. Emily Rodriguez',
    submittedAt: '2026-05-14T07:25:00Z',
    status: 'Pending Review',
    reviewer: null,
  },
]
