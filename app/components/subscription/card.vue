<template>
  <div :class="`d-flex flex-column align-center justify-start plan-card rounded-xl pa-3 pa-md-4 elevation-3 ${plan.highlight ? `hightlight-card`:`simple-card`} ${isCurrentPlan ? `disabled-card`:``}`">
    <div class="price-div w-100 d-flex flex-column aligh-start justify-start pa-3 pa-md-4 rounded-lg">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-h6 text-md-h4 font-weight-bold text-grey700">
          {{ plan.title }}
        </span>
        <v-chip
          v-if="plan.highlight"
          color="success"
          variant="tonal"
          size="small"
          prepend-icon="md:favorite"
          class="font-weight-bold flex-shrink-0"
        >
          Popular
        </v-chip>
      </div>
      <span
        v-if="strikeThroughMonthlyPrice"
        class="text-h6 text-md-h5 text-grey400 text-decoration-line-through"
      >
        ${{ formatPrice(strikeThroughMonthlyPrice) }}
      </span>
      <div
        v-if="selectedPrice"
        class="d-flex align-center justify-space-between mt-2"
      >
        <div class="d-flex align-center">
          <span class="text-h6 text-md-h4 text-grey400">$</span>
          <span class="text-h4 text-md-h2 font-weight-bold">
            {{ formatPrice(displayMonthlyPrice) }}</span>
          <span class="text-h6 text-grey400">/mo</span>
        </div>

        <v-icon
          size="36"
          color="grey400"
        >
          md:diamond
        </v-icon>
      </div>
      <div
        v-if="selectedPrice && billingInterval !== 'Monthly'"
        class="text-h6 text-grey400 mt-1"
      >
        billed ${{ formatPrice(selectedPrice.price) }} {{ billingSuffix[billingInterval] }}
      </div>
    </div>
    <span
      v-if="gemsBalance !== null"
      class="w-100 d-flex align-center jusify-start mt-2 text-h5 font-weight-bold text-grey900"
    >
      <v-icon
        size="20"
        class="mr-2"
        color="primary"
      >
        md:diamond
      </v-icon>
      {{ formatPrice(gemsBalance) }} Gems
    </span>

    <ul class="features text-left mt-4 pa-0">
      <li
        v-for="(featureGroup, groupIndex) in featureGroups"
        :key="groupIndex"
        class="d-flex align-center mb-2 text-h6 text-md-h5"
      >
        <v-icon
          size="18"
          class="mr-2 flex-shrink-0"
          color="success"
        >
          md:check
        </v-icon>
        {{ formatFeatureLine(featureGroup) }}
      </li>
    </ul>

    <v-btn
      class="text-h6 text-md-h5 font-weight-bold mt-6 rounded-lg"
      :color="isCurrentPlan ? `grey300` : `grey900`"
      variant="flat"
      block
      size="large"
      :disabled="isCurrentPlan"
      :loading="loadingStartPaymentSubscription"
      @click.stop="selectPlan"
    >
      {{ ctaLabel }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  ActiveSubscriptionPlanPriceDTO,
  AdminSubscriptionPlanFeatureGroupDTO,
  BillingInterval,
  PaymentGateway,
  SubscriptionPlanDTO,
  UpgradeSuggestionsDTO,
  UpgradeSuggestionsFeatureGroup,
  UpgradeSuggestionsPrice,
} from '@/types'

interface ICard {
  plan: SubscriptionPlanDTO | UpgradeSuggestionsDTO
  billingInterval: BillingInterval
  isCurrentPlan: boolean
}

const props = defineProps<ICard>()

const route = useRoute()
const { trackPayment } = useGtmEvents()
const { savePathRedirect } = usePayment()
const { startPaymentSubscription, loadingStartPaymentSubscription } = useSubscription()
const { monthlyEquivalentPrice, discountPercent } = useBillingIntervalPricing()

const billingSuffix: Record<BillingInterval, string> = {
  Daily: 'per day',
  Weekly: 'per week',
  Monthly: 'per month',
  Seasonally: 'every 3 months',
  Yearly: 'per year',
}

