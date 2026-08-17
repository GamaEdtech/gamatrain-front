<template>
  <div :class="`d-flex flex-column align-center justify-space-between plan-card rounded-xl pa-3 pa-md-4 elevation-3 ${plan.highlight ? `hightlight-card`:`simple-card`} ${isDisabled ? `disabled-card`:``}`">
    <div class="price-div w-100 d-flex flex-column aligh-start justify-start pa-3 pa-md-4 rounded-lg">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-h6 text-md-h4 font-weight-bold text-grey700">
          {{ plan.title }}
        </span>
        <v-chip
          v-if="plan.highlight"
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
        v-if="strikeThroughMonthlyPrice"
        class="text-h6 text-md-h5 text-grey400 text-decoration-line-through"
      >
        ${{ formatPrice(strikeThroughMonthlyPrice) }}
      </span>
      <div
        v-if="selectedPrice"
        class="d-flex align-center justify-space-between mt-2"
      >
        <div class="d-flex align-center">
          <span class="text-h6 text-md-h4 text-grey400">$</span>
          <span class="text-h4 text-md-h2 font-weight-bold">
            {{ formatPrice(displayMonthlyPrice) }}</span>
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
        v-if="selectedPrice && billingInterval !== 'Monthly'"
        class="text-h6 text-grey400 mt-1"
      >
        billed ${{ formatPrice(selectedPrice.price) }} {{ billingSuffix[billingInterval] }}
      </div>
    </div>
    <span
      v-if="gemsBalance !== null"
      class="w-100 d-flex align-center jusify-start mt-2 text-h5 font-weight-bold text-grey900"
    >
      <v-icon
        size="20"
        class="mr-2"
        color="primary"
      >
        md:diamond
      </v-icon>
      {{ formatPrice(gemsBalance) }} Gems
    </span>

    <ul class="features text-left mt-4 pa-0">
      <li
        v-for="(featureGroup, groupIndex) in featureGroups"
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
        {{ formatFeatureLine(featureGroup) }}
      </li>
    </ul>

    <v-btn
      class="w-100 text-h6 text-md-h5 font-weight-bold mt-6 rounded-lg"
      :color="isDisabled ? `grey300` : `grey900`"
      variant="flat"
      height="44"
      :disabled="isDisabled"
      :loading="loadingStartPaymentSubscription"
      @click.stop="selectPlan"
    >
      {{ ctaLabel }}
    </v-btn>

    <common-modal-base
      v-model:show-dialog="showConfirmUpgrade"
      :title="isSamePlanIntervalMove ? `Switch to ${billingInterval} billing?` : `Switch to ${plan.title}?`"
      :max-width="480"
    >
      <user-subscription-modals-confirm
        :text="confirmUpgradeText"
        confirm-color="primary"
        :loading="loadingStartPaymentSubscription"
        @back="showConfirmUpgrade = false"
        @confirm="confirmUpgrade"
      />
    </common-modal-base>
  </div>
</template>

<script setup lang="ts">
import type {
  ActiveSubscriptionPlanPriceDTO,
  AdminSubscriptionPlanFeatureGroupDTO,
  BillingInterval,
  PayloadPaymentSubscriptionDTO,
  SubscriptionCurrency,
  SubscriptionPlanDTO,
  UpgradeSuggestionsDTO,
  UpgradeSuggestionsFeatureGroup,
  UpgradeSuggestionsPrice,
} from '@/types'

interface ICard {
  plan: SubscriptionPlanDTO | UpgradeSuggestionsDTO
  billingInterval: BillingInterval
  isCurrentPlan: boolean
  // True when the viewer already has an Active subscription (to any plan, not just this one) - cosmetic
  // only (button label): plans/{id}/purchase now decides buy vs. switch on its own either way
  // (gamatrain-back#577), so every non-current card below always just calls startPaymentSubscription.
  hasActiveSubscription?: boolean
}

const props = withDefaults(defineProps<ICard>(), {
  hasActiveSubscription: false,
})

const emit = defineEmits<{ switched: [] }>()

const route = useRoute()
const { $toast } = useNuxtApp()
const { trackPayment } = useGtmEvents()
const { savePathRedirect } = usePayment()
const {
  startPaymentSubscription,
  loadingStartPaymentSubscription,
  getUserSubscription,
  userSubscription,
} = useSubscription()
const { monthlyEquivalentPrice, discountPercent } = useBillingIntervalPricing()

const showConfirmUpgrade = ref(false)
const previewAmount = ref<number | null>(null)
const previewCurrency = ref<SubscriptionCurrency | null>(null)

const billingSuffix: Record<BillingInterval, string> = {
  Daily: 'per day',
  Weekly: 'per week',
  Monthly: 'per month',
  Seasonally: 'every 3 months',
  Yearly: 'per year',
}

type PlanPrice = ActiveSubscriptionPlanPriceDTO | UpgradeSuggestionsPrice
type FeatureGroup = AdminSubscriptionPlanFeatureGroupDTO | UpgradeSuggestionsFeatureGroup

const isUpgradeSuggestionsPlan = (plan: SubscriptionPlanDTO | UpgradeSuggestionsDTO): plan is UpgradeSuggestionsDTO => {
  return !('featureGroups' in plan)
}

const isUpgradeSuggestionsPrice = (price: PlanPrice): price is UpgradeSuggestionsPrice => {
  return 'featureGroups' in price
}

const selectedPrice = computed(() => {
  return props.plan.prices.find(price => price.billingInterval === props.billingInterval)
})

const monthlyPrice = computed(() => {
  return props.plan.prices.find(price => price.billingInterval === 'Monthly')?.price ?? null
})

const displayMonthlyPrice = computed(() => {
  if (!selectedPrice.value) return 0
  return monthlyEquivalentPrice(selectedPrice.value.price, props.billingInterval)
})

