import type { BillingInterval } from '@/types'

export type ContentTypeDownload = 'PastPaper' | 'Multimedia' | 'Exam'

export interface BodyRequestDownloadDTO {
  id: string | number
  contentType: ContentTypeDownload
  fileType: string
  extraId?: string | number
}

export type PaidByDownloadResponseDTO = 'SubscriptionQuota' | 'Points'

// A plan's quota can differ per billing interval (gamatrain-back#563), so limit/description/
// pooledFeatureCodes/featureGroups live on each UpgradeSuggestionsPrice entry - already resolved server-side
// for that one interval - rather than once at the suggestion's top level.
export interface UpgradeSuggestionsDTO {
  id: number
  title: string
  highlight: boolean
  prices: UpgradeSuggestionsPrice[]
}

export interface UpgradeSuggestionsPrice {
  billingInterval: BillingInterval
  currency: string
  currencySymbol: string
  price: number
  monthlyEquivalentPrice: number
  /** null when this entry is itself the Monthly price, or the plan has no Monthly price to compare against. */
  discountPercent: number | null
  /** The suggested plan's limit for the feature that failed, at this billing interval; null means unlimited. */
  limit: number | null
  /** Other feature code(s) sharing `limit` with the one that failed, if any. Empty/absent when unpooled. */
  pooledFeatureCodes: string[]
  description: string
  /** The plan's full feature-group list at this billing interval, not just the group that triggered the suggestion. */
  featureGroups: UpgradeSuggestionsFeatureGroup[]
}

export interface UpgradeSuggestionsFeatureGroup {
  features: UpgradeSuggestionsFeature[]
  limit: number | null
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
