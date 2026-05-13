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
      <div
        v-else
        class="value"
        v-html="contactData?.body"
      />
    </div>

    <div
      v-if="loadingReplyList || replyList.length > 0"
      class="w-100 d-flex flex-column align-start justify-start mb-4 ga-2"
    >
      <span class="label mb-2">Conversation</span>
      <template v-if="loadingReplyList">
        <div
          v-for="i in 3"
          :key="i"
          class="box-chat d-flex flex-column rounded-lg bg-grey100 pa-4 ga-1"
        >
          <v-skeleton-loader
            width="80"
            height="20"
            class="rounded-lg"
          />
          <v-skeleton-loader
            width="40"
            height="10"
            class="rounded-lg"
          />
        </div>
      </template>
      <template v-else>
        <div
          v-for="item in replyList"
          :key="item.id"
          class="box-chat d-flex flex-column rounded-lg bg-grey100 py-4 px-6 ga-1"
        >
          <div
            class="w-100 text-start text-h5 font-weight-bold text-grey900"
            v-html="item.body"
          />
          <span class="w-100 text-end text-subtitle-2 font-weight-regular text-grey700">{{ $dayjs(item.creationDate).format("DD/MM/YYYY HH:mm") }}</span>
        </div>
      </template>
    </div>
    <div class="w-100 d-flex flex-column align-start">
      <span class="text-h5 font-weight-bold text-grey700 mb-4">Do you Want Reply this Email?</span>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          From
        </div>
        <v-select
          v-model="selectedFromEmail"
          :items="fromEmailList"
          :loading="loadingEmailList"
          rounded="lg"
          density="compact"
          placeholder="From"
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

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Body
        </div>
        <common-rich-editor
          v-model="bodyReply"
          mode="custom"
          :features="['bold', 'italic', 'list', 'link']"
          :rules="requiredRule"
          required
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
      :disabled="!replyValid || loadingData || loadingEmailList"
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
  AdminReplyTicketListDTO,
} from '@/types'

interface IViewMessageDetailsModal {
  id: number | null
}

const props = defineProps<IViewMessageDetailsModal>()
const emit = defineEmits(['replySuccessFull'])
const { $dayjs, $toast } = useNuxtApp()

const contactData = ref<AdminContactUsDetailDTO>()
const loadingReply = ref(false)
const loadingData = ref(true)

const bodyReply = ref('')
const selectedFromEmail = ref()
const fromEmailList = ref<string[]>([])
const loadingEmailList = ref(false)
const loadingReplyList = ref(true)
const replyList = ref<AdminReplyTicketListDTO[]>([])

const requiredRule = (value: string) => !!value || 'This field is required'

const replyValid = computed(() => {
  if (bodyReply.value.length == 0 || selectedFromEmail.value == null || selectedFromEmail.value.length == 0) {
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
      `/api/v2/admin/tickets/${props.id}`,
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

const removeScriptTags = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const scripts = doc.querySelectorAll('script')

  scripts.forEach((script) => {
    script.remove()
  })
  return doc.body.innerHTML
}

const reply = async () => {
  if (contactData.value) {
    try {
      loadingReply.value = true
      const formData = new FormData()
      formData.append('From', selectedFromEmail.value)
      formData.append('Body', removeScriptTags(bodyReply.value))
      const response = await useApiService.post<
        ApiResult<unknown>
      >(
        `/api/v2/admin/tickets/${contactData.value.id}/replys`,
        formData,
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
    $toast.error('User data not founded!')
  }
}

const getEmailAddresses = async () => {
  try {
    loadingEmailList.value = true
    const response = await useApiService.get<
      ApiResult<string[]>
    >(
      '/api/v2/admin/emails/addresses',
    )
    if (response.succeeded) {
      fromEmailList.value = response.data ?? []
    }
    else {
      $toast.error('The operation get data failed. Please try again later.')
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }
  finally {
    loadingEmailList.value = false
  }
}

const getReplyList = async () => {
  try {
    loadingReplyList.value = true
    const response = await useApiService.get<
      ApiResult<AdminReplyTicketListDTO[]>
    >(
      `/api/v2/admin/tickets/${props.id}/replys`,
    )
    if (response.succeeded) {
      replyList.value = response.data ?? []
    }
    else {
      $toast.error('The operation get data failed. Please try again later.')
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }
  finally {
    loadingReplyList.value = false
  }
}

onMounted(async () => {
  await Promise.allSettled([
    getDetail(),
    getEmailAddresses(),
    getReplyList(),
  ])
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
