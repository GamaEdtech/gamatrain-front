<template>
  <div class="w-100 d-flex flex-column pa-4">
    <div class="w-100 d-flex flex-column align-start">
      <span class="text-h5 font-weight-bold text-grey700 mb-4">Do you want compose mail?</span>

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
          Subject
        </div>
        <v-text-field
          v-model="subject"
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
          Email
        </div>
        <v-text-field
          v-model="email"
          rounded="lg"
          density="compact"
          placeholder="Email"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[requiredRule, emailRules]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Body
        </div>

        <common-rich-editor
          v-model="body"
          :rules="requiredRule"
          required
          mode="custom"
          :features="['bold', 'italic', 'list', 'link']"
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
      :disabled="!dataValid || loadingEmailList"
      :loading="loading"
      flat
      @click="send"
    >
      Send
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  AppError,
} from '~/types/api'

const emit = defineEmits(['ComposeMailSuccessFull'])
const { $toast } = useNuxtApp()

const loading = ref(false)
const subject = ref('')
const body = ref('')
const email = ref('')
const selectedFromEmail = ref()
const fromEmailList = ref<string[]>([])
const loadingEmailList = ref(false)

const isRequired = (value: string) => !!value
const isEmailValid = (value: string) => /.+@.+\..+/.test(value)

const requiredRule = (value: string) => isRequired(value) || 'This field is required'
const emailRules = (value: string) => isEmailValid(value) || 'E-mail must be valid'

const dataValid = computed(() => {
  return (
    isRequired(subject.value)
    && isRequired(body.value)
    && isRequired(email.value)
    && isEmailValid(email.value)
    && isRequired(selectedFromEmail.value)
    && selectedFromEmail.value.length > 0
  )
})

const removeScriptTags = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const scripts = doc.querySelectorAll('script')

  scripts.forEach((script) => {
    script.remove()
  })
  return doc.body.innerHTML
}

const send = async () => {
  try {
    loading.value = true
    const params = {
      from: selectedFromEmail.value,
      body: removeScriptTags(body.value),
      subject: subject.value,
      users: [],
      emailAddresses: [
        email.value,
      ],
    }
    const response = await useApiService.post<
      ApiResult<unknown>
    >(
      '/api/v2/admin/emails',
      params,
    )
    if (response.succeeded) {
      $toast.success('Message Send Successfully!')
      emit('ComposeMailSuccessFull')
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
    loading.value = false
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

onMounted(async () => {
  await getEmailAddresses()
})
</script>

<style scoped>
</style>
