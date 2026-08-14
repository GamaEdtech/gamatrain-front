<template>
  <v-card
    :class="`plan-card border-solid border-sm border-grey600 pa-4 pa-md-5 position-relative ${isCurrentPlan ? `plan-card--current` : ``} ${plan.highlight ? `plan-card--highlight` : ``}`"
    @click="selectPlan"
  >
    <!-- Price panel -->
    <div class="price-panel rounded-lg pa-4 mb-4 text-left">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-h6 text-md-h4 font-weight-bold text-grey700">
          {{ plan.title }}
        </span>
        <div
          v-if="plan.highlight"
          class="popular-badge d-flex align-center ga-1 px-2 py-1 rounded-pill bg-white flex-shrink-0"
        >
          <v-icon
            size="14"
            color="success"
          >
            md:favorite
          </v-icon>
          <span class="text-h6 font-weight-bold text-success">Popular</span>
        </div>
      </div>

      <div class="d-flex align-center justify-space-between">
        <div class="d-flex flex-column">
          <div
            v-if="selectedPrice"
            class="d-flex align-baseline flex-wrap ga-2"
          >
            <span
              v-if="strikeThroughMonthlyPrice"
              class="text-h6 text-md-h5 text-grey400 text-decoration-line-through"
            >
              ${{ formatPrice(strikeThroughMonthlyPrice) }}
            </span>
            <span>
              <span class="text-h6 text-md-h4 text-grey400 mt-2">$</span><sub class="text-h4 text-md-h2 font-weight-bold">
                {{ formatPrice(displayMonthlyPrice) }}</sub><span class="text-h6 text-grey400">/mo</span>
            </span>
          </div>
          <div
            v-if="selectedPrice && billingInterval !== 'Monthly'"
            class="text-h6 text-grey400"
          >
            billed ${{ formatPrice(selectedPrice.price) }} {{ billingSuffix[billingInterval] }}
          </div>
        </div>

        <v-icon
          v-if="selectedPrice"
          size="36"
          color="grey900"
          class="diamond-icon flex-shrink-0"
        >
          md:diamond
        </v-icon>
      </div>
    </div>

    <!-- Features -->
    <ul class="features text-left mb-6 pa-0">
      <template
        v-for="(featureGroup, groupIndex) in featureGroups"
        :key="groupIndex"
      >
        <li
          class="d-flex align-center mb-2 text-h6 text-md-h5"
        >
          <v-icon
            size="18"
            class="mr-2 flex-shrink-0"
            color="success"
          >
            md:check
          </v-icon>
          {{ formatGroupLimit(featureGroup) }} {{ featureGroup.description }}
        </li>
      </template>
    </ul>

    <!-- Button -->
    <v-btn
      class="text-h6 text-md-h5 font-weight-bold"
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
  </v-card>
</template>

<script setup lang="ts">
import type {
  AdminSubscriptionPlanFeatureGroupDTO,
  BillingInterval,
  PaymentGateway,
  SubscriptionPlanDTO,
  UpgradeSuggestionsDTO,
  UpgradeSuggestionsFeatureGroup,
} from '@/types'

interface ICard {
  // subscriptions/plans ("buy a plan") sends one featureGroups list per plan, each group carrying a limit
  // per billing interval; a download's upgrade suggestion carries featureGroups per price entry instead,
  // already resolved to that one interval's flat limit.
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

// Only shown when this interval is genuinely cheaper per month than the plan's own Monthly price, so the
// discount from committing to a longer interval is legible (not just "$5/mo" with no reference point).
const strikeThroughMonthlyPrice = computed(() => {
  if (!selectedPrice.value) return null
  const discount = discountPercent(selectedPrice.value.price, props.billingInterval, monthlyPrice.value)
  return discount === null ? null : monthlyPrice.value
})

const featureGroups = computed(() => {
  return 'featureGroups' in props.plan ? props.plan.featureGroups : selectedPrice.value?.featureGroups ?? []
})

const resolveGroupLimit = (group: AdminSubscriptionPlanFeatureGroupDTO | UpgradeSuggestionsFeatureGroup) => {
  if ('limits' in group) {
    return group.limits.find(limit => limit.billingInterval === props.billingInterval)?.limit ?? null
  }

  return group.limit
}

const formatPrice = (value: number) => {
  return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2)
}

const formatGroupLimit = (group: AdminSubscriptionPlanFeatureGroupDTO | UpgradeSuggestionsFeatureGroup) => {
  const limit = resolveGroupLimit(group)
  return limit === null ? 'Unlimited' : formatPrice(limit)
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
  height : fit-content;
  width : 30%;
  border-radius: 20px;
  transition: all 0.25s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  cursor: pointer;
  background: rgb(var(--v-theme-white));
}
.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}
.plan-card--highlight {
  border: 2px solid rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.12);
}
.plan-card--current {
  opacity: 0.7;
  cursor: default;
}
.plan-card--current:hover {
  transform: none;
  box-shadow: none;
}

.popular-badge {
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

/* Per-tier tint, matching the 3 pastel gradients from the Figma cards (blue / purple / amber) - rotates
   by card position rather than plan data, since the design ties it to slot order, not a plan attribute. */
.price-panel {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, rgb(var(--v-theme-grey100)) 100%);
}
.plan-card:nth-of-type(3n+1) .price-panel {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #e7eefb 100%);
}
.plan-card:nth-of-type(3n+2) .price-panel {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #f1e6f6 100%);
}
.plan-card:nth-of-type(3n+3) .price-panel {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #f7f1e1 100%);
}

.diamond-icon {
  opacity: 0.35;
}

.features {
  list-style: none;
}
@media screen and (max-width: 600px) {
 .plan-card {
   width : 100%;
   max-width : 220px;
 }
}
</style>
