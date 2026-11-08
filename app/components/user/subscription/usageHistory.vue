<template>
  <div
    v-if="hasAnyUsage || hasBillingPeriod"
    class="w-100 d-flex flex-column align-start justify-start ga-4"
  >
    <div class="w-100 d-flex align-center justify-space-between flex-wrap ga-3">
      <span class="text-h6 font-weight-bold text-grey700">Usage History</span>

      <v-select
        v-model="period"
        :items="periodOptions"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="compact"
        rounded="pill"
        hide-details
        prepend-inner-icon="md:date_range"
        class="period-select flex-grow-0"
      />
    </div>

    <!-- Per-feature totals for the period; a chip also filters the list to that feature. -->
    <v-chip-group
      v-if="loadingUsageSummary || usageSummary.length > 0"
      v-model="featureCode"
      selected-class="text-primary"
      column
    >
      <template v-if="loadingUsageSummary">
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          type="chip"
          width="180"
        />
      </template>
      <template v-else>
        <v-chip
          v-for="item in usageSummary"
          :key="item.featureCode"
          :value="item.featureCode"
          filter
          variant="outlined"
          class="text-caption font-weight-medium"
        >
          <v-icon
            start
            size="18"
          >
            {{ featureMeta(item.featureCode).icon }}
          </v-icon>
          <span class="font-weight-bold mr-1">{{ item.featureName || item.featureCode }}</span>
          <span class="text-grey500">
            {{ $numberFormat(item.totalAmount) }} Gems · {{ item.useCount }} {{ item.useCount === 1 ? 'use' : 'uses' }}
          </span>
        </v-chip>
      </template>
    </v-chip-group>

    <div class="w-100 bg-grey25 rounded-lg">
      <template v-if="loadingUsage && usage.length === 0">
        <div
          v-for="i in 4"
          :key="i"
          class="pa-4"
        >
          <v-skeleton-loader
            type="list-item-avatar-two-line"
            class="bg-transparent"
          />
        </div>
      </template>

      <div
        v-else-if="usage.length === 0"
        class="w-100 d-flex flex-column align-center justify-center text-center ga-2 pa-8"
      >
        <v-icon
          size="40"
          color="grey400"
        >
          md:history
        </v-icon>
        <span class="text-body-1 font-weight-bold text-grey700">Nothing used in this period</span>
        <span class="text-caption font-weight-medium text-grey500">Premium downloads and exam analyses you use will show up here.</span>
        <v-btn
          to="/search?type=paper"
          rounded="pill"
          color="primary"
          variant="tonal"
          class="text-none text-caption font-weight-bold mt-2"
        >
          Browse past papers
        </v-btn>
      </div>

      <v-list
        v-else
        bg-color="transparent"
        class="py-0"
      >
        <template
          v-for="group in groupedUsage"
          :key="group.label"
        >
          <v-list-subheader class="text-caption font-weight-bold text-grey500 text-uppercase">
            {{ group.label }}
          </v-list-subheader>

          <v-list-item
            v-for="item in group.items"
            :key="item.id"
            class="usage-row py-3"
          >
            <template #prepend>
              <v-avatar
                :color="item.amount < 0 ? 'success' : 'primary'"
                variant="tonal"
                size="40"
              >
                <v-icon size="20">
                  {{ featureMeta(item.featureCode).icon }}
                </v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="text-body-1 font-weight-bold text-grey700 text-wrap">
              {{ item.featureName || item.featureCode }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption font-weight-medium text-grey500 d-flex align-center flex-wrap ga-1 mt-1">
              <NuxtLink
                v-if="contentPath(item)"
                :to="contentPath(item)!"
                class="text-grey700 font-weight-medium"
              >
                {{ contentLabel(item) }}
                <v-icon
                  size="14"
                  color="grey500"
                >
                  md:open_in_new
                </v-icon>
              </NuxtLink>
              <span v-else-if="item.identifierId">{{ contentLabel(item) }}</span>
              <span
                v-if="item.planTitle"
                class="d-none d-sm-inline"
              >· {{ item.planTitle }}</span>
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end ga-1 ml-3">
                <span
                  :class="`text-body-1 font-weight-bold text-no-wrap ${item.amount < 0 ? 'text-success' : 'text-grey700'}`"
                >
                  {{ amountLabel(item.amount) }}
                </span>
                <v-tooltip
                  :text="formatLocal(item.creationDate, 'MMM D, YYYY HH:mm')"
                  location="top"
                >
                  <template #activator="{ props: tooltipProps }">
                    <span
                      v-bind="tooltipProps"
                      class="text-caption text-grey500 text-no-wrap"
                    >
                      {{ fromNowLocal(item.creationDate) }}
                    </span>
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </div>

    <div
      v-if="usage.length < usageTotalCount"
      class="w-100 d-flex justify-center"
    >
      <v-btn
        rounded="pill"
        variant="outlined"
        color="primary"
        :loading="loadingUsage"
        class="text-none text-caption font-weight-bold"
        @click="loadMore"
      >
        Load more
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserSubscriptionDTO, UserSubscriptionUsageDTO, UserSubscriptionUsagePeriod } from '@/types'
import { SUBSCRIPTION_USAGE_FEATURES, SUBSCRIPTION_USAGE_PERIODS } from '@/constants'

