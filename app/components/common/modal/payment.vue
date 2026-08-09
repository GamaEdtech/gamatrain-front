<template>
  <div class="w-100 d-flex flex-column flex-sm-row flex-wrap justify-center justify-sm-space-between align-center align-sm-end ga-4 ga-sm-2 mt-12">
    <div class="w-100 d-flex align-start mb-4">
      <div class="btn-filter-container d-flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill">
        <v-btn
          v-for="item in billingInterval"
          :key="item"
          rounded="pill"
          :color="item == intervalSelect ? `white`:`transparent`"
          flat
          height="36"
          :class="`${item == intervalSelect ? `elevation-2` : ``}`"
          @click="changeFilterInterval(item)"
        >
          <span :class="`${item == intervalSelect ? `text-grey900`:`text-grey500`} font-weight-bold text-h5`">{{ item }}</span>
        </v-btn>
      </div>
    </div>
    <template
      v-if="loading"
    >
      <subscription-card-skeleton
        v-for="item in skeletonCount"
        :key="item"
      />
    </template>

    <template v-else>
      <subscription-card
        v-for="plan in filteredPlans"
        :key="plan.subscriptionPlanId"
        :plan="plan"
        :billing-interval="intervalSelect"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BillingInterval, UpgradeSuggestionsDTO } from '@/types'

interface IPaymentModal {
  plans: UpgradeSuggestionsDTO[]
  loading?: boolean
}
const props = withDefaults(defineProps<IPaymentModal>(),
  {
    loading: false,
  })

const skeletonCount = 3
const intervalSelect = ref<BillingInterval>('Monthly')
const billingInterval: BillingInterval[] = ['Monthly', 'Seasonally', 'Yearly']
const filteredPlans = computed(() => {
  return props.plans.filter((plan) => {
    return plan.prices.some(price => price.billingInterval === intervalSelect.value)
  })
})

const changeFilterInterval = async (status: BillingInterval) => {
  intervalSelect.value = status
}
</script>

<style scoped>
.btn-filter-container{
  height : 44px;
}
</style>
