export type CurrencyPayment = 'SOL' | 'USDC' | 'GET' | 'USDT'
export type StatusPayment = 'Pending' | 'Paid' | 'Failed'
export type PaymentCurrency = 'SOL' | 'USDC' | 'USD'
export type PaymentGateway = 'GamaTrain' | 'Stripe'
// What a payment represents - see GamaEdtech.Domain.Enumeration.PaymentKind (gamatrain-back).
// Null on rows recorded before this classification existed (can't be reliably backfilled for
// Renewal vs. PlanSwitch - both used the same TransactionId scheme).
export type PaymentKind = 'PointsTopUp' | 'NewSubscription' | 'Renewal' | 'PlanSwitch'

export interface AdminPaymentDTO {
  id: number
  userId: number
  firstName?: string
  lastName?: string
  amount: number
  currency: CurrencyPayment
  gateway: PaymentGateway
  status: StatusPayment
  kind?: PaymentKind | null
  creationDate: string
  verifyDate?: string
  sourceWallet?: string
  comment?: string
  transactionId?: string
}
export interface PayloadPaymentDTO {
  amount: number
  currency: PaymentCurrency
  gateway: PaymentGateway
  title: string
  description: string
}
export interface PaymentDTO {
  paymentId: number
  url: string
}

export interface PaymentSummaryDTO {
  date: string
  pendingAmount: number
  paidAmount: number
  failedAmount: number
  failedCount: number
  paidCount: number
  pendingCount: number
  // Independent pivot of the same rows by Kind, not a subset of paidAmount - see the backend's own
  // doc comment (docs/business/payments-and-points.md, "Payment.Kind") for why these can sum to
  // less than paidAmount for a date range that includes pre-2026-09-16 payments.
  newSubscriptionAmount: number
  newSubscriptionCount: number
  renewalAmount: number
  renewalCount: number
  planSwitchAmount: number
  planSwitchCount: number
  pointsTopUpAmount: number
  pointsTopUpCount: number
}

export interface PaymentSummaryGetParams {
  userId: number | null
  startDate: string | null
  endDate: string | null
  gateway: PaymentGateway | null
  status: StatusPayment | null
  currency: CurrencyPayment | null
  kind: PaymentKind | null
}

export interface PaymentAdminExportParams {
  startDate?: string | null
  endDate?: string | null
  gateway?: PaymentGateway | null
  status?: StatusPayment | null
  kind?: PaymentKind | null
}

export interface SearchFilterAdminPayment {
  userId: string
  identifierId: string
  startDate: string
  endDate: string
  status: string
  gateway: string
  kind: string
}

export interface GetAdminPaymentsParams extends SearchFilterAdminPayment {
  page: number
  pageSize: number
  sortSelected: string[]
}
