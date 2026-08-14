<template>
  <v-card
    :class="`plan-card border-solid px-3 py-6 pa-md-6 text-center position-relative ${plan.highlight ? `bg-grey900` : ``} ${selected ? `plan-card--selected` : `border-sm border-grey600`}`"
    @click="selectPlan"
  >
    <!-- Badge -->
    <v-chip
      v-if="plan.highlight"
      color="primary"
      class="mb-3 text-h5 font-weight-bold"
    >
      Most Popular
    </v-chip>

    <!-- Name -->
    <div class="text-h6 text-md-h4 font-weight-bold mb-2 text-primary">
      {{ plan.title }}
    </div>

    <!-- Price -->
    <div
      v-if="selectedPrice"
      class="mb-1 d-flex align-baseline justify-center flex-wrap ga-2"
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
      class="mb-4 text-h6 text-grey400"
    >
      billed ${{ formatPrice(selectedPrice.price) }} {{ billingSuffix[billingInterval] }}
    </div>
    <div
      v-else
      class="mb-4"
    />

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
            class="mr-2"
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
      :color="isCurrentPlan ? `grey300` : `primary`"
      :variant="ctaVariant"
      block
      size="large"
      :disabled="isCurrentPlan"
      :loading="selected && loadingStartPaymentSubscription"
      @click.stop="onCtaClick"
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
  selected: boolean
  isCurrentPlan: boolean
}

const props = defineProps<ICard>()
const emit = defineEmits<{ select: [id: number] }>()

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

const ctaLabel = computed(() => {
  if (props.isCurrentPlan) return 'Current Plan'
  return props.selected ? 'Continue' : 'Choose Plan'
})

const ctaVariant = computed(() => {
  if (props.isCurrentPlan) return 'flat'
  return props.selected ? 'flat' : 'outlined'
})

const selectPlan = () => {
  if (props.isCurrentPlan) return
  emit('select', props.plan.id)
}

const pay = async () => {
  trackPayment({
    route: route.fullPath,
  })
  if (selectedPrice.value) {
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
}

const onCtaClick = () => {
  if (props.isCurrentPlan) return
  if (!props.selected) {
    emit('select', props.plan.id)
    return
  }
  pay()
}
</script>

<style scoped>
.plan-card {
  height : fit-content;
  width : 30%;
  border-radius: 16px;
  transition: all 0.25s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  cursor: pointer;
}
.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}
.plan-card--selected {
  border: 2px solid rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.15);
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
