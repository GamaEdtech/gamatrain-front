export type CommissionReason = 'ContentDownload'
export type ContentSource = 'GamaApiLegacy'
export type CommissionContentType = 'PastPaper' | 'Test' | 'Multimedia' | 'Exam'

export interface AdminCommissionDTO {
  id: number
  ownerUserId: number
  ownerFirstName: string
  ownerLastName: string
  downloaderUserId: number
  reason: CommissionReason
  source: ContentSource
  contentType: CommissionContentType
  externalContentId: number
  externalFileType: string
  externalExtraId: number
  points: number
  commissionPercent: number
  amountUsd: number
  creationDate: string
}

export interface SearchFilterAdminCommission {
  startDate: string
  endDate: string
}

export interface GetAdminCommissionParams extends SearchFilterAdminCommission {
  page: number
  pageSize: number
}

export interface UserCommissionDTO {
  id: number
  ownerUserId: number
  ownerFirstName: string
  ownerLastName: string
  downloaderUserId: number
  reason: CommissionReason
  source: ContentSource
  contentType: CommissionContentType
  externalContentId: number
  externalFileType: string
  externalExtraId: number
  points: number
  commissionPercent: number
  amountUsd: number
  creationDate: string
}

export interface SearchFilterUserCommission {
  startDate: string
  endDate: string
}

export interface GetUserCommissionParams extends SearchFilterUserCommission {
  page: number
  pageSize: number
}

export type CommissionStatisticsPeriod = 'DayOfWeek' | 'MonthOfYear'

export interface CommissionStatisticDTO {
  name: string
  amountUsd: number
  points: number
}

export interface CommissionStatisticsResponseDTO {
  statistics: CommissionStatisticDTO[]
  totalAmountUsd: number
  totalPoints: number
}

export interface CommissionStatisticsParams {
  period: CommissionStatisticsPeriod
  startDate: string
  endDate: string
}

// Payouts (gamatrain-back: commissions/balance, commissions/payouts, admin/commissions/payouts)
export type CommissionPayoutStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected' | 'Cancelled'

/** StripeConnect (default): approval sends a Stripe transfer. Manual: an admin transfers by hand and marks it paid. */
export type CommissionPayoutMethod = 'StripeConnect' | 'Manual'

export interface PayoutAccountDTO {
  hasAccount: boolean
  country: string | null
  detailsSubmitted: boolean
  payoutsEnabled: boolean
}

export interface CommissionBalanceDTO {
  totalEarnedUsd: number
  paidOutUsd: number
  reservedUsd: number
  availableUsd: number
  payoutThresholdUsd: number
  openPayoutId: number | null
}

export interface CommissionPayoutDTO {
  id: number
  userId: number
  userFirstName: string | null
  userLastName: string | null
  amountUsd: number
  destination: string
  status: CommissionPayoutStatus
  method: CommissionPayoutMethod
  creationDate: string
  approvedByUserId: number | null
  approvedByFullName: string | null
  approvalDate: string | null
  paidByUserId: number | null
  paidByFullName: string | null
  paidDate: string | null
  transferReference: string | null
  rejectedByUserId: number | null
  rejectedByFullName: string | null
  rejectionDate: string | null
  rejectionReason: string | null
  cancellationDate: string | null
}

export interface GetCommissionPayoutsParams {
  page: number
  pageSize: number
  status?: CommissionPayoutStatus | ''
}

export interface RequestCommissionPayoutBody {
  amountUsd?: number
  method: CommissionPayoutMethod
  /** Manual only. */
  destination?: string
}

export type CommissionPayoutDecision = 'approve' | 'reject' | 'paid'

export interface GetAdminCommissionPayoutsParams extends GetCommissionPayoutsParams {
  userId?: number | null
}
