<template>
  <div class="w-100 d-flex flex-column pa-4">
    <div class="w-100 d-flex flex-column align-center ga-3">
      <v-skeleton-loader
        v-if="loadingGetItemById"
        width="100%"
        height="220"
        class="rounded-lg"
      />

      <div
        v-else
        class="w-100 d-flex align-center justify-center rounded-lg bg-grey100 image-box"
      >
        <img
          v-if="imageIssue?.fileUri"
          :src="imageIssue.fileUri"
          :alt="imageIssue.schoolName"
          class="w-100 h-100"
        >
      </div>

      <v-skeleton-loader
        v-if="loadingGetItemById"
        width="160"
        height="24"
        class="rounded-pill"
      />

      <nuxt-link
        v-else
        class="text-h4 text-grey700 font-weight-bold text-start text-decoration-none w-100"
        :to="`/school/${imageIssue?.schoolId}`"
      >
        {{ imageIssue?.schoolName || '-' }}
      </nuxt-link>
    </div>

    <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
      <div class="text-h6 text-grey700 ml-2">
        You can write a message to reject.
      </div>
      <v-text-field
        v-model="rejectComment"
        rounded="lg"
        density="compact"
        placeholder="Comment"
        variant="outlined"
        autocomplete="off"
        persistent-clear
        base-color="grey200"
        color="primary"
        active-color="primary"
        bg-color="white"
        class="w-100"
      />
    </div>

    <div class="w-100 d-flex flex-column flex-sm-row justify-center align-center ga-3 mt-8">
      <v-btn
        color="error"
        rounded="xl"
        variant="outlined"
        height="40"
        width="180"
        class="text-h5"
        :disabled="loadingGetItemById || !imageIssue || loadingConfirm || !rejectComment"
        :loading="loadingReject"
        flat
        @click="rejectIssue"
      >
        Reject
      </v-btn>

      <v-btn
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        width="180"
        class="text-h5"
        :loading="loadingConfirm"
        :disabled="loadingGetItemById || !imageIssue || loadingReject"
        flat
        @click="confirmIssue"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminSchoolImageIssueDetailDTO } from '@/types'

interface IImageIssueDetailModal {
  id: string
}

const props = defineProps<IImageIssueDetailModal>()
const emit = defineEmits(['changeStatusSuccessfull'])

const {
  getItemById,
  loadingGetItemById,
  confirm,
  loadingConfirm,
  reject,
  loadingReject,
} = useSchoolImageIssueAdmin()

const imageIssue = ref<AdminSchoolImageIssueDetailDTO | null>(null)
const rejectComment = ref('')

onMounted(async () => {
  const response = await getItemById(props.id)

  if (response.succeeded && response.data) {
    imageIssue.value = response.data
  }
})

const confirmIssue = async () => {
  if (!imageIssue.value) return

  const response = await confirm(imageIssue.value.id)

  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}

const rejectIssue = async () => {
  if (!imageIssue.value || !rejectComment.value) return

  const response = await reject(imageIssue.value.id, rejectComment.value)

  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}
</script>

<style scoped>
.image-box {
  min-height: 220px;
  max-height: 360px;
}
</style>
