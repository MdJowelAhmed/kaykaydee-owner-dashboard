export type NotificationVariant = 'email' | 'user'

export interface NotificationEntry {
  id: string
  variant: NotificationVariant
  title: string
  description: string
  /** For variant user */
  avatarUrl?: string
}

export const NOTIFICATION_SAMPLE_TITLE = 'Email Notification'
export const NOTIFICATION_SAMPLE_DESCRIPTION =
  'Receive email updates about your account'

const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/96/96`

export const MOCK_NOTIFICATIONS: NotificationEntry[] = [
  {
    id: '1',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
  },
  {
    id: '2',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    avatarUrl: avatar('n1'),
  },
  {
    id: '3',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
  },
  {
    id: '4',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    avatarUrl: avatar('n2'),
  },
  {
    id: '5',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
  },
  {
    id: '6',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    avatarUrl: avatar('n3'),
  },
  {
    id: '7',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
  },
  {
    id: '8',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    avatarUrl: avatar('n4'),
  },
  {
    id: '9',
    variant: 'email',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
  },
  {
    id: '10',
    variant: 'user',
    title: NOTIFICATION_SAMPLE_TITLE,
    description: NOTIFICATION_SAMPLE_DESCRIPTION,
    avatarUrl: avatar('n5'),
  },
]

export const NOTIFICATION_MODAL_PREVIEW_COUNT = 3
