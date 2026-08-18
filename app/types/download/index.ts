import type { BillingInterval } from '@/types'

export type ContentTypeDownload = 'PastPaper' | 'Multimedia' | 'Exam'

export interface BodyRequestDownloadDTO {
  id: string | number
  contentType: ContentTypeDownload
  fileType: string
  extraId?: string | number
}

export type PaidByDownloadResponseDTO = 'SubscriptionQuota' | 'Points'

// Verified against the live QuotaFailureReason enum (sandbox.gamaedtech.com/swagger/v1/swagger.json).
export type QuotaFailureReason = 'NoActiveSubscription' | 'FeatureNotInPlan' | 'QuotaExhausted'

// Shared "why did this quota consumption fail" context (gamatrain-back#575), returned by both the
// download and games/spends endpoints whenever the caller's plan/balance couldn't cover the request.
// Left unset (null) on a successful response.
export interface QuotaFailureContextDTO {
  reason: QuotaFailureReason | null
  currentSubscriptionId: number | null
  currentPlanId: number | null
  currentPlanTitle: string | null
}

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
  // gamatrain-back#580. Every plan+interval offering the failed feature is always in the response now
  // (previously filtered/capped) - render the full grid and use these two flags to grey out what can't be
  // picked, rather than an entry's absence. Not present on SubscriptionPlanDTO's prices (the general
  // subscriptions/plans catalog wasn't touched by that PR) - only ever on a quota-exhausted suggestion.
  /** True only for the caller's own active plan at this exact billing interval. At most one entry across
   *  the whole response is true, and only when the caller has an active subscription. */
  isCurrent: boolean
  /** False when this entry isn't a selectable upgrade target - either it's `isCurrent`, or its `limit`
   *  doesn't actually exceed what the caller already has (an equal/lower-quota lateral or downgrade). */
  canUpgrade: boolean
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

export interface DownloadResponseDTO extends QuotaFailureContextDTO {
  url: string
  name: string
  spent: boolean
  paidBy: PaidByDownloadResponseDTO
  upgradeSuggestions: UpgradeSuggestionsDTO[]
  availableBillingIntervals: BillingInterval[]
}

// POST games/spends (points/Gem spend, e.g. TestDetails' "See Full Answer") - same quota-failure shape as
// a download, minus the file url/name.
export interface SpendPointsResponseDTO extends QuotaFailureContextDTO {
  spent: boolean
  paidBy: PaidByDownloadResponseDTO
  remainingQuota: number | null
  upgradeSuggestions: UpgradeSuggestionsDTO[]
  availableBillingIntervals: BillingInterval[]
}
