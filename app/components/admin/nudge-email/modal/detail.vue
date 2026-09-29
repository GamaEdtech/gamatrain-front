<template>
  <admin-nudge-email-modal-form
    mode="edit"
    :initial-value="detailInfo"
    :loading="loadingEditItem"
    :data-loading="loadingGetItemById"
    @submit="edit"
  />
</template>

<script setup lang="ts">
import type {
  AddAdminNudgeTemplateDTO,
  AdminNudgeTemplateDetailDTO,
} from '@/types'

interface DetailProps {
  id: number | string
}

const props = defineProps<DetailProps>()
const emit = defineEmits(['EditItemSuccessFull'])

const { editItem, loadingEditItem, getItemById, loadingGetItemById } = useNudgeAdmin()

const detailInfo = ref<AdminNudgeTemplateDetailDTO | null>()

const edit = async (payload: AddAdminNudgeTemplateDTO) => {
  const response = await editItem(payload, props.id)

  if (response.succeeded) {
    emit('EditItemSuccessFull')
  }
}

onMounted(async () => {
  const response = await getItemById(props.id)
  if (response.succeeded && response.data) {
    detailInfo.value = response.data
  }
})
</script>
