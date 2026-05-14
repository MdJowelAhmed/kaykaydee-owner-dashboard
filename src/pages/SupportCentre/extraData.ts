export type ChatStatus = 'active' | 'waiting' | 'resolved'

export interface LiveChatSession {
  id: string
  clinic: string
  contactName: string
  contactRole: string
  avatarUrl: string
  lastMessage: string
  unread: number
  waitingForMinutes: number
  agent: string | null
  status: ChatStatus
  startedAt: string
}

export type BugSeverity = 'low' | 'medium' | 'high' | 'critical'
export type BugStatus = 'new' | 'triaged' | 'in_progress' | 'fixed' | 'wont_fix'

export interface BugReport {
  id: string
  ref: string
  title: string
  clinic: string
  reportedBy: string
  module: 'Billing' | 'Clinical Notes' | 'Scheduling' | 'Auth' | 'Reports' | 'Mobile'
  severity: BugSeverity
  status: BugStatus
  affectedUsers: number
  reportedAt: string
  steps: string
}

export type FeatureRequestStatus =
  | 'under_review'
  | 'planned'
  | 'in_progress'
  | 'shipped'
  | 'rejected'

export interface FeatureRequest {
  id: string
  ref: string
  title: string
  description: string
  clinic: string
  submittedBy: string
  category: 'Workflow' | 'Reporting' | 'Integrations' | 'AI' | 'Mobile' | 'Billing'
  votes: number
  status: FeatureRequestStatus
  submittedAt: string
}

export interface ClinicSupportSummary {
  id: string
  clinic: string
  plan: 'Basic' | 'Professional' | 'Enterprise'
  totalTickets: number
  openTickets: number
  escalations: number
  satisfaction: number
  responseRatio: number
  lastContact: string
}

export type EscalationLevel = 'L1' | 'L2' | 'L3'

export interface EscalationRecord {
  id: string
  clinicId: string
  ticketRef: string
  subject: string
  reason: string
  level: EscalationLevel
  owner: string
  escalatedAt: string
  resolvedAt: string | null
}

export const liveChatSessions: LiveChatSession[] = [
  {
    id: 'CHT-2201',
    clinic: 'Bayview Family Clinic',
    contactName: 'Sarah Chen',
    contactRole: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/96?img=5',
    lastMessage: 'The invoice for May is still missing — can you check?',
    unread: 2,
    waitingForMinutes: 3,
    agent: null,
    status: 'waiting',
    startedAt: '2026-05-13T14:42:00Z',
  },
  {
    id: 'CHT-2202',
    clinic: 'Northside Dental',
    contactName: 'Dr. Amelia Park',
    contactRole: 'Clinician',
    avatarUrl: 'https://i.pravatar.cc/96?img=47',
    lastMessage: 'Thanks, that worked! Closing this for now.',
    unread: 0,
    waitingForMinutes: 0,
    agent: 'Maria Lopez',
    status: 'resolved',
    startedAt: '2026-05-13T13:00:00Z',
  },
  {
    id: 'CHT-2203',
    clinic: 'Westend Wellness',
    contactName: 'David Okonkwo',
    contactRole: 'Owner',
    avatarUrl: 'https://i.pravatar.cc/96?img=60',
    lastMessage: 'I cannot add new staff — getting an error 500.',
    unread: 1,
    waitingForMinutes: 0,
    agent: 'Tom Banks',
    status: 'active',
    startedAt: '2026-05-13T14:15:00Z',
  },
  {
    id: 'CHT-2204',
    clinic: 'Sunrise Pediatrics',
    contactName: 'Priya Patel',
    contactRole: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/96?img=12',
    lastMessage: 'Can someone walk me through the analytics export?',
    unread: 3,
    waitingForMinutes: 7,
    agent: null,
    status: 'waiting',
    startedAt: '2026-05-13T14:38:00Z',
  },
  {
    id: 'CHT-2205',
    clinic: 'Greenfield Health',
    contactName: 'James Wilson',
    contactRole: 'Billing',
    avatarUrl: 'https://i.pravatar.cc/96?img=33',
    lastMessage: 'Following up on the refund timing.',
    unread: 0,
    waitingForMinutes: 0,
    agent: 'Maria Lopez',
    status: 'active',
    startedAt: '2026-05-13T14:05:00Z',
  },
]

