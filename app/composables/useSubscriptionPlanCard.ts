import type {
  ActiveSubscriptionPlanPriceDTO,
  AdminSubscriptionPlanFeatureGroupDTO,
  BillingInterval,
  SubscriptionPlanDTO,
  UpgradeSuggestionsDTO,
  UpgradeSuggestionsFeatureGroup,
  UpgradeSuggestionsPrice,
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
  currentPlanId?: number | null
  currentBillingInterval?: BillingInterval | null
  hasActiveSubscription?: boolean
}

const billingSuffix: Record<BillingInterval, string> = {
  Daily: 'per day',
  Weekly: 'per week',
  Monthly: 'per month',
  Quarterly: 'every 3 months',
  Annual: 'per year',
}

const isUpgradeSuggestionsPlan = (
  plan: SubscriptionPlanDTO | UpgradeSuggestionsDTO,
): plan is UpgradeSuggestionsDTO => {
  return !('featureGroups' in plan)
}

const isUpgradeSuggestionsPrice = (price: PlanPrice): price is UpgradeSuggestionsPrice => {
  return 'featureGroups' in price
}

const isCurrentSuggestionPrice = (price: PlanPrice) => {
  return isUpgradeSuggestionsPrice(price) && price.isCurrent
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
    currentPlanId,
    currentBillingInterval,
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
    const currentSuggestionPrice = plan.prices.find(isCurrentSuggestionPrice)
    const resolvedCurrentPlanId = currentPlanId ?? (currentSuggestionPrice ? plan.id : null)
    const resolvedCurrentBillingInterval = currentBillingInterval ?? currentSuggestionPrice?.billingInterval ?? null
    const isUpgradeSuggestionCard = selectedPrice ? isUpgradeSuggestionsPrice(selectedPrice) : false
    const suggestionCanUpgrade = selectedPrice && 'canUpgrade' in selectedPrice ? selectedPrice.canUpgrade : true
    const suggestionIsCurrent = selectedPrice ? isCurrentSuggestionPrice(selectedPrice) : false
    const fallbackIsCurrent = resolvedCurrentPlanId === plan.id && resolvedCurrentBillingInterval === billingInterval
    const isCurrentPlan = suggestionIsCurrent || fallbackIsCurrent
    const isSamePlanIntervalMove = resolvedCurrentPlanId === plan.id && !isCurrentPlan && !suggestionIsCurrent
    const shouldSwitchPlan = hasActiveSubscription || (isUpgradeSuggestionCard && suggestionCanUpgrade)
    const isDisabled = isCurrentPlan || suggestionIsCurrent || !suggestionCanUpgrade

    let action: SubscriptionPlanCardViewModel['action']

    if (isCurrentPlan) {
      action = { type: 'current', label: 'Current Plan', disabled: true }
    }
    else if (!suggestionCanUpgrade) {
      action = { type: 'locked', label: 'Not an Upgrade', disabled: true }
    }
    else if (isSamePlanIntervalMove) {
      action = { type: 'switch', label: `Switch to ${billingInterval}`, disabled: isDisabled }
    }
    else if (shouldSwitchPlan) {
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
