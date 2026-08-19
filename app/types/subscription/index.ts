import type { PaymentGateway } from '@/types'

export type BillingInterval = 'Daily' | 'Weekly' | 'Monthly' | 'Seasonally' | 'Yearly'
export type SubscriptionCurrency = 'SOL' | 'USDC' | 'GET' | 'USDT' | 'USD'

export interface SubscriptionPolygonPointDTO {
  latitude: number
  longitude: number
}

export interface AdminSubscriptionPlanPriceDTO {
  id: number
  subscriptionPlanId: number
  countryCode: string | null
  currency: SubscriptionCurrency
  currencySymbol: string
  price: number
  billingInterval: BillingInterval
}

export interface AdminSubscriptionPlanFeatureDTO {
  featureId: number
  featureCode: string
  featureName: string
}

export interface AdminSubscriptionPlanFeatureLimitDTO {
  billingInterval: BillingInterval
  limit: number | null
}

export interface AdminSubscriptionPlanFeatureGroupDTO {
  features: AdminSubscriptionPlanFeatureDTO[]
  limits: AdminSubscriptionPlanFeatureLimitDTO[]
  description: string
}

export interface AdminSubscriptionPlanDTO {
  id: number
  title: string
  polygon: SubscriptionPolygonPointDTO[]
  isActive: boolean
  highlight: boolean
  prices: AdminSubscriptionPlanPriceDTO[]
  featureGroups: AdminSubscriptionPlanFeatureGroupDTO[]
}

export interface AddAdminSubscriptionPlanDTO {
  title: string
  polygon: SubscriptionPolygonPointDTO[]
  isActive: boolean
  highlight: boolean
}

export interface GetAdminSubscriptionPlanParams {
  page: number
  pageSize: number
}

export interface EditAdminSubscriptionPlanFeaturesDTO {
  featureGroups: {
    featureIds: number[]
    limits: AdminSubscriptionPlanFeatureLimitDTO[]
    description: string
  }[]
}

export interface AdminSubscriptionFeatureDTO {
  id: number
  code: string
  name: string
  description: string
  isActive: boolean
}

export interface AddAdminSubscriptionFeatureDTO {
  code: string
  name: string
  description: string
  isActive: boolean
}

export interface GetAdminSubscriptionFeatureParams {
  page: number
  pageSize: number
}

export interface AdminSubscriptionPriceDTO {
  id: number
  subscriptionPlanId: number
  countryCode: string | null
  currency: SubscriptionCurrency
  currencySymbol: string
  price: number
  billingInterval: BillingInterval
}

export interface AddAdminSubscriptionPriceDTO {
  subscriptionPlanId: number
  countryCode: string | null
  currency: SubscriptionCurrency
  price: number
  billingInterval: BillingInterval
}

export interface GetAdminSubscriptionPriceParams {
  page: number
  pageSize: number
}

export interface AdminSubscriptionGatewayMappingDTO {
  id: number
  subscriptionPlanPriceId: number
  gateway: string
  externalProductId: string
  externalPlanId: string
}

export interface AddAdminSubscriptionGatewayMappingDTO {
  subscriptionPlanPriceId: number
  gateway: string
  externalProductId: string
  externalPlanId: string
}

export interface GetAdminSubscriptionGatewayMappingParams {
  page: number
  pageSize: number
}

export interface ResponseGetPlanDTO {
  plans: SubscriptionPlanDTO[]
  availableBillingIntervals: BillingInterval[]
}

export interface ActiveSubscriptionPlanPriceDTO {
  billingInterval: BillingInterval
  currency: SubscriptionCurrency
  currencySymbol: string
  price: number
}

