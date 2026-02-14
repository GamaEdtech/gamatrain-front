<template>
  <div class="w-100 d-flex flex-column pa-4">
    <div class="w-100 d-flex flex-column align-start">
      <span class="text-h5 font-weight-bold text-grey700 mb-4">Do you create Ticket?</span>

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
          Receiver Name
        </div>
        <v-text-field
          v-model="name"
          rounded="lg"
          density="compact"
          placeholder="Receiver Name"
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
          Receiver Email
        </div>
        <v-text-field
          v-model="email"
          rounded="lg"
          density="compact"
          placeholder="Receiver Email"
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
        <v-textarea
          v-model="body"
          rounded="lg"
          density="compact"
          placeholder="Body"
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
      :disabled="!dataValid || loadingEmailList"
      :loading="loading"
      flat
      @click="create"
    >
      Create
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  AppError,
} from '~/types/api'

const emit = defineEmits(['CreateTicketSuccessFull'])
const { $toast } = useNuxtApp()

const loading = ref(false)
const subject = ref('')
const body = ref('')
const email = ref('')
const name = ref('')
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
    && isRequired(name.value)
    && isRequired(email.value)
    && isEmailValid(email.value)
    && isRequired(selectedFromEmail.value)
    && selectedFromEmail.value.length > 0
  )
})

const create = async () => {
  try {
    loading.value = true

    const formData = new FormData()
    formData.append('From', selectedFromEmail.value)
    formData.append('ReceiverName', name.value)
    formData.append('ReceiverEmail', email.value)
    formData.append('Subject', subject.value)
    formData.append('Body', body.value)
    const response = await useApiService.post<
      ApiResult<unknown>
    >(
      '/api/v2/admin/tickets',
      formData,
    )
    if (response.succeeded) {
      $toast.success('Ticket Create Successfully!')
      emit('CreateTicketSuccessFull')
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
