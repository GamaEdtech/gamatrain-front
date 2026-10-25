<template>
  <div class="offer-page w-100">
    <v-container class="offer-container pb-10 pb-md-16">
      <!-- Loading: the same shape as the offer, so nothing jumps when it arrives -->
      <v-row
        v-if="status === 'loading'"
        justify="center"
      >
        <v-col
          cols="12"
          md="6"
        >
          <v-skeleton-loader
            type="chip, heading, paragraph, list-item-two-line@3"
            color="transparent"
          />
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
          <v-skeleton-loader
            type="image, list-item-two-line, button"
            class="rounded-xl"
          />
        </v-col>
      </v-row>

      <!-- The offer -->
      <v-row
        v-else-if="status === 'ready' && offer"
        justify="center"
        align="start"
      >
        <v-col
          cols="12"
          md="6"
          class="order-1 pr-md-10"
        >
          <v-chip
            color="primary"
            variant="tonal"
            prepend-icon="md:bookmark"
            class="font-weight-bold mb-4"
          >
            Saved for you
          </v-chip>

          <h1 class="text-h3 text-md-h2 font-weight-bold text-grey900 mb-3">
            Your {{ offer.planTitle }} plan is still waiting
          </h1>
          <p class="text-h5 text-grey700 font-weight-regular mb-8">
            You started subscribing but didn't finish. Complete it now and get
            <b class="text-grey900">{{ offer.discountPercent }}% off</b> your first payment.
          </p>

          <div
            v-if="featureLines.length"
            class="d-none d-md-block mb-8"
          >
            <div class="text-h5 font-weight-bold text-grey800 mb-3">
              What's included
            </div>
            <div
              v-for="line in featureLines"
              :key="line"
              class="d-flex align-start ga-3 mb-2"
            >
              <v-icon
                color="success"
                size="20"
                class="mt-1"
              >
                md:check_circle
              </v-icon>
              <span class="text-h5 text-grey700">{{ line }}</span>
            </div>
          </div>

          <div class="d-none d-md-flex flex-wrap ga-6 text-grey700">
            <div
              v-for="item in trustItems"
              :key="item.text"
              class="d-flex align-center ga-2"
            >
              <v-icon
                size="20"
                color="grey700"
              >
                {{ item.icon }}
              </v-icon>
              <span class="text-h5">{{ item.text }}</span>
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="5"
          class="order-2"
        >
          <div class="summary-card rounded-xl bg-white pa-5 pa-sm-7">
            <div class="discount-ribbon text-h6 font-weight-bold">
              -{{ offer.discountPercent }}%
            </div>

            <div class="text-h6 text-grey400 font-weight-bold text-uppercase mb-1">
              {{ intervalLabel }} plan
            </div>
            <div class="text-h4 font-weight-bold text-grey900 mb-5">
              {{ offer.planTitle }}
            </div>

            <div class="d-flex align-end flex-wrap ga-2">
              <span class="price-now font-weight-bold text-grey900">{{ money(offer.discountedPrice) }}</span>
              <span class="text-h5 text-grey400 text-decoration-line-through mb-2">{{ money(offer.price) }}</span>
            </div>
            <div class="text-h5 text-grey700 mb-3">
              for your first {{ periodLabel }}
            </div>
            <v-chip
              color="success"
              variant="tonal"
              prepend-icon="md:savings"
              class="font-weight-bold"
            >
              You save {{ money(savings) }}
            </v-chip>

            <v-divider class="my-5" />

            <div class="d-flex justify-space-between text-h5 mb-2">
              <span class="text-grey700">Today</span>
              <span class="font-weight-bold text-grey900">{{ money(offer.discountedPrice) }}</span>
            </div>
            <div class="d-flex justify-space-between text-h5">
              <span class="text-grey700">Then</span>
              <span class="text-grey900">{{ money(offer.price) }} {{ billingSuffix }}</span>
            </div>

            <v-btn
              block
              color="primary"
              rounded="pill"
              height="52"
              class="text-h5 text-grey900 font-weight-bold mt-6"
              flat
              append-icon="md:arrow_forward"
              :loading="loadingRedeemOffer"
              @click="redeem"
            >
              Continue to checkout
            </v-btn>
            <div
              v-if="redeemError"
              class="text-h6 text-error text-center mt-3"
            >
              {{ redeemError }}
            </div>
            <div class="text-h6 text-grey400 text-center mt-3">
              Discount already applied on the next page. No code needed.
            </div>

            <div
              :class="`expiry-row d-flex align-center justify-center ga-2 rounded-lg pa-3 mt-5 ${expiresSoon ? 'expires-soon' : ''}`"
            >
              <v-icon
                size="18"
                :color="expiresSoon ? 'warning' : 'grey700'"
              >
                md:schedule
              </v-icon>
              <span class="text-h6 text-grey800">
                Offer ends {{ expiryDate }}<template v-if="daysLeft !== null"> &middot; <b>{{ daysLeftLabel }}</b></template>
              </span>
            </div>
          </div>

          <!-- Mobile: what's included and trust points follow the price -->
          <div
            v-if="featureLines.length"
            class="d-md-none mt-6"
          >
            <div class="text-h5 font-weight-bold text-grey800 mb-3">
              What's included
            </div>
            <div
              v-for="line in featureLines"
              :key="line"
              class="d-flex align-start ga-3 mb-2"
            >
              <v-icon
                color="success"
                size="20"
                class="mt-1"
              >
                md:check_circle
              </v-icon>
              <span class="text-h5 text-grey700">{{ line }}</span>
            </div>
          </div>
          <div class="d-md-none d-flex flex-column ga-2 mt-6 text-grey700">
            <div
              v-for="item in trustItems"
              :key="item.text"
              class="d-flex align-center ga-2"
            >
              <v-icon
                size="18"
                color="grey700"
              >
                {{ item.icon }}
              </v-icon>
              <span class="text-h5">{{ item.text }}</span>
            </div>
          </div>

          <div class="text-center mt-6">
            <nuxt-link
              to="/user/subscription"
              class="text-h6 text-primary font-weight-bold text-decoration-none"
            >
              See all plans
            </nuxt-link>
          </div>
        </v-col>
      </v-row>

      <!-- Signed out, expired, already subscribed, bad link -->
      <v-row
        v-else
        justify="center"
      >
        <v-col
          cols="12"
          sm="9"
          md="6"
          lg="5"
        >
          <div class="state-card rounded-xl bg-white d-flex flex-column align-center text-center ga-4 pa-6 pa-sm-10">
            <div
              class="state-icon d-flex align-center justify-center rounded-circle"
              :style="{ background: `rgba(var(--v-theme-${state.color}), 0.14)` }"
            >
              <v-icon
                size="36"
                :color="state.color"
              >
                {{ state.icon }}
              </v-icon>
            </div>

            <h1 class="text-h3 font-weight-bold text-grey900">
              {{ state.title }}
            </h1>
            <p class="text-h5 text-grey700 font-weight-regular">
              {{ state.description }}
            </p>

            <v-btn
              v-if="status === 'signIn'"
              block
              color="primary"
              rounded="pill"
              height="48"
              class="text-h5 text-grey900 font-weight-bold mt-2"
              flat
              prepend-icon="md:login"
              @click="openSignIn"
            >
              Sign in to see my offer
            </v-btn>
            <v-btn
              v-else
              block
              color="primary"
              rounded="pill"
              height="48"
              class="text-h5 text-grey900 font-weight-bold mt-2"
              flat
              :to="state.actionTo"
            >
              {{ state.actionLabel }}
            </v-btn>

            <nuxt-link
              v-if="status === 'signIn'"
              to="/user/subscription"
              class="text-h6 text-primary font-weight-bold text-decoration-none"
            >
              See all plans
            </nuxt-link>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import type { CheckoutRecoveryOfferDTO } from '@/types'
