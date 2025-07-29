<script setup>
import { navigateTo } from 'nuxt/app'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUser } from '@/composables/useUser'

const route = useRoute()

const { $toast } = useNuxtApp()

const props = defineProps({
  dialog: Boolean,
})

const emit = defineEmits([
  'update:dialog',
  'switchToRegister',
  'switchToRecover',
])

const passVisible = ref(false)
const login_loading = ref(false)
const validationSchema = yup.object().shape({
  identity: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email'),
  password: yup.string().required().min(4),
})
const { handleSubmit, handleReset } = useForm({
  validationSchema,
})
const identity = useField('identity')
const password = useField('password')

const otp = ref('')
const otp_loading = ref(false)
const countDown = ref(60)
const timerId = ref(null)
const sendOtpBtnStatus = ref(true)

const google_login_loading = ref(true)
const identity_holder = ref(true)
const otp_holder = ref(false)
const googleLoginBtn = ref(null)

watch(countDown, (val) => {
  // When user wait 10 second
  if (val === 0) sendOtpBtnStatus.value = false

  // When user request new otp code
  if (val === 60) countDownTimer()
})

async function handleCredentialResponse(value) {
  const auth = useAuth()
  const { setUser } = useUser()
  try {
    const response = await useApiService.post(
      '/api/v1/users/googleAuth',
      new URLSearchParams({
        id_token: value.credential,
      }),
    )

    if (response.status === 1) {
      $toast.success('Logged in successfully')

      auth.setUserToken(response.data.jwtToken)
      setUser(response.data.info)
      submitLoginV2(response.data.jwtToken)
      closeDialog()

      if (route.path === '/') navigateTo('/user')
    }
  }
  catch (err) {
    const status = err?.response?.status

    if (status === 401) {
      $toast.error(useNuxtApp().$t('LOGIN_WRONG_DATA'))
    }
    else if (status === 500 || status === 504) {
      $toast.error(useNuxtApp().$t('REQUEST_FAILED'))
    }
  }
}

watch(
  () => props.dialog,
  (isOpen) => {
    if (isOpen) {
      google_login_loading.value = true
      setTimeout(() => {
        if (window.google?.accounts?.id && googleLoginBtn.value) {
          window.google.accounts.id.initialize({
            client_id:
              '231452968451-rd7maq3v4c8ce6d1e36uk3qacep20lp8.apps.googleusercontent.com',
            callback: handleCredentialResponse,
            auto_select: true,
          })

          window.google.accounts.id.renderButton(googleLoginBtn.value, {
            text: 'Login',
            size: 'large',
            width: '252',
            theme: 'outline',
          })

          google_login_loading.value = false
        }
      }, 4000)
    }
  },
)

onMounted(() => {
  setTimeout(() => {
    if (window.google?.accounts?.id && googleLoginBtn.value) {
      window.google.accounts.id.initialize({
        client_id:
          '231452968451-rd7maq3v4c8ce6d1e36uk3qacep20lp8.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: true,
      })

      window.google.accounts.id.renderButton(googleLoginBtn.value, {
        text: 'Login',
        size: 'large',
        width: '252',
        theme: 'outline',
      })

      google_login_loading.value = false
    }
  }, 4000)
})

// Resend OTP code
const sendOtpCodeAgain = async () => {
  try {
    const _response = await useApiService.post(
      '/api/v1/users/',
      new URLSearchParams({
        type: 'resend_code',
        identity: identity.value,
      }),
    )
    countDownTimer()
    sendOtpBtnStatus.value = true
    $toast.success('Otp code sent again')
  }
  catch (error) {
    const errorData = error?.response?._data

    if (error?.response?.status === 400) $toast.error(errorData.message)
    else $toast.error('Something went wrong.')
  }
}

const submit = handleSubmit(async () => {
  const auth = useAuth()
  const { setUser } = useUser()

  login_loading.value = true
  try {
    const response = await auth.login({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      identity: identity.value.value,
      pass: password.value.value,
    })

    const data = await response
    if (data.data.type == 'loginByOTP') {
      $toast.success('Otp code sent')
      identity_holder.value = false
      otp_holder.value = true
      countDownTimer()
    }
    else if (data.data.type == 'register') {
      goToRegister()
    }
    else {
      auth.setUserToken(response.data.jwtToken)
      setUser(response.data.info)
      submitLoginV2(response.data.jwtToken)
      $toast.success('Logged in successfully')

      closeDialog()
      if (route.path === '/') navigateTo('/user')
    }
  }
  catch (error) {
    const errorData = error?.response?._data

    if (error?.response?.status === 400) $toast.error(errorData.message)
    else $toast.error('Something went wrong.')
  }
  finally {
    login_loading.value = false
  }
})