const strikeThroughMonthlyPrice = computed(() => {
  if (!selectedPrice.value) return null
  const discount = discountPercent(selectedPrice.value.price, props.billingInterval, monthlyPrice.value)
  return discount === null ? null : monthlyPrice.value
})

const featureGroups = computed<FeatureGroup[]>(() => {
  if (!isUpgradeSuggestionsPlan(props.plan)) {
    return props.plan.featureGroups
  }

  return selectedPrice.value && isUpgradeSuggestionsPrice(selectedPrice.value)
    ? selectedPrice.value.featureGroups
    : []
})

const resolveGroupLimit = (group: FeatureGroup) => {
  if ('limits' in group) {
    return group.limits.find(limit => limit.billingInterval === props.billingInterval)?.limit ?? null
  }

  return group.limit
}

const gemsBalance = computed(() => {
  const limits = featureGroups.value
    .map(group => resolveGroupLimit(group))
    .filter((limit): limit is number => limit !== null)

  return limits.length > 0 ? limits.reduce((total, limit) => total + limit, 0) : null
})

const formatPrice = (value: number) => {
  return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2)
}

const formatFeatureLine = (group: FeatureGroup) => {
  const limit = resolveGroupLimit(group)
  return limit === null ? `Unlimited ${group.description}` : `Use Gems for ${group.description}`
}

// True when this card is the plan the viewer is already on, just at a different billing interval - e.g.
// the Yearly card for a plan they're currently paying Monthly. isCurrentPlan (exact plan+interval) is
// already false here, or the card would be disabled - but "the Alpha plan" reads oddly when Alpha is
// exactly what they're on; "Yearly billing" is what's actually changing (gamatrain-back#577).
const isSamePlanIntervalMove = computed(() => {
  return userSubscription.value?.status === 'Active'
    && userSubscription.value.subscriptionPlanId === props.plan.id
})

// Only an upgrade-suggestion price (a quota-exhausted "here's what fixes it" card) carries these -
// SubscriptionPlanDTO's own prices (the general subscriptions/plans catalog) don't, since that endpoint
// wasn't touched by gamatrain-back#580. Absent means there's nothing to grey out beyond isCurrentPlan.
const suggestionCanUpgrade = computed(() => {
  return selectedPrice.value && 'canUpgrade' in selectedPrice.value ? selectedPrice.value.canUpgrade : true
})

// Backend now flags the caller's own plan+interval directly on the suggestion (compared by id, immune to
// a live admin limit change) - trust that over the client-side isCurrentPlan prop when it's present.
const suggestionIsCurrent = computed(() => {
  return selectedPrice.value && 'isCurrent' in selectedPrice.value ? selectedPrice.value.isCurrent : false
})

// Non-selectable either because it's the plan they're already on, or (in the upgrade-suggestion context
// only) because canUpgrade:false - an equal/lower-quota lateral or downgrade doesn't fix the quota wall
// that put this card in front of the user, so it's greyed out here even though the switch itself would be
// mechanically allowed (gamatrain-back#580).
const isDisabled = computed(() => props.isCurrentPlan || suggestionIsCurrent.value || !suggestionCanUpgrade.value)

const ctaLabel = computed(() => {
  if (props.isCurrentPlan || suggestionIsCurrent.value) return 'Current Plan'
  if (!suggestionCanUpgrade.value) return 'Not an Upgrade'
  if (isSamePlanIntervalMove.value) return `Switch to ${props.billingInterval}`
  return props.hasActiveSubscription ? 'Switch Plan' : 'Choose Plan'
})

const switchTargetDescription = computed(() => {
  return isSamePlanIntervalMove.value ? `${props.billingInterval} billing` : `the ${props.plan.title} plan`
})

// Only shown while showConfirmUpgrade is open (a real charge pending), so the target/amount below are
// always what confirming will actually apply.
const confirmUpgradeText = computed(() => {
  if (previewAmount.value === null) return `You'll switch to ${switchTargetDescription.value}.`

  return `You'll switch to ${switchTargetDescription.value} and be charged `
    + `${previewCurrency.value ?? ''} ${formatPrice(previewAmount.value)} right now.`
})

// plans/{id}/purchase now makes the buy-vs-switch-vs-preview decision itself (gamatrain-back#577) - this
// one call covers a first purchase, a downgrade (applied immediately, no charge), and an upgrade (which
// comes back as a preview first; resubmitting with confirm: true is what actually applies/bills it).
const purchaseOrSwitch = async (confirm: boolean) => {
  const payload: PayloadPaymentSubscriptionDTO = {
    gateway: 'Stripe',
    billingInterval: props.billingInterval,
    confirm,
  }
  const response = await startPaymentSubscription(payload, props.plan.id)
  if (!response.succeeded || !response.data) return

  const data = response.data

  if (data.url) {
    // Genuine first purchase - unchanged redirect-to-Checkout flow.
    savePathRedirect(route.fullPath)
    window.location.href = data.url
    return
  }

  if (data.requiresConfirmation) {
    previewAmount.value = data.previewAmount
    previewCurrency.value = data.previewCurrency
    showConfirmUpgrade.value = true
    return
  }

  if (data.switched) {
    showConfirmUpgrade.value = false
    $toast.success(
      confirm
        ? `You're now on ${switchTargetDescription.value}.`
        : `You'll switch to ${switchTargetDescription.value} at the end of your current billing period.`,
    )
    await getUserSubscription()
    emit('switched')
  }
}

const selectPlan = async () => {
  if (isDisabled.value) return

  trackPayment({
    route: route.fullPath,
  })

  if (!selectedPrice.value) return

  await purchaseOrSwitch(false)
}

const confirmUpgrade = () => purchaseOrSwitch(true)
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
