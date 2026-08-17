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

// Mirrors GET subscriptions/plans (ActiveSubscriptionPlanResponseViewModel) - no id/countryCode on its
// prices, unlike the admin price list.
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
}
export interface PaymentSubscriptionResponseDTO {
  userSubscriptionId: number
  paymentId: number
  url: string
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
  startDate: string | null
  expirationDate: string | null
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
  startDate: string | null
  expirationDate: string | null
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

export type AdminSubscriptionUsageSortType = 'Asc' | 'Desc'

export interface AdminSubscriptionUsageSortFilter {
  sortType: AdminSubscriptionUsageSortType
  column: string
}

export interface AdminSubscriptionUsageSearchFilter {
  phrase: string
  column: string
}

export interface AdminSubscriptionUsageDTO {
  id: number
  userId: number
  userEmail: string
  userSubscriptionId: number
  subscriptionPlanId: number
  planTitle: string
  featureId: number
  featureCode: string
  featureName: string
  amount: number
  identifierId: number
  creationDate: string
}

export interface GetAdminSubscriptionUsageParams {
  page: number
  pageSize: number
  sortFilter?: AdminSubscriptionUsageSortFilter[]
  searchFilter?: AdminSubscriptionUsageSearchFilter[]
  userId?: number | string | null
  featureCode?: string | null
  identifierId?: number | string | null
  fromDate?: string | null
  toDate?: string | null
}

export interface AdminSubscriptionUsageAggregateDTO {
  featureId: number
  featureCode: string
  featureName: string
  totalAmount: number
  eventCount: number
  distinctUserCount: number
}

export interface GetAdminSubscriptionUsageAggregateParams {
  userId?: number | string | null
  fromDate?: string | null
  toDate?: string | null
}
