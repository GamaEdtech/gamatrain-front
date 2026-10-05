<template>
  <div class="w-100 d-flex flex-column pa-4">
    <div class="w-100 d-flex flex-column align-start ga-3">
      <nuxt-link
        class="text-h4 text-grey700 font-weight-bold text-decoration-none"
        :to="`/school/${issue.schoolId}`"
        target="_blank"
      >
        {{ issue.schoolName || `School #${issue.schoolId}` }}
      </nuxt-link>

      <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
        <span class="text-h6 text-grey500 font-weight-medium">
          Reported by {{ issue.creationUser || 'unknown' }}
        </span>
        <span class="text-h6 text-grey500 font-weight-medium">
          {{ formatLocal(issue.creationDate, 'DD/MM/YYYY HH:mm') }}
        </span>
      </div>

      <p class="text-h5 text-grey700 font-weight-medium bg-grey100 rounded-lg pa-4 w-100">
        {{ issue.description }}
      </p>
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
        :disabled="loadingConfirm || !rejectComment"
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
        :disabled="loadingReject"
        flat
        @click="confirmIssue"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminSchoolIssueDTO } from '@/types'

interface ISchoolIssueDetailModal {
  issue: AdminSchoolIssueDTO
}

const props = defineProps<ISchoolIssueDetailModal>()
const emit = defineEmits(['changeStatusSuccessfull'])

const { formatLocal } = useDateTime()
const {
  confirm,
  loadingConfirm,
  reject,
  loadingReject,
} = useSchoolIssueAdmin()

const rejectComment = ref('')

const confirmIssue = async () => {
  const response = await confirm(props.issue.id)

  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}

const rejectIssue = async () => {
  if (!rejectComment.value) return

  const response = await reject(props.issue.id, rejectComment.value)

  if (response.succeeded) {
    emit('changeStatusSuccessfull')
  }
}
</script>
