<template>
  <v-card
    :class="`plan-card border-solid border-sm border-grey600 px-3 py-6 pa-md-6 text-center ${plan.highlight ? `bg-grey900`:``}`"
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
      class="mb-4"
    >
      <span><span class="text-h6 text-md-h4 text-grey400 mt-2">$</span><sub class="text-h4 text-md-h2 font-weight-bold">
        {{ selectedPrice.price }}</sub></span>
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
            class="mr-2"
            color="success"
          >
            md:check
          </v-icon>
          {{ resolveGroupLimit(featureGroup) ?? 'Unlimited' }} {{ featureGroup.description }}
        </li>
      </template>
    </ul>

    <!-- Button -->
    <v-btn
      class="text-h6 text-md-h5 font-weight-bold"
      :color="plan.highlight ? 'primary' : 'grey300'"
      block
      size="large"
      :loading="loadingStartPaymentSubscription"
      @click="pay"
    >
      Pay with Stripe
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
}

const props = defineProps<ICard>()

const route = useRoute()
const { trackPayment } = useGtmEvents()
const { savePathRedirect } = usePayment()
const { startPaymentSubscription, loadingStartPaymentSubscription } = useSubscription()

const selectedPrice = computed(() => {
  return props.plan.prices.find(price => price.billingInterval === props.billingInterval)
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
</script>

<style scoped>
.plan-card {
  height : fit-content;
  width : 30%;
  border-radius: 16px;
  transition: all 0.25s ease;
}
.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
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
