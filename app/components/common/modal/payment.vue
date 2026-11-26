<template>
  <div class="w-100 d-flex flex-column pt-2">
    <!-- A live sale campaign the caller's purchase would get (the backend only sends campaignPrice then). -->
    <div
      v-if="showCampaign && campaign"
      class="campaign-strip w-100 d-flex flex-wrap align-center justify-space-between ga-2 px-4 py-3 mb-4 rounded-lg"
      :style="{ background: campaignStyle.stripBackground, color: campaignStyle.stripText }"
    >
      <span class="d-flex align-center ga-2 text-body-2 font-weight-bold">
        <span
          class="campaign-strip__pill px-2 rounded"
          :style="{ background: campaignStyle.stripText, color: campaignStyle.stripBackground }"
        >-{{ campaign.discountPercent }}%</span>
        {{ campaign.title }}: {{ campaign.discountPercent }}% off your first payment
      </span>
      <campaign-countdown
        :ends-at="campaign.endsAt"
        variant="inline"
        class="text-caption font-weight-medium"
      />
    </div>

    <v-alert
      v-if="currentPlanId !== null && currentPlanTitle"
      type="info"
      color="primaryStrong"
      density="compact"
      variant="tonal"
      class="mb-4"
    >
      You're currently on the <strong>{{ currentPlanTitle }}</strong> plan. Picking another plan
      below switches you over - it won't start a separate subscription.
    </v-alert>

    <div class="w-100 d-flex align-center justify-center mb-4">
      <v-skeleton-loader
        v-if="loading"
        width="200"
        height="44"
        class="rounded-pill"
      />
      <div
        v-else-if="shownIntervals.length > 0"
        class="btn-filter-container d-flex align-center justify-start ga-1 bg-grey50 pa-1 rounded-pill overflow-x-auto overflow-y-hidden "
      >
        <v-btn
          v-for="item in shownIntervals"
          :key="item"
          rounded="pill"
          :color="item == intervalSelect ? `surface`:`transparent`"
          flat
          height="36"
          :class="`${item == intervalSelect ? `elevation-2` : ``}`"
          @click="changeFilterInterval(item)"
        >
          <span :class="`${item == intervalSelect ? `text-grey900`:`text-grey500`} font-weight-bold text-body-1`">
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
          class="payment-plan-slider pt-4 d-flex position-relative"
          show-arrows
          center-active
        >
          <template #prev>
            <v-btn
              aria-label="Previous plans"
              icon
              flat
              size="30"
              class="slider-arrow-button"
              color="surface"
            >
              <v-icon
                size="24"
                color="grey700"
              >
                md:chevron_left
              </v-icon>
            </v-btn>
          </template>

          <template #next>
            <v-btn
              aria-label="Next plans"
              icon
              flat
              size="30"
              class="slider-arrow-button"
              color="surface"
            >
              <v-icon
                size="24"
                color="grey700"
              >
                md:chevron_right
              </v-icon>
            </v-btn>
          </template>

          <v-slide-group-item
            v-for="(item, index) in skeletonCount"
            :key="item"
            :value="index"
          >
            <subscription-card-skeleton class="mr-4 mb-1" />
          </v-slide-group-item>
        </v-slide-group>
      </template>

      <!-- Out of gems on the biggest pack already: nothing to sell, say what happens instead. -->
      <v-alert
        v-else-if="isUpgradeContext && filteredPlans.length === 0"
        type="info"
        variant="tonal"
        color="primaryStrong"
        class="text-body-2"
      >
        You're already on the biggest plan, so there's nothing to upgrade to. Your gems refill when your plan renews.
      </v-alert>

      <template v-else>
        <v-slide-group
          :model-value="activePlanIndex"
          class="payment-plan-slider pt-4 d-flex align-center position-relative"
          show-arrows
          center-active
        >
          <template #prev>
            <v-btn
              aria-label="Previous plans"
              icon
              flat
              size="30"
              class="slider-arrow-button"
              color="surface"
            >
              <v-icon
                size="24"
                color="grey700"
              >
                md:chevron_left
              </v-icon>
            </v-btn>
          </template>

          <template #next>
            <v-btn
              aria-label="Next plans"
              icon
              flat
              size="30"
              class="slider-arrow-button"
              color="surface"
            >
              <v-icon
                size="24"
                color="grey700"
              >
                md:chevron_right
              </v-icon>
            </v-btn>
          </template>

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
              class="mr-4 mb-1"
              @switch-successfully="emit('switchSuccessfully')"
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
        class="limited-access-link text-caption text-grey500 font-weight-semibold d-flex align-center ga-1"
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
const propsData = withDefaults(defineProps<IPaymentModal>(),
  {
    loading: false,
    showLimitedAccessLink: true,
    currentPlanId: null,
    currentBillingInterval: null,
    currentPlanTitle: null,
  })

