<template>
  <!-- A plan as a "pack": its level, a chest that grows with it, its gems (with the same gem icon the download buttons
       use), the price and one button. Only the button acts: a tap anywhere on the card used to start checkout. -->
  <v-card
    flat
    rounded="xl"
    :color="card.highlight ? 'secondary' : 'surface'"
    :class="[
      'h-100 position-relative overflow-visible d-flex flex-column ga-4 pa-5 border-md border-opacity-100',
      card.highlight ? 'border-secondary pack-card--main' : 'border-borderSubtle pack-card',
      { 'opacity-60': card.action.type === 'locked' },
    ]"
  >
    <v-chip
      v-if="card.highlight"
      color="primary"
      variant="flat"
      size="small"
      class="position-absolute font-weight-black pack-card__badge"
    >
      &#9733; Most picked
    </v-chip>

    <v-chip
      label
      size="small"
      variant="tonal"
      :color="card.highlight ? 'primary' : 'grey600'"
      class="align-self-start font-weight-black"
    >
      LEVEL {{ level }}
    </v-chip>

    <div class="d-flex align-center ga-4">
      <subscription-pack-chest :level="level" />
      <div class="d-flex flex-column ga-1">
        <span class="text-h5 font-weight-black">{{ card.title }}</span>
        <span
          v-if="card.gemsBalance !== null"
          class="d-flex align-center ga-1 text-body-2"
          :class="card.highlight ? 'text-onInverseSurfaceSubtle' : 'text-grey600'"
        >
          <strong
            class="d-inline-flex align-center ga-1 text-h6 font-weight-black"
            :class="card.highlight ? 'text-white' : 'text-grey900'"
            :aria-label="`${formatPrice(card.gemsBalance)} gems`"
          >
            {{ formatPrice(card.gemsBalance) }}
            <v-icon
              size="20"
              color="primary"
              aria-hidden="true"
            >md:diamond_outlined</v-icon>
          </strong>
          <span class="text-no-wrap">a {{ periodWord }}</span>
        </span>
      </div>
    </div>

    <!-- Live sale: the backend sends campaignPrice only when this purchase gets it, and charges exactly that. -->
    <div
      v-if="card.selectedPrice"
      class="d-flex flex-column ga-1"
    >
      <div class="d-flex align-baseline ga-2">
        <span
          class="text-h4 font-weight-black"
          :class="card.highlight ? 'text-primary' : 'text-grey900'"
        >${{ formatPrice(showCampaign ? campaignPrice! : card.displayMonthlyPrice) }}</span>
        <span
          v-if="!showCampaign"
          class="text-body-2"
          :class="card.highlight ? 'text-onInverseSurfaceSubtle' : 'text-grey500'"
        >/mo</span>
        <span
          v-if="struckPrice !== null"
          class="text-body-1 text-decoration-line-through"
          :class="card.highlight ? 'text-onInverseSurfaceMuted' : 'text-grey400'"
        >${{ formatPrice(struckPrice) }}</span>
      </div>
      <span
        class="text-caption"
        :class="card.highlight ? 'text-onInverseSurfaceSubtle' : 'text-grey500'"
      >{{ priceNote }}</span>
    </div>

    <!-- What this plan's gems buy, as pills: the gem icon where it spends gems (as on the download buttons), the
         infinity sign where it is unlimited. -->
    <div
      v-if="ownFeatures.length"
      role="list"
      class="d-flex flex-wrap ga-2"
    >
      <v-chip
        v-for="feature in ownFeatures"
        :key="feature.line"
        role="listitem"
        label
        variant="tonal"
        :color="card.highlight ? 'primary' : 'primaryStrong'"
        :prepend-icon="feature.unlimited ? 'md:all_inclusive' : 'md:diamond_outlined'"
        :aria-label="feature.line"
        class="h-auto py-1 text-wrap text-body-2 font-weight-medium"
      >
        {{ feature.unlimited ? feature.line : feature.description }}
      </v-chip>
    </div>

    <!-- The plan they're on: said plainly, with no dead "Current Plan" button to click. -->
    <v-sheet
      v-if="card.action.type === 'current'"
      height="52"
      rounded="lg"
      color="transparent"
      class="mt-auto flex-grow-0 d-flex align-center justify-center ga-2 border-md border-opacity-100 border-success text-success text-body-1 font-weight-black"
    >
      <v-icon
        size="20"
        aria-hidden="true"
      >
        md:check_circle
      </v-icon>
      Your plan
    </v-sheet>
    <v-btn
      v-else
      block
      flat
      height="52"
      rounded="lg"
      :variant="card.highlight ? 'flat' : 'outlined'"
      :color="card.action.disabled ? 'grey400' : card.highlight ? 'primary' : 'brandNavy'"
      :class="['mt-auto flex-grow-0 text-body-1 font-weight-black text-none', card.action.disabled ? '' : card.highlight ? 'pack-card__cta--main' : 'pack-card__cta']"
      :disabled="card.action.disabled"
      :loading="loadingStartPaymentSubscription || loadingSwitchSubscriptionPlan"
      @click="selectPlan"
    >
      {{ buttonLabel }}
    </v-btn>

    <common-modal-base
      v-model:show-dialog="showConfirmUpgradeModal"
      :title="card.isSamePlanIntervalMove ? `Switch to ${billingInterval} billing?` : `Switch to ${card.title}?`"
      :max-width="480"
    >
      <div
        v-if="paymentActionUrl"
        class="w-100 d-flex flex-column align-start justify-start ga-6 pt-4"
      >
        <p class="text-body-1 text-grey600 font-weight-medium mb-0">
          Your bank needs you to confirm this payment. Open the payment page, confirm it there, then come back to this tab.
        </p>

        <v-alert
          type="info"
          variant="tonal"
          density="comfortable"
          class="w-100"
        >
          <div class="d-flex align-center ga-3">
            <v-progress-circular
              v-if="waitingForSwitch"
              indeterminate
              size="18"
              width="2"
            />
            <span>{{ waitingForSwitch ? 'Waiting for your payment to be confirmed...' : 'Your plan switches as soon as the payment is confirmed. You can close this and check back later.' }}</span>
          </div>
        </v-alert>

        <div class="w-100 d-flex align-center justify-center ga-3 flex-wrap">
          <v-btn
            rounded="pill"
            variant="outlined"
            color="grey500"
            height="40"
            min-width="110"
            class="text-body-1 font-weight-bold"
            @click="closeConfirmUpgradeModal"
          >
            Close
          </v-btn>

          <v-btn
            rounded="pill"
            color="primary"
            height="40"
            min-width="110"
            class="text-body-1 font-weight-bold text-white"
            flat
            :href="paymentActionUrl"
            target="_blank"
            rel="noopener noreferrer"
            append-icon="md:open_in_new"
            @click="startWaitingForSwitch"
          >
            Confirm payment
          </v-btn>
        </div>
      </div>

      <user-subscription-modals-confirm
        v-else
        :text="confirmUpgradeText"
        confirm-color="primary"
        :loading="loadingStartPaymentSubscription || loadingSwitchSubscriptionPlan"
        :error-message="confirmUpgradeError"
        @back="closeConfirmUpgradeModal"
        @confirm="confirmUpgrade"
      />
    </common-modal-base>

    <common-modal-base
      v-model:show-dialog="showResumeModal"
      title="Resume"
      :max-width="480"
    >
      <user-subscription-modals-confirm
        text="To upgrade your plan, you must first reactivate your current plan. Please confirm to continue."
        confirm-color="primary"
        :loading="loadingResumeSubscription"
        :error-message="resumeError"
        @back="closeResumeModal"
        @confirm="confirmResumeSubscription"
      />
    </common-modal-base>
  </v-card>
