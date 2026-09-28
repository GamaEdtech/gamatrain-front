<template>
  <admin-subscription-prices-form
    mode="edit"
    :initial-value="item"
    :loading="loadingEditItem"
    @submit="edit"
  />
</template>

<script setup lang="ts">
import type {
  AddAdminSubscriptionPriceDTO,
  AdminSubscriptionPriceDTO,
} from '@/types'

interface DetailProps {
  item: AdminSubscriptionPriceDTO
}

const props = defineProps<DetailProps>()
const emit = defineEmits(['EditItemSuccessFull'])
const { editItem, loadingEditItem } = useSubscriptionPriceAdmin()

const edit = async (payload: AddAdminSubscriptionPriceDTO) => {
  const response = await editItem(payload, props.item.id)

  if (response.succeeded) {
    emit('EditItemSuccessFull')
  }
}
</script>
