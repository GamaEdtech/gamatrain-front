<template>
  <admin-subscription-plans-form
    mode="add"
    :loading="loadingAddItem"
    @submit="add"
  />
</template>

<script setup lang="ts">
import type { AddAdminSubscriptionPlanDTO } from '@/types'

const emit = defineEmits(['AddItemSuccessFull'])
const { addItem, loadingAddItem } = useSubscriptionPlanAdmin()

const add = async (payload: AddAdminSubscriptionPlanDTO) => {
  const response = await addItem(payload)

  if (response.succeeded) {
    emit('AddItemSuccessFull')
  }
}
</script>