type PlanPrice = ActiveSubscriptionPlanPriceDTO | UpgradeSuggestionsPrice
type FeatureGroup = AdminSubscriptionPlanFeatureGroupDTO | UpgradeSuggestionsFeatureGroup

const isUpgradeSuggestionsPlan = (plan: SubscriptionPlanDTO | UpgradeSuggestionsDTO): plan is UpgradeSuggestionsDTO => {
  return !('featureGroups' in plan)
}

const isUpgradeSuggestionsPrice = (price: PlanPrice): price is UpgradeSuggestionsPrice => {
  return 'featureGroups' in price
}

const selectedPrice = computed(() => {
  return props.plan.prices.find(price => price.billingInterval === props.billingInterval)
})

const monthlyPrice = computed(() => {
  return props.plan.prices.find(price => price.billingInterval === 'Monthly')?.price ?? null
})

const displayMonthlyPrice = computed(() => {
  if (!selectedPrice.value) return 0
  return monthlyEquivalentPrice(selectedPrice.value.price, props.billingInterval)
})

const strikeThroughMonthlyPrice = computed(() => {
  if (!selectedPrice.value) return null
  const discount = discountPercent(selectedPrice.value.price, props.billingInterval, monthlyPrice.value)
  return discount === null ? null : monthlyPrice.value
})

const featureGroups = computed<FeatureGroup[]>(() => {
  if (!isUpgradeSuggestionsPlan(props.plan)) {
    return props.plan.featureGroups
  }

  return selectedPrice.value && isUpgradeSuggestionsPrice(selectedPrice.value)
    ? selectedPrice.value.featureGroups
    : []
})

const resolveGroupLimit = (group: FeatureGroup) => {
  if ('limits' in group) {
    return group.limits.find(limit => limit.billingInterval === props.billingInterval)?.limit ?? null
  }

  return group.limit
}

const gemsBalance = computed(() => {
  const limits = featureGroups.value
    .map(group => resolveGroupLimit(group))
    .filter((limit): limit is number => limit !== null)

  return limits.length > 0 ? limits.reduce((total, limit) => total + limit, 0) : null
})

const formatPrice = (value: number) => {
  return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2)
}

const formatFeatureLine = (group: FeatureGroup) => {
  const limit = resolveGroupLimit(group)
  return limit === null ? `Unlimited ${group.description}` : `Use Gems for ${group.description}`
}

const ctaLabel = computed(() => props.isCurrentPlan ? 'Current Plan' : 'Choose Plan')

const selectPlan = async () => {
  if (props.isCurrentPlan) return

  trackPayment({
    route: route.fullPath,
  })

  if (!selectedPrice.value) return

  const payload = {
    gateway: 'Stripe' as PaymentGateway,
    billingInterval: props.billingInterval,
  }
  const response = await startPaymentSubscription(payload, props.plan.id)
  if (response.succeeded && response.data && response.data.url) {
    savePathRedirect(route.fullPath)
    window.location.href = response.data.url
  }
}
</script>

<style scoped>
.plan-card {
  width: 30%;
  height : fit-content;
  min-height : 300px;
  cursor: pointer;
  transition: all 0.5s;
}
.plan-card:hover{
  background-color : rgb(var(--v-theme-grey100));
}
.disabled-card{
  opacity: 0.6;
  cursor: not-allowed;
}
.hightlight-card{
  border : 2px solid rgb(var(--v-theme-primary));
}
.simple-card{
  border : 2px solid rgb(var(--v-theme-grey300));
}
.features {
  list-style: none;
}

.price-div {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, rgb(var(--v-theme-grey100)) 100%);
}
.plan-card:nth-of-type(3n+1) .price-div {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #e7eefb 100%);
}
.plan-card:nth-of-type(3n+2) .price-div {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #f1e6f6 100%);
}
.plan-card:nth-of-type(3n+3) .price-div {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #f7f1e1 100%);
}

@media screen and (max-width: 600px) {
 .plan-card {
   width : 100% !important;
   max-width : 220px;
 }
}
</style>
