export type AuditCategory =
  | 'Billing'
  | 'Clinical Notes'
  | 'Permissions'
  | 'Login Activity'
  | 'Subscription'

export type AuditSeverity = 'Info' | 'Warning' | 'Critical'

export type AuditLogRow = {
  id: string
  category: AuditCategory
  action: string
  actor: string
  actorRole: string
  target: string
  clinic: string
  ip: string
  timestamp: string
  severity: AuditSeverity
}

export type ComplianceAlertType =
  | 'Missing Report'
  | 'Unverified User'
  | 'Security Incident'
  | 'Expired Payment Method'

export type ComplianceAlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical'

export type ComplianceAlertRow = {
  id: string
  type: ComplianceAlertType
  title: string
  description: string
  clinic: string
  detectedAt: string
  severity: ComplianceAlertSeverity
  status: 'Open' | 'In Review' | 'Resolved'
}

export type DataExportRow = {
  id: string
  requester: string
  requesterRole: string
  scope: string
  format: 'CSV' | 'JSON' | 'PDF'
  requestedAt: string
  completedAt: string | null
  status: 'Queued' | 'Processing' | 'Completed' | 'Failed'
}

export type BackupRow = {
  id: string
  type: 'Full' | 'Incremental'
  startedAt: string
  durationMinutes: number
  sizeGb: number
  region: string
  status: 'Success' | 'Running' | 'Failed'
}

export type RetentionPolicyRow = {
  id: string
  resource: string
  retentionDays: number
  lastReviewed: string
  owner: string
  status: 'Active' | 'Under Review' | 'Expired'
}

export const auditLogs: AuditLogRow[] = [
  {
    id: 'AL-30021',
    category: 'Billing',
    action: 'Subscription plan upgraded from Basic to Professional',
    actor: 'Sarah Chen',
    actorRole: 'Admin',
    target: 'Bayview Family Clinic',
    clinic: 'Bayview Family Clinic',
    ip: '10.42.18.7',
    timestamp: '2026-05-13T14:22:00Z',
    severity: 'Info',
  },
  {
    id: 'AL-30022',
    category: 'Clinical Notes',
    action: 'Edited clinical note for patient #P-4821',
    actor: 'Dr. Amelia Park',
    actorRole: 'Clinician',
    target: 'Patient P-4821',
    clinic: 'Northside Dental',
    ip: '10.42.18.22',
    timestamp: '2026-05-13T13:08:00Z',
    severity: 'Warning',
  },
  {
    id: 'AL-30023',
    category: 'Permissions',
    action: 'Granted billing access to user',
    actor: 'Michael Ross',
    actorRole: 'Super Admin',
    target: 'jane.doe@bayview.health',
    clinic: 'Bayview Family Clinic',
    ip: '10.42.18.1',
    timestamp: '2026-05-13T11:45:00Z',
    severity: 'Critical',
  },
  {
    id: 'AL-30024',
    category: 'Login Activity',
    action: 'Failed login attempt — 5 consecutive failures',
    actor: 'Unknown',
    actorRole: 'Unknown',
    target: 'admin@sunrisepeds.com',
    clinic: 'Sunrise Pediatrics',
    ip: '203.0.113.42',
    timestamp: '2026-05-13T09:31:00Z',
    severity: 'Critical',
  },
  {
    id: 'AL-30025',
    category: 'Login Activity',
    action: 'New device sign-in from Chicago, USA',
    actor: 'David Okonkwo',
    actorRole: 'Clinician',
    target: 'david.okonkwo@westend.health',
    clinic: 'Westend Wellness',
    ip: '198.51.100.18',
    timestamp: '2026-05-13T08:12:00Z',
    severity: 'Warning',
  },
  {
    id: 'AL-30026',
    category: 'Subscription',
    action: 'Subscription cancelled — effective end of cycle',
    actor: 'Priya Patel',
    actorRole: 'Owner',
    target: 'Hillcrest Vision',
    clinic: 'Hillcrest Vision',
    ip: '10.42.18.55',
    timestamp: '2026-05-12T17:50:00Z',
    severity: 'Warning',
  },
  {
    id: 'AL-30027',
    category: 'Billing',
    action: 'Payment method updated (Visa ending 4521)',
    actor: 'James Wilson',
    actorRole: 'Admin',
    target: 'Greenfield Health',
    clinic: 'Greenfield Health',
    ip: '10.42.18.61',
    timestamp: '2026-05-12T15:24:00Z',
    severity: 'Info',
  },
  {
    id: 'AL-30028',
    category: 'Clinical Notes',
    action: 'Deleted draft note (pre-finalization)',
    actor: 'Dr. Emily Rodriguez',
    actorRole: 'Clinician',
    target: 'Patient P-5102',
    clinic: 'Maplewood Dermatology',
    ip: '10.42.18.33',
    timestamp: '2026-05-12T14:02:00Z',
    severity: 'Info',
  },
  {
    id: 'AL-30029',
    category: 'Permissions',
    action: 'Revoked admin role from former employee',
    actor: 'Michael Ross',
    actorRole: 'Super Admin',
    target: 'k.lee@cedarhill.health',
    clinic: 'Cedar Hill Clinic',
    ip: '10.42.18.1',
    timestamp: '2026-05-12T10:18:00Z',
    severity: 'Warning',
  },
  {
    id: 'AL-30030',
    category: 'Subscription',
    action: 'Add-on enabled: Advanced Analytics',
    actor: 'Sarah Chen',
    actorRole: 'Admin',
    target: 'Riverstone Cardiology',
    clinic: 'Riverstone Cardiology',
    ip: '10.42.18.7',
    timestamp: '2026-05-11T16:40:00Z',
    severity: 'Info',
  },
]

