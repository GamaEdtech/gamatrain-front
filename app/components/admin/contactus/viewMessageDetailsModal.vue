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
        v-safe-html="contactData?.body"
        class="value container-body"
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
        <!-- Support replies on the right in the brand tint, the customer's on the left, mirroring the customer's view. -->
        <div
          v-for="item in replyList"
          :key="item.id"
          :class="['w-100 d-flex', item.bySupport ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="['reply-bubble d-flex flex-column rounded-lg py-4 px-6 ga-1', item.bySupport ? 'bg-primary50' : 'bg-grey100']"
          >
            <span class="text-h6 font-weight-bold text-grey700">
              {{ getReplyAuthor(item) }}
            </span>
            <div
              v-safe-html="item.body"
              class="w-100 text-start text-h5 font-weight-bold text-grey900"
            />
            <span class="w-100 text-end text-subtitle-2 font-weight-regular text-grey700">{{ formatLocal(item.creationDate, "DD/MM/YYYY HH:mm") }}</span>
          </div>
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
          :features="['bold', 'italic', 'list', 'link', 'image', 'mediaEmbed']"
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
          :disabled="!bodyReply.trim() || loadingPolishReply || !contactData"
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
const {
  getItemById,
  loadingGetItemById: loadingData,
  getEmailAddresses,
  loadingGetEmailAddresses: loadingEmailList,
  emailAddresses: fromEmailList,
  replyTicket,
  loadingReplyTicket: loadingReply,
  getReplyList: fetchReplyList,
  loadingGetReplyList: loadingReplyList,
  replyList,
  generateAiResponse,
} = useContactUsAdmin()

const contactData = ref<AdminContactUsDetailDTO>()

const bodyReply = ref('')
const selectedFromEmail = ref('')
const loadingAiReply = ref(false)
const loadingPolishReply = ref(false)

const replyValid = computed(() => {
  if (bodyReply.value.length == 0 || selectedFromEmail.value == null || selectedFromEmail.value.length == 0) {
    return false
  }
  return true
})

const getDetail = async () => {
  if (props.id == null)
    return

  const response = await getItemById(props.id)

  if (response.succeeded && response.data) {
    contactData.value = response.data
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

// Admins see which colleague answered; customers only ever see "Support team".
const getReplyAuthor = (reply: AdminReplyTicketListDTO) => {
  if (reply.bySupport) return reply.creationUser ? `Support team · ${reply.creationUser}` : 'Support team'

  return reply.creationUser || contactData.value?.fullName || 'Customer'
}

// The prompt and the support handbook live on the backend (POST admin/tickets/{id}/ai-replies).
const generateAiReply = async () => {
  if (!contactData.value)
    return

  try {
    loadingAiReply.value = true
    const reply = await generateAiResponse(contactData.value.id, { mode: 'Generate' })

    if (reply) {
      bodyReply.value = reply
      $toast.success('AI reply generated successfully!')
    }
  }
  finally {
    loadingAiReply.value = false
  }
}

const polishReplyWithAi = async () => {
  if (!contactData.value || !bodyReply.value.trim())
    return

  try {
    loadingPolishReply.value = true
    const reply = await generateAiResponse(contactData.value.id, {
      mode: 'Polish',
      draft: bodyReply.value,
    })

    if (reply) {
      bodyReply.value = reply
      $toast.success('Reply polished successfully!')
    }
  }
  finally {
    loadingPolishReply.value = false
  }
}

const reply = async () => {
  if (contactData.value) {
    const response = await replyTicket(contactData.value.id, {
      from: selectedFromEmail.value,
      body: removeScriptTags(bodyReply.value),
    })

    if (response.succeeded) {
      emit('replySuccessFull')
    }
  }
  else {
    $toast.error('User data not founded!')
  }
}

const getReplyList = async () => {
  if (props.id == null)
    return

  await fetchReplyList(props.id)
}

// Addresses come as "Support dep <support@gamatrain.com>"; match the address, not the label.
const selectSupportSender = () => {
  if (selectedFromEmail.value)
    return

  selectedFromEmail.value = fromEmailList.value.find((email: string) => email.toLowerCase().includes('<support@')) ?? ''
}

onMounted(async () => {
  await Promise.allSettled([
    getDetail(),
    getEmailAddresses().then(selectSupportSender),
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
.reply-bubble {
  max-width: 80%;
}
.position-button-ai {
  right: 10px;
  bottom: 60px;
}
:deep(.container-body img){
  width : 100% !important;
  height : auto !important;
  max-width : 600px !important;
  max-height : 600px !important;
}
</style>
