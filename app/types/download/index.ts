export type ContentTypeDownload = 'PastPaper' | 'Multimedia' | 'Exam'

export interface BodyRequestDownloadDTO {
  id: string | number
  contentType: ContentTypeDownload
  fileType: string
  extraId?: string | number
}

export type PaidByDownloadResponseDTO = 'SubscriptionQuota' | 'Points'
export interface DownloadResponseDTO {
  url: string
  name: string
  spent: boolean
  paidBy: PaidByDownloadResponseDTO
  upgradeSuggestions: {
    subscriptionPlanId: number
    title: string
    limit: number
  }[]
}