const props = defineProps<{
  // The current subscription, when there is one: "This billing period" is measured from it.
  subscription: UserSubscriptionDTO | null
}>()

const PAGE_SIZE = 20
// The summary needs a range; "All time" starts well before any subscription existed.
const ALL_TIME_START = '2020-01-01T00:00:00Z'
const BILLING_PERIOD_LENGTH = {
  Daily: { value: 1, unit: 'day' },
  Weekly: { value: 1, unit: 'week' },
  Monthly: { value: 1, unit: 'month' },
  Quarterly: { value: 3, unit: 'month' },
  Annual: { value: 1, unit: 'year' },
} as const

const { $numberFormat, $dayjs } = useNuxtApp()
const { local, formatLocal, fromNowLocal } = useDateTime()
const { usage, usageTotalCount, loadingUsage, getUsage, usageSummary, loadingUsageSummary, getUsageSummary } = useSubscriptionUsage()

const hasBillingPeriod = computed(() => props.subscription?.status === 'Active' && !!props.subscription.expirationDate)
const periodOptions = computed(() => SUBSCRIPTION_USAGE_PERIODS.filter(t => t.value !== 'billingPeriod' || hasBillingPeriod.value))

const period = ref<UserSubscriptionUsagePeriod>(hasBillingPeriod.value ? 'billingPeriod' : 'last30Days')
const featureCode = ref<string | null>(null)
const page = ref(1)
// Stays true once anything was found, so switching to an empty period shows the empty state, not nothing.
const hasAnyUsage = ref(false)

// The current period is the plan's interval counted back from its expiry, never before the start date:
// that is the window the Used/Remaining numbers above count.
const periodStart = computed(() => {
  const now = $dayjs()
  if (period.value === 'allTime') return ALL_TIME_START
  if (period.value === 'last30Days' || !props.subscription) return now.subtract(30, 'day').toISOString()

  const length = BILLING_PERIOD_LENGTH[props.subscription.billingInterval]
  const fromExpiry = local(props.subscription.expirationDate)?.subtract(length.value, length.unit)
  const start = local(props.subscription.startDate)
  if (!fromExpiry) return now.subtract(30, 'day').toISOString()

  return (start && start.isAfter(fromExpiry) ? start : fromExpiry).toISOString()
})

const featureMeta = (code: string) => SUBSCRIPTION_USAGE_FEATURES[code] ?? { icon: 'md:toll', contentLabel: 'Item' }

const contentPath = (item: UserSubscriptionUsageDTO) => {
  const path = featureMeta(item.featureCode).path
  return item.identifierId && path ? path(item.identifierId) : null
}

const contentLabel = (item: UserSubscriptionUsageDTO) => `${featureMeta(item.featureCode).contentLabel} #${item.identifierId}`

const amountLabel = (amount: number) => amount < 0
  ? `+${$numberFormat(-amount)} Refunded`
  : `−${$numberFormat(amount)} Gems`

const groupedUsage = computed(() => {
  const today = $dayjs().startOf('day')
  const groups: { label: string, items: UserSubscriptionUsageDTO[] }[] = []

  for (const item of usage.value) {
    const day = local(item.creationDate)?.startOf('day')
    const diff = day ? today.diff(day, 'day') : null
    const label = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : (day?.format('MMM D, YYYY') ?? '')
    const last = groups.at(-1)

    if (last?.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }

  return groups
})

const fetchUsage = async (append = false) => {
  await getUsage({
    page: page.value,
    pageSize: PAGE_SIZE,
    featureCode: featureCode.value,
    fromDate: periodStart.value,
  }, append)
  if (usage.value.length > 0) hasAnyUsage.value = true
}

const fetchSummary = async () => {
  await getUsageSummary(periodStart.value, $dayjs().toISOString())
}

const loadMore = async () => {
  page.value += 1
  await fetchUsage(true)
}

watch(period, async () => {
  page.value = 1
  featureCode.value = null
  await Promise.all([fetchUsage(), fetchSummary()])
})

watch(featureCode, async () => {
  page.value = 1
  await fetchUsage()
})

onMounted(async () => {
  await Promise.all([fetchUsage(), fetchSummary()])

  // Nothing in the default window: check for older usage before hiding the section altogether.
  if (!hasAnyUsage.value && period.value !== 'allTime') {
    const response = await getUsage({ page: 1, pageSize: 1, fromDate: ALL_TIME_START })
    if ((response.data?.totalRecordsCount ?? 0) > 0) hasAnyUsage.value = true
    await fetchUsage()
  }
})
</script>

<style scoped>
.period-select {
  min-width: 220px;
}
.usage-row + .usage-row {
  border-top: 1px solid rgb(var(--v-theme-grey100));
}
</style>
