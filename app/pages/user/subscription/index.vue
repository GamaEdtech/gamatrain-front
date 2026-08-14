<template>
  <div class="w-100 d-flex flex-column align-start justify-start ga-5">
    <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey700">
          Subscription
        </h1>
        <p class="text-h6 text-grey500 font-weight-regular mt-1 mb-0">
          Current plan and usage details
        </p>
      </div>

      <div
        v-if="userSubscription && !loadingGetUserSubscription"
        class="d-flex align-center justify-end ga-3 flex-wrap"
      >
        <v-chip
          v-if="renewalBadge"
          :color="renewalBadge.color"
          class="text-h6 font-weight-bold"
        >
          <v-icon
            start
            size="18"
          >
            {{ renewalBadge.icon }}
          </v-icon>
          {{ renewalBadge.text }}
        </v-chip>

        <v-btn
          v-if="showCancelButton"
          rounded="pill"
          color="lightError"
          height="40"
          flat
          :loading="loadingCancelSubscription"
          class="text-h5 font-weight-bold text-white"
          @click="showCancelModal = true"
        >
          Cancel subscription
        </v-btn>

        <v-btn
          v-if="showResumeButton"
          rounded="pill"
          color="warning"
          height="40"
          flat
          :loading="loadingResumeSubscription"
          class="text-h5 font-weight-bold text-white"
          @click="showResumeModal = true"
        >
          Resume subscription
        </v-btn>
      </div>
    </div>

    <template v-if="loadingGetUserSubscription">
      <v-row class="w-100 ma-0">
        <v-col
          v-for="i in 4"
          :key="i"
          cols="12"
          sm="6"
          lg="3"
        >
          <v-skeleton-loader
            height="116"
            class="rounded-lg"
          />
        </v-col>
        <v-col cols="12">
          <v-skeleton-loader
            height="360"
            class="rounded-lg"
          />
        </v-col>
      </v-row>
    </template>

    <template v-else-if="userSubscription">
      <v-row class="w-100 ma-0">
        <v-col
          v-for="item in summaryItems"
          :key="item.title"
          cols="12"
          sm="6"
          lg="3"
        >
          <div class="summary-card bg-grey100 rounded-lg pa-4 d-flex flex-column justify-space-between">
            <div class="d-flex align-center justify-space-between">
              <span class="text-h6 text-grey500 font-weight-medium">{{ item.title }}</span>
              <v-icon
                size="22"
                :color="item.iconColor"
              >
                {{ item.icon }}
              </v-icon>
            </div>
            <span :class="`${item.colorClass} text-h4 font-weight-bold mt-3 text-truncate`">
              {{ item.value }}
            </span>
          </div>
        </v-col>
      </v-row>

      <!-- Start Desktop -->
      <div class="w-100 mt-2 d-none d-sm-flex">
        <v-data-table
          :headers="headers"
          :items="featureGroups"
          :items-per-page="featureGroups.length || 1"
          class="elevation-1 set-height-table"
          fixed-header
          hide-default-footer
        >
          <template #headers="{ columns }">
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="index"
                :class="`bg-grey100 text-grey700 text-h5 font-weight-medium pa-2 text-center
                 ${index == 0 ? `text-start` : `th-min-width`}`"
              >
                {{ column.title }}
              </th>
            </tr>
          </template>

          <template #[`item.description`]="{ item }">
            <div class="text-grey700 text-h6 d-flex justify-start align-center font-weight-medium description-width">
              {{ item.description || featureNames(item) }}
            </div>
          </template>

          <template #[`item.limit`]="{ item }">
            <div class="text-grey700 text-h6 d-flex justify-center align-center font-weight-bold">
              {{ formatLimit(item.limit) }}
            </div>
          </template>

          <template #[`item.used`]="{ item }">
            <div class="text-grey700 text-h6 d-flex justify-center align-center font-weight-bold">
              {{ $numberFormat(item.used) }}
            </div>
          </template>

          <template #[`item.remaining`]="{ item }">
            <div class="text-grey700 text-h6 d-flex justify-center align-center font-weight-bold">
              {{ formatRemaining(item) }}
            </div>
          </template>

          <template #[`item.usage`]="{ item }">
            <div class="usage-cell d-flex flex-column ga-1 py-2">
              <div class="w-100 d-flex justify-space-between text-subtitle-1 text-grey500">
                <span>{{ usageLabel(item) }}</span>
              </div>
              <v-progress-linear
                :model-value="usagePercent(item)"
                :color="item.limit === null ? `success` : `primary`"
                height="8"
                rounded
              />
            </div>
          </template>
        </v-data-table>
      </div>
      <!-- End Desktop -->

      <div class="w-100 d-flex d-sm-none flex-column align-start justify-start">
        <div
          v-for="(item, index) in featureGroups"
          :key="index"
          :class="`${index % 2 == 0 ? `bg-grey25 border-odd` : ``} card-feature-mobile w-100 d-flex flex-column align-start justify-start ga-3 pa-4`"
        >
          <span class="text-grey700 text-h6 font-weight-medium">
            {{ item.description || featureNames(item) }}
          </span>
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey500 text-h6">Limit</span>
            <span class="text-grey700 text-h6 font-weight-bold">{{ formatLimit(item.limit) }}</span>
          </div>
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey500 text-h6">Used</span>
            <span class="text-grey700 text-h6 font-weight-bold">{{ $numberFormat(item.used) }}</span>
          </div>
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey500 text-h6">Remaining</span>
            <span class="text-grey700 text-h6 font-weight-bold">{{ formatRemaining(item) }}</span>
          </div>
          <v-progress-linear
            :model-value="usagePercent(item)"
            :color="item.limit === null ? `success` : `primary`"
            height="8"
            rounded
          />
        </div>
      </div>
    </template>

    <div
      v-else
      class="w-100 d-flex flex-column align-start justify-start ga-2"
    >
      <span class="text-h5 text-grey700 font-weight-bold">Choose a plan to get started</span>
      <span class="text-h6 text-grey500">
        You don't have an active subscription yet - pick a plan below to unlock premium downloads.
      </span>

      <common-modal-payment
        :plans="plansData?.plans || []"
        :billing-interval="plansData?.availableBillingIntervals || []"
        :loading="loadingGetPlansData"
        :show-limited-access-link="false"
      />
    </div>

    <common-modal-base
      v-model:show-dialog="showCancelModal"
      title="Cancel your subscription?"
      :max-width="480"
    >
      <user-subscription-modals-confirm
        :text="getCancelModalText()"
        confirm-color="lightError"
        :loading="loadingCancelSubscription"
        @back="showCancelModal = false"
        @confirm="confirmCancelSubscription"
      />
    </common-modal-base>

    <common-modal-base
      v-model:show-dialog="showResumeModal"
      title="Resume your subscription?"
      :max-width="480"
    >
      <user-subscription-modals-confirm
        :text="getResumeModalText()"
        confirm-color="primary"
        :loading="loadingResumeSubscription"
        @back="showResumeModal = false"
        @confirm="confirmResumeSubscription"
      />
    </common-modal-base>
  </div>
</template>

<script setup lang="ts">
import type { FeatureGroupUserSubscriptionDTO } from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth'],
})

useHead({
  title: 'Subscription',
  meta: [
    { name: 'description', content: 'View your current subscription plan and feature usage' },
  ],
})

const { $numberFormat } = useNuxtApp()
const { formatLocal } = useDateTime()
const {
  userSubscription,
  loadingGetUserSubscription,
  loadingCancelSubscription,
  loadingResumeSubscription,
  getUserSubscription,
  cancelSubscription,
  resumeSubscription,
  data: plansData,
  loadingGetData: loadingGetPlansData,
  getData: getPlans,
} = useSubscription()

const showCancelModal = ref(false)
const showResumeModal = ref(false)

const headers = [
  { title: 'Feature Group', key: 'description', sortable: false, width: '24vw' },
  { title: 'Limit', key: 'limit', sortable: false, width: '16vw' },
  { title: 'Used', key: 'used', sortable: false, width: '16vw' },
  { title: 'Remaining', key: 'remaining', sortable: false, width: '16vw' },
  { title: 'Usage', key: 'usage', sortable: false, width: '28vw' },
]

const featureGroups = computed(() => userSubscription.value?.featureGroups ?? [])

const formattedExpirationDate = computed(() => {
  return formatLocal(userSubscription.value?.expirationDate, 'MMM D, YYYY')
})

const showCancelButton = computed(() => {
  return userSubscription.value?.autoRenews === true && userSubscription.value.cancelAtPeriodEnd === false
})

const showResumeButton = computed(() => {
  return userSubscription.value?.autoRenews === true && userSubscription.value.cancelAtPeriodEnd === true
})

const renewalBadge = computed(() => {
  if (!userSubscription.value?.autoRenews) return null

  if (userSubscription.value.cancelAtPeriodEnd) {
    return {
      color: 'warning',
      icon: 'md:event_busy',
      text: `Ends ${formattedExpirationDate.value} - won't renew`,
    }
  }

  return {
    color: 'success',
    icon: 'md:autorenew',
    text: `Active - auto-renews ${formattedExpirationDate.value}`,
  }
})

