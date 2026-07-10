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
    </template>

    <template v-else>
      <div
        v-for="field in formattedData"
        :key="field.label"
        class="detail-item"
        :class="{ 'w-100': field.full }"
      >
        <span class="label">{{ field.label }}</span>
        <span class="value">{{ field.value }}</span>
      </div>

      <div class="w-100 d-flex flex-column align-center justify-start ga-6 mt-4">
        <div
          v-for="item in rates"
          :key="item.key"
          class="w-100 d-flex justify-space-between align-center overflow-x-hidden"
        >
          <span class="d-flex align-center ga-3 text-h5 font-weight-bold primary-gray-700">
            <div class="dot-div" />
            {{ item.title }}
          </span>

          <v-rating
            half-increments
            readonly
            :length="5"
            :size="30"
            :model-value="item.score"
            color="primary"
            active-color="primary"
            empty-icon="md:star_outlined"
            half-icon="md:star_half_outlined"
            full-icon="md:star"
          />
        </div>
      </div>
    </template>

    <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-6">
      <div class="text-h6 text-grey700 ml-2">
        You must write a message to reject.
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

    <div class="w-100 d-flex align-center ga-2 mt-8">
      <v-btn
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5 w-50"
        :disabled="loadingGetItemById"
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
        :disabled="loadingGetItemById || !commentReject"
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
import { SCHOOL_COMMENT_RATE_LIST } from '@/constants'
import type { AdminSchoolCommentDetailDTO } from '@/types'

interface IDetailModal {
  contributionId: string
}

interface DetailField {
  label: string
  value: string | number
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
} = useSchoolCommentAdmin()

const comment = ref<AdminSchoolCommentDetailDTO | null>(null)
const commentReject = ref('')

const formattedData = computed<DetailField[]>(() => {
  if (!comment.value) return []

  return [
    { label: 'Id:', value: comment.value.id },
    { label: 'School Name:', value: comment.value.schoolName, full: true },
    { label: 'School Id:', value: comment.value.schoolId },
    { label: 'Comment:', value: comment.value.comment || '-', full: true },
  ]
})

const rates = computed(() => {
  if (!comment.value) return []

  return SCHOOL_COMMENT_RATE_LIST.map(item => ({
    ...item,
    score: Number(comment.value?.[item.key] ?? 0),
  }))
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
    comment.value = response.data
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

.dot-div {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffb600;
}
</style>
