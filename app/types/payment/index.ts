export type CurrencyPayment = 'SOL' | 'USDC' | 'GET' | 'USDT'
export type StatusPayment = 'Pending' | 'Paid' | 'Failed'
export type PaymentCurrency = 'SOL' | 'USDC'
export type PaymentGateway = 'GamaTrain' | 'Stripe'

export interface AdminPaymentDTO {
  id: number
  userId: number
  firstName?: string
  lastName?: string
  amount: number
  currency: CurrencyPayment
  gateway: PaymentGateway
  status: StatusPayment
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
}

export interface PaymentSummaryGetParams {
  userId: number | null
  startDate: string | null
  endDate: string | null
  gateway: PaymentGateway | null
  status: StatusPayment | null
  currency: CurrencyPayment | null
}

export interface PaymentAdminExportParams {
  startDate?: string | null
  endDate?: string | null
  gateway?: PaymentGateway | null
  status?: StatusPayment | null
}
