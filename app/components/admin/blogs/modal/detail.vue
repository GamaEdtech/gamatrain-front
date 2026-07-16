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

    <template v-else-if="blogDetail">
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
        v-if="blogDetail.imageUri"
        class="detail-item w-100 flex-column"
      >
        <span class="label">Image :</span>
        <img
          :src="blogDetail.imageUri"
          width="220"
          class="rounded-lg blog-image"
          alt="Blog image"
        >
      </div>

      <div
        v-if="blogDetail.podcastUri"
        class="detail-item w-100 flex-column"
      >
        <span class="label">Podcast :</span>
        <audio
          controls
          :src="blogDetail.podcastUri"
          class="w-100"
        />
      </div>

      <div
        v-if="blogDetail.body"
        class="detail-item w-100 flex-column"
      >
        <span class="label">Body :</span>
        <div
          class="value body-content"
          v-html="blogDetail.body"
        />
      </div>

      <div
        v-if="blogDetail.localizedValues?.length"
        class="detail-item w-100 flex-column"
      >
        <span class="label">Localized Values :</span>

        <div
          v-for="item in blogDetail.localizedValues"
          :key="item.languageId"
          class="localized-box"
        >
          <div class="detail-item w-100">
            <span class="label">Language ID :</span>
            <span class="value">{{ item.languageId }}</span>
          </div>
          <div class="detail-item w-100">
            <span class="label">Title :</span>
            <span class="value">{{ item.title }}</span>
          </div>
          <div class="detail-item w-100">
            <span class="label">Summary :</span>
            <span class="value">{{ item.summary }}</span>
          </div>
          <div class="detail-item w-100 flex-column">
            <span class="label">Body :</span>
            <div
              class="value body-content"
              v-html="item.body"
            />
          </div>
        </div>
      </div>

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
    </template>

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
        :disabled="loading || !commentReject"
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
import dayjs from 'dayjs'
import type { AdminBlogContributionDetailDTO } from '@/types'

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
} = useBlogAdmin()

const blogDetail = ref<AdminBlogContributionDetailDTO | null>(null)
const commentReject = ref('')

const detailFields = computed<DetailField[]>(() => {
  if (!blogDetail.value) return []

  const fields: DetailField[] = [
    { key: 'title', label: 'Title :', value: blogDetail.value.title, full: true },
    { key: 'slug', label: 'Slug :', value: blogDetail.value.slug, full: true },
    { key: 'summary', label: 'Summary :', value: blogDetail.value.summary, full: true },
    { key: 'keywords', label: 'Keywords :', value: blogDetail.value.keywords || '', full: true },
    { key: 'postId', label: 'Post ID :', value: blogDetail.value.postId },
    { key: 'visibilityType', label: 'Visibility :', value: blogDetail.value.visibilityType },
    {
      key: 'publishDate',
      label: 'Publish Date :',
      value: blogDetail.value.publishDate
        ? dayjs(blogDetail.value.publishDate).format('DD/MM/YYYY HH:mm:ss')
        : '',
    },
    { key: 'draft', label: 'Draft :', value: blogDetail.value.draft ? 'Yes' : 'No' },
    { key: 'tags', label: 'Tags :', value: blogDetail.value.tags.join(', '), full: true },
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
    blogDetail.value = response.data
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

.blog-image {
  max-width: 100%;
  max-height : 300px;
  height: auto;
  object-fit: contain;
}

.body-content {
  width: 100%;
  font-weight: 500;
  line-height: 1.7;
}

:deep(.body-content img) {
  max-width: 100%;
  max-height : 300px;
  height: auto;
}

.localized-box {
  width: 100%;
  border: 1px solid rgb(var(--v-theme-grey200));
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
}
</style>
