<template>
  <admin-subscription-gateway-mappings-form
    mode="add"
    :loading="loadingAddItem"
    @submit="add"
  />
</template>

<script setup lang="ts">
import type { AddAdminSubscriptionGatewayMappingDTO } from '@/types'

const emit = defineEmits(['AddItemSuccessFull'])
const { addItem, loadingAddItem } = useSubscriptionGatewayMappingAdmin()

const add = async (payload: AddAdminSubscriptionGatewayMappingDTO) => {
  const response = await addItem(payload)

  if (response.succeeded) {
    emit('AddItemSuccessFull')
  }
}
</script>
