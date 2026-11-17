<template>
  <div class="w-100 d-flex flex-column pa-4">
    <h1 class="text-h6 text-grey700 font-weight-regular">
      Cancel deletion request
    </h1>

    <h4 class="text-caption text-grey700 font-weight-regular mt-5">
      Your account will stay active and nothing will be deleted.
    </h4>
    <div class="w-100 d-flex align-center justify-center mt-8">
      <v-btn
        flat
        rounded="pill"
        width="250"
        height="40"
        class="text-body-1 font-weight-medium"
        color="primary"
        :loading="loadingCancelDeleteItem"
        @click="cancelDelete"
      >
        Cancel Deletion
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types'

const emit = defineEmits(['close'])

const { cancelDeleteItem, loadingCancelDeleteItem } = useProfile()
const { user, setUser } = useUser()

const cancelDelete = async () => {
  const response = await cancelDeleteItem()
  if (response.succeeded) {
    setUser({
      ...user.value as User,
      orphanDate: null,
    })
    emit('close')
  }
}
</script>

<style scoped></style>