export const complianceAlerts: ComplianceAlertRow[] = [
  {
    id: 'CA-7001',
    type: 'Security Incident',
    title: 'Brute-force login attempts detected',
    description: '5+ failed logins from 203.0.113.42 against admin@sunrisepeds.com',
    clinic: 'Sunrise Pediatrics',
    detectedAt: '2026-05-13T09:31:00Z',
    severity: 'Critical',
    status: 'Open',
  },
  {
    id: 'CA-7002',
    type: 'Expired Payment Method',
    title: 'Primary card expired',
    description: 'Visa •••• 4521 expired on 2026-04-30. Next charge fails on 2026-05-20.',
    clinic: 'Northside Dental',
    detectedAt: '2026-05-11T00:00:00Z',
    severity: 'High',
    status: 'In Review',
  },
  {
    id: 'CA-7003',
    type: 'Unverified User',
    title: '7 users pending email verification > 30 days',
    description: 'Verification reminders sent on 04/15, 04/30, 05/10',
    clinic: 'Multiple',
    detectedAt: '2026-05-10T00:00:00Z',
    severity: 'Medium',
    status: 'Open',
  },
  {
    id: 'CA-7004',
    type: 'Missing Report',
    title: 'Monthly HIPAA access report not generated',
    description: 'April 2026 report missing — scheduled job last ran 2026-03-30',
    clinic: 'Bayview Family Clinic',
    detectedAt: '2026-05-01T00:00:00Z',
    severity: 'High',
    status: 'In Review',
  },
  {
    id: 'CA-7005',
    type: 'Expired Payment Method',
    title: 'Backup card expiring within 14 days',
    description: 'Mastercard •••• 0918 expires 2026-05-27',
    clinic: 'Greenfield Health',
    detectedAt: '2026-05-09T00:00:00Z',
    severity: 'Low',
    status: 'Open',
  },
  {
    id: 'CA-7006',
    type: 'Security Incident',
    title: 'New device sign-in flagged for review',
    description: 'Chicago, USA — first time seen for david.okonkwo@westend.health',
    clinic: 'Westend Wellness',
    detectedAt: '2026-05-13T08:12:00Z',
    severity: 'Medium',
    status: 'Resolved',
  },
  {
    id: 'CA-7007',
    type: 'Missing Report',
    title: 'Quarterly access audit pending',
    description: 'Q1 2026 audit not yet submitted by clinic admin',
    clinic: 'Cedar Hill Clinic',
    detectedAt: '2026-05-05T00:00:00Z',
    severity: 'Medium',
    status: 'Open',
  },
]

