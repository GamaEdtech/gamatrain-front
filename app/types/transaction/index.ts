export interface AdminTransactionDTO {
  id: number
  userId: number
  points: number
  description: string
  creationDate: string
  currentBalance: number
  isDebit: boolean
}
export interface TransactionStatisticDTO {
  name: string
  debitValue: number
  creditValue: number
}
export interface TransactionDTO {
  id: number
  points: number
  description: string
  currentBalance: number
  creationDate: string
  isDebit: boolean
}
