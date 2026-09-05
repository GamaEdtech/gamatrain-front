<template>
  <div class="w-100 d-flex flex-column ticket-detail mt-2">
    <template v-if="loadingDetail">
      <div
        class="w-100 d-flex flex-column align-start justify-start ga-3 bg-grey100 rounded-lg pa-4"
      >
        <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
          <v-skeleton-loader
            width="160"
            height="20"
            class="rounded-pill"
          />
          <v-skeleton-loader
            width="140"
            height="20"
            class="rounded-pill"
          />
        </div>

        <div class="w-100 d-flex align-center justify-start ga-2 flex-wrap">
          <v-skeleton-loader
            width="100"
            height="20"
            class="rounded-pill"
          />
          <v-skeleton-loader
            width="80"
            height="20"
            class="rounded-pill"
          />
        </div>

        <v-skeleton-loader
          width="240"
          height="80"
          class="rounded-lg ml-4 mb-2"
        />

        <v-skeleton-loader
          width="140"
          height="30"
          class="rounded-pill ml-4"
        />
      </div>
    </template>
    <template v-else>
      <div
        v-if="ticketDetail"
        class="w-100 d-flex flex-column align-start justify-start ga-3 bg-grey100 rounded-lg pa-4"
      >
        <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
          <span class="text-h5 text-sm-h4 text-grey800 font-weight-bold">
            {{ ticketDetail.subject }}
          </span>
          <span class="text-h6 text-grey500 font-weight-medium d-flex align-center ga-1">
            <v-icon
              size="18"
              color="grey400"
            >
              md:history
            </v-icon>
            {{ formatLocal(ticketDetail.creationDate, 'DD/MM/YYYY HH:mm') }}
          </span>
        </div>

        <div class="w-100 d-flex align-center justify-start ga-2 flex-wrap">
          <span
            class="text-h6 font-weight-bold text-grey700"
          >
            {{ ticketDetail.fullName }} :
          </span>
          <span class="text-h6 text-grey500 font-weight-medium">
            {{ ticketDetail.email }}
          </span>
        </div>

        <p class="text-h5 text-grey700 font-weight-medium mb-2 ml-4 ticket-body">
          {{ ticketDetail.body }}
        </p>

        <v-btn
          v-if="ticketDetail.fileUri"
          :href="ticketDetail.fileUri"
          target="_blank"
          rounded="pill"
          variant="outlined"
          color="primary"
          height="30"
          class="text-h6 font-weight-bold ml-4"
        >
          <v-icon
            size="18"
            start
          >
            md:download
          </v-icon>
          Download file
        </v-btn>
      </div>
    </template>

    <template v-if="loadingReplies">
      <div class="w-100 d-flex flex-column ga-3 mt-5 reply-list pa-2 overflow-y-auto">
        <div
          v-for="i in 5"
          :key="i"
          :class="`w-100 d-flex ${i % 2 == 0 ? 'justify-end' : 'justify-start'}`"
        >
          <div :class="`reply-bubble rounded-lg d-flex flex-column ga-2 pa-3 ${i % 2 == 0 ? 'bg-primary50' : 'bg-grey100'}`">
            <div class="d-flex align-center justify-space-between ga-3 flex-wrap">
              <v-skeleton-loader
                width="140"
                height="16"
                class="rounded-pill"
              />
              <v-skeleton-loader
                width="100"
                height="16"
                class="rounded-pill"
              />
            </div>
            <v-skeleton-loader
              width="200"
              height="60"
              class="rounded-lg  mb-0 ml-2 mt-2"
            />

            <v-skeleton-loader
              width="160"
              height="30"
              class="rounded-pill"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="w-100 d-flex flex-column ga-3 mt-5 reply-list pa-2 overflow-y-auto">
        <div
          v-if="!replyList.length"
          class="w-100 d-flex flex-column align-center justify-center ga-2 py-8"
        >
          <v-icon
            size="36"
            color="grey300"
          >
            md:forum
          </v-icon>
          <span class="text-h5 text-grey700 font-weight-medium">
            No replies yet
          </span>
        </div>

        <div
          v-for="reply in replyList"
          :key="reply.id"
          :class="`w-100 d-flex ${isUserReply(reply) ? 'justify-end' : 'justify-start'}`"
        >
          <div :class="`reply-bubble rounded-lg d-flex flex-column ga-2 pa-3 ${isUserReply(reply) ? 'bg-primary50' : 'bg-grey100'}`">
            <div class="d-flex align-center justify-space-between ga-3 flex-wrap">
              <span class="text-h6 text-grey700 font-weight-bold">
                {{ reply.creationUser || 'Support' }}
              </span>
              <span class="text-subtitle-1 text-grey500 font-weight-medium">
                {{ formatLocal(reply.creationDate, 'DD/MM/YYYY HH:mm') }}
              </span>
            </div>

            <div
              class="text-h6 text-grey700 font-weight-medium mb-0 ticket-body pl-2"
              v-html="reply.body"
            />

            <v-btn
              v-if="reply.fileUri"
              :href="reply.fileUri"
              target="_blank"
              rounded="pill"
              variant="text"
              color="primary"
              height="30"
              class="align-self-start px-2 text-h6 font-weight-bold"
            >
              <v-icon
                size="18"
                start
              >
                md:download
              </v-icon>
              Download file
            </v-btn>
          </div>
        </div>
      </div>

      <v-form
        v-model="isReplyFormValid"
        class="w-100 mt-5"
      >
        <div class="reply-composer rounded-lg bg-white">
          <div
            v-if="selectedFile"
            class="d-flex justify-space-between align-center pa-2 ma-2 rounded-lg bg-grey100"
          >
            <div class="d-flex align-center ga-3 w-75">
              <v-img
                v-if="filePreviewUrl"
                :src="filePreviewUrl"
                width="44"
                height="44"
                max-width="44"
                cover
                class="rounded-lg"
              />
              <div
                v-else
                class="d-flex align-center justify-center rounded-lg bg-primary50 pa-2"
              >
                <v-icon
                  color="primary"
                  size="28"
                >
                  md:insert_drive_file
                </v-icon>
              </div>

              <div class="d-flex flex-column overflow-hidden">
                <span class="text-h6 text-grey800 font-weight-bold text-truncate">
                  {{ selectedFile.name }}
                </span>
                <span class="text-subtitle-1 text-grey500 font-weight-medium">
                  {{ formatFileSize(selectedFile.size) }}
                </span>
              </div>
            </div>

            <v-btn
              icon
              variant="text"
              size="32"
              color="grey600"
              @click="clearFile"
            >
              <v-icon size="18">
                md:close
              </v-icon>
            </v-btn>
          </div>

          <v-textarea
            v-model="replyForm.body"
            placeholder="Write a reply..."
            variant="plain"
            color="primary"
            bg-color="transparent"
            class="px-3 py-1"
            no-resize
            rows="2"
            auto-grow
            max-rows="6"
            hide-details
            density="compact"
            autocomplete="off"
            persistent-clear
            :rules="[required]"
          >
            <template #append-inner>
              <div class="d-flex align-end h-100 ga-2 pb-2">
                <v-btn
                  icon
                  variant="text"
                  size="40"
                  color="grey600"
                  @click="openFilePicker"
                >
                  <v-icon size="22">
                    md:attach_file
                  </v-icon>
                </v-btn>

                <v-btn
                  icon
                  flat
                  color="primary"
                  size="40"
                  :disabled="!isReplyFormValid"
                  :loading="loadingCreateReply"
                  @click="submitReply"
                >
                  <v-icon
                    color="white"
                    size="20"
                  >
                    md:send
                  </v-icon>
                </v-btn>
              </div>
            </template>
          </v-textarea>

          <v-file-input
            ref="fileInputRef"
            v-model="replyForm.file"
            class="d-none"
            accept=".zip,.png,.jpg,.jpeg,.gif,.webp,.svg"
            hide-details
            @update:model-value="onFileChange"
          />
        </div>
      </v-form>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TicketReplyDTO } from '@/types'

