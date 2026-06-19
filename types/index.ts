// ─── Enums ──────────────────────────────────────────────────────────────────

export type PledgeStatus =
  | 'PENDING_ACCEPTANCE'
  | 'AWAITING_FUNDING'
  | 'ACTIVE'
  | 'OVERDUE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'

export type ReminderPreference = 'LIGHT' | 'STANDARD' | 'STRICT'

export type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED'

export type NotificationType =
  | 'PLEDGE_RECEIVED'
  | 'PLEDGE_ACCEPTED'
  | 'FUNDING_CONFIRMED'
  | 'REMINDER'
  | 'PAYMENT_RECEIVED'
  | 'PLEDGE_COMPLETED'
  | 'PLEDGE_OVERDUE'

export type ActivityEventType =
  | 'PLEDGE_CREATED'
  | 'PLEDGE_ACCEPTED'
  | 'FUNDING_CONFIRMED'
  | 'REMINDER_SENT'
  | 'PAYMENT_RECEIVED'
  | 'PLEDGE_COMPLETED'
  | 'PLEDGE_OVERDUE'
  | 'PLEDGE_CANCELLED'
  | 'PLEDGE_EXPIRED'

// ─── Models ──────────────────────────────────────────────────────────────────

export interface User {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  bankName: string | null
  accountNumber: string | null
  accountName: string | null
  reputationScore: number
  createdAt: Date
  updatedAt: Date
}

export interface Pledge {
  id: string
  shareToken: string
  lenderId: string
  borrowerId: string | null
  borrowerName: string
  borrowerEmail: string
  borrowerPhone: string
  amount: number
  outstandingBalance: number
  purpose: string
  dueDate: Date
  status: PledgeStatus
  reminderPreference: ReminderPreference
  proofOfFundingUrl: string | null
  createdAt: Date
  acceptedAt: Date | null
  fundedAt: Date | null
  completedAt: Date | null
  updatedAt: Date
  lender?: Pick<User, 'id' | 'fullName' | 'email'>
  borrower?: Pick<User, 'id' | 'fullName' | 'email'> | null
}

export interface Payment {
  id: string
  pledgeId: string
  amount: number
  flutterwaveTransactionId: string
  flutterwaveRef: string | null
  status: PaymentStatus
  paidAt: Date | null
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
}

export interface Activity {
  id: string
  pledgeId: string
  actorId: string | null
  eventType: ActivityEventType
  metadata: Record<string, unknown> | null
  createdAt: Date
}

// ─── Display / Summary Types ─────────────────────────────────────────────────

export interface PledgeSummary {
  id: string
  amount: number
  outstandingBalance: number
  purpose: string
  dueDate: Date
  status: PledgeStatus
  borrowerName: string
  lenderName: string
  createdAt: Date
}

export interface PledgeDetail extends Pledge {
  activities: Activity[]
  payments: Payment[]
}

export interface ReputationProfile {
  score: number
  completedPledges: number
  onTimeRate: number
  activeOverdue: number
  isNew: boolean
}

// ─── API Types ───────────────────────────────────────────────────────────────

export interface ApiError {
  error: string
  details?: unknown
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
