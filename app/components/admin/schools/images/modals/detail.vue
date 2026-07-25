<template>
  <div class="w-100 d-flex flex-wrap pa-4">
    <template v-if="loadingGetItemById">
      <div
        v-for="i in 4"
        :key="i"
        class="detail-item w-100"
      >
        <v-skeleton-loader
          width="90"
          height="16"
          class="rounded-pill"
        />
        <v-skeleton-loader
          width="140"
          height="16"
          class="rounded-pill"
        />
      </div>
      <v-skeleton-loader
        width="100%"
        height="220"
        class="rounded-lg"
      />
    </template>

    <template v-else>
      <div class="w-100 image-box mb-4">
        <img
          v-if="image?.fileUri"
          :src="image.fileUri"
          :alt="image.schoolName"
        >
      </div>

      <div
        v-for="field in formattedData"
        :key="field.label"
        class="detail-item"
        :class="{ 'w-100': field.full }"
      >
        <span class="label">{{ field.label }}</span>
        <span class="value">{{ field.value }}</span>
      </div>
    </template>

    <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
      <div class="text-h6 text-grey700 ml-2">
        You must write a message to reject.
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

    <div class="w-100 d-flex align-center ga-2 mt-8">
      <v-btn
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5 w-50"
        :disabled="loadingGetItemById || !image"
        :loading="loadingConfirm || loadingReject"
        flat
        @click="approveItem"
      >
        Approve
      </v-btn>
      <v-btn
        color="error"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5 w-50"
        :disabled="loadingGetItemById || !image || !rejectComment"
        :loading="loadingConfirm || loadingReject"
        flat
        @click="rejectItem"
      >
        Reject
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminSchoolImageDetailDTO } from '@/types'

interface IDetailModal {
  contributionId: string
}

interface DetailField {
  label: string
  value: string | number | boolean
  full?: boolean
}

const props = defineProps<IDetailModal>()
const emit = defineEmits(['changeStatusSuccessfull'])

const { $toast } = useNuxtApp()
const {
  getItemById,
  loadingGetItemById,
  confirm,
  loadingConfirm,
  reject,
  loadingReject,
} = useSchoolImageAdmin()

const image = ref<AdminSchoolImageDetailDTO | null>(null)
const rejectComment = ref('')

const formattedData = computed<DetailField[]>(() => {
  if (!image.value) return []

  return [
    { label: 'Id:', value: image.value.id },
    { label: 'School Name:', value: image.value.schoolName, full: true },
    { label: 'School Id:', value: image.value.schoolId },
    { label: 'File Type:', value: image.value.fileType || '-' },
    { label: 'Is Default:', value: image.value.isDefault ? 'True' : 'False' },
    { label: 'Tag Id:', value: image.value.tagId || '-' },
    { label: 'Tag Name:', value: image.value.tagName || '-' },
  ]
})

const approveItem = async () => {
  const response = await confirm(props.contributionId)
  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}

const rejectItem = async () => {
  if (!rejectComment.value.trim()) {
    $toast.error('Please write the reason for rejection.')
    return
  }

  const response = await reject(props.contributionId, rejectComment.value)
  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}

onMounted(async () => {
  const response = await getItemById(props.contributionId)
  if (response.succeeded && response.data) {
    image.value = response.data
  }
})
</script>

<style scoped>
.detail-item {
  width: 50%;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 12px;
}

@media (max-width: 960px) {
  .detail-item {
    width: 100% !important;
  }
}

.label {
  font-size: 14px;
  color: rgb(var(--v-theme-grey500));
  font-weight: 700;
  white-space: nowrap;
}

.value {
  font-size: 14px;
  color: rgb(var(--v-theme-grey700));
  font-weight: 700;
  word-break: break-word;
}

.image-box {
  min-height: 220px;
  max-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: rgb(var(--v-theme-grey100));
  overflow: hidden;
}

.image-box img {
  max-width: 100%;
  max-height: 360px;
  object-fit: contain;
}
</style>
