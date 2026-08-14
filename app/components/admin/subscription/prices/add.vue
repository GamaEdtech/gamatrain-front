<template>
  <admin-subscription-prices-form
    mode="add"
    :loading="loadingAddItem"
    @submit="add"
  />
</template>

<script setup lang="ts">
import type { AddAdminSubscriptionPriceDTO } from '@/types'

const emit = defineEmits(['AddItemSuccessFull'])
const { addItem, loadingAddItem } = useSubscriptionPriceAdmin()

const add = async (payload: AddAdminSubscriptionPriceDTO) => {
  const response = await addItem(payload)

  if (response.succeeded) {
    emit('AddItemSuccessFull')
  }
}
</script>
