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
