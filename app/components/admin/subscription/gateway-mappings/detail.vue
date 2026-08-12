<template>
  <admin-subscription-gateway-mappings-form
    mode="edit"
    :initial-value="item"
    :loading="loadingEditItem"
    @submit="edit"
  />
</template>

<script setup lang="ts">
import type {
  AddAdminSubscriptionGatewayMappingDTO,
  AdminSubscriptionGatewayMappingDTO,
} from '@/types'

interface DetailProps {
  item: AdminSubscriptionGatewayMappingDTO
}

const props = defineProps<DetailProps>()
const emit = defineEmits(['EditItemSuccessFull'])
const { editItem, loadingEditItem } = useSubscriptionGatewayMappingAdmin()

const edit = async (payload: AddAdminSubscriptionGatewayMappingDTO) => {
  const response = await editItem(payload, props.item.id)

  if (response.succeeded) {
    emit('EditItemSuccessFull')
  }
}
</script>
