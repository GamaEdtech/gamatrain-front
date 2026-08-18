<template>
  <v-card
    :class="[
      'plan-card pa-4 pa-md-5 position-relative bg-white rounded-xl border-solid',
      plan.highlight ? 'border-md border-primary plan-card--highlight' : 'border-sm border-grey600',
    ]"
    :elevation="plan.highlight ? 4 : 1"
    hover
    :disabled="isDisabled"
    @click="selectPlan"
  >
    <!-- Price panel -->
    <div class="price-panel rounded-lg pa-4 mb-4 text-left">
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

      <div class="d-flex align-center justify-space-between">
        <div class="d-flex flex-column">
          <div
            v-if="selectedPrice"
            class="d-flex align-baseline flex-wrap ga-2"
          >
            <span
              v-if="strikeThroughMonthlyPrice"
              class="text-h6 text-md-h5 text-grey400 text-decoration-line-through"
            >
              ${{ formatPrice(strikeThroughMonthlyPrice) }}
            </span>
            <span>
              <span class="text-h6 text-md-h4 text-grey400 mt-2">$</span><sub class="text-h4 text-md-h2 font-weight-bold">
                {{ formatPrice(displayMonthlyPrice) }}</sub><span class="text-h6 text-grey400">/mo</span>
            </span>
          </div>
          <div
            v-if="selectedPrice && billingInterval !== 'Monthly'"
            class="text-h6 text-grey400"
          >
            billed ${{ formatPrice(selectedPrice.price) }} {{ billingSuffix[billingInterval] }}
          </div>
        </div>

        <v-icon
          v-if="selectedPrice"
          size="36"
          color="grey900"
          class="diamond-icon flex-shrink-0"
        >
          md:diamond
        </v-icon>
      </div>
    </div>

    <!-- Features -->
    <ul class="features text-left mb-6 pa-0">
      <!-- The Gem balance: the plan's own feature-group limits, summed (unlimited groups don't contribute
           a number - there's nothing to add). Real backend data, not a derived/marketing figure - what
           each item actually costs to use still varies per item, so this isn't "N downloads" either. -->
      <li
        v-if="gemsBalance !== null"
        class="d-flex align-center mb-3 text-h5 font-weight-bold text-grey900"
      >
        <v-icon
          size="20"
          class="mr-2 flex-shrink-0"
          color="primary"
        >
          md:diamond
        </v-icon>
        {{ formatPrice(gemsBalance) }} Gems
      </li>

      <template
        v-for="(featureGroup, groupIndex) in featureGroups"
        :key="groupIndex"
      >
        <li
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
      </template>
    </ul>

    <!-- Button -->
    <v-btn
      class="text-h6 text-md-h5 font-weight-bold"
      :color="isDisabled ? `grey300` : `grey900`"
      variant="flat"
      block
      size="large"
      :disabled="isDisabled"
      :loading="loadingStartPaymentSubscription"
      @click.stop="selectPlan"
    >
      {{ ctaLabel }}
    </v-btn>
  </v-card>

  <!-- Upgrade-charge confirmation - only reachable when purchase comes back as a preview
       (requiresConfirmation: true, gamatrain-back#577): an immediate upgrade bills the card synchronously,
       so it's never applied on the strength of a single click with no visible amount. A downgrade or a
       first purchase never goes through this - both apply/redirect straight from the one click. -->
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
</template>

<script setup lang="ts">
import type {
  AdminSubscriptionPlanFeatureGroupDTO,
  BillingInterval,
  PayloadPaymentSubscriptionDTO,
  SubscriptionCurrency,
  SubscriptionPlanDTO,
  UpgradeSuggestionsDTO,
  UpgradeSuggestionsFeatureGroup,
} from '@/types'

interface ICard {
  // subscriptions/plans ("buy a plan") sends one featureGroups list per plan, each group carrying a limit
  // per billing interval; a download's upgrade suggestion carries featureGroups per price entry instead,
  // already resolved to that one interval's flat limit.
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

// Only shown when this interval is genuinely cheaper per month than the plan's own Monthly price, so the
// discount from committing to a longer interval is legible (not just "$5/mo" with no reference point).
const strikeThroughMonthlyPrice = computed(() => {
  if (!selectedPrice.value) return null
  const discount = discountPercent(selectedPrice.value.price, props.billingInterval, monthlyPrice.value)
  return discount === null ? null : monthlyPrice.value
})

const featureGroups = computed(() => {
  return 'featureGroups' in props.plan ? props.plan.featureGroups : selectedPrice.value?.featureGroups ?? []
})

const resolveGroupLimit = (group: AdminSubscriptionPlanFeatureGroupDTO | UpgradeSuggestionsFeatureGroup) => {
  if ('limits' in group) {
    return group.limits.find(limit => limit.billingInterval === props.billingInterval)?.limit ?? null
  }

  return group.limit
}

// Gem balance = the plan's own feature-group limits at this billing interval, summed - real, admin-set
// backend data (see plans/features.vue), not a price-derived figure. Unlimited groups (limit === null)
// don't contribute a number; null overall means every group is unlimited, so there's no total to show.
const gemsBalance = computed(() => {
  const limits = featureGroups.value
    .map(group => resolveGroupLimit(group))
    .filter((limit): limit is number => limit !== null)

  return limits.length > 0 ? limits.reduce((total, limit) => total + limit, 0) : null
})

const formatPrice = (value: number) => {
  return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2)
}

// No fixed count is shown for Gem-spendable groups (each item's actual Gem cost varies); an unlimited
// group still reads as "Unlimited X", same as before.
const formatFeatureLine = (group: AdminSubscriptionPlanFeatureGroupDTO | UpgradeSuggestionsFeatureGroup) => {
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
  /* Not a Vuetify width utility (w-33 etc.) on purpose - the container also has an explicit gap between
     cards, so 3 * exactly-33% overflows 100% and wraps. 30% leaves headroom for that gap. */
  width: 30%;
  height : fit-content;
  cursor: pointer;
}
/* elevation/hover/disabled dimming all come from v-card's own props (see the template) - this is just the
   colored glow ring on the highlighted plan. Uses outline rather than box-shadow so it layers on top of
   the elevation prop's own box-shadow instead of overriding it. */
.plan-card--highlight {
  outline: 3px solid rgba(var(--v-theme-primary), 0.15);
  outline-offset: 2px;
}

/* Per-tier tint, matching the 3 pastel gradients from the Figma cards (blue / purple / amber) - rotates
   by card position rather than plan data, since the design ties it to slot order, not a plan attribute. */
.price-panel {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, rgb(var(--v-theme-grey100)) 100%);
}
.plan-card:nth-of-type(3n+1) .price-panel {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #e7eefb 100%);
}
.plan-card:nth-of-type(3n+2) .price-panel {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #f1e6f6 100%);
}
.plan-card:nth-of-type(3n+3) .price-panel {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #f7f1e1 100%);
}

.diamond-icon {
  opacity: 0.35;
}

.features {
  list-style: none;
}
@media screen and (max-width: 600px) {
 .plan-card {
   width : 100% !important;
   max-width : 220px;
 }
}
</style>
