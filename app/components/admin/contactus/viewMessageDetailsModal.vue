<template>
  <div class="w-100 d-flex flex-column pa-4">
    <div class="detail-item">
      <span class="label">User :</span>
      <v-skeleton-loader
        v-if="loadingData"
        width="140"
        height="20"
        class="rounded-pill"
      />
      <span
        v-else
        class="value"
      >{{ contactData?.fullName }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Email :</span>
      <v-skeleton-loader
        v-if="loadingData"
        width="180"
        height="20"
        class="rounded-pill"
      />
      <span
        v-else
        class="value"
      >{{ contactData?.email }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Subject :</span>
      <v-skeleton-loader
        v-if="loadingData"
        width="160"
        height="20"
        class="rounded-pill"
      />
      <span
        v-else
        class="value"
      >{{ contactData?.subject }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Body :</span>
      <v-skeleton-loader
        v-if="loadingData"
        width="200"
        height="20"
        class="rounded-pill"
      />
      <span
        v-else
        class="value"
      >{{ contactData?.body }}</span>
    </div>
    <div class="w-100 d-flex flex-column align-start">
      <span class="text-h5 font-weight-bold text-grey700 mb-4">Do you Want Reply this Email?</span>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Subject
        </div>
        <v-text-field
          v-model="subjectReply"
          rounded="lg"
          density="compact"
          placeholder="Subject"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[requiredRule]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Body
        </div>
        <v-textarea
          v-model="bodyReply"
          rounded="lg"
          density="compact"
          placeholder="Body Reply"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[requiredRule]"
          no-resize
        />
      </div>
    </div>
    <v-btn
      color="success"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-8 mx-auto"
      :disabled="!replyValid || loadingData"
      :loading="loadingReply"
      flat
      @click="reply"
    >
      Reply
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  AppError,
  AdminContactUsDetailDTO,
} from '~/types/api'

interface IViewMessageDetailsModal {
  id: number | null
}

const props = defineProps<IViewMessageDetailsModal>()
const emit = defineEmits(['replySuccessFull'])
const { $toast } = useNuxtApp()

const contactData = ref<AdminContactUsDetailDTO>()
const loadingReply = ref(false)
const loadingData = ref(true)

const subjectReply = ref('')
const bodyReply = ref('')

const requiredRule = (value: string) => !!value || 'This field is required'

const replyValid = computed(() => {
  if (subjectReply.value.length == 0 || bodyReply.value.length == 0) {
    return false
  }
  return true
})

const getDetail = async () => {
  try {
    loadingData.value = true
    const response = await useApiService.get<
      ApiResult<AdminContactUsDetailDTO>
    >(
      `/api/v2/admin/contacts/${props.id}`,
    )
    if (response.succeeded && response.data) {
      contactData.value = response.data
    }
    else {
      $toast.error('The operation failed. Please try again later.')
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }
  finally {
    loadingData.value = false
  }
}

const reply = async () => {
  if (contactData.value && contactData.value.email) {
    try {
      loadingReply.value = true
      const params = {
        sender: 'support@gamatrain.com',
        body: bodyReply.value,
        subject: subjectReply.value,
        users: [],
        emailAddresses: [
          contactData.value?.email ?? '',
        ],
      }
      const response = await useApiService.post<
        ApiResult<unknown>
      >(
        '/api/v2/admin/emails',
        params,
      )
      if (response.succeeded) {
        $toast.success('Reply Message Send Successfully!')
        emit('replySuccessFull')
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingReply.value = false
    }
  }
  else {
    $toast.error('User email is invalid.')
  }
}

onMounted(async () => {
  await getDetail()
})
</script>

<style scoped>
.detail-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 16px;
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
</style>