import { BILLING_INTERVAL_PERIOD_LABEL, BILLING_INTERVAL_SUFFIX } from '@/constants'

type OfferStatus = 'loading' | 'ready' | 'signIn' | 'missingToken' | 'invalid' | 'expired' | 'unavailable' | 'error'
type StateStatus = Exclude<OfferStatus, 'loading' | 'ready'>

// Public route: a signed-out visitor from the email gets a sign-in prompt here (the auth middleware would send them
// home and lose the link's token).
definePageMeta({
  auth: false,
})

useSeoMeta({
  title: 'Your Subscription Offer',
  description: 'Finish your GamaTrain subscription with a discount on your first payment.',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const { savePathRedirect } = usePayment()
const { getOffer, redeemOffer, loadingRedeemOffer } = useCheckoutOffer()
const { data: plans, getData: getPlans } = useSubscription()
const {
  formatSubscriptionPlanCardPrice: formatPrice,
  formatSubscriptionPlanFeatureLine,
} = useSubscriptionPlanCard()

const status = ref<OfferStatus>('loading')
const offer = ref<CheckoutRecoveryOfferDTO | null>(null)
const redeemError = ref('')

const trustItems = [
  { icon: 'md:lock', text: 'Secure payment by Stripe' },
  { icon: 'md:event_repeat', text: 'Cancel anytime from your account' },
]

const states: Record<StateStatus, { title: string, description: string, icon: string, color: string, actionLabel: string, actionTo: string }> = {
  signIn: {
    title: 'You have an offer waiting',
    description: 'Sign in with the account you used to start your subscription to see your discount.',
    icon: 'md:redeem',
    color: 'primary',
    actionLabel: '',
    actionTo: '',
  },
  missingToken: {
    title: 'This offer link is incomplete',
    description: 'Please open the link from your email again.',
    icon: 'md:link_off',
    color: 'error',
    actionLabel: 'See plans',
    actionTo: '/user/subscription',
  },
  invalid: {
    title: 'This offer isn\'t available',
    description: 'The link is invalid or belongs to another account. Make sure you\'re signed in with the account the email was sent to.',
    icon: 'md:error',
    color: 'error',
    actionLabel: 'See plans',
    actionTo: '/user/subscription',
  },
  expired: {
    title: 'This offer has ended',
    description: 'The discount is no longer available, but you can still subscribe at the regular price.',
    icon: 'md:schedule',
    color: 'warning',
    actionLabel: 'See plans',
    actionTo: '/user/subscription',
  },
  unavailable: {
    title: 'You\'re already subscribed',
    description: 'This offer is for a first payment only, and your account already has a subscription.',
    icon: 'md:verified',
    color: 'success',
    actionLabel: 'Go to my subscription',
    actionTo: '/user/subscription',
  },
  error: {
    title: 'Something went wrong',
    description: 'We couldn\'t load your offer. Please try the link again in a moment.',
    icon: 'md:error',
    color: 'error',
    actionLabel: 'Go to home',
    actionTo: '/',
  },
}

const errorStatus: Record<string, OfferStatus> = {
  CheckoutRecoveryOfferNotFound: 'invalid',
  CheckoutRecoveryOfferExpired: 'expired',
  CheckoutRecoveryOfferNotAvailable: 'unavailable',
}

const DAY_MS = 24 * 60 * 60 * 1000

const token = computed(() => {
  const value = route.query.token
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? ''
})

const state = computed(() => states[status.value as StateStatus] ?? states.error)

const money = (value: number) =>
  offer.value?.currency === 'USD' || !offer.value ? `$${formatPrice(value)}` : `${formatPrice(value)} ${offer.value.currency}`

const savings = computed(() => offer.value ? Math.round((offer.value.price - offer.value.discountedPrice) * 100) / 100 : 0)
const periodLabel = computed(() => offer.value ? BILLING_INTERVAL_PERIOD_LABEL[offer.value.billingInterval] : '')
const billingSuffix = computed(() => offer.value ? BILLING_INTERVAL_SUFFIX[offer.value.billingInterval] : '')
const intervalLabel = computed(() => offer.value?.billingInterval === 'Annual' ? 'Yearly' : offer.value?.billingInterval ?? '')

const expiration = computed(() => offer.value ? new Date(offer.value.expirationDate) : null)
const expiryDate = computed(() => expiration.value?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) ?? '')
const daysLeft = computed(() => {
  if (!expiration.value || Number.isNaN(expiration.value.getTime())) return null
  return Math.max(0, Math.ceil((expiration.value.getTime() - Date.now()) / DAY_MS))
})
const daysLeftLabel = computed(() => {
  if (daysLeft.value === null) return ''
  if (daysLeft.value <= 1) return 'last day'
  return `${daysLeft.value} days left`
})
const expiresSoon = computed(() => daysLeft.value !== null && daysLeft.value <= 2)

// What the plan gives, from the public plan list; the offer still shows without it.
const featureLines = computed(() => {
  if (!offer.value) return []
  const plan = plans.value?.plans.find(item => item.id === offer.value!.subscriptionPlanId)
  return (plan?.featureGroups ?? []).slice(0, 6).map(group => formatSubscriptionPlanFeatureLine(group, offer.value!.billingInterval))
})

const statusFromErrors = (errors?: { message: string }[] | null): OfferStatus =>
  errors?.map(error => errorStatus[error.message]).find(Boolean) ?? 'error'

const loadOffer = async () => {
  if (!token.value) {
    status.value = 'missingToken'
    return
  }

  if (!auth.isAuthenticated.value) {
    status.value = 'signIn'
    return
  }

  status.value = 'loading'
  const response = await getOffer(token.value)
  if (response.succeeded && response.data) {
    offer.value = response.data
    status.value = 'ready'
    getPlans()
    return
  }

  status.value = statusFromErrors(response.errors)
}

// Keeps the token in the URL: the header opens the login dialog for auth_form=login, and auth_noredirect leaves the
// query as it is, so the watcher below picks the offer up once the visitor signs in.
const openSignIn = () => {
  router.push({ query: { ...route.query, auth_form: 'login', auth_noredirect: 'true' } })
}

const redeem = async () => {
  redeemError.value = ''
  const response = await redeemOffer(token.value)
  if (response.succeeded && response.data?.url) {
    savePathRedirect('/user/subscription')
    window.location.href = response.data.url
    return
  }

  const next = statusFromErrors(response.errors)
  if (next === 'error') {
    redeemError.value = 'We couldn\'t open the checkout. Please try again.'
    return
  }

  status.value = next
}

watch(() => auth.isAuthenticated.value, (signedIn) => {
  if (signedIn && status.value === 'signIn') loadOffer()
})

onMounted(() => {
  loadOffer()
})
</script>

<style scoped>
.offer-page {
  min-height: 70vh;
  background: linear-gradient(180deg, rgb(var(--v-theme-grey100)) 0%, rgb(var(--v-theme-white)) 60%);
}

.offer-container {
  max-width: 1100px;
  /* clears the fixed header */
  padding-top: 96px;
}

@media (min-width: 960px) {
  .offer-container {
    padding-top: 128px;
  }
}

.summary-card,
.state-card {
  position: relative;
  border: 1px solid rgba(var(--v-theme-grey400), 0.25);
  box-shadow: 0 12px 40px rgba(16, 24, 40, 0.08);
  overflow: hidden;
}

.discount-ribbon {
  position: absolute;
  top: 18px;
  right: -34px;
  width: 140px;
  padding: 4px 0;
  text-align: center;
  transform: rotate(45deg);
  color: rgb(var(--v-theme-white));
  background: rgb(var(--v-theme-success));
}

.price-now {
  font-size: 3.25rem;
  line-height: 1;
}

.expiry-row {
  background: rgb(var(--v-theme-grey100));
}

.expiry-row.expires-soon {
  background: rgba(var(--v-theme-warning), 0.12);
}

.state-icon {
  width: 72px;
  height: 72px;
}
</style>
