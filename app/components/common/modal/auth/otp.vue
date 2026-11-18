<template>
  <div class="w-100 d-flex flex-column bg-surface pa-2">
    <v-alert
      v-if="notice"
      type="info"
      variant="tonal"
      density="compact"
      class="text-body-2 mt-2"
    >
      {{ notice }}
    </v-alert>
    <p class="text-body-2 text-grey600 mt-2 mb-1">
      Enter the 6-digit code we sent to
    </p>
    <div class="d-flex align-center flex-wrap ga-1 mb-3">
      <span class="text-body-1 font-weight-bold text-grey800 text-break">{{ email }}</span>
      <v-btn
        variant="text"
        density="compact"
        color="primaryStrong"
        class="px-1 text-caption font-weight-bold text-none"
        @click="emit('changeEmail', email)"
      >
        Change
      </v-btn>
    </div>

    <v-form @submit.prevent="confirmCode">
      <v-otp-input
        v-model="otp"
        :length="CODE_LENGTH"
        type="number"
        autofocus
        :disabled="loadingCode"
        :error="!!errorMessage"
        class="px-0"
        @finish="confirmCode"
        @update:model-value="errorMessage = ''"
      />

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        density="compact"
        class="text-body-2 mt-2"
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
        class="mt-4 text-body-1 font-weight-bold text-none"
        flat
        :disabled="otp.length !== CODE_LENGTH"
        :loading="loadingCode && !resending"
      >
        Verify
      </v-btn>
    </v-form>

    <div class="w-100 d-flex flex-column align-center ga-1 mt-4">
      <span class="text-caption font-weight-medium text-grey600">
        {{ counter > 0 ? `Didn't get it? You can ask for a new code in ${counter}s.` : "Didn't get it? Check your spam folder, or" }}
      </span>
      <v-btn
        variant="text"
        color="primaryStrong"
        class="text-caption font-weight-bold text-none"
        :disabled="counter > 0 || loadingCode"
        :loading="resending"
        @click="resendCode"
      >
        Send a new code
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuthCodeMode } from '@/types'

const CODE_LENGTH = 6
// The backend accepts a new code once a minute.
const RESEND_SECONDS = 60

const props = withDefaults(defineProps<{ email: string, mode?: AuthCodeMode, notice?: string }>(), { mode: 'register', notice: '' })
const emit = defineEmits<{
  changeEmail: [email: string]
  codeConfirmed: [code: string]
  loginSuccessfull: []
}>()

const { $toast } = useNuxtApp()
const { verifyRegisterCode, sendRegisterCode, verifyResetCode, sendResetCode, sendLoginCode, loginWithCode, loadingCode, completeSignIn } = useAuth()

const otp = ref('')
const errorMessage = ref('')
const resending = ref(false)
const counter = ref(RESEND_SECONDS)
let counterInterval: ReturnType<typeof setInterval> | null = null

const clearCounter = () => {
  if (counterInterval) {
    clearInterval(counterInterval)
    counterInterval = null
  }
}

const startCounter = () => {
  clearCounter()
  counter.value = RESEND_SECONDS
  counterInterval = setInterval(() => {
    counter.value = Math.max(counter.value - 1, 0)
    if (counter.value === 0) clearCounter()
  }, 1000)
}

const confirmCode = async () => {
  if (otp.value.length !== CODE_LENGTH || loadingCode.value) return
  errorMessage.value = ''

  const code = otp.value

  // Signing in with the code: it is the last step, the person is signed in.
  if (props.mode === 'login') {
    const answer = await loginWithCode(props.email, code)
    if (answer.succeeded && answer.data?.token) {
      if (await completeSignIn(answer.data.token)) emit('loginSuccessfull')
      else errorMessage.value = 'You are signed in, but we could not load your profile. Refresh the page to continue.'
      return
    }

    errorMessage.value = answer.message || 'The code is not correct. Check the email and try again.'
    otp.value = ''
    return
  }

  const response = props.mode === 'register'
    ? await verifyRegisterCode(props.email, code)
    : await verifyResetCode(props.email, code)
  if (response.succeeded) {
    emit('codeConfirmed', code)
    return
  }

  errorMessage.value = response.message || 'The code is not correct. Check the email and try again.'
  otp.value = ''
}

const resendCode = async () => {
  if (counter.value > 0 || loadingCode.value) return
  resending.value = true
  errorMessage.value = ''
  try {
    const send = { login: sendLoginCode, register: sendRegisterCode, forgetPassword: sendResetCode }[props.mode]
    const response = await send(props.email)
    if (response.succeeded) {
      otp.value = ''
      $toast.success('We sent you a new code.')
      startCounter()
      return
    }

    errorMessage.value = response.message || 'We could not send a new code. Please try again.'
  }
  finally {
    resending.value = false
  }
}

onMounted(startCounter)
onUnmounted(clearCounter)
</script>