export const bugReports: BugReport[] = [
  {
    id: 'BUG-7401',
    ref: 'BUG-7401',
    title: 'Add Staff form returns 500 on submit',
    clinic: 'Westend Wellness',
    reportedBy: 'David Okonkwo',
    module: 'Auth',
    severity: 'critical',
    status: 'in_progress',
    affectedUsers: 18,
    reportedAt: '2026-05-13T08:42:00Z',
    steps: 'Open clinic settings → Staff → Add Staff → Fill all fields → Submit',
  },
  {
    id: 'BUG-7402',
    ref: 'BUG-7402',
    title: 'Invoice PDF missing line items for annual plans',
    clinic: 'Bayview Family Clinic',
    reportedBy: 'Sarah Chen',
    module: 'Billing',
    severity: 'high',
    status: 'triaged',
    affectedUsers: 9,
    reportedAt: '2026-05-12T11:20:00Z',
    steps: 'Open billing → annual invoice → Download PDF → line items missing',
  },
  {
    id: 'BUG-7403',
    ref: 'BUG-7403',
    title: 'Clinical note autosave drops content on slow networks',
    clinic: 'Maplewood Dermatology',
    reportedBy: 'Dr. Emily Rodriguez',
    module: 'Clinical Notes',
    severity: 'high',
    status: 'new',
    affectedUsers: 4,
    reportedAt: '2026-05-12T15:05:00Z',
    steps: 'Type a long note on a throttled network → autosave silently fails',
  },
  {
    id: 'BUG-7404',
    ref: 'BUG-7404',
    title: 'Mobile app crashes on low-memory devices',
    clinic: 'Cedar Hill Clinic',
    reportedBy: 'Mobile crash logs',
    module: 'Mobile',
    severity: 'medium',
    status: 'in_progress',
    affectedUsers: 22,
    reportedAt: '2026-05-11T10:30:00Z',
    steps: 'Open dashboard with > 50 patients on iPhone 11 or older → crash',
  },
  {
    id: 'BUG-7405',
    ref: 'BUG-7405',
    title: 'Calendar timezone offset wrong for clinics in AUS',
    clinic: 'Riverstone Cardiology',
    reportedBy: 'Support Team',
    module: 'Scheduling',
    severity: 'medium',
    status: 'fixed',
    affectedUsers: 3,
    reportedAt: '2026-05-08T07:18:00Z',
    steps: 'Set clinic timezone to AEST → bookings display in UTC',
  },
  {
    id: 'BUG-7406',
    ref: 'BUG-7406',
    title: 'Dashboard tooltip overlaps sidebar on 1280px width',
    clinic: 'Northside Dental',
    reportedBy: 'Dr. Amelia Park',
    module: 'Reports',
    severity: 'low',
    status: 'wont_fix',
    affectedUsers: 1,
    reportedAt: '2026-04-30T12:55:00Z',
    steps: 'View dashboard on exactly 1280×800 resolution',
  },
]

export const featureRequests: FeatureRequest[] = [
  {
    id: 'FR-5081',
    ref: 'FR-5081',
    title: 'Bulk-export patient records by date range',
    description:
      'Allow admins to export patient records as CSV or JSON filtered by a custom date range with HIPAA-safe redaction.',
    clinic: 'Bayview Family Clinic',
    submittedBy: 'Sarah Chen',
    category: 'Reporting',
    votes: 84,
    status: 'planned',
    submittedAt: '2026-05-08T09:00:00Z',
  },
  {
    id: 'FR-5082',
    ref: 'FR-5082',
    title: 'Two-way Google Calendar sync for clinicians',
    description: 'Sync appointment changes both directions, including reschedules and cancellations.',
    clinic: 'Northside Dental',
    submittedBy: 'Dr. Amelia Park',
    category: 'Integrations',
    votes: 62,
    status: 'under_review',
    submittedAt: '2026-05-10T11:20:00Z',
  },
  {
    id: 'FR-5083',
    ref: 'FR-5083',
    title: 'AI-generated SOAP note summaries',
    description: 'Use Zealth AI to summarize long clinical notes into a SOAP-format brief.',
    clinic: 'Maplewood Dermatology',
    submittedBy: 'Dr. Emily Rodriguez',
    category: 'AI',
    votes: 121,
    status: 'in_progress',
    submittedAt: '2026-04-22T14:45:00Z',
  },
  {
    id: 'FR-5084',
    ref: 'FR-5084',
    title: 'Offline mode for mobile clinical notes',
    description: 'Allow editing notes offline and syncing once back online.',
    clinic: 'Westend Wellness',
    submittedBy: 'David Okonkwo',
    category: 'Mobile',
    votes: 47,
    status: 'under_review',
    submittedAt: '2026-05-04T08:30:00Z',
  },
  {
    id: 'FR-5085',
    ref: 'FR-5085',
    title: 'Stripe Tax automatic remittance',
    description: 'Automatically file taxes per region via Stripe Tax integration.',
    clinic: 'Greenfield Health',
    submittedBy: 'James Wilson',
    category: 'Billing',
    votes: 38,
    status: 'shipped',
    submittedAt: '2026-03-18T10:00:00Z',
  },
  {
    id: 'FR-5086',
    ref: 'FR-5086',
    title: 'Custom branding on patient-facing emails',
    description: 'Let clinics upload a logo and brand color to email templates.',
    clinic: 'Cedar Hill Clinic',
    submittedBy: 'Owner',
    category: 'Workflow',
    votes: 19,
    status: 'rejected',
    submittedAt: '2026-04-12T16:00:00Z',
  },
]

