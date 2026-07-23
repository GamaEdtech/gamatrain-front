export type BillingInterval = 'Daily' | 'Weekly' | 'Monthly' | 'Seasonally' | 'Yearly'
export type SubscriptionCurrency = 'SOL' | 'USDC' | 'GET' | 'USDT' | 'USD'

export interface SubscriptionPolygonPointDTO {
  latitude: number
  longitude: number
}

export interface AdminSubscriptionPlanPriceDTO {
  id: number
  subscriptionPlanId: number
  countryCode: string
  currency: SubscriptionCurrency
  currencySymbol: string
  price: number
}

export interface AdminSubscriptionPlanFeatureDTO {
  featureId: number
  featureCode: string
  featureName: string
  limit: number
}

export interface AdminSubscriptionPlanDTO {
  id: number
  title: string
  polygon: SubscriptionPolygonPointDTO[]
  isActive: boolean
  highlight: boolean
  billingInterval: BillingInterval
  prices: AdminSubscriptionPlanPriceDTO[]
  features: AdminSubscriptionPlanFeatureDTO[]
}

export interface AddAdminSubscriptionPlanDTO {
  title: string
  polygon: SubscriptionPolygonPointDTO[]
  isActive: boolean
  highlight: boolean
  billingInterval: BillingInterval
}

export interface GetAdminSubscriptionPlanParams {
  page: number
  pageSize: number
}

export interface EditAdminSubscriptionPlanFeaturesDTO {
  features: {
    featureId: number
    limit: number
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
  countryCode: string
  currency: SubscriptionCurrency
  currencySymbol: string
  price: number
}

export interface AddAdminSubscriptionPriceDTO {
  subscriptionPlanId: number
  countryCode: string
  currency: SubscriptionCurrency
  price: number
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
