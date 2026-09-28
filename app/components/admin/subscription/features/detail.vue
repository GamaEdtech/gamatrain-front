<template>
  <admin-subscription-features-form
    mode="edit"
    :initial-value="item"
    :loading="loadingEditItem"
    @submit="edit"
  />
</template>

<script setup lang="ts">
import type {
  AddAdminSubscriptionFeatureDTO,
  AdminSubscriptionFeatureDTO,
} from '@/types'

interface DetailProps {
  item: AdminSubscriptionFeatureDTO
}

const props = defineProps<DetailProps>()
const emit = defineEmits(['EditItemSuccessFull'])
const { editItem, loadingEditItem } = useSubscriptionFeatureAdmin()

const edit = async (payload: AddAdminSubscriptionFeatureDTO) => {
  const response = await editItem(payload, props.item.id)

  if (response.succeeded) {
    emit('EditItemSuccessFull')
  }
}
</script>