export const clinicSupportSummaries: ClinicSupportSummary[] = [
  {
    id: 'CL-001',
    clinic: 'Bayview Family Clinic',
    plan: 'Enterprise',
    totalTickets: 28,
    openTickets: 3,
    escalations: 1,
    satisfaction: 4.6,
    responseRatio: 0.92,
    lastContact: '2026-05-13T14:42:00Z',
  },
  {
    id: 'CL-002',
    clinic: 'Northside Dental',
    plan: 'Professional',
    totalTickets: 17,
    openTickets: 1,
    escalations: 0,
    satisfaction: 4.8,
    responseRatio: 0.97,
    lastContact: '2026-05-13T13:00:00Z',
  },
  {
    id: 'CL-003',
    clinic: 'Westend Wellness',
    plan: 'Professional',
    totalTickets: 21,
    openTickets: 4,
    escalations: 2,
    satisfaction: 3.9,
    responseRatio: 0.78,
    lastContact: '2026-05-13T14:15:00Z',
  },
  {
    id: 'CL-004',
    clinic: 'Sunrise Pediatrics',
    plan: 'Basic',
    totalTickets: 9,
    openTickets: 2,
    escalations: 1,
    satisfaction: 4.2,
    responseRatio: 0.85,
    lastContact: '2026-05-13T09:31:00Z',
  },
  {
    id: 'CL-005',
    clinic: 'Maplewood Dermatology',
    plan: 'Professional',
    totalTickets: 14,
    openTickets: 0,
    escalations: 0,
    satisfaction: 4.9,
    responseRatio: 1.0,
    lastContact: '2026-05-12T15:05:00Z',
  },
  {
    id: 'CL-006',
    clinic: 'Cedar Hill Clinic',
    plan: 'Basic',
    totalTickets: 12,
    openTickets: 1,
    escalations: 1,
    satisfaction: 3.6,
    responseRatio: 0.7,
    lastContact: '2026-05-11T10:30:00Z',
  },
  {
    id: 'CL-007',
    clinic: 'Riverstone Cardiology',
    plan: 'Enterprise',
    totalTickets: 31,
    openTickets: 2,
    escalations: 0,
    satisfaction: 4.7,
    responseRatio: 0.94,
    lastContact: '2026-05-11T16:40:00Z',
  },
  {
    id: 'CL-008',
    clinic: 'Greenfield Health',
    plan: 'Professional',
    totalTickets: 19,
    openTickets: 1,
    escalations: 1,
    satisfaction: 4.3,
    responseRatio: 0.88,
    lastContact: '2026-05-12T15:24:00Z',
  },
]

export const escalations: EscalationRecord[] = [
  {
    id: 'ESC-9001',
    clinicId: 'CL-001',
    ticketRef: 'TKT-1042',
    subject: 'Invoice not generated for March subscription',
    reason: 'No response within SLA on billing-critical issue',
    level: 'L2',
    owner: 'Maria Lopez',
    escalatedAt: '2026-05-13T10:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'ESC-9002',
    clinicId: 'CL-003',
    ticketRef: 'TKT-1041',
    subject: 'Cannot add new staff member to clinic',
    reason: 'Urgent priority, multi-user impact',
    level: 'L3',
    owner: 'Tom Banks',
    escalatedAt: '2026-05-12T08:30:00Z',
    resolvedAt: null,
  },
  {
    id: 'ESC-9003',
    clinicId: 'CL-004',
    ticketRef: 'TKT-1024',
    subject: 'Password reset email not received',
    reason: 'Repeated incidents in last 7 days',
    level: 'L2',
    owner: 'Maria Lopez',
    escalatedAt: '2026-04-29T11:00:00Z',
    resolvedAt: '2026-04-30T09:00:00Z',
  },
  {
    id: 'ESC-9004',
    clinicId: 'CL-006',
    ticketRef: 'TKT-0991',
    subject: 'Onboarding session rescheduled twice',
    reason: 'Satisfaction risk',
    level: 'L1',
    owner: 'Maria Lopez',
    escalatedAt: '2026-05-02T14:00:00Z',
    resolvedAt: '2026-05-05T16:30:00Z',
  },
  {
    id: 'ESC-9005',
    clinicId: 'CL-008',
    ticketRef: 'TKT-1008',
    subject: 'Refund delayed beyond 7 business days',
    reason: 'Compliance / payment policy breach',
    level: 'L2',
    owner: 'Tom Banks',
    escalatedAt: '2026-04-25T09:00:00Z',
    resolvedAt: '2026-04-27T12:00:00Z',
  },
]

export const STATUS_LABELS_BUG: Record<BugStatus, string> = {
  new: 'New',
  triaged: 'Triaged',
  in_progress: 'In Progress',
  fixed: 'Fixed',
  wont_fix: "Won't Fix",
}

export const STATUS_LABELS_FEATURE: Record<FeatureRequestStatus, string> = {
  under_review: 'Under Review',
  planned: 'Planned',
  in_progress: 'In Progress',
  shipped: 'Shipped',
  rejected: 'Rejected',
}