export const dataExports: DataExportRow[] = [
  {
    id: 'DX-9001',
    requester: 'Sarah Chen',
    requesterRole: 'Admin',
    scope: 'Full clinic export — Bayview Family Clinic',
    format: 'JSON',
    requestedAt: '2026-05-13T08:00:00Z',
    completedAt: '2026-05-13T08:42:00Z',
    status: 'Completed',
  },
  {
    id: 'DX-9002',
    requester: 'Dr. Amelia Park',
    requesterRole: 'Clinician',
    scope: 'Patient records export (90-day window)',
    format: 'CSV',
    requestedAt: '2026-05-13T10:15:00Z',
    completedAt: null,
    status: 'Processing',
  },
  {
    id: 'DX-9003',
    requester: 'Michael Ross',
    requesterRole: 'Super Admin',
    scope: 'Platform audit log archive — April 2026',
    format: 'CSV',
    requestedAt: '2026-05-12T14:00:00Z',
    completedAt: '2026-05-12T14:18:00Z',
    status: 'Completed',
  },
  {
    id: 'DX-9004',
    requester: 'Priya Patel',
    requesterRole: 'Owner',
    scope: 'GDPR data subject export (patient self-request)',
    format: 'PDF',
    requestedAt: '2026-05-12T11:30:00Z',
    completedAt: null,
    status: 'Queued',
  },
  {
    id: 'DX-9005',
    requester: 'James Wilson',
    requesterRole: 'Admin',
    scope: 'Billing export 2025-Q4',
    format: 'CSV',
    requestedAt: '2026-05-10T09:20:00Z',
    completedAt: null,
    status: 'Failed',
  },
]

export const backups: BackupRow[] = [
  {
    id: 'BK-2103',
    type: 'Incremental',
    startedAt: '2026-05-13T02:00:00Z',
    durationMinutes: 14,
    sizeGb: 1.8,
    region: 'us-east-1',
    status: 'Success',
  },
  {
    id: 'BK-2102',
    type: 'Incremental',
    startedAt: '2026-05-12T02:00:00Z',
    durationMinutes: 12,
    sizeGb: 1.6,
    region: 'us-east-1',
    status: 'Success',
  },
  {
    id: 'BK-2101',
    type: 'Full',
    startedAt: '2026-05-11T01:30:00Z',
    durationMinutes: 78,
    sizeGb: 124.5,
    region: 'us-east-1',
    status: 'Success',
  },
  {
    id: 'BK-2100',
    type: 'Incremental',
    startedAt: '2026-05-10T02:00:00Z',
    durationMinutes: 15,
    sizeGb: 1.9,
    region: 'us-east-1',
    status: 'Success',
  },
  {
    id: 'BK-2099',
    type: 'Incremental',
    startedAt: '2026-05-09T02:00:00Z',
    durationMinutes: 0,
    sizeGb: 0,
    region: 'us-east-1',
    status: 'Failed',
  },
  {
    id: 'BK-2098',
    type: 'Incremental',
    startedAt: '2026-05-14T02:00:00Z',
    durationMinutes: 4,
    sizeGb: 0.6,
    region: 'eu-west-1',
    status: 'Running',
  },
]

export const retentionPolicies: RetentionPolicyRow[] = [
  {
    id: 'RP-1',
    resource: 'Patient clinical notes',
    retentionDays: 2555,
    lastReviewed: '2026-02-12',
    owner: 'Compliance Team',
    status: 'Active',
  },
  {
    id: 'RP-2',
    resource: 'Audit logs',
    retentionDays: 365,
    lastReviewed: '2026-01-20',
    owner: 'Security Team',
    status: 'Active',
  },
  {
    id: 'RP-3',
    resource: 'Billing & invoice records',
    retentionDays: 2190,
    lastReviewed: '2025-11-08',
    owner: 'Finance Team',
    status: 'Under Review',
  },
  {
    id: 'RP-4',
    resource: 'Session & login telemetry',
    retentionDays: 90,
    lastReviewed: '2026-03-04',
    owner: 'Security Team',
    status: 'Active',
  },
  {
    id: 'RP-5',
    resource: 'Marketing analytics events',
    retentionDays: 180,
    lastReviewed: '2025-08-19',
    owner: 'Growth Team',
    status: 'Expired',
  },
]