</template>

<script setup lang="ts">
import type {
  BillingInterval,
  SubscriptionCurrency,
  SubscriptionPlanDTO,
  UpgradeSuggestionsDTO,
  PaymentGateway,
} from '@/types'
import { BILLING_INTERVAL_PERIOD_LABEL, SWITCH_NOT_ALLOWED_WHILE_CANCELLATION_PENDING_ERROR } from '@/constants'

interface ICard {
  plan: SubscriptionPlanDTO | UpgradeSuggestionsDTO
  billingInterval: BillingInterval
  currentPlanId?: number | null
  currentBillingInterval?: BillingInterval | null
  /** The plan's place in the plan list, 1 for the smallest: drives the "LEVEL n" label and the chest. */
  level?: number
  /** Feature lines every shown plan has: the list says them once, so the card leaves them out. */
  sharedFeatureLines?: string[]
}

const props = withDefaults(defineProps<ICard>(), {
  currentPlanId: null,
  currentBillingInterval: null,
  level: 1,
  sharedFeatureLines: () => [],
})

const emit = defineEmits(['switchSuccessfully'])

const { campaign } = useCampaign()

const route = useRoute()
const { $toast } = useNuxtApp()
const { trackPayment } = useGtmEvents()
const { savePathRedirect } = usePayment()
const {
  startPaymentSubscription,
  loadingStartPaymentSubscription,
  switchSubscriptionPlan,
  loadingSwitchSubscriptionPlan,
  loadingResumeSubscription,
  resumeSubscription,
  getUserSubscription,
} = useSubscription()
const {
  billingSuffix,
  buildSubscriptionPlanCard,
  formatSubscriptionPlanCardPrice: formatPrice,
} = useSubscriptionPlanCard()

