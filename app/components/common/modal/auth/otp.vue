<template>
  <div
    class="w-100 d-flex flex-wrap flex-column bg-white pa-2"
  >
    <common-google-login-button @login-successfull="emit('loginSuccessfull')" />

    <span
      class="w-100 font-weight-medium text-h5 text-grey700 mt-6 text-start"
    >Please enter the code received on your email address:</span>

    <v-otp-input
      v-model="otp"
      :disabled="loadingLogin"
      length="5"
      :loading="loadingLogin"
      @finish="onFinish"
    />

    <v-divider
      :thickness="2"
      class="border-opacity-100 mt-8"
      color="grey200"
    />
    <span
      class="w-100 font-weight-medium text-h5 text-grey700 mt-4 text-center cursor-pointer"
      @click="emit('openLogin')"
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
        :disabled="!canResendCode || loadingLogin"
        :loading="resendLoading"
        @click="resendCode"
      >
        Resend code
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IOTPModal {
  identity: string
  password: string
}

const props = defineProps<IOTPModal>()
const emit = defineEmits(['loginSuccessfull', 'openLogin'])

const { $toast } = useNuxtApp()
const { login, loadingLogin, setUserToken } = useAuth()
const { getProfile, setUser } = useUser()

const otp = ref('')
const counter = ref(60)
const resendLoading = ref(false)
let counterInterval: ReturnType<typeof setInterval> | null = null

const canResendCode = computed(() => counter.value === 0)

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

const onFinish = async () => {
  const response = await login({
    identity: props.identity,
    password: props.password,
    type: 'confirm',
    code: Number(otp.value),
  })

  if (response.succeeded && response.data?.token) {
    await completeLogin(response.data.token)
  }
  else {
    $toast.error('The verification code is incorrect or has expired. Please try again.')
  }
}

const resendCode = async () => {
  if (!canResendCode.value || resendLoading.value) {
    return
  }

  resendLoading.value = true

  try {
    const response = await login({
      identity: props.identity,
      password: props.password,
      type: 'resend_code',
    })

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
