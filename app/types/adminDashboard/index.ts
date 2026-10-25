/** Backend keys of the admin "needs attention" queues (AdminDashboardService). */
export type AttentionKey
  = | 'ContactUs'
    | 'SchoolImages'
    | 'SchoolContributions'
    | 'SchoolIssues'
    | 'SchoolImageRemovals'
    | 'SchoolComments'
    | 'Posts'
    | 'PostComments'
    | 'Payouts'

export interface AttentionItemDTO {
  key: AttentionKey
  count: number
  newLast7Days: number
  oldestDate: string | null
}

export interface AdminDashboardSummaryDTO {
  items: AttentionItemDTO[]
  generatedDate: string
}

export type PaymentKindName = 'PointsTopUp' | 'NewSubscription' | 'Renewal' | 'PlanSwitch'

export interface AdminDashboardOverviewDTO {
  from: string
  toExclusive: string
  signUps: number
  teacherSignUps: number
  studentSignUps: number
  revenue: { kind: PaymentKindName | null, count: number, amountUsd: number }[]
  revenueUsd: number
  paymentsWithoutUsd: number
  activeSubscriptions: number
  cancellingSubscriptions: number
  newSubscriptions: number
  expiredSubscriptions: number
  daily: {
    date: string
    signUps: number
    paidPayments: number
    revenueUsd: number
    inviteJoins: number
    invitedSignUps: number
  }[]
}

export interface AdminReferralTeacherDTO {
  userId: number
  name: string | null
  joinedDate: string | null
  percent: number | null
  invited: number
  paying: number
  earnedUsd: number
  lastInvitedDate: string | null
}

export interface AdminInvitedSignUpDTO {
  userId: number
  name: string | null
  signedUpDate: string | null
  inviterUserId: number
  inviterName: string | null
  payments: number
  earnedUsd: number
  sharedNetwork: boolean
}

export interface AdminReferralReportDTO {
  offersCreated: number
  offersEmailed: number
  teachersJoined: number
  invitedSignUps: number
  payingInvitees: number
  earnedUsd: number
  sharedNetworkSignUps: number
  topTeachers: AdminReferralTeacherDTO[]
  recentSignUps: AdminInvitedSignUpDTO[]
}

/** Whole days, inclusive, as YYYY-MM-DD. */
export interface DashboardRange {
  startDate: string
  endDate: string
}
