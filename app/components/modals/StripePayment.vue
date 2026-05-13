<template>
  <v-card
    :class="`plan-card border-solid border-sm border-grey600 mt-4 mr-2 mb-2 px-3 py-6 pa-md-6 text-center ${plan.popular ? `bg-grey900`:``}`"
  >
    <!-- Badge -->
    <v-chip
      v-if="plan.popular"
      color="primary"
      class="mb-3 text-h5 font-weight-bold"
    >
      Most Popular
    </v-chip>

    <!-- Name -->
    <div class="text-h6 text-md-h4 font-weight-bold mb-2 text-primary">
      {{ plan.name }}
    </div>

    <!-- Price -->
    <div class="mb-4">
      <span><span class="text-h6 text-md-h4 text-grey400 mt-2">$</span><sub class="text-h4 text-md-h2 font-weight-bold">{{ plan.price }}</sub></span>
    </div>

    <!-- Features -->
    <ul class="features text-left mb-6 pa-0">
      <li
        v-for="(feature, i) in plan.features"
        :key="i"
        class="d-flex align-center mb-2 text-h6 text-md-h5"
      >
        <v-icon
          size="18"
          class="mr-2"
          color="success"
        >
          md:check
        </v-icon>
        {{ feature }}
      </li>
    </ul>

    <!-- Button -->
    <v-btn
      class="text-h6 text-md-h5 font-weight-bold"
      :color="plan.popular ? 'primary' : 'grey300'"
      block
      size="large"
      :loading="loadingPayment"
      @click="pay(plan.price)"
    >
      Pay with Stripe
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import type { PaymentCurrency, PaymentGateway } from '@/types'

defineProps<{
  plan: {
    id?: number
    name?: string
    price: number
    popular: boolean
    cta?: string
    features?: Array<string>
  }
}>()
const { $toast } = useNuxtApp()
const route = useRoute()
const { trackPayment } = useGtmEvents()
const { startPayment, loadingPayment, savePathRedirect } = usePayment()

const minAmount = 2
const currency: PaymentCurrency = 'USDC'
const gateway: PaymentGateway = 'Stripe'

const pay = async (amount: number) => {
  if (amount < minAmount) {
    $toast.error(`Minimum amount is $${minAmount}`)
    return
  }
  trackPayment({
    route: route.fullPath,
  })
  const payload = {
    amount: amount,
    currency,
    gateway,
    title: 'Gamatrain Usage Invoice',
    description: 'One-time charge for use of the Gamatrain e-learning platform. Payment grants access to platform features and learning materials.',
  }
  const response = await startPayment(payload)
  console.log(response)
  if (response.succeeded && response.data && response.data.url) {
    savePathRedirect(route.fullPath)
    window.location.href = response.data.url
  }
}
</script>

<style scoped>
.plan-card {
  height : fit-content;
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
</style>
