<template>
  <div class="w-100 d-flex flex-column flex-sm-row flex-wrap justify-center justify-sm-space-between align-center align-sm-end ga-4 ga-sm-2 mt-12">
    <template
      v-for="plan in plans"
      :key="plan.subscriptionPlanId"
    >
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
          v-if="plan.prices && plan.prices.length > 0"
          class="mb-4"
        >
          <span><span class="text-h6 text-md-h4 text-grey400 mt-2">$</span><sub class="text-h4 text-md-h2 font-weight-bold">
            {{ plan.prices[0]?.price }}</sub></span>
        </div>

        <!-- Features -->
        <ul class="features text-left mb-6 pa-0">
          <template
            v-for="(featureGroup, groupIndex) in plan.featureGroups"
            :key="groupIndex"
          >
            <li
              v-for="feature in featureGroup.features"
              :key="`${groupIndex}-${feature.featureId}`"
              class="d-flex align-center mb-2 text-h6 text-md-h5"
            >
              <v-icon
                size="18"
                class="mr-2"
                color="success"
              >
                md:check
              </v-icon>
              {{ featureGroup.limit || 'Unlimited' }} {{ feature.featureName }}
            </li>
          </template>
        </ul>

        <!-- Button -->
        <v-btn
          class="text-h6 text-md-h5 font-weight-bold"
          :color="plan.highlight ? 'primary' : 'grey300'"
          block
          size="large"
          :loading="loadingPayment"
          @click="pay(plan)"
        >
          Pay with Stripe
        </v-btn>
      </v-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { UpgradeSuggestionsDTO, PaymentCurrency, PaymentGateway } from '@/types'

interface IPaymentModal {
  plans: UpgradeSuggestionsDTO[]
  loading?: boolean
}
withDefaults(defineProps<IPaymentModal>(),
  {
    loading: false,
  })

const route = useRoute()
const { trackPayment } = useGtmEvents()
const { startPayment, loadingPayment, savePathRedirect } = usePayment()

const pay = async (plan: UpgradeSuggestionsDTO) => {
  trackPayment({
    route: route.fullPath,
  })
  if (plan.prices && plan.prices.length > 0) {
    const price = plan.prices[0]
    if (price) {
      const payload = {
        amount: price.price,
        currency: price.currency as PaymentCurrency,
        gateway: 'Stripe' as PaymentGateway,
        title: 'Gamatrain Usage Invoice',
        description: 'One-time charge for use of the Gamatrain e-learning platform. Payment grants access to platform features and learning materials.',
      }
      const response = await startPayment(payload)
      if (response.succeeded && response.data && response.data.url) {
        savePathRedirect(route.fullPath)
        window.location.href = response.data.url
      }
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
