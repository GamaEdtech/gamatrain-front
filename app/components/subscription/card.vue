<template>
  <div :class="`d-flex flex-column align-center justify-space-between plan-card rounded-xl pa-3 pa-md-4 elevation-3 ${card.highlight ? `hightlight-card`:`simple-card`} ${card.action.disabled ? `disabled-card`:``}`">
    <div class="price-div w-100 d-flex flex-column aligh-start justify-start pa-3 pa-md-4 rounded-lg">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-h6 text-md-h4 font-weight-bold text-grey700">
          {{ card.title }}
        </span>
        <v-chip
          v-if="card.highlight"
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
        v-if="card.strikeThroughMonthlyPrice"
        class="text-h6 text-md-h5 text-grey400 text-decoration-line-through"
      >
        ${{ formatPrice(card.strikeThroughMonthlyPrice) }}
      </span>
      <div
        v-if="card.selectedPrice"
        class="d-flex align-center justify-space-between mt-2"
      >
        <div class="d-flex align-center">
          <span class="text-h6 text-md-h4 text-grey400">$</span>
          <span class="text-h4 text-md-h2 font-weight-bold">
            {{ formatPrice(card.displayMonthlyPrice) }}</span>
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
        v-if="card.selectedPrice && billingInterval !== 'Monthly'"
        class="text-h6 text-grey400 mt-1"
      >
        billed ${{ formatPrice(card.selectedPrice.price) }} {{ billingSuffix[billingInterval] }}
      </div>
    </div>
    <span
      v-if="card.gemsBalance !== null"
      class="w-100 d-flex align-center jusify-start mt-2 text-h5 font-weight-bold text-grey900"
    >
      <v-icon
        size="20"
        class="mr-2"
        color="primary"
      >
        md:diamond
      </v-icon>
      {{ formatPrice(card.gemsBalance) }} Gems
    </span>

    <ul class="features text-left mt-4 pa-0">
      <li
        v-for="(featureLine, groupIndex) in card.featureLines"
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
        {{ featureLine }}
      </li>
    </ul>

    <v-btn
      class="w-100 text-h6 text-md-h5 font-weight-bold mt-6 rounded-lg"
      :color="card.action.disabled ? `grey300` : `grey900`"
      variant="flat"
      height="44"
      :disabled="card.action.disabled"
      :loading="loadingStartPaymentSubscription"
    >
      {{ card.action.label }}
    </v-btn>

    <!-- <common-modal-base
      v-model:show-dialog="showConfirmUpgrade"
      :title="card.isSamePlanIntervalMove ? `Switch to ${billingInterval} billing?` : `Switch to ${card.title}?`"
      :max-width="480"
    >
      <user-subscription-modals-confirm
        :text="confirmUpgradeText"
        confirm-color="primary"
        :loading="loadingStartPaymentSubscription"
        @back="showConfirmUpgrade = false"
        @confirm="confirmUpgrade"
      />
    </common-modal-base> -->
  </div>
</template>

<script setup lang="ts">
import type {
  BillingInterval,
  // PayloadPaymentSubscriptionDTO,
  // SubscriptionCurrency,
  SubscriptionPlanDTO,
  UpgradeSuggestionsDTO,
} from '@/types'

interface ICard {
  plan: SubscriptionPlanDTO | UpgradeSuggestionsDTO
  billingInterval: BillingInterval
  isCurrentPlan: boolean
  hasActiveSubscription?: boolean
}

const props = withDefaults(defineProps<ICard>(), {
  hasActiveSubscription: false,
})

// const emit = defineEmits<{ switched: [] }>()

// const route = useRoute()
// const { $toast } = useNuxtApp()
// const { trackPayment } = useGtmEvents()
// const { savePathRedirect } = usePayment()
const {
  // startPaymentSubscription,
  loadingStartPaymentSubscription,
  // getUserSubscription,
  // userSubscription,
} = useSubscription()
const {
  billingSuffix,
  buildSubscriptionPlanCard,
  formatSubscriptionPlanCardPrice: formatPrice,
} = useSubscriptionPlanCard()

// const showConfirmUpgrade = ref(false)
// const previewAmount = ref<number | null>(null)
// const previewCurrency = ref<SubscriptionCurrency | null>(null)

const card = computed(() => {
  return buildSubscriptionPlanCard({
    plan: props.plan,
    billingInterval: props.billingInterval,
    userSubscription: null,
    isCurrentPlan: props.isCurrentPlan,
    hasActiveSubscription: props.hasActiveSubscription,
  })
})

// const switchTargetDescription = computed(() => {
//   return card.value.isSamePlanIntervalMove ? `${props.billingInterval} billing` : `the ${card.value.title} plan`
// })

// const confirmUpgradeText = computed(() => {
//   if (previewAmount.value === null) return `You'll switch to ${switchTargetDescription.value}.`

//   return `You'll switch to ${switchTargetDescription.value} and be charged `
//     + `${previewCurrency.value ?? ''} ${formatPrice(previewAmount.value)} right now.`
// })

// const purchaseOrSwitch = async (confirm: boolean) => {
//   const payload: PayloadPaymentSubscriptionDTO = {
//     gateway: 'Stripe',
//     billingInterval: props.billingInterval,
//     confirm,
//   }
//   const response = await startPaymentSubscription(payload, props.plan.id)
//   if (!response.succeeded || !response.data) return

//   const data = response.data

//   if (data.url) {
//     // Genuine first purchase - unchanged redirect-to-Checkout flow.
//     savePathRedirect(route.fullPath)
//     window.location.href = data.url
//     return
//   }

//   if (data.requiresConfirmation) {
//     previewAmount.value = data.previewAmount
//     previewCurrency.value = data.previewCurrency
//     showConfirmUpgrade.value = true
//     return
//   }

//   if (data.switched) {
//     showConfirmUpgrade.value = false
//     $toast.success(
//       confirm
//         ? `You're now on ${switchTargetDescription.value}.`
//         : `You'll switch to ${switchTargetDescription.value} at the end of your current billing period.`,
//     )
//     await getUserSubscription()
//     emit('switched')
//   }
// }

// const selectPlan = async () => {
//   if (card.value.action.disabled) return

//   trackPayment({
//     route: route.fullPath,
//   })

//   if (!card.value.selectedPrice) return

//   await purchaseOrSwitch(false)
// }

// const confirmUpgrade = () => purchaseOrSwitch(true)
</script>

<style scoped>
.plan-card {
  max-width : 260px;
  min-width: 260px;
  height : fit-content;
  min-height : 380px;
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
   min-width: 220px;
   min-height : 360px;
 }
}
</style>
