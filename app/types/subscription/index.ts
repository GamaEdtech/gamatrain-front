export type BillingInterval = 'Daily' | 'Weekly' | 'Monthly' | 'Seasonally' | 'Yearly'

export interface SubscriptionPolygonPointDTO {
  latitude: number
  longitude: number
}

export interface AdminSubscriptionPlanPriceDTO {
  id: number
  subscriptionPlanId: number
  countryCode: string
  currency: string
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
