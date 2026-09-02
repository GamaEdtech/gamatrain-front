<template>
  <div class="dashboard-card pa-4 w-100">
    <template v-if="subscription">
      <div class="subscription-layout">
        <div class="d-flex align-start ga-3 min-width-0">
          <v-avatar
            color="primary50"
            rounded="lg"
            size="48"
          >
            <v-icon color="primary">
              md:workspace_premium
            </v-icon>
          </v-avatar>

          <div class="min-width-0">
            <div class="d-flex align-center flex-wrap ga-2 mb-1">
              <p class="text-h5 text-sm-h4 font-weight-bold text-grey900 mb-0 text-truncate">
                {{ subscription.planTitle }}
              </p>
              <v-chip
                :color="statusColor"
                size="small"
                variant="tonal"
                class="font-weight-bold"
              >
                {{ subscription.status }}
              </v-chip>
            </div>

            <div class="d-flex align-center flex-wrap ga-2 text-h6 text-sm-h5 text-grey700">
              <span>{{ subscription.billingInterval }}</span>
              <span class="detail-separator" />
              <span>{{ formattedPrice }}</span>
              <template v-if="subscription.expirationDate">
                <span class="detail-separator" />
                <span>Expires {{ formatLocal(subscription.expirationDate, 'MMM D, YYYY') }}</span>
              </template>
            </div>

            <div
              v-if="subscription.cancelAtPeriodEnd || subscription.pendingSwitchPlanTitle || subscription.lastPaymentFailedDate"
              class="d-flex flex-wrap ga-2 mt-3"
            >
              <v-chip
                v-if="subscription.cancelAtPeriodEnd"
                color="warning"
                size="small"
                variant="tonal"
                prepend-icon="md:event_busy"
              >
                Cancels at period end
              </v-chip>
              <v-chip
                v-if="subscription.pendingSwitchPlanTitle"
                color="info"
                size="small"
                variant="tonal"
                prepend-icon="md:sync_alt"
              >
                Switch to {{ subscription.pendingSwitchPlanTitle }} pending
              </v-chip>
              <v-chip
                v-if="subscription.lastPaymentFailedDate"
                color="error"
                size="small"
                variant="tonal"
                prepend-icon="md:error"
              >
                Payment needs attention
              </v-chip>
            </div>
          </div>
        </div>

        <div class="usage-summary">
          <v-progress-circular
            :model-value="hasLimitedUsage ? usagePercent : 100"
            :color="usageColor"
            bg-color="grey200"
            :size="96"
            :width="10"
          >
            <span class="text-h5 font-weight-bold text-grey900">
              {{ hasLimitedUsage ? `${usagePercent}%` : '∞' }}
            </span>
          </v-progress-circular>
          <div class="text-center text-md-left">
            <p class="text-h6 font-weight-bold text-grey900 mb-0">
              {{ totalUsedLabel }} used
            </p>
            <p class="text-body-2 text-grey600 mb-0">
              {{ totalLimitLabel }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="visibleFeatureUsage.length"
        class="feature-grid mt-4"
      >
        <div
          v-for="feature in visibleFeatureUsage"
          :key="feature.key"
          class="feature-usage"
        >
          <div class="d-flex align-center justify-space-between ga-2 mb-2">
            <span class="text-body-2 font-weight-bold text-grey800 text-truncate">
              {{ feature.title }}
            </span>
            <span class="text-caption text-grey600 flex-shrink-0">
              {{ feature.used }}{{ feature.limitLabel }}
            </span>
          </div>
          <v-progress-linear
            :model-value="feature.percent"
            :color="feature.color"
            bg-color="grey200"
            height="7"
            rounded
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="subscription-layout">
        <div class="d-flex align-start ga-3">
          <v-avatar
            color="primary50"
            rounded="lg"
            size="48"
          >
            <v-icon color="primary">
              md:star_shine_outlined
            </v-icon>
          </v-avatar>
          <div>
            <p class="text-h5 text-sm-h4 font-weight-bold text-grey900 mb-1">
              No active subscription
            </p>
            <p class="text-h6 text-sm-h5 text-grey700 mb-0">
              Choose a plan to unlock premium content and download quotas.
            </p>
          </div>
        </div>

        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          to="/user/subscription"
        >
          <span class="text-h5 font-weight-bold">
            <v-icon class="mr-1">md:subscriptions_outlined</v-icon>View plans</span>
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { FeatureGroupUserSubscriptionDTO, UserSubscriptionDTO } from '@/types'

interface FeatureUsageItem {
  key: string
  title: string
  used: number
  percent: number
  limitLabel: string
  color: string
}

const props = defineProps<{
  subscription: UserSubscriptionDTO | null
}>()

const { formatLocal } = useDateTime()

const subscription = computed(() => props.subscription)

const statusColor = computed(() => {
  return subscription.value ? useSubscriptionStatusColor(subscription.value.status) : 'grey400'
})

const formattedPrice = computed(() => {
  if (!subscription.value) return ''

  return `${subscription.value.currency} ${formatNumber(subscription.value.pricePaid)}`
})

const limitedFeatureGroups = computed(() => {
  return subscription.value?.featureGroups.filter(group => group.limit !== null) ?? []
})

const totalUsed = computed(() => {
  return limitedFeatureGroups.value.reduce((sum, group) => sum + group.used, 0)
})

const totalLimit = computed(() => {
  return limitedFeatureGroups.value.reduce((sum, group) => sum + (group.limit ?? 0), 0)
})

const usagePercent = computed(() => {
  if (!totalLimit.value) return 0

  return Math.min(Math.round((totalUsed.value / totalLimit.value) * 100), 100)
})

const usageColor = computed(() => {
  if (usagePercent.value >= 90) return 'error'
  if (usagePercent.value >= 70) return 'warning'
  return 'success'
})

const totalUsedLabel = computed(() => formatNumber(totalUsed.value))

const totalLimitLabel = computed(() => {
  if (!totalLimit.value) return 'Unlimited plan usage'

  return `${formatNumber(totalLimit.value)} total quota`
})

const hasLimitedUsage = computed(() => totalLimit.value > 0)

const visibleFeatureUsage = computed<FeatureUsageItem[]>(() => {
  return subscription.value?.featureGroups.slice(0, 4).map((group, index) => {
    const limit = group.limit
    const percent = limit ? Math.min(Math.round((group.used / limit) * 100), 100) : 0

    return {
      key: `${index}-${group.description}`,
      title: getFeatureTitle(group),
      used: group.used,
      percent,
      limitLabel: limit === null ? ' used' : ` / ${formatNumber(limit)}`,
      color: limit === null ? 'info' : getFeatureUsageColor(percent),
    }
  }) ?? []
})

function getFeatureTitle(group: FeatureGroupUserSubscriptionDTO) {
  return group.description || group.features.map(feature => feature.featureName).join(', ') || 'Subscription usage'
}

function getFeatureUsageColor(percent: number) {
  if (percent >= 90) return 'error'
  if (percent >= 70) return 'warning'
  return 'primary'
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
  background: rgb(var(--v-theme-white));
}

.subscription-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
}

.usage-summary {
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.feature-usage {
  min-width: 0;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: rgb(var(--v-theme-grey50));
  border: 1px solid rgb(var(--v-theme-grey200));
}

.detail-separator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(var(--v-theme-grey400));
}

.min-width-0 {
  min-width: 0;
}

@media screen and (max-width: 960px) {
  .subscription-layout {
    grid-template-columns: 1fr;
  }

  .usage-summary {
    justify-content: flex-start;
  }

  .feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media screen and (max-width: 600px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
