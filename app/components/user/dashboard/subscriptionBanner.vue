<template>
  <div class="dashboard-card pa-4 w-100">
    <template v-if="subscription">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div class="d-flex align-start ga-3 flex-grow-1">
          <v-avatar
            color="primary50"
            rounded="lg"
            class="flex-shrink-0"
            size="48"
          >
            <v-icon color="primary">
              md:workspace_premium
            </v-icon>
          </v-avatar>

          <div class="min-width-0 flex-grow-1">
            <div class="d-flex align-center flex-wrap ga-2 mb-1">
              <p class="text-h5 text-sm-h4 font-weight-bold text-grey900 mb-0 text-truncate">
                {{ subscription.planTitle }}
              </p>
              <v-chip
                :color="statusColor"
                variant="tonal"
                class="font-weight-bold text-h6"
              >
                {{ subscription.status }}
              </v-chip>
            </div>

            <div class="d-flex align-center flex-wrap ga-2 text-h6 text-sm-h5 text-grey700">
              <span>{{ subscription.billingInterval }}</span>
              <span class="text-grey400">|</span>
              <span>{{ formattedPrice }}</span>
              <template v-if="subscription.expirationDate">
                <span class="text-grey400">|</span>
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

        <div class="d-flex align-center justify-end flex-wrap ga-3">
          <v-progress-circular
            :model-value="hasLimitedUsage ? usagePercent : 100"
            :color="usageColor"
            bg-color="grey200"
            :size="96"
            :width="10"
          >
            <span class="text-h5 font-weight-bold text-grey900">
              {{ hasLimitedUsage ? `${usagePercent}%` : 'All' }}
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
    </template>

    <template v-else>
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
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
          variant="tonal"
          rounded="lg"
          to="/user/subscription"
          append-icon="md:chevron_right"
          class="font-weight-bold"
        >
          View plans
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { UserSubscriptionDTO } from '@/types'

const props = defineProps<{
  subscription: UserSubscriptionDTO | null
}>()

const { formatLocal } = useDateTime()
const { formatNumber } = useFormatNumber()

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
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
  background: rgb(var(--v-theme-white));
}

.min-width-0 {
  min-width: 0;
}
</style>
