<template>
  <v-card
    class="plan-card mt-4 pa-6 text-center"
    :class="{ 'bg-grey-darken-4': plan.popular }"
  >
    <!-- Badge -->
    <v-chip
      v-if="plan.popular"
      color="primary"
      class="mb-3 text-h5 font-weight-bold "
    >
      Most Popular
    </v-chip>

    <!-- Name -->
    <div class="text-h4 font-weight-bold mb-2 text-primary">
      {{ plan.name }}
    </div>

    <!-- Price -->
    <div class=" mb-4">
      <span><span class="text-h4 text-grey">$</span><sub class="text-h2 font-weight-bold">{{ plan.price }}</sub></span>
    </div>

    <!-- Features -->
    <ul class="features mb-6">
      <li
        v-for="(feature, i) in plan.features"
        :key="i"
      >
        <v-icon
          size="18"
          class="mr-2"
          color="success"
        >
          mdi-check
        </v-icon>
        {{ feature }}
      </li>
    </ul>

    <!-- Button -->
    <v-btn
      class="text-h5 font-weight-bold"
      :color="plan.popular ? 'primary' : 'grey-darken-1'"
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
import type { PaymentCurrency, PaymentGateway } from '~/types/api'
import { usePayment } from '../../composables/api/usePayment'

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
const { startPayment, loadingPayment, savePathRedirect } = usePayment()

const minAmount = 2
const currency: PaymentCurrency = 'USDC'
const gateway: PaymentGateway = 'Stripe'

const pay = async (amount: number) => {
  if (amount < minAmount) {
    $toast.error(`Minimum amount is $${minAmount}`)
    return
  }
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
    .border-primary {
    border: 2px solid #1976d2;
    }

    .plan-card {
  border-radius: 16px;
  transition: all 0.25s ease;
  border: 1px solid #eee;
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.features {
  list-style: none;
  padding: 0;
  text-align: left;
}

.features li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
  </style>
