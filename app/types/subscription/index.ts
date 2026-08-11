import type { PaymentGateway, UpgradeSuggestionsDTO } from '@/types'

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

export interface AdminSubscriptionPlanFeatureGroupDTO {
  features: AdminSubscriptionPlanFeatureDTO[]
  limit: number | null
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
    limit: number | null
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
  plans: UpgradeSuggestionsDTO[]
  availableBillingIntervals: BillingInterval[]
}

export interface SubscriptionPlanDTO {
  id: number
  title: string
  highlight: boolean
  prices: AdminSubscriptionPlanPriceDTO[]
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
}

export interface FeatureGroupUserSubscriptionDTO {
  features: AdminSubscriptionPlanFeatureDTO[]
  limit: number | null
  used: number
  remaining: number | null
  description: string
}
