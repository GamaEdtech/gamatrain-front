import type { BillingInterval } from '@/types'

export type ContentTypeDownload = 'PastPaper' | 'Multimedia' | 'Exam'

export interface BodyRequestDownloadDTO {
  id: string | number
  contentType: ContentTypeDownload
  fileType: string
  extraId?: string | number
}

export type PaidByDownloadResponseDTO = 'SubscriptionQuota' | 'Points'
export interface UpgradeSuggestionsDTO {
  id: number
  title: string
  limit: number
  pooledFeatureCodes: string[]
  description: string
  highlight: boolean
  prices: UpgradeSuggestionsPrice[]
  featureGroups: UpgradeSuggestionsFeatureGroup[]
}

export interface UpgradeSuggestionsPrice {
  billingInterval: string
  currency: string
  currencySymbol: string
  price: number
  monthlyEquivalentPrice: number
  discountPercent: number
}

export interface UpgradeSuggestionsFeatureGroup {
  features: UpgradeSuggestionsFeature[]
  limit: number
  description: string
}

export interface UpgradeSuggestionsFeature {
  featureId: number
  featureCode: string
  featureName: string
}

export interface DownloadResponseDTO {
  url: string
  name: string
  spent: boolean
  paidBy: PaidByDownloadResponseDTO
  upgradeSuggestions: UpgradeSuggestionsDTO[]
  availableBillingIntervals: BillingInterval[]
}
