<template>
  <div class="w-100 d-flex flex-column flex-sm-row flex-wrap justify-center justify-sm-space-between align-center align-sm-end ga-4 ga-sm-2 mt-12">
    <template
      v-if="loading"
    >
      <subscription-card-skeleton
        v-for="item in skeletonCount"
        :key="item"
      />
    </template>

    <template v-else>
      <subscription-card
        v-for="plan in plans"
        :key="plan.subscriptionPlanId"
        :plan="plan"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { UpgradeSuggestionsDTO } from '@/types'

interface IPaymentModal {
  plans: UpgradeSuggestionsDTO[]
  loading?: boolean
}
withDefaults(defineProps<IPaymentModal>(),
  {
    loading: false,
  })

const skeletonCount = 3
</script>

<style scoped>

</style>
