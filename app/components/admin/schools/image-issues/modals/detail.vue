<template>
  <div class="w-100 d-flex flex-column ga-4 pa-4">
    <v-alert
      v-if="isPending"
      type="warning"
      variant="tonal"
    >
      <span class="text-grey700">
        Delete image confirms this report and removes the image from the school page. This can't be undone.
      </span>
    </v-alert>
    <v-alert
      v-else
      type="info"
      variant="tonal"
    >
      <span class="text-grey700">
        This report has already been reviewed. Status: {{ issue.status }}.
      </span>
    </v-alert>

    <v-img
      :src="issue.fileUri"
      :alt="schoolName"
      min-height="220"
      max-height="300"
      class="bg-grey100 rounded-lg"
    >
      <template #error>
        <div class="h-100 d-flex align-center justify-center text-h5 text-grey500">
          The image could not be loaded.
        </div>
      </template>
    </v-img>

    <div class="d-flex flex-wrap align-center justify-space-between ga-2">
      <v-skeleton-loader
        v-if="loadingGetItemById"
        width="160"
        height="24"
        class="rounded-pill"
      />
      <nuxt-link
        v-else
        class="text-h4 text-grey700 font-weight-bold text-decoration-none"
        :to="`/school/${issue.schoolId}`"
        target="_blank"
      >
        {{ schoolName || `School ${issue.schoolId}` }}
      </nuxt-link>

      <v-btn
        :href="issue.fileUri"
        target="_blank"
        rel="noopener"
        variant="text"
        class="text-h6"
        prepend-icon="md:open_in_new"
      >
        Full size
      </v-btn>
    </div>

    <div
      v-for="detail in details"
      :key="detail.label"
      class="d-flex flex-column"
    >
      <span class="text-h6 text-grey500">{{ detail.label }}</span>
      <span class="text-h5 text-grey700 text-break">{{ detail.value }}</span>
    </div>

    <template v-if="isPending">
      <div class="d-flex flex-column ga-1">
        <div class="text-h6 text-grey700">
          To keep the image, write why this report is wrong.
        </div>
        <v-text-field
          v-model="rejectComment"
          rounded="lg"
          density="compact"
          placeholder="Reason for keeping the image"
          variant="outlined"
          autocomplete="off"
          hide-details
        />
      </div>

      <div class="d-flex flex-column flex-sm-row justify-center align-center ga-3 mt-4">
        <v-btn
          color="success"
          rounded="xl"
          variant="outlined"
          height="40"
          width="180"
          class="text-h5"
          :disabled="loadingConfirm || !rejectComment.trim()"
          :loading="loadingReject"
          flat
          @click="rejectIssue"
        >
          Keep image
        </v-btn>

        <v-btn
          color="error"
          rounded="xl"
          variant="outlined"
          height="40"
          width="180"
          class="text-h5"
          :disabled="loadingReject"
          flat
          @click="showDeleteModal = true"
        >
          Delete image
        </v-btn>
      </div>
    </template>

    <admin-common-delete-modal
      v-model="showDeleteModal"
      :loading="loadingConfirm"
      @confirm="confirmIssue"
    />
  </div>
</template>

<script setup lang="ts">
import type { AdminSchoolImageIssueDTO } from '@/types'

interface IImageIssueDetailModal {
  issue: AdminSchoolImageIssueDTO
}

const props = defineProps<IImageIssueDetailModal>()
const emit = defineEmits(['changeStatusSuccessfull'])

const { formatLocal } = useDateTime()
const {
  getItemById,
  loadingGetItemById,
  confirm,
  loadingConfirm,
  reject,
  loadingReject,
} = useSchoolImageIssueAdmin()

const schoolName = ref('')
const rejectComment = ref('')
const showDeleteModal = ref(false)

const isPending = computed(() => props.issue.status === 'Review')
const details = computed(() => [
  { label: 'Reason for removal', value: props.issue.description || 'No reason given' },
  {
    label: 'Reported by',
    value: `${props.issue.creationUser || 'Unknown'} on ${formatLocal(props.issue.creationDate, 'DD/MM/YYYY HH:mm')}`,
  },
])

onMounted(async () => {
  const response = await getItemById(props.issue.id)

  if (response.succeeded && response.data) {
    schoolName.value = response.data.schoolName
  }
})

const confirmIssue = async () => {
  const response = await confirm(props.issue.id)
  showDeleteModal.value = false

  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}

const rejectIssue = async () => {
  const response = await reject(props.issue.id, rejectComment.value.trim())

  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}
</script>
