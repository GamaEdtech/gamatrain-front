<template>
  <div
    class="w-100 d-flex flex-wrap flex-column bg-white pa-2"
  >
    <span
      class="w-100 font-weight-medium text-h5 text-grey700 mt-4 text-start"
    >Please enter the code received on your email address:</span>

    <v-otp-input
      v-model="otp"
      :disabled="isProcessing"
      length="5"
      :loading="isProcessing"
      @finish="onFinish"
    />

    <v-divider
      :thickness="2"
      class="border-opacity-100 mt-8"
      color="grey200"
    />
    <span
      class="w-100 font-weight-medium text-h5 text-grey700 mt-4 text-center cursor-pointer"
      @click="checkEmail"
    >Your email is incorrect? <span class="text-primary font-weight-bold">Recheck it.
    </span>
    </span>
    <v-divider
      :thickness="2"
      class="border-opacity-100 mt-4"
      color="grey200"
    />

    <div class="w-100 d-flex flex-column align-center ga-2 mt-4">
      <span class="text-h6 text-grey600">
        {{ canResendCode ? 'Did not receive the code?' : `You can request a new code in ${counter}s` }}
      </span>

      <v-btn
        variant="text"
        color="primary"
        class="text-h6 font-weight-bold"
        :disabled="!canResendCode || isProcessing"
        :loading="resendLoading"
        @click="resendCode"
      >
        Resend code
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginInformationDTO, OTPMode, OTPResponse } from '@/types'

interface IOTPModal {
  identity: string
  password?: string
  mode?: OTPMode
}

const props = withDefaults(defineProps<IOTPModal>(), {
  mode: 'login',
})
const emit = defineEmits(['loginSuccessfull', 'registerCodeConfirmed', 'forgetPasswordCodeConfirmed', 'openLogin', 'openRegister', 'openForgetPassword'])

const { $toast } = useNuxtApp()
const {
  login,
  loadingLogin,
  register,
  loadingRegister,
  forgetPassword,
  loadingForgetPassword,
  setUserToken,
} = useAuth()
const { getProfile, setUser } = useUser()

const otp = ref('')
const counter = ref(60)
const resendLoading = ref(false)
const confirmLoading = ref(false)
let counterInterval: ReturnType<typeof setInterval> | null = null

const canResendCode = computed(() => counter.value === 0)
const authLoading = computed(() =>
  loadingRegister.value || loadingForgetPassword.value || loadingLogin.value,
)
const isProcessing = computed(() => authLoading.value || resendLoading.value || confirmLoading.value)

const checkEmail = () => {
  if (props.mode === 'register') {
    emit('openRegister')
    return
  }

  if (props.mode === 'forgetPassword') {
    emit('openForgetPassword')
    return
  }

  emit('openLogin')
}

const clearCounter = () => {
  if (counterInterval) {
    clearInterval(counterInterval)
    counterInterval = null
  }
}

const startCounter = () => {
  clearCounter()
  counter.value = 60

  counterInterval = setInterval(() => {
    if (counter.value <= 1) {
      counter.value = 0
      clearCounter()
      return
    }

    counter.value -= 1
  }, 1000)
}

const completeLogin = async (token: string) => {
  setUserToken(token)
  const profileData = await getProfile(token)

  if (profileData.data) {
    const profile = profileData.data.data!
    setUser(profile)
    emit('loginSuccessfull')
    return
  }

  $toast.error('Sign-in succeeded, but we could not load your profile. Please try again.')
}

const getAuthAction = () => {
  if (props.mode === 'register') {
    return register
  }

  if (props.mode === 'forgetPassword') {
    return forgetPassword
  }

  return login
}

const buildPayload = (type: 'confirm' | 'resend_code') => {
  const payload: LoginInformationDTO = {
    identity: props.identity,
    type,
    code: Number(otp.value),
  }

  if (props.mode === 'login') {
    payload.password = props.password
  }

  return payload
}

const handleConfirmSuccess = async (response: OTPResponse) => {
  if (props.mode === 'login') {
    if (response.data && 'token' in response.data && response.data.token) {
      await completeLogin(response.data.token)
      return
    }

    $toast.error('The verification code was accepted, but sign-in could not be completed. Please try again.')
    return
  }

  if (props.mode === 'register') {
    emit('registerCodeConfirmed', response.data)
    return
  }

  emit('forgetPasswordCodeConfirmed', response.data)
}

const onFinish = async () => {
  if (otp.value.length !== 5 || confirmLoading.value) {
    return
  }

  const payload = buildPayload('confirm')
  if (!payload) {
    return
  }

  confirmLoading.value = true

  try {
    const response = await getAuthAction()(payload)

    if (response.succeeded) {
      await handleConfirmSuccess(response as OTPResponse)
    }
    else {
      $toast.error('The verification code is incorrect or has expired. Please try again.')
    }
  }
  finally {
    confirmLoading.value = false
  }
}

const resendCode = async () => {
  if (!canResendCode.value || resendLoading.value) {
    return
  }

  resendLoading.value = true

  try {
    const payload = buildPayload('resend_code')
    if (!payload) {
      return
    }

    const response = await getAuthAction()(payload)

    if (response.succeeded) {
      otp.value = ''
      $toast.success('A new verification code has been sent.')
      startCounter()
    }
    else {
      $toast.error('We could not resend the verification code. Please try again.')
    }
  }
  finally {
    resendLoading.value = false
  }
}

onMounted(startCounter)
onUnmounted(clearCounter)
</script>

<style scoped>

</style>
