<template>
  <div class="w-100 d-flex flex-wrap pa-4 justify-space-between">
    <template v-if="loadingGetItemById">
      <div
        v-for="field in fields"
        :key="field.key"
        class="detail-item"
        :class="{ 'w-100': field.full }"
      >
        <v-skeleton-loader
          width="80"
          height="16"
          class="rounded-pill"
        />
        <v-skeleton-loader
          width="100"
          height="16"
          class="rounded-pill"
        />
      </div>
    </template>

    <template v-else>
      <div
        v-for="field in detailFields"
        :key="field.key"
        class="detail-item"
        :class="{ 'w-100': field.full }"
      >
        <span class="label">{{ field.label }}</span>
        <span class="value">{{ field.value }}</span>
      </div>

      <div
        v-if="quotaStatuses.length > 0"
        class="w-100 d-flex flex-column ga-2 mt-2"
      >
        <v-divider class="w-100" />
        <span class="text-h5 font-weight-bold text-grey700">Quota</span>

        <div
          v-for="(quota, index) in quotaStatuses"
          :key="index"
          class="w-100 d-flex flex-column ga-1 border rounded-lg pa-2"
        >
          <div class="w-100 d-flex align-center justify-space-between ga-2">
            <span class="text-h6 font-weight-bold text-grey700">{{ quota.title }}</span>
            <span class="text-h6 text-grey600 text-no-wrap">{{ quota.usageLabel }}</span>
          </div>

          <v-progress-linear
            v-if="quota.percentUsed !== null"
            :model-value="quota.percentUsed"
            height="8"
            rounded
            :color="quota.percentUsed >= 100 ? 'error' : quota.percentUsed >= 80 ? 'warning' : 'primary'"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AdminUserSubscriptionDetailDTO } from '@/types'

interface IDetailModal {
  id: string | number
}

type FieldConfig = {
  key: keyof AdminUserSubscriptionDetailDTO
  label: string
  full?: boolean
  formatter?: (value: AdminUserSubscriptionDetailDTO[keyof AdminUserSubscriptionDetailDTO]) => string
}

type DetailField = FieldConfig & {
  value: string
}

const props = defineProps<IDetailModal>()
const { formatLocal } = useDateTime()
const {
  getItemById,
  loadingGetItemById,
} = useUserSubscriptionAdmin()

const subscription = ref<AdminUserSubscriptionDetailDTO | null>(null)
const detailFields = ref<DetailField[]>([])

const fields: FieldConfig[] = [
  { key: 'id', label: 'ID :' },
  { key: 'userId', label: 'User ID :' },
  { key: 'userEmail', label: 'User Email :', full: true },
  { key: 'subscriptionPlanId', label: 'Plan ID :' },
  { key: 'planTitle', label: 'Plan Title :' },
  { key: 'status', label: 'Status :' },
  { key: 'gateway', label: 'Gateway :' },
  { key: 'creationDate', label: 'Creation Date :', formatter: formatDate, full: true },
  { key: 'startDate', label: 'Start Date :', formatter: formatDate, full: true },
  { key: 'expirationDate', label: 'Expiration Date :', formatter: formatDate, full: true },
  { key: 'pricePaid', label: 'Price Paid :', formatter: formatPrice },
  { key: 'currency', label: 'Currency :' },
  { key: 'billingInterval', label: 'Billing Interval :' },
  { key: 'autoRenews', label: 'Auto Renews :', formatter: formatBoolean },
  { key: 'cancelAtPeriodEnd', label: 'Cancel At Period End :', formatter: formatBoolean, full: true },
  { key: 'pendingSwitchPlanId', label: 'Pending Switch Plan ID :', full: true },
  { key: 'pendingSwitchPlanTitle', label: 'Pending Switch Plan Title :', full: true },
  { key: 'pendingSwitchBillingInterval', label: 'Pending Switch Billing Interval :', full: true },
  { key: 'lastPaymentFailedDate', label: 'Last Payment Failed Date :', formatter: formatNullableDate, full: true },
  { key: 'externalSubscriptionId', label: 'External Subscription ID :', full: true },
]

function formatDate(value: AdminUserSubscriptionDetailDTO[keyof AdminUserSubscriptionDetailDTO]) {
  return typeof value === 'string' ? formatLocal(value, 'DD/MM/YYYY HH:mm') : '-'
}

function formatNullableDate(value: AdminUserSubscriptionDetailDTO[keyof AdminUserSubscriptionDetailDTO]) {
  return typeof value === 'string' && value ? formatLocal(value, 'DD/MM/YYYY HH:mm') : '-'
}

function formatBoolean(value: AdminUserSubscriptionDetailDTO[keyof AdminUserSubscriptionDetailDTO]) {
  return value ? 'Yes' : 'No'
}

function formatPrice(value: AdminUserSubscriptionDetailDTO[keyof AdminUserSubscriptionDetailDTO]) {
  if (typeof value !== 'number') {
    return '-'
  }

  return value.toString()
}

const createFormatedData = (
  data: AdminUserSubscriptionDetailDTO,
  fieldConfigs: FieldConfig[],
) => {
  return fieldConfigs.map((field) => {
    const rawValue = data[field.key]

    return {
      ...field,
      value: field.formatter
        ? field.formatter(rawValue)
        : formatValue(rawValue),
    }
  })
}

const formatValue = (value: AdminUserSubscriptionDetailDTO[keyof AdminUserSubscriptionDetailDTO]) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return value.toString()
}

// Live quota status (Used/Limit per feature group) - only present on this single-subscription
// detail response, never on the paged list.
const quotaStatuses = computed(() => {
  return (subscription.value?.featureGroups ?? []).map((quota) => {
    const title = quota.description || quota.features.map(feature => feature.featureName).join(', ')
    const percentUsed = quota.limit === null ? null : Math.min(100, (quota.used / quota.limit) * 100)
    const usageLabel = quota.limit === null ? `${quota.used} used · Unlimited` : `${quota.used} / ${quota.limit}`

    return { title, usageLabel, percentUsed }
  })
})

const fetchDetail = async () => {
  const response = await getItemById(props.id)

  if (response.succeeded && response.data) {
    subscription.value = response.data
    detailFields.value = createFormatedData(response.data, fields)
  }
  else {
    subscription.value = null
    detailFields.value = []
  }
}

onMounted(async () => {
  await fetchDetail()
})
</script>

<style scoped>
.detail-item {
  width: 48%;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 16px;
}

@media (max-width: 960px) {
  .detail-item {
    width: 100% !important;
  }
}

.label {
  font-size: 14px;
  color: rgb(var(--v-theme-grey500));
  font-weight: 700;
  white-space: nowrap;
}

.value {
  font-size: 14px;
  color: rgb(var(--v-theme-grey700));
  font-weight: 700;
  word-break: break-word;
}
</style>
