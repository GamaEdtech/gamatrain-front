<template>
  <div class="history-card w-100 d-flex align-center justify-space-between ga-4 pa-4">
    <div class="d-flex flex-column ga-2 flex-grow-1 history-main">
      <div class="d-flex align-center ga-2 flex-wrap">
        <span class="text-h5 text-grey700 font-weight-bold">
          {{ subscription.planTitle }}
        </span>
        <span class="text-h6 text-grey500 font-weight-bold">
          #{{ subscription.id }}
        </span>
      </div>

      <div class="d-flex align-center ga-2 flex-wrap">
        <span class="text-h6 text-grey500 font-weight-semibold">
          {{ formatDate(subscription.startDate) }}
        </span>
        <v-icon
          size="16"
          color="grey400"
        >
          md:arrow_forward
        </v-icon>
        <span class="text-h6 text-grey500 font-weight-semibold">
          {{ formatDate(subscription.expirationDate) }}
        </span>
      </div>
    </div>

    <div class="d-flex align-center justify-end ga-3 flex-wrap history-meta">
      <v-chip
        :color="getStatusColor(subscription.status)"
        class="font-weight-bold text-h5"
      >
        {{ subscription.status }}
      </v-chip>

      <span class="text-h6 text-grey600 font-weight-bold">
        {{ subscription.billingInterval }}
      </span>

      <span class="text-h6 text-grey600 font-weight-bold">
        {{ subscription.gateway }}
      </span>

      <v-chip
        :color="subscription.autoRenews ? `success` : `grey400`"
        class="font-weight-bold text-h6"
      >
        {{ subscription.autoRenews ? `Auto renews` : `No auto renew` }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminUserSubscriptionListDTO,
  UserSubscriptionStatus,
} from '@/types'

interface IHistoryCard {
  subscription: AdminUserSubscriptionListDTO
}

defineProps<IHistoryCard>()

const { formatLocal } = useDateTime()

const formatDate = (value: string | null) => {
  return value ? formatLocal(value, 'DD/MM/YYYY') : '-'
}

const getStatusColor = (status: UserSubscriptionStatus) => {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Expired':
      return 'grey400'
    case 'Cancelled':
      return 'error'

    default:
      return 'warning'
  }
}
</script>

<style scoped>
.history-card {
  border: 1px solid rgb(var(--v-theme-grey200));
  border-radius: 8px;
  min-height: 86px;
}

.history-main {
  min-width: 220px;
}

.history-meta {
  min-width: 320px;
}

@media (max-width: 960px) {
  .history-card {
    align-items: flex-start !important;
    flex-direction: column;
  }

  .history-meta {
    justify-content: flex-start !important;
    min-width: 0;
  }
}
</style>