const onFinish = async () => {
  const auth = useAuth()
  const { setUser } = useUser()
  try {
    const response = await useApiService.post(
      '/api/v1/users/login',
      new URLSearchParams({
        type: 'confirm',
        identity: identity.value.value,
        pass: password.value.value,
        code: otp.value,
      }),
    )
    if (response.status === 1) {
      auth.setUserToken(response.data.jwtToken)
      setUser(response.data.info)
      await submitLoginV2(response.data.jwtToken)
      $toast.success('Logged in successfully')
      closeDialog()
      if (route.path === '/') navigateTo('/user')
    }
  }
  catch (error) {
    const errorData = error?.response?._data
    if (error?.response?.status === 400) $toast.error(errorData.message)
    else $toast.error('Something went wrong.')
  }
}

const countDownTimer = () => {
  if (timerId.value) {
    clearTimeout(timerId)
    timerId.value = null
  }
  countDown.value = 60
  tick()
}

const tick = () => {
  if (countDown.value > 0) {
    timerId.value = setTimeout(() => {
      countDown.value -= 1
      tick()
    }, 1000)
  }
  else {
    timerId.value = null
  }
}

function goToRegister() {
  emit('switchToRegister')
}

function goToRecover() {
  emit('switchToRecover')
}

function closeDialog() {
  identity_holder.value = true
  otp_holder.value = false
  login_loading.value = false
  handleReset()
  emit('update:dialog', false)
}

const recheckEnteredIdentity = () => {
  otp_holder.value = false
  identity_holder.value = true
}

async function submitLoginV2(old_token) {
  const { user } = useUser()
  const pass = password.value.value ? password.value.value : generatePassword()
  const identityVal = identity.value.value
    ? identity.value.value
    : user.value.email || ''

  const result = await useApiService.post('/api/v2/identities/tokens/old', {
    token: old_token,
  })
  if (result.succeeded) {
    localStorage.setItem('v2_token', result.data.token)
  }
  else if (
    result.errors.length
    && (result.errors[0].message === 'UserNotFound'
      || result.errors[0].message === 'Invalid Token')
  ) {
    await registerV2(identityVal, pass)
  }
}

function generatePassword() {
  // Generate a random password (example)
  return Math.random().toString(36).slice(-8)
}

async function registerV2(identity, pass) {
  const result = await useApiService.post('/api/v2/identities/register', {
    email: identity,
    password: pass,
    confirmPassword: pass,
  })
  if (result.succeeded) {
    await submitLoginV2(useAuth().getUserToken())
  }
}
</script>

<template>
  <v-dialog
    :model-value="props.dialog"
    max-width="300px"
    @update:model-value="(val) => emit('update:dialog', val)"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Login</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            class="text-center"
          >
            <v-divider class="my-2" />
            <div v-show="google_login_loading">
              <v-progress-circular
                color="teal"
                class="mr-2"
                size="20"
                width="2"
                indeterminate
              />
              <span style="font-size: 1.2rem"> Loading google sign in</span>
            </div>
            <div
              v-show="!google_login_loading"
              ref="googleLoginBtn"
            />
          </v-col>
          <v-col cols="12">
            <div v-show="identity_holder">
              <form @submit.prevent="submit">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="identity.value.value"
                      dense
                      label="Email"
                      outlined
                      required
                      autocomplete="off"
                      :error-messages="identity.errorMessage.value"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password.value.value"
                      label="Password"
                      outlined
                      dense
                      :type="passVisible ? 'text' : 'password'"
                      :append-icon="passVisible ? 'mdi-eye' : 'mdi-eye-off'"
                      required
                      :error-messages="password.errorMessage.value"
                      @click:append="passVisible = !passVisible"
                    />
                    <p
                      class="pointer"
                      @click="goToRecover"
                    >
                      Forget password
                    </p>
                  </v-col>
                  <v-col cols="12">
                    <v-divider class="mb-3" />
                    <p
                      class="text-h6 text-center pointer"
                      @click="goToRegister"
                    >
                      Not registered? Register now
                    </p>
                    <v-divider class="mt-3" />
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      outlined
                      block
                      @click="closeDialog"
                    >
                      Cancel
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="primary"
                      type="submit"
                      :loading="login_loading"
                      block
                    >
                      Login
                    </v-btn>
                  </v-col>
                </v-row>
              </form>
            </div>

            <div v-show="otp_holder">
              <!-- Otp holder -->
              <v-col cols="12">
                <p class="text-h6">
                  Please enter the code received on your email address:
                </p>
                <v-otp-input
                  v-model="otp"
                  :disabled="otp_loading"
                  length="5"
                  @finish="onFinish"
                />
              </v-col>
              <v-col cols="12">
                <v-divider class="mb-3" />
                <p
                  class="text-h6 text-center pointer"
                  @click="recheckEnteredIdentity"
                >
                  Your email is incorrect? Recheck it.
                </p>
                <v-divider class="my-3 text-center" />
                <v-btn
                  plain
                  class="text-none pointer"
                  :disabled="sendOtpBtnStatus"
                  @click="sendOtpCodeAgain"
                >
                  Send code again
                  <span
                    v-show="countDown"
                    class="ml-3"
                  >{{ countDown }}</span>
                </v-btn>
              </v-col>
              <!-- End otp holder -->
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.btn-google {
  color: #545454;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 1px #ddd;
}

.btn-google img {
  width: 30px;
  margin-right: 8px;
  max-width: 30px;
}
</style>
