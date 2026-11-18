<template>
  <div class="w-100 d-flex flex-column bg-surface pa-2">
    <p class="text-body-2 text-grey600 mt-2 mb-4">
      Enter the email of your account. We'll send you a 6-digit code to set a new password.
    </p>

    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column ga-3"
      @submit.prevent="sendCode"
    >
      <div class="w-100 d-flex flex-column ga-1">
        <label
          for="auth-reset-email"
          class="text-caption text-grey700 font-weight-bold ml-2"
        >Email</label>
        <v-text-field
          id="auth-reset-email"
          v-model="emailUser"
          rounded="lg"
          height="48"
          placeholder="you@example.com"
          type="email"
          variant="outlined"
          autocomplete="email"
          hide-details="auto"
          base-color="grey300"
          color="primary"
          bg-color="surface"
          :rules="[required, emailRule]"
          @update:model-value="errorMessage = ''"
        />
      </div>

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        density="compact"
        class="text-body-2"
        role="alert"
      >
        {{ errorMessage }}
      </v-alert>

      <v-btn
        type="submit"
        block
        color="primary"
        rounded="pill"
        height="44"
        class="text-body-1 font-weight-bold text-none"
        flat
        :disabled="!isFormValid"
        :loading="loadingCode"
      >
        Send code
      </v-btn>
    </v-form>

    <v-btn
      variant="text"
      color="grey700"
      prepend-icon="md:arrow_back"
      class="mt-3 text-caption font-weight-medium text-none"
      @click="emit('openLogin', emailUser)"
    >
      Back to sign in
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ email?: string }>(), { email: '' })
const emit = defineEmits<{
  openLogin: [email: string]
  codeSent: [email: string]
}>()

const { $toast } = useNuxtApp()
const { email: emailRule, required } = useValidationRules()
const { sendResetCode, loadingCode } = useAuth()

const emailUser = ref(props.email)
const isFormValid = ref(false)
const errorMessage = ref('')

const sendCode = async () => {
  if (!isFormValid.value || loadingCode.value) return
  errorMessage.value = ''

  const response = await sendResetCode(emailUser.value)
  if (response.succeeded) {
    $toast.success('We sent you a code. Check your email.')
    emit('codeSent', emailUser.value.trim())
    return
  }

  errorMessage.value = response.message || 'We could not send the code. Please try again.'
}
</script>
