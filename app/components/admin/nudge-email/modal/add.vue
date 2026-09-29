<template>
  <admin-nudge-email-modal-form
    mode="add"
    :loading="loadingAddItem"
    @submit="add"
  />
</template>

<script setup lang="ts">
import type { AddAdminNudgeTemplateDTO } from '@/types'

const emit = defineEmits(['AddItemSuccessFull'])
const { addItem, loadingAddItem } = useNudgeAdmin()

const add = async (payload: AddAdminNudgeTemplateDTO) => {
  const response = await addItem(payload)

  if (response.succeeded) {
    emit('AddItemSuccessFull')
  }
}
</script>
