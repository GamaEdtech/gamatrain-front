<template>
  <div class="w-100 d-flex flex-column pt-2">
    <v-alert
      v-if="currentPlanId && currentPlanTitle"
      type="info"
      color="primary"
      density="compact"
      variant="tonal"
      class="mb-4"
    >
      You're currently on the <strong>{{ currentPlanTitle }}</strong> plan. Picking another plan
      below switches you over - it won't start a separate subscription.
    </v-alert>

    <div class="w-100 d-flex align-start justify-center justify-sm-start mb-4">
      <v-skeleton-loader
        v-if="loading"
        width="200"
        height="44"
        class="rounded-pill"
      />
      <div
        v-else
        class="btn-filter-container d-flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill"
      >
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
          <span :class="`${item == intervalSelect ? `text-grey900`:`text-grey500`} font-weight-bold text-h5`">
            {{ item }}
            <span
              v-if="bestDiscountByInterval[item]"
              class="text-success ml-1"
            >Save {{ bestDiscountByInterval[item] }}%</span>
          </span>
        </v-btn>
      </div>
    </div>

    <div class="w-100 d-flex justify-center align-center">
      <template
        v-if="loading"
      >
        <v-slide-group
          :model-value="activeSkeletonIndex"
          class="pa-4 d-flex"
          show-arrows="always"
          center-active
        >
          <v-slide-group-item
            v-for="(item, index) in skeletonCount"
            :key="item"
            :value="index"
          >
            <subscription-card-skeleton class="mr-4 mb-1" />
          </v-slide-group-item>
        </v-slide-group>
      </template>

      <template v-else>
        <v-slide-group
          :model-value="activePlanIndex"
          class="pa-4 d-flex"
          show-arrows="always"
          center-active
        >
          <v-slide-group-item
            v-for="(plan, index) in filteredPlans"
            :key="plan.id"
            :value="index"
          >
            <subscription-card
              :plan="plan"
              :billing-interval="intervalSelect"
              :current-plan-id="currentPlanId"
              :current-billing-interval="currentBillingInterval"
              :has-active-subscription="currentPlanId !== null"
              class="mr-4 mb-1"
              @switched="emit('dismiss')"
            />
          </v-slide-group-item>
        </v-slide-group>
      </template>
    </div>

    <div
      v-if="showLimitedAccessLink"
      class="w-100 d-flex justify-center justify-sm-start mt-6"
    >
      <button
        type="button"
        class="limited-access-link text-h6 text-grey500 font-weight-semibold d-flex align-center ga-1"
        @click="emit('dismiss')"
      >
        Continue with Limited Access
        <v-icon
          size="18"
          color="primary"
        >
          md:chevron_right
        </v-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BillingInterval, SubscriptionPlanDTO, UpgradeSuggestionsDTO } from '@/types'

interface IPaymentModal {
  plans: (SubscriptionPlanDTO | UpgradeSuggestionsDTO)[]
  billingInterval: BillingInterval[]
  loading?: boolean
  showLimitedAccessLink?: boolean
  currentPlanId?: number | null
  currentBillingInterval?: BillingInterval | null
  currentPlanTitle?: string | null
}
const props = withDefaults(defineProps<IPaymentModal>(),
  {
    loading: false,
    showLimitedAccessLink: true,
    currentPlanId: null,
    currentBillingInterval: null,
    currentPlanTitle: null,
  })

const emit = defineEmits<{ dismiss: [] }>()

const { discountPercent } = useBillingIntervalPricing()

const skeletonCount = 3
const activeSkeletonIndex = 1
const intervalSelect = ref<BillingInterval>('Monthly')

const filteredPlans = computed(() => {
  return props.plans.filter((plan) => {
    return plan.prices.some(price => price.billingInterval === intervalSelect.value)
  })
})

const activePlanIndex = computed(() => Math.floor(filteredPlans.value.length / 2))

const bestDiscountByInterval = computed(() => {
  return Object.fromEntries(props.billingInterval.map((interval) => {
    const discounts = props.plans
      .map((plan) => {
        const price = plan.prices.find(p => p.billingInterval === interval)
        const monthlyPrice = plan.prices.find(p => p.billingInterval === 'Monthly')?.price ?? null
        return price ? discountPercent(price.price, interval, monthlyPrice) : null
      })
      .filter((discount): discount is number => discount !== null)

    return [interval, discounts.length > 0 ? Math.max(...discounts) : null]
  })) as Record<BillingInterval, number | null>
})

const changeFilterInterval = async (status: BillingInterval) => {
  intervalSelect.value = status
}

watch(() => props.billingInterval, (intervals) => {
  if (intervals.length > 0 && !intervals.includes(intervalSelect.value)) {
    intervalSelect.value = intervals[0]!
  }
}, { immediate: true })
</script>

<style scoped>
.btn-filter-container{
  height : 44px;
}
.limited-access-link {
  background: none;
  border: none;
  cursor: pointer;
}
:deep(.v-slide-group__content){
  align-items: flex-end;
}
</style>
