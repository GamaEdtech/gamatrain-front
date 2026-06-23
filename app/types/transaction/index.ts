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

export interface SearchFilterAdminTransaction {
  isDebit: boolean | null
  userId: string
  name: string
  email: string
  identifierId: string
  startDate: string
  endDate: string
}

export interface GetAdminTransactionsParams extends SearchFilterAdminTransaction {
  page: number
  pageSize: number
}
export interface AddTransactionAdminDTO {
  userId: number | string
  isDebit: boolean
  points: number
  description: string
}
export interface ResponseAddTransactionAdminDTO {
  balance: number
}
