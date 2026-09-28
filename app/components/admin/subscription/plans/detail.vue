<template>
  <admin-subscription-plans-form
    mode="edit"
    :initial-value="plan"
    :loading="loadingEditItem"
    :data-loading="loadingGetItemById"
    @submit="edit"
  />
</template>

<script setup lang="ts">
import type {
  AddAdminSubscriptionPlanDTO,
  AdminSubscriptionPlanDTO,
} from '@/types'

interface DetailProps {
  id: string
}

const props = defineProps<DetailProps>()
const emit = defineEmits(['EditItemSuccessFull'])

const {
  getItemById,
  loadingGetItemById,
  editItem,
  loadingEditItem,
} = useSubscriptionPlanAdmin()

const plan = ref<AdminSubscriptionPlanDTO | null>(null)

onMounted(async () => {
  const response = await getItemById(props.id)

  if (response.succeeded && response.data) {
    plan.value = response.data
  }
})

const edit = async (payload: AddAdminSubscriptionPlanDTO) => {
  const response = await editItem(payload, props.id)

  if (response.succeeded) {
    emit('EditItemSuccessFull')
  }
}
</script>
