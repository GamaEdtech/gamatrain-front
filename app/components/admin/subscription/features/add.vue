<template>
  <admin-subscription-features-form
    mode="add"
    :loading="loadingAddItem"
    @submit="add"
  />
</template>

<script setup lang="ts">
import type { AddAdminSubscriptionFeatureDTO } from '@/types'

const emit = defineEmits(['AddItemSuccessFull'])
const { addItem, loadingAddItem } = useSubscriptionFeatureAdmin()

const add = async (payload: AddAdminSubscriptionFeatureDTO) => {
  const response = await addItem(payload)

  if (response.succeeded) {
    emit('AddItemSuccessFull')
  }
}
</script>
