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
