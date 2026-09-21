<template>
  <div class="w-100 d-flex flex-wrap pa-4">
    <template v-if="loading">
      <div
        v-for="i in 10"
        :key="i"
        class="detail-item"
      >
        <v-skeleton-loader
          width="80"
          height="16"
          class="rounded-pill"
        />
        <v-skeleton-loader
          width="60"
          height="16"
          class="rounded-pill"
        />
      </div>
    </template>

    <template v-else-if="postDetail">
      <div
        v-for="field in detailFields"
        :key="field.key"
        class="detail-item"
        :class="{ 'w-100': field.full }"
      >
        <span class="label">{{ field.label }}</span>
        <span class="value">{{ field.value }}</span>
      </div>

      <div
        v-if="canReject"
        class="w-100 d-flex flex-column align-start justify-start ga-1"
      >
        <div class="text-h6 text-grey700 ml-2">
          Write the reason to reject.
        </div>
        <v-text-field
          v-model="commentReject"
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
    </template>

    <div class="w-100 d-flex align-center ga-2 mt-8">
      <v-btn
        v-if="canApprove"
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5 flex-1-1"
        :disabled="loading"
        :loading="loadingConfirm || loadingReject"
        flat
        @click="approveItem"
      >
        Approve
      </v-btn>
      <v-btn
        v-if="canReject"
        color="error"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5 flex-1-1"
        :disabled="loading || !commentReject"
        :loading="loadingConfirm || loadingReject"
        flat
        @click="rejectItem"
      >
        Reject
      </v-btn>
      <v-btn
        v-if="postDetail"
        color="primary"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5 flex-1-1"
        :to="`/admin/posts/edit/${postDetail.id}`"
        flat
      >
        Edit
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { AdminPostDetailDTO } from '@/types'

interface IDetailModal {
  contributionId: string
}

interface DetailField {
  key: string
  label: string
  value: string | number | boolean
  full?: boolean
}

const props = defineProps<IDetailModal>()
const emit = defineEmits(['changeStatusSuccessfull'])

const { $toast } = useNuxtApp()
const {
  getItemById,
  loadingGetItemById: loading,
  confirm,
  loadingConfirm,
  reject,
  loadingReject,
} = usePostAdmin()

const postDetail = ref<AdminPostDetailDTO | null>(null)
const commentReject = ref('')

// Review can go either way; a Confirmed post can be pulled back (rejected) and a Rejected one re-approved.
const canApprove = computed(() => ['Review', 'Rejected'].includes(postDetail.value?.status ?? ''))
const canReject = computed(() => ['Review', 'Confirmed'].includes(postDetail.value?.status ?? ''))

const detailFields = computed<DetailField[]>(() => {
  if (!postDetail.value) return []

  const fields: DetailField[] = [
    { key: 'title', label: 'Title :', value: postDetail.value.title, full: true },
    { key: 'postId', label: 'Post ID :', value: postDetail.value.id },
    { key: 'status', label: 'Status :', value: postDetail.value.status },
    { key: 'visibilityType', label: 'Visibility :', value: postDetail.value.visibilityType },
    {
      key: 'publishDate',
      label: 'Publish Date :',
      value: postDetail.value.publishDate
        ? dayjs(postDetail.value.publishDate).format('DD/MM/YYYY HH:mm:ss')
        : '',
    },
    { key: 'rejectionComment', label: 'Rejection reason :', value: postDetail.value.rejectionComment || '', full: true },
  ]

  return fields.filter(field => field.value !== null && field.value !== undefined && field.value !== '')
})

const approveItem = async () => {
  const response = await confirm(props.contributionId)
  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}

const rejectItem = async () => {
  if (!commentReject.value.trim()) {
    $toast.error('Please write the reason for rejection.')
    return
  }

  const response = await reject(props.contributionId, commentReject.value)
  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}

onMounted(async () => {
  const response = await getItemById(props.contributionId)
  if (response.succeeded && response.data) {
    postDetail.value = response.data
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

:deep(
</style>
