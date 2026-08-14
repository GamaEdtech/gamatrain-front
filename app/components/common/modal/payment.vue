<template>
  <div class="w-100 d-flex flex-column pa-4 pa-sm-8 pt-2">
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

    <div class="w-100 d-flex flex-column flex-sm-row flex-wrap justify-center justify-sm-space-between align-center align-sm-end ga-4 ga-sm-2">
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
          :key="plan.id"
          :plan="plan"
          :billing-interval="intervalSelect"
          :selected="selectedPlanId === plan.id"
          :is-current-plan="isCurrentPlan(plan.id)"
          @select="selectPlan"
        />
      </template>
    </div>

    <div class="w-100 d-flex justify-center justify-sm-start mt-6">
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
  // Fed either the "buy a plan" list (subscriptions/plans) or a download's upgrade suggestions - the two
  // shapes differ (see subscription/card.vue), so this stays a union rather than picking one.
  plans: (SubscriptionPlanDTO | UpgradeSuggestionsDTO)[]
  billingInterval: BillingInterval[]
  loading?: boolean
}
const props = withDefaults(defineProps<IPaymentModal>(),
  {
    loading: false,
  })

const emit = defineEmits<{ dismiss: [] }>()

const { discountPercent } = useBillingIntervalPricing()
const auth = useAuth()
const { userSubscription, getUserSubscription } = useSubscription()

const skeletonCount = 3
const intervalSelect = ref<BillingInterval>('Monthly')
const selectedPlanId = ref<number | null>(null)

const filteredPlans = computed(() => {
  return props.plans.filter((plan) => {
    return plan.prices.some(price => price.billingInterval === intervalSelect.value)
  })
})

// Best (highest) savings any currently-listed plan offers at each interval vs its own Monthly price -
// shown as a "Save X%" pill on the interval toggle itself, same spot the Figma mockup had it (just with
// a real, computed number instead of a hardcoded string).
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

const isCurrentPlan = (planId: number) => {
  return userSubscription.value?.status === 'Active' && userSubscription.value.subscriptionPlanId === planId
}

const selectPlan = (id: number) => {
  selectedPlanId.value = id
}

const changeFilterInterval = async (status: BillingInterval) => {
  intervalSelect.value = status
}

// billingInterval arrives async (starts empty while the parent's fetch is in flight) and doesn't always
// include Monthly - fall back to whatever's actually on offer instead of leaving every toggle button
// unselected and filteredPlans empty.
watch(() => props.billingInterval, (intervals) => {
  if (intervals.length > 0 && !intervals.includes(intervalSelect.value)) {
    intervalSelect.value = intervals[0]
  }
}, { immediate: true })

onMounted(async () => {
  if (auth.isAuthenticated.value) {
    await getUserSubscription()
  }
})
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
</style>