const showConfirmUpgradeModal = ref(false)
const previewAmount = ref<number | null>(null)
const previewCurrency = ref<SubscriptionCurrency | null>(null)
const showResumeModal = ref(false)
const confirmUpgradeError = ref<string | null>(null)
// Set when the bank wants the user to confirm the upgrade payment (3-D Secure / OTP): Stripe's payment page,
// opened in a new tab from a real link (a window.open after the API call would be blocked as a pop-up).
const paymentActionUrl = ref<string | null>(null)
const waitingForSwitch = ref(false)
let switchPollTimer: ReturnType<typeof setInterval> | null = null
let switchPollDeadline = 0
const SWITCH_POLL_INTERVAL_MS = 5000
const SWITCH_POLL_MAX_MS = 10 * 60 * 1000
const resumeError = ref<string | null>(null)

const card = computed(() => {
  return buildSubscriptionPlanCard({
    plan: props.plan,
    billingInterval: props.billingInterval,
    currentPlanId: props.currentPlanId,
    currentBillingInterval: props.currentBillingInterval,
  })
})

const campaignPrice = computed(() => card.value.selectedPrice?.campaignPrice ?? null)
const campaignPercent = computed(() => {
  const price = card.value.selectedPrice?.price
  return price && campaignPrice.value !== null ? Math.round((1 - campaignPrice.value / price) * 100) : 0
})
const campaignLabel = computed(() => campaign.value?.title || 'Sale')

const periodWord = computed(() => BILLING_INTERVAL_PERIOD_LABEL[props.billingInterval])
// The sale price is the first payment of a new subscription only, never of a switch.
const showCampaign = computed(() => campaignPrice.value !== null && !!card.value.selectedPrice && card.value.action.type === 'choose')
const struckPrice = computed(() => showCampaign.value ? card.value.selectedPrice!.price : card.value.strikeThroughMonthlyPrice)
const priceNote = computed(() => {
  const price = card.value.selectedPrice?.price
  if (price === undefined) return ''
  const amount = `$${formatPrice(price)} ${billingSuffix[props.billingInterval]}`
  if (showCampaign.value) return `${campaignLabel.value} -${campaignPercent.value}%: first ${periodWord.value}, then ${amount}`
  if (props.billingInterval !== 'Monthly') return `Billed ${amount} · cancel anytime`
  return 'Billed monthly · cancel anytime'
})
// featureLines[i] is featureGroups[i] in words ("Unlimited …" or "Use Gems for …"); lines every shown plan has are
// listed once under the cards instead.
const ownFeatures = computed(() => card.value.featureGroups
  .map((group, index) => {
    const line = card.value.featureLines[index] ?? ''
    return { line, description: group.description, unlimited: line === `Unlimited ${group.description}` }
  })
  .filter(feature => !props.sharedFeatureLines.includes(feature.line)))
