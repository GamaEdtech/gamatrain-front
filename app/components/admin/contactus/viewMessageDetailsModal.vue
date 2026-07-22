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
          <span class="w-100 text-end text-subtitle-2 font-weight-regular text-grey700">{{ formatLocal(item.creationDate, "DD/MM/YYYY HH:mm") }}</span>
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

      <div class="w-100 d-flex flex-column align-start justify-start ga-1 position-relative">
        <div class="text-h6 text-grey700 ml-2">
          Body
        </div>
        <common-rich-editor
          v-model="bodyReply"
          mode="custom"
          :features="['bold', 'italic', 'list', 'link']"
          :rules="[required]"
        />
        <v-btn
          size="x-small"
          height="40"
          width="40"
          icon
          color="primary"
          flat
          :loading="loadingAiReply"
          :disabled="loadingData || loadingReplyList || !contactData"
          class="position-absolute position-button-ai"
          @click="generateAiReply"
        >
          <v-icon
            size="x-large"
            color="white"
          >
            md:wand_stars
          </v-icon>
        </v-btn>

        <v-btn
          color="primary"
          variant="outlined"
          flat
          class="text-h5 font-weight-bold"
          :loading="loadingPolishReply"
          :disabled="!bodyReply.trim() || loadingPolishReply"
          @click="polishReplyWithAi"
        >
          Polish with AI
          <v-icon
            color="primary"
            class="ml-1"
          >
            md:cleaning_services
          </v-icon>
        </v-btn>
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
const { $toast } = useNuxtApp()
const { formatLocal } = useDateTime()
const { required } = useValidationRules()

const contactData = ref<AdminContactUsDetailDTO>()
const loadingReply = ref(false)
const loadingData = ref(true)

const bodyReply = ref('')
const selectedFromEmail = ref()
const fromEmailList = ref<string[]>([])
const loadingEmailList = ref(false)
const loadingAiReply = ref(false)
const loadingPolishReply = ref(false)
const loadingReplyList = ref(true)
const replyList = ref<AdminReplyTicketListDTO[]>([])

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

const stripHtml = (html?: string | null) => {
  if (!html)
    return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  return doc.body.textContent?.trim() ?? ''
}

const buildAiReplyPrompt = () => {
  const ticket = contactData.value
  const conversation = replyList.value.length
    ? replyList.value
        .map((item, index) => {
          return [
            `Reply ${index + 1}:`,
            `Date: ${formatLocal(item.creationDate, 'DD/MM/YYYY HH:mm')}`,
            `Body: ${stripHtml(item.body)}`,
          ].join('\n')
        })
        .join('\n\n')
    : 'No previous replies.'

  return [
    'You are a GamaTrain admin support agent.',
    'Write a direct reply to the customer based on the ticket information below.',
    'Use the customer name when it is available.',
    'Keep the tone professional, warm, clear, and concise.',
    'Answer only based on the provided subject, original message, and previous conversation.',
    'Do not invent facts, prices, discounts, timelines, links, policies, or technical details.',
    'If the issue cannot be resolved with the provided information, politely ask the customer for the exact missing details.',
    'Do not mention that you are an AI or that you received a prompt.',
    'Format the reply as clean HTML suitable for a rich text editor.',
    'Use <p> tags for the greeting, each paragraph, and the closing.',
    'Put the greeting in its own paragraph, for example: <p>Dear [Customer Name],</p>.',
    'Use separate paragraphs wherever a line break is needed.',
    'Put the closing in its own final paragraph, for example: <p>Best regards,<br>GamaTrain Support</p>.',
    'Do not use Markdown.',
    'Do not include scripts, styles, images, tables, or unnecessary HTML attributes.',
    'Return only the final HTML reply body that the admin can send to the customer.',
    '',
    `Customer name: ${ticket?.fullName || 'Unknown'}`,
    `Customer email: ${ticket?.email || 'Unknown'}`,
    `Subject: ${ticket?.subject || 'No subject'}`,
    `Original message: ${stripHtml(ticket?.body) || 'No body'}`,
    '',
    'Previous conversation:',
    conversation,
  ].join('\n')
}

const generateAiReply = async () => {
  if (!contactData.value)
    return

  try {
    loadingAiReply.value = true
    const response = await useApiService.post<{
      response?: string
    }>(
      '/api/chatgpt',
      {
        userComment: buildAiReplyPrompt(),
      },
    )

    if (response.response) {
      bodyReply.value = response.response
      $toast.success('AI reply generated successfully!')
    }
    else {
      $toast.error('The operation failed. Please try again later.')
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    $toast.error(
      error.response?.data?.message
      || error.message
      || 'The operation failed. Please try again later.',
    )
  }
  finally {
    loadingAiReply.value = false
  }
}

const buildPolishReplyPrompt = () => {
  return [
    'You are a professional English writing editor for a GamaTrain admin support reply.',
    'Polish the admin reply below.',
    'Improve grammar, spelling, word choice, clarity, and professional tone.',
    'Preserve the original meaning and intent exactly.',
    'Do not add new facts, promises, prices, discounts, links, timelines, policies, or technical details.',
    'Remove or soften any rude, offensive, aggressive, or unprofessional wording while keeping the message clear.',
    'Format the polished reply as clean HTML suitable for a rich text editor.',
    'Use <p> tags for the greeting, each paragraph, and the closing.',
    'Put the greeting in its own paragraph when a greeting exists.',
    'Use separate paragraphs wherever a line break is needed.',
    'Put the closing in its own final paragraph when a closing exists, for example: <p>Best regards,<br>GamaTrain Support</p>.',
    'Do not use Markdown.',
    'Do not wrap the reply in a fenced code block such as ```html or ```.',
    'Do not include scripts, styles, images, tables, or unnecessary HTML attributes.',
    'Return only the polished HTML reply body.',
    '',
    'Admin reply:',
    stripHtml(bodyReply.value),
  ].join('\n')
}

const polishReplyWithAi = async () => {
  if (!bodyReply.value.trim())
    return

  try {
    loadingPolishReply.value = true
    const response = await useApiService.post<{
      response?: string
    }>(
      '/api/chatgpt',
      {
        userComment: buildPolishReplyPrompt(),
      },
    )

    if (response.response) {
      bodyReply.value = response.response
      $toast.success('Reply polished successfully!')
    }
    else {
      $toast.error('The operation failed. Please try again later.')
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    $toast.error(
      error.response?.data?.message
      || error.message
      || 'The operation failed. Please try again later.',
    )
  }
  finally {
    loadingPolishReply.value = false
  }
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
.position-button-ai {
  right: 10px;
  bottom: 60px;
}
</style>