const billingPeriod = computed(() => {
  switch (userSubscription.value?.billingInterval) {
    case 'Daily':
      return 'day'
    case 'Weekly':
      return 'week'
    case 'Monthly':
      return 'month'
    case 'Seasonally':
      return 'season'
    case 'Yearly':
      return 'year'
    default:
      return 'period'
  }
})

const getFormattedSubscriptionPrice = () => {
  if (!userSubscription.value) return ''

  return `${userSubscription.value.currency} ${$numberFormat(userSubscription.value.pricePaid)}/${billingPeriod.value}`
}

const getCancelModalText = () => {
  return `You'll keep full access until ${formattedExpirationDate.value} after that it won't renew. This can be undone any time`
}

const getResumeModalText = () => {
  return `You'll go back to auto-renewing on ${formattedExpirationDate.value} at ${getFormattedSubscriptionPrice()}.`
}

const formatLimit = (value: number | null) => {
  return value === null ? 'Unlimited' : $numberFormat(value)
}

const formatRemaining = (item: FeatureGroupUserSubscriptionDTO) => {
  if (item.limit === null) return 'Unlimited'

  return formatLimit(item.remaining)
}

const featureNames = (item: FeatureGroupUserSubscriptionDTO) => {
  return item.features.map(feature => feature.featureName).join(', ')
}