const buttonLabel = computed(() => {
  const { action, title, isSamePlanIntervalMove } = card.value
  if (action.type === 'choose') return `Get ${title}`
  if (action.type !== 'switch') return action.label
  if (isSamePlanIntervalMove) return `Switch to ${props.billingInterval}`
  // The out-of-gems dialog only offers plans that give more gems: call it what it is.
  const isUpgrade = card.value.selectedPrice && 'canUpgrade' in card.value.selectedPrice && card.value.selectedPrice.canUpgrade
  return isUpgrade ? `Upgrade to ${title}` : `Switch to ${title}`
})

const switchTargetDescription = computed(() => {
  return card.value.isSamePlanIntervalMove ? `${props.billingInterval} billing` : `the ${card.value.title} plan`
})

const confirmUpgradeText = computed(() => {
  if (previewAmount.value === null) return `You'll switch to ${switchTargetDescription.value}.`

  return `You'll switch to ${switchTargetDescription.value} and be charged `
    + `${previewCurrency.value ?? ''} ${formatPrice(previewAmount.value)} right now.`
})

const chooseNewPlan = async () => {
  const payload = {
    gateway: 'Stripe' as PaymentGateway,
    billingInterval: props.billingInterval,
    confirm: true,
  }
  const response = await startPaymentSubscription(payload, props.plan.id)
  if (!response.succeeded || !response.data) return
  if (response.data.url) {
    savePathRedirect(route.fullPath)
    window.location.href = response.data.url
    return
  }
}

const stopWaitingForSwitch = () => {
  if (switchPollTimer) clearInterval(switchPollTimer)
  switchPollTimer = null
  waitingForSwitch.value = false
}

const closeConfirmUpgradeModal = () => {
  stopWaitingForSwitch()
  showConfirmUpgradeModal.value = false
  confirmUpgradeError.value = null
  paymentActionUrl.value = null
}

// After the user opens the payment page, the plan switches once Stripe tells the backend it's paid
// (invoice.paid webhook). Check the subscription until it's on the target plan, for a few minutes at most.
const checkSwitchApplied = async () => {
  if (Date.now() > switchPollDeadline) {
    stopWaitingForSwitch()
    return
  }

  const response = await getUserSubscription()
  const subscription = response.succeeded ? response.data : null
  if (subscription?.subscriptionPlanId === props.plan.id && subscription.billingInterval === props.billingInterval) {
    closeConfirmUpgradeModal()
    $toast.success(`You're now on ${switchTargetDescription.value}.`)
    emit('switchSuccessfully')
  }
}

const startWaitingForSwitch = () => {
  switchPollDeadline = Date.now() + SWITCH_POLL_MAX_MS
  if (switchPollTimer) return

  waitingForSwitch.value = true
  switchPollTimer = setInterval(checkSwitchApplied, SWITCH_POLL_INTERVAL_MS)
}

watch(showConfirmUpgradeModal, (show) => {
  if (!show) closeConfirmUpgradeModal()
})

onBeforeUnmount(stopWaitingForSwitch)

const switchPlan = async () => {
  const payload = {
    subscriptionPlanId: props.plan.id,
    billingInterval: props.billingInterval,
    confirm: false,
  }
  const response = await switchSubscriptionPlan(payload)
  if (response.succeeded && response.data) {
    previewAmount.value = response.data.previewAmount
    previewCurrency.value = response.data.previewCurrency
    confirmUpgradeError.value = null
    showConfirmUpgradeModal.value = true
  }
  if (!response.succeeded && response.errors && response.errors.length > 0) {
    const messages = response.errors.map(error => error.message)
    if (messages.includes(SWITCH_NOT_ALLOWED_WHILE_CANCELLATION_PENDING_ERROR)) {
      resumeError.value = null
      showResumeModal.value = true
    }
  }
}

