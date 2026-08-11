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
      class="empty-state w-100 bg-grey100 rounded-lg pa-6 d-flex flex-column align-center justify-center text-center"
    >
      <v-icon
        size="40"
        color="grey500"
      >
        md:subscriptions_outlined
      </v-icon>
      <span class="text-h5 text-grey700 font-weight-bold mt-3">No active subscription</span>
      <span class="text-h6 text-grey500 mt-1">You do not have a subscription to show right now.</span>
    </div>
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
  getUserSubscription,
} = useSubscription()

const headers = [
  { title: 'Feature Group', key: 'description', sortable: false, width: '24vw' },
  { title: 'Limit', key: 'limit', sortable: false, width: '16vw' },
  { title: 'Used', key: 'used', sortable: false, width: '16vw' },
  { title: 'Remaining', key: 'remaining', sortable: false, width: '16vw' },
  { title: 'Usage', key: 'usage', sortable: false, width: '28vw' },
]

const featureGroups = computed(() => userSubscription.value?.featureGroups ?? [])

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

onMounted(async () => {
  await getUserSubscription()
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
.empty-state {
  min-height: 280px;
}
</style>
