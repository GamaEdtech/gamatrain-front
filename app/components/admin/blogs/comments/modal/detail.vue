<template>
  <div class="w-100 d-flex flex-wrap pa-4">
    <template v-if="loading">
      <div
        v-for="i in 4"
        :key="i"
        class="detail-item w-100"
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

    <template v-else>
      <div
        v-for="field in newDataFormated"
        :key="field.key"
        class="detail-item"
        :class="{ 'w-100': field.full }"
      >
        <span class="label">{{ field.label }}</span>
        <span class="value">{{ field.value }}</span>
      </div>
    </template>

    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h6 text-grey700 ml-2">
        You can write a message to reject.
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
        :disabled="loading"
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
        :disabled="loading"
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
import type { CommnetBlogDetailAdminDTO } from '@/types'

interface IDetailModal {
  contributionId: string
}
type FieldConfig<T> = {
  key: keyof T
  label: string
  full?: boolean
}

const props = defineProps<IDetailModal>()
const emit = defineEmits(['changeStatusSuccessfull'])

const { $toast } = useNuxtApp()
const { getItemById, loadingGetItemById: loading, confirm, loadingConfirm, reject, loadingReject } = useBlogCommentAdmin()

const newDataFormated = ref()
const commentReject = ref('')

const newDataFields: FieldConfig<CommnetBlogDetailAdminDTO>[] = [
  { key: 'id', label: 'Id :', full: true },
  { key: 'postTitle', label: 'Post Title :', full: true },
  { key: 'postId', label: 'Post Id :', full: true },
  { key: 'comment', label: 'Comment :', full: true },
]

const createFormatedData = <T extends object>(data: T, fields: FieldConfig<T>[]) => {
  if (!data) return []

  return fields
    .map((field) => {
      const rawValue = data[field.key]

      if (
        rawValue === null
        || rawValue === undefined
        || rawValue === ''
        || (Array.isArray(rawValue) && rawValue.length === 0)
      ) {
        return null
      }

      return {
        ...field,
        value: rawValue,
      }
    })
    .filter(Boolean)
}

const approveItem = async () => {
  const response = await confirm(props.contributionId)
  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}

const rejectItem = async () => {
  if (commentReject.value && commentReject.value.length > 0) {
    const response = await reject(props.contributionId, commentReject.value)
    if (response.succeeded) {
      emit('changeStatusSuccessfull')
    }
  }
  else {
    $toast.error('Please write the reason for rejection.')
  }
}

onMounted(async () => {
  const response = await getItemById(props.contributionId)
  if (response.succeeded && response.data) {
    newDataFormated.value = createFormatedData(response.data as CommnetBlogDetailAdminDTO, newDataFields)
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

.description {
  font-weight: 500;
  line-height: 1.7;
}
</style>
