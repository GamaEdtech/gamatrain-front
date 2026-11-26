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
        <v-row class="w-100 mt-2">
          <v-col
            v-for="item in skeletonCount"
            :key="item"
            cols="12"
            sm="6"
            md="4"
          >
            <subscription-card-skeleton />
          </v-col>
        </v-row>
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
        <div class="w-100 d-flex flex-column ga-4">
          <!-- A phone keeps the sideways slider (one plan at a time, swipe for the next), opening on the most useful
               plan; wider screens show every plan side by side. -->
          <v-slide-group
            v-if="smAndDown"
            :model-value="focusIndex"
            center-active
            class="mx-n4"
          >
            <v-slide-group-item
              v-for="plan in filteredPlans"
              :key="plan.id"
            >
              <v-sheet
                width="78vw"
                max-width="300"
                color="transparent"
                class="pt-6 pb-3 px-2"
              >
                <subscription-card
                  :plan="plan"
                  :billing-interval="intervalSelect"
                  :current-plan-id="currentPlanId"
                  :current-billing-interval="currentBillingInterval"
                  :level="levelOf(plan)"
                  :shared-feature-lines="sharedFeatureLines"
                  @switch-successfully="emit('switchSuccessfully')"
                />
              </v-sheet>
            </v-slide-group-item>
          </v-slide-group>
          <v-row
            v-else
            justify="center"
            class="mt-1"
          >
            <v-col
              v-for="plan in filteredPlans"
              :key="plan.id"
              cols="12"
              sm="6"
              md="4"
              class="pt-6"
            >
              <subscription-card
                :plan="plan"
                :billing-interval="intervalSelect"
                :current-plan-id="currentPlanId"
                :current-billing-interval="currentBillingInterval"
                :level="levelOf(plan)"
                :shared-feature-lines="sharedFeatureLines"
                @switch-successfully="emit('switchSuccessfully')"
              />
            </v-col>
          </v-row>

          <!-- Said once instead of on every card: these lines were the same on all of them. -->
          <div
            v-if="sharedFeatureLines.length"
            class="w-100 d-flex flex-column ga-3 pa-4 pa-sm-5 rounded-xl bg-softGold"
          >
            <span class="text-body-1 font-weight-black text-grey900">Every plan unlocks</span>
            <v-row
              dense
              role="list"
            >
              <v-col
                v-for="line in sharedFeatureLines"
                :key="line"
                cols="12"
                sm="6"
                role="listitem"
                class="d-flex align-start ga-2 text-body-2 text-grey800"
              >
                <v-icon
                  size="20"
                  color="primaryStrong"
                  class="flex-shrink-0"
                >
                  md:check_circle
                </v-icon>
                {{ line }}
              </v-col>
            </v-row>
          </div>
        </div>
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
import { useDisplay } from 'vuetify'
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

type Plan = SubscriptionPlanDTO | UpgradeSuggestionsDTO

// Plans ranked by what they cost (their Monthly price, else their cheapest one): the API's order isn't by size, and a
// $20 plan showed as Level 1 next to a $5 Level 3. The rank is the plan's level and the order the cards are shown in.
const rankPrice = (plan: Plan) => plan.prices.find(price => price.billingInterval === 'Monthly')?.price
  ?? Math.min(...plan.prices.map(price => price.price ?? Number.POSITIVE_INFINITY))
const rankedPlans = computed(() => [...propsData.plans].sort((a, b) => rankPrice(a) - rankPrice(b)))

const filteredPlans = computed(() => {
  return rankedPlans.value.filter((plan) => {
    return plan.prices.some(price => price.billingInterval === intervalSelect.value && isOffered(price))
  })
})

// The phone slider opens on the smallest upgrade for someone who already has a plan (only upgrades are shown,
// smallest first), else on the highlighted plan. Declared below ownInterval, which it reads.
const { smAndDown } = useDisplay()

// A plan's level is its rank among all plans, so it stays the same when smaller plans are hidden.
const levelOf = (plan: Plan) => rankedPlans.value.findIndex(item => item.id === plan.id) + 1

const { buildSubscriptionPlanCard } = useSubscriptionPlanCard()
// Feature lines that every shown plan has: listed once under the cards instead of on each one.
const sharedFeatureLines = computed(() => {
  const lineSets = filteredPlans.value.map(plan => buildSubscriptionPlanCard({ plan, billingInterval: intervalSelect.value }).featureLines)
  if (lineSets.length < 2) return []
  return lineSets[0]!.filter(line => lineSets.every(lines => lines.includes(line)))
})

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

const hasPlan = computed(() => propsData.currentPlanId !== null || ownInterval.value !== null)
const focusIndex = computed(() => hasPlan.value ? 0 : Math.max(filteredPlans.value.findIndex(plan => plan.highlight), 0))

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

.campaign-strip__pill {
  font-weight: 900;
}
</style>