export interface SubscriptionPlanDTO {
  id: number
  title: string
  highlight: boolean
  prices: ActiveSubscriptionPlanPriceDTO[]
  featureGroups: AdminSubscriptionPlanFeatureGroupDTO[]
}
export interface PayloadPaymentSubscriptionDTO {
  gateway: PaymentGateway
  billingInterval: BillingInterval
  // Purchase now delegates to a switch internally when the caller already has an Active subscription
  // (gamatrain-back#577) - meaningless on a genuine first purchase. Defaults false server-side; only ever
  // sent true on the resubmit after the user has confirmed a previewed upgrade charge.
  confirm?: boolean
}
export interface PaymentSubscriptionResponseDTO {
  userSubscriptionId: number
  // 0 whenever `switched` - an immediate switch bills via Stripe's own proration invoice, not a Payment row.
  paymentId: number
  // Stripe Checkout redirect - set only for a genuine fresh purchase; null whenever `switched` or
  // `requiresConfirmation`.
  url: string | null
  // True when this call changed an already-existing subscription instead of starting a new one.
  switched: boolean
  // True when nothing was applied yet and this response is only a preview - resend the identical request
  // with `confirm: true` to actually apply it and charge `previewAmount`.
  requiresConfirmation: boolean
  /** Set only alongside requiresConfirmation - the exact amount a confirm:true resubmit will charge now. */
  previewAmount: number | null
  previewCurrency: SubscriptionCurrency | null
}

export type UserSubscriptionStatus = 'Pending' | 'Active' | 'Expired' | 'Cancelled'

export interface UserSubscriptionDTO {
  id: number
  subscriptionPlanId: number
  planTitle: string
  status: UserSubscriptionStatus
  startDate: string
  expirationDate: string
  pricePaid: number
  currency: SubscriptionCurrency
  billingInterval: BillingInterval
  featureGroups: FeatureGroupUserSubscriptionDTO[]
  autoRenews: boolean
  cancelAtPeriodEnd: boolean
  pendingSwitchPlanId: number | null
  pendingSwitchPlanTitle: string | null
  lastPaymentFailedDate: string
}

export interface FeatureGroupUserSubscriptionDTO {
  features: AdminSubscriptionPlanFeatureDTO[]
  limit: number | null
  used: number
  remaining: number | null
  description: string
}

export interface AdminUserSubscriptionListDTO {
  id: number
  userId: number
  userEmail: string
  subscriptionPlanId: number
  planTitle: string
  status: UserSubscriptionStatus
  creationDate: string
  startDate: string
  expirationDate: string
  pricePaid: number
  currency: SubscriptionCurrency
  billingInterval: BillingInterval
  autoRenews: boolean
  cancelAtPeriodEnd: boolean
  pendingSwitchPlanId: number | null
  pendingSwitchPlanTitle: string | null
  lastPaymentFailedDate: string | null
  externalSubscriptionId: string | null
  gateway: PaymentGateway
}

export interface AdminUserSubscriptionDetailDTO {
  id: number
  userId: number
  userEmail: string
  subscriptionPlanId: number
  planTitle: string
  status: UserSubscriptionStatus
  creationDate: string
  startDate: string
  expirationDate: string
  pricePaid: number
  currency: SubscriptionCurrency
  billingInterval: BillingInterval
  autoRenews: boolean
  cancelAtPeriodEnd: boolean
  pendingSwitchPlanId: number | null
  pendingSwitchPlanTitle: string | null
  lastPaymentFailedDate: string | null
  externalSubscriptionId: string | null
  gateway: PaymentGateway
}

export interface SearchFilterAdminUserSubscription {
  userId: string
  status: UserSubscriptionStatus | ''
}

export interface GetAdminUserSubscriptionParams extends SearchFilterAdminUserSubscription {
  page: number
  pageSize: number
}

export interface GrantAdminUserSubscriptionDTO {
  userId: number
  subscriptionPlanId: number
  billingInterval: BillingInterval
}

export interface GrantAdminUserSubscriptionResponseDTO {
  id: number
}

export interface ExtendAdminUserSubscriptionDTO {
  days: number
}

// screen that already knows the caller has a plan; startPaymentSubscription (plans/{id}/purchase) now
// handles the same buy/upgrade/downgrade decision on its own for any generic "choose a plan" UI, so this
export interface SwitchSubscriptionPlanDTO {
  subscriptionPlanId: number
  // Omitted keeps the current interval; only a move to a bigger interval is supported (gamatrain-back#577).
  billingInterval?: BillingInterval
  // Defaults false; set true only on the resubmit after the user confirmed a previewed upgrade charge.
  confirm?: boolean
}

export interface SwitchSubscriptionPlanResponseDTO {
  success: boolean
  /** true when the switch applied right away (upgrade, prorated invoice); false when it's deferred to
   *  effectiveDate instead (downgrade). */
  immediate: boolean
  effectiveDate: string | null
  requiresConfirmation: boolean
  previewAmount: number | null
  previewCurrency: SubscriptionCurrency | null
}
