import type {
  ActiveSubscriptionPlanPriceDTO,
  AdminSubscriptionPlanFeatureGroupDTO,
  BillingInterval,
  SubscriptionPlanDTO,
  UpgradeSuggestionsDTO,
  UpgradeSuggestionsFeatureGroup,
  UpgradeSuggestionsPrice,
  UserSubscriptionDTO,
} from '@/types'

type PlanPrice = ActiveSubscriptionPlanPriceDTO | UpgradeSuggestionsPrice
type FeatureGroup = AdminSubscriptionPlanFeatureGroupDTO | UpgradeSuggestionsFeatureGroup

export type SubscriptionPlanCardActionType = 'choose' | 'switch' | 'current' | 'locked'

export interface SubscriptionPlanCardViewModel {
  id: number
  title: string
  highlight: boolean
  selectedPrice: PlanPrice | undefined
  displayMonthlyPrice: number
  strikeThroughMonthlyPrice: number | null
  featureGroups: FeatureGroup[]
  featureLines: string[]
  gemsBalance: number | null
  isSamePlanIntervalMove: boolean
  action: {
    type: SubscriptionPlanCardActionType
    label: string
    disabled: boolean
  }
  rawPlan: SubscriptionPlanDTO | UpgradeSuggestionsDTO
}

interface BuildSubscriptionPlanCardParams {
  plan: SubscriptionPlanDTO | UpgradeSuggestionsDTO
  billingInterval: BillingInterval
  userSubscription: UserSubscriptionDTO | null | undefined
  isCurrentPlan: boolean
  hasActiveSubscription: boolean
}

const billingSuffix: Record<BillingInterval, string> = {
  Daily: 'per day',
  Weekly: 'per week',
  Monthly: 'per month',
  Seasonally: 'every 3 months',
  Yearly: 'per year',
}

const isUpgradeSuggestionsPlan = (
  plan: SubscriptionPlanDTO | UpgradeSuggestionsDTO,
): plan is UpgradeSuggestionsDTO => {
  return !('featureGroups' in plan)
}

const isUpgradeSuggestionsPrice = (price: PlanPrice): price is UpgradeSuggestionsPrice => {
  return 'featureGroups' in price
}

const resolveGroupLimit = (group: FeatureGroup, billingInterval: BillingInterval) => {
  if ('limits' in group) {
    return group.limits.find(limit => limit.billingInterval === billingInterval)?.limit ?? null
  }

  return group.limit
}

export const formatSubscriptionPlanCardPrice = (value: number) => {
  return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2)
}

export const formatSubscriptionPlanFeatureLine = (
  group: FeatureGroup,
  billingInterval: BillingInterval,
) => {
  const limit = resolveGroupLimit(group, billingInterval)
  return limit === null ? `Unlimited ${group.description}` : `Use Gems for ${group.description}`
}

export const useSubscriptionPlanCard = () => {
  const { monthlyEquivalentPrice, discountPercent } = useBillingIntervalPricing()

  const buildSubscriptionPlanCard = ({
    plan,
    billingInterval,
    userSubscription,
    isCurrentPlan,
    hasActiveSubscription,
  }: BuildSubscriptionPlanCardParams): SubscriptionPlanCardViewModel => {
    const selectedPrice = plan.prices.find(price => price.billingInterval === billingInterval)
    const monthlyPrice = plan.prices.find(price => price.billingInterval === 'Monthly')?.price ?? null
    const displayMonthlyPrice = selectedPrice
      ? isUpgradeSuggestionsPrice(selectedPrice)
        ? selectedPrice.monthlyEquivalentPrice
        : monthlyEquivalentPrice(selectedPrice.price, billingInterval)
      : 0
    const planDiscountPercent = selectedPrice
      ? isUpgradeSuggestionsPrice(selectedPrice)
        ? selectedPrice.discountPercent
        : discountPercent(selectedPrice.price, billingInterval, monthlyPrice)
      : null
    const strikeThroughMonthlyPrice = planDiscountPercent === null ? null : monthlyPrice
    const featureGroups = !isUpgradeSuggestionsPlan(plan)
      ? plan.featureGroups
      : selectedPrice && isUpgradeSuggestionsPrice(selectedPrice)
        ? selectedPrice.featureGroups
        : []
    const limits = featureGroups
      .map(group => resolveGroupLimit(group, billingInterval))
      .filter((limit): limit is number => limit !== null)
    const suggestionCanUpgrade = selectedPrice && 'canUpgrade' in selectedPrice ? selectedPrice.canUpgrade : true
    const suggestionIsCurrent = selectedPrice && 'isCurrent' in selectedPrice ? selectedPrice.isCurrent : false
    const isSamePlanIntervalMove = userSubscription?.status === 'Active'
      && userSubscription.subscriptionPlanId === plan.id
    const isDisabled = isCurrentPlan || suggestionIsCurrent || !suggestionCanUpgrade

    let action: SubscriptionPlanCardViewModel['action']

    if (isCurrentPlan || suggestionIsCurrent) {
      action = { type: 'current', label: 'Current Plan', disabled: true }
    }
    else if (!suggestionCanUpgrade) {
      action = { type: 'locked', label: 'Not an Upgrade', disabled: true }
    }
    else if (isSamePlanIntervalMove) {
      action = { type: 'switch', label: `Switch to ${billingInterval}`, disabled: isDisabled }
    }
    else if (hasActiveSubscription) {
      action = { type: 'switch', label: 'Switch Plan', disabled: isDisabled }
    }
    else {
      action = { type: 'choose', label: 'Choose Plan', disabled: isDisabled }
    }

    return {
      id: plan.id,
      title: plan.title,
      highlight: plan.highlight,
      selectedPrice,
      displayMonthlyPrice,
      strikeThroughMonthlyPrice,
      featureGroups,
      featureLines: featureGroups.map(group => formatSubscriptionPlanFeatureLine(group, billingInterval)),
      gemsBalance: limits.length > 0 ? limits.reduce((total, limit) => total + limit, 0) : null,
      isSamePlanIntervalMove,
      action,
      rawPlan: plan,
    }
  }

  return {
    billingSuffix,
    buildSubscriptionPlanCard,
    formatSubscriptionPlanCardPrice,
    formatSubscriptionPlanFeatureLine,
  }
}