const emit = defineEmits(['switchSuccessfully', 'dismiss'])

const { discountPercent } = useBillingIntervalPricing()
const { campaign, isLive: campaignLive, style: campaignStyle, refresh: refreshCampaign } = useCampaign()
const showCampaign = computed(() => campaignLive.value
  && propsData.plans.some(plan => plan.prices.some(price => price.campaignPrice !== null && price.campaignPrice !== undefined)))
onMounted(refreshCampaign)

const skeletonCount = 3
const activeSkeletonIndex = 1
const intervalSelect = ref<BillingInterval>('Monthly')

// Out-of-gems responses (UpgradeSuggestionsDTO) say per price whether it is a real upgrade; the general plans list
// doesn't. In that upgrade context only real upgrades are offered: the caller's own plan and smaller ones used to
// show as disabled "Current Plan" / "Not an Upgrade" cards, often the one in focus.
const isUpgradeContext = computed(() => propsData.plans.some(plan => plan.prices.some(price => 'canUpgrade' in price)))
const isOffered = (price: (SubscriptionPlanDTO | UpgradeSuggestionsDTO)['prices'][number]) =>
  !('canUpgrade' in price) || price.canUpgrade

// Only the periods that have something to offer get a tab.
const shownIntervals = computed(() => isUpgradeContext.value
  ? propsData.billingInterval.filter(interval =>
      propsData.plans.some(plan => plan.prices.some(price => price.billingInterval === interval && isOffered(price))))
  : propsData.billingInterval)

const filteredPlans = computed(() => {
  return propsData.plans.filter((plan) => {
    return plan.prices.some(price => price.billingInterval === intervalSelect.value && isOffered(price))
  })
})

// An upgrade starts from the smallest step up; the general list centres on the middle plan.
const activePlanIndex = computed(() => isUpgradeContext.value ? 0 : Math.floor(filteredPlans.value.length / 2))

const bestDiscountByInterval = computed(() => {
  return Object.fromEntries(propsData.billingInterval.map((interval) => {
    const discounts = propsData.plans
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

// The tab to open on: a subscriber's own billing period (a Monthly subscriber out of gems was shown another period),
// else Monthly, else the first one offered. Chosen again whenever new plans arrive, so a tab picked the last time
// the dialog was open doesn't carry over.
const ownInterval = computed<BillingInterval | null>(() => propsData.currentBillingInterval
  ?? propsData.plans.flatMap(plan => plan.prices).find(price => 'isCurrent' in price && price.isCurrent)?.billingInterval
  ?? null)

watch(() => [propsData.plans, shownIntervals.value, ownInterval.value] as const, () => {
  const intervals = shownIntervals.value
  if (intervals.length === 0) return
  const preferred = [ownInterval.value, 'Monthly' as BillingInterval].find(
    (interval): interval is BillingInterval => !!interval && intervals.includes(interval))
  intervalSelect.value = preferred ?? intervals[0]!
}, { immediate: true })
</script>

<style scoped>
.btn-filter-container{
  height : 44px;
}
.btn-filter-container::-webkit-scrollbar {
  height: 4px;
}

.limited-access-link {
  background: none;
  border: none;
  cursor: pointer;
}
:deep(.v-slide-group__content){
  align-items: flex-end;
}

:deep(.payment-plan-slider > .v-slide-group__prev),
:deep(.payment-plan-slider > .v-slide-group__next) {
  position: absolute;
  top: 50%;
  z-index: 2;
  min-width: 30px;
  transform: translateY(-50%);
}

:deep(.payment-plan-slider > .v-slide-group__prev) {
  left: 0;
}

:deep(.payment-plan-slider > .v-slide-group__next) {
  right: 0;
}

.slider-arrow-button {
  border: 1px solid rgb(var(--v-theme-grey300));
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.12);
}

:deep(.v-slide-group__prev--disabled .slider-arrow-button),
:deep(.v-slide-group__next--disabled .slider-arrow-button) {
  opacity: 0.45;
  box-shadow: none;
}
.campaign-strip__pill {
  font-weight: 900;
}
</style>