const props = defineProps<{
  ticketId: number | string
}>()

const emit = defineEmits<{
  (e: 'replied'): void
}>()

const { $toast } = useNuxtApp()
const { formatLocal } = useDateTime()
const { required } = useValidationRules()
const {
  replyList,
  loadingGetItemById: loadingDetail,
  loadingGetReplyList: loadingReplies,
  loadingCreateReply,
  getItemById,
  getReplyList,
  createReply,
} = useTicket()

const allowedFileExtensions = ['zip', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']
const maxFileSize = 1 * 1024 * 1024
const ticketDetail = ref<Awaited<ReturnType<typeof getItemById>>['data']>(null)
const isReplyFormValid = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const filePreviewUrl = ref<string | null>(null)
const replyForm = reactive<{
  body: string
  file: File | File[] | null
}>({
  body: '',
  file: null,
})

const loadTicket = async () => {
  const [detailResponse] = await Promise.allSettled([
    getItemById(props.ticketId),
    getReplyList(props.ticketId),
  ])
  if (detailResponse.status == 'fulfilled') {
    ticketDetail.value = detailResponse.value.data
  }
}

const getSelectedFile = () => {
  if (Array.isArray(replyForm.file)) {
    return replyForm.file[0] ?? null
  }

  return replyForm.file
}

const selectedFile = computed(() => getSelectedFile())

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const validateFile = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !allowedFileExtensions.includes(extension)) {
    $toast.error(`File type must be one of: ${allowedFileExtensions.join(', ')}`)
    return false
  }
  if (file.size > maxFileSize) {
    $toast.error('File size must be less than 1MB')
    return false
  }
  return true
}

const openFilePicker = () => {
  const inputEl = fileInputRef.value as HTMLInputElement | null
  inputEl?.click()
}

const clearFile = () => {
  replyForm.file = null
}

const onFileChange = (value: File | File[] | null) => {
  const file = Array.isArray(value) ? value[0] : value
  if (file) {
    if (validateFile(file)) {
      revokePreview()
      if (file && file.type.startsWith('image/')) {
        filePreviewUrl.value = URL.createObjectURL(file)
      }
    }
    else {
      replyForm.file = null
    }
  }
}

const revokePreview = () => {
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value)
    filePreviewUrl.value = null
  }
}

onBeforeUnmount(() => {
  revokePreview()
})

const resetReplyForm = () => {
  replyForm.body = ''
  replyForm.file = null
}

const isUserReply = (reply: TicketReplyDTO) => {
  return !!ticketDetail.value?.creationUser && reply.creationUser === ticketDetail.value.creationUser
}

const submitReply = async () => {
  if (!isReplyFormValid.value) return
  const response = await createReply(props.ticketId, {
    body: replyForm.body,
    file: getSelectedFile(),
  })

  if (response.succeeded) {
    $toast.success('Reply sent successfully!')
    resetReplyForm()
    await getReplyList(props.ticketId)
    emit('replied')
  }
}

onMounted(async () => {
  await loadTicket()
})
</script>

<style scoped>
.reply-list{
  max-height : 40vh;
}
.reply-bubble {
  max-width: 70%;
}
.ticket-body {
  white-space: pre-wrap;
  word-break: break-word;
}
.reply-composer {
  border: 1px solid rgb(var(--v-theme-grey200));
}
@media screen and (max-width: 600px) {
  .reply-bubble {
    max-width: 100%;
  }
}
</style>
