<template>
  <v-form
    v-model="isFormValid"
    class="w-100 d-flex flex-column"
    @submit.prevent="submitTicket"
  >
    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h6 text-grey700 font-weight-medium ml-2">
        Email
      </div>
      <v-text-field
        v-model="form.email"
        rounded="pill"
        height="48"
        placeholder="Enter..."
        variant="outlined"
        autocomplete="off"
        persistent-clear
        base-color="grey200"
        color="primary"
        active-color="primary"
        bg-color="white"
        class="w-100"
        density="compact"
        :rules="[required, emailStrict]"
      />
    </div>

    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h6 text-grey700 font-weight-medium ml-2">
        Subject
      </div>
      <v-text-field
        v-model="form.subject"
        rounded="pill"
        height="48"
        placeholder="Enter..."
        variant="outlined"
        autocomplete="off"
        persistent-clear
        base-color="grey200"
        color="primary"
        active-color="primary"
        bg-color="white"
        class="w-100"
        density="compact"
        :rules="[required]"
      />
    </div>

    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h6 text-grey700 font-weight-medium ml-2">
        Message
      </div>
      <v-textarea
        v-model="form.body"
        rounded="lg"
        placeholder="Write your message..."
        variant="outlined"
        base-color="grey200"
        color="primary"
        active-color="primary"
        bg-color="white"
        class="w-100"
        no-resize
        rows="5"
        density="compact"
        :rules="[required]"
      />
    </div>

    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h6 text-grey700 font-weight-medium ml-2">
        Attachment
      </div>
      <v-file-input
        v-model="form.file"
        rounded="pill"
        height="48"
        placeholder="Choose a file"
        variant="outlined"
        base-color="grey200"
        color="primary"
        active-color="primary"
        bg-color="white"
        class="w-100"
        clearable
        :accept="allowedFileTypes.join(',')"
        prepend-icon=""
        prepend-inner-icon="md:attach_file"
        density="compact"
        :rules="[fileSize(1), fileType(allowedFileTypes)]"
      />
    </div>

    <div class="w-100 d-flex justify-center align-center ga-2 mt-8">
      <v-btn
        color="grey200"
        variant="outlined"
        rounded="pill"
        height="38"
        width="90"
        class="text-h5 font-weight-medium"
        flat
        :disabled="loading"
        @click="back"
      >
        <span class="text-grey800">
          Discard
        </span>
      </v-btn>

      <v-btn
        color="primary"
        rounded="pill"
        height="38"
        width="220"
        class="text-h5 text-grey800 font-weight-medium"
        flat
        type="submit"
        :disabled="!isFormValid || loading"
        :loading="loading"
      >
        Submit
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { useRecaptcha } from '~/composables/useRecapcha'

const { allowedFileTypes } = defineProps<{
  allowedFileTypes: string[]
}>()

const emit = defineEmits<{
  (e: 'back' | 'success'): void
}>()

const { $toast } = useNuxtApp()
const { required, emailStrict, fileSize, fileType } = useValidationRules()
const { createTicket } = useTicket()
const { getToken, initCaptcha, isLoaded } = useRecaptcha()
const { user } = useUser()
const { sanitizeTextForHtml } = useHtmlSanitizer()

const isFormValid = ref(false)
const loading = ref(false)
const form = reactive<{
  email: string
  subject: string
  body: string
  file: File | File[] | null
}>({
  email: '',
  subject: '',
  body: '',
  file: null,
})

const back = () => {
  emit('back')
}

const resetForm = () => {
  form.email = ''
  form.subject = ''
  form.body = ''
  form.file = null
}

const getSelectedFile = (value: File | File[] | null = form.file) => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const submitTicket = async () => {
  if (!isFormValid.value || loading.value) return

  try {
    if (!isLoaded()) {
      throw new Error('reCAPTCHA not loaded yet. Please try again.')
    }

    loading.value = true
    const captcha = await getToken('submit')
    const response = await createTicket({
      captcha,
      fullName: useFullName(user.value || {}),
      email: form.email,
      subject: form.subject,
      body: sanitizeTextForHtml(form.body),
      file: getSelectedFile(),
    })

    if (response.succeeded) {
      $toast.success('Ticket submitted successfully!')
      resetForm()
      emit('success')
      emit('back')
    }
  }
  catch (error) {
    console.error(error)
    $toast.error('An error occurred. Please try again.')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  initCaptcha()
})
</script>