const confirmUpgrade = async () => {
  confirmUpgradeError.value = null
  const payload = {
    subscriptionPlanId: props.plan.id,
    billingInterval: props.billingInterval,
    confirm: true,
  }
  const response = await switchSubscriptionPlan(payload)
  if (response.succeeded && response.data) {
    showConfirmUpgradeModal.value = false
    $toast.success(
      response.data.immediate
        ? `You're now on ${switchTargetDescription.value}.`
        : `You'll switch to ${switchTargetDescription.value} at the end of your current billing period(${response.data.effectiveDate}).`,
    )
    emit('switchSuccessfully')
    return
  }

  // Not a decline: the bank wants the user to confirm the payment (3-D Secure / OTP), which can't happen on
  // the off-session charge. The dialog now offers Stripe's payment page; the plan switches once it's paid there.
  if (response.data?.paymentActionUrl) {
    paymentActionUrl.value = response.data.paymentActionUrl
    return
  }

  // Not a decline either: the bank is still processing the payment. The plan switches by itself once it's
  // confirmed, so don't invite a retry.
  if (response.data?.paymentProcessing) {
    showConfirmUpgradeModal.value = false
    $toast.info(response.errors?.[0]?.message ?? 'Your payment is being processed by your bank. Your plan will switch automatically once it\'s confirmed.')
    return
  }

  if (response.errors && response.errors.length > 0) {
    const messages = response.errors.map(error => error.message)
    if (messages.includes(SWITCH_NOT_ALLOWED_WHILE_CANCELLATION_PENDING_ERROR)) {
      // Same resolution as the preview-time check in switchPlan(): this switch
      // can't proceed until the pending cancellation is reversed.
      showConfirmUpgradeModal.value = false
      showResumeModal.value = true
      return
    }

    // Any other failure: surface it as an alert in this same dialog instead of
    // leaving the user with no feedback (a toast is easy to miss behind a modal).
    confirmUpgradeError.value = response.errors[0].message
  }
  else {
    confirmUpgradeError.value = 'Something went wrong. Please try again.'
  }
}

const selectPlan = async () => {
  if (card.value.action.disabled) return

  trackPayment({
    route: route.fullPath,
  })

  if (card.value.action.type == 'choose') {
    await chooseNewPlan()
  }
  else if (card.value.action.type == 'switch') {
    await switchPlan()
  }
}

const closeResumeModal = () => {
  showResumeModal.value = false
  resumeError.value = null
}

const confirmResumeSubscription = async () => {
  resumeError.value = null
  const response = await resumeSubscription()

  if (response.succeeded && response.data) {
    showResumeModal.value = false
    await switchPlan()

    // switchPlan() re-opens showResumeModal itself if the retry hits the
    // exact same cancellation-pending error - most likely the backend hasn't
    // fully propagated the resume yet (eventual consistency). Surface that
    // explicitly instead of silently reopening the same modal with the same
    // generic text, which reads as if nothing happened and invites the user
    // to just keep clicking "confirm".
    if (showResumeModal.value) {
      resumeError.value = 'Your subscription was resumed, but switching plans right away didn\'t go through. Please wait a moment and try again.'
    }

    return
  }

  if (response.errors && response.errors.length > 0) {
    resumeError.value = response.errors[0].message
  }
  else {
    resumeError.value = 'Something went wrong resuming your subscription. Please try again.'
  }
}
</script>

<style scoped>
/* Only what Vuetify has no utility for: the solid "ledge" under the card and its button that makes them feel
   game-like, and the tilted badge sitting on the card's edge. */
.pack-card {
  box-shadow: 0 6px 0 rgb(var(--v-theme-borderSubtle));
}
.pack-card--main {
  box-shadow: 0 8px 0 rgb(var(--v-theme-primary));
}
.pack-card__badge {
  top: -14px;
  right: 20px;
  transform: rotate(3deg);
}
.pack-card__cta {
  box-shadow: 0 4px 0 rgb(var(--v-theme-brandNavy)) !important;
}
.pack-card__cta--main {
  box-shadow: 0 5px 0 rgb(var(--v-theme-primaryStrong)) !important;
}
</style>