const usagePercent = (item: FeatureGroupUserSubscriptionDTO) => {
  if (item.limit === null) return 100
  if (item.limit <= 0) return 0

  return Math.min(Math.round((item.used / item.limit) * 100), 100)
}

const usageLabel = (item: FeatureGroupUserSubscriptionDTO) => {
  if (item.limit === null) return 'Unlimited'

  return `${usagePercent(item)}% used`
}

const statusConfig = computed(() => {
  const status = userSubscription.value?.status

  switch (status) {
    case 'Active':
      return {
        icon: 'md:verified',
        iconColor: 'success',
        colorClass: 'text-success',
      }
    case 'Pending':
      return {
        icon: 'md:pending',
        iconColor: 'warning',
        colorClass: 'text-warning',
      }
    case 'Expired':
      return {
        icon: 'md:event_busy',
        iconColor: 'lightError',
        colorClass: 'text-lightError',
      }
    case 'Cancelled':
      return {
        icon: 'md:cancel',
        iconColor: 'grey500',
        colorClass: 'text-grey500',
      }
    default:
      return {
        icon: 'md:help',
        iconColor: 'grey500',
        colorClass: 'text-grey700',
      }
  }
})

const summaryItems = computed(() => {
  if (!userSubscription.value) return []

  return [
    {
      title: 'Plan',
      value: userSubscription.value.planTitle,
      icon: 'md:workspace_premium',
      iconColor: 'grey500',
      colorClass: 'text-grey700',
    },
    {
      title: 'Status',
      value: userSubscription.value.status,
      icon: statusConfig.value.icon,
      iconColor: statusConfig.value.iconColor,
      colorClass: statusConfig.value.colorClass,
    },
    {
      title: 'Billing',
      value: userSubscription.value.billingInterval,
      icon: 'md:repeat',
      iconColor: 'grey500',
      colorClass: 'text-grey700',
    },
    {
      title: 'Paid',
      value: `${userSubscription.value.currency} ${$numberFormat(userSubscription.value.pricePaid)}`,
      icon: 'md:payments',
      iconColor: 'grey500',
      colorClass: 'text-grey700',
    },
    {
      title: 'Started',
      value: formatLocal(userSubscription.value.startDate, 'DD/MM/YYYY'),
      icon: 'md:calendar_today',
      iconColor: 'grey500',
      colorClass: 'text-grey700',
    },
    {
      title: 'Expires',
      value: formatLocal(userSubscription.value.expirationDate, 'DD/MM/YYYY'),
      icon: 'md:event',
      iconColor: 'grey500',
      colorClass: 'text-grey700',
    },
  ]
})

const confirmCancelSubscription = async () => {
  const response = await cancelSubscription()

  if (response.succeeded && response.data) {
    showCancelModal.value = false
    await getUserSubscription()
  }
}

const confirmResumeSubscription = async () => {
  const response = await resumeSubscription()

  if (response.succeeded && response.data) {
    showResumeModal.value = false
    await getUserSubscription()
  }
}

onMounted(async () => {
  await getUserSubscription()

  // subscriptions/me comes back with no data when the user has no active subscription (not an error -
  // see the fix in useSubscription.api.ts) - only then is there anything to suggest, so only then fetch
  // the plan list to fill the same card/payment component used elsewhere for choosing a plan.
  if (!userSubscription.value) {
    await getPlans()
  }
})
</script>

<style scoped>
.summary-card {
  min-height: 116px;
}
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.description-width {
  min-width: 200px;
}
.usage-cell {
  min-width: 160px;
}
.border-odd {
  border-top: 2px solid rgb(var(--v-theme-grey100));
  border-bottom: 2px solid rgb(var(--v-theme-grey100));
}
.card-feature-mobile {
  min-height: 190px;
}
</style>
