<script setup>
import { useAuth } from '~/composables/useAuth'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// Yup validation for password + confirm password
const validationSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(4, 'Password must be at least 4 characters'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
})

// Set up form and fields
const { handleSubmit, errors } = useForm({
  validationSchema,
})

const { $toast } = useNuxtApp()

const props = defineProps({
  dialog: Boolean,
})

const _pass_recover_dialog = ref(false)
const google_register_loading = ref(true)
const show1 = ref(false)
const confirmPassword = useField('confirmPassword')
const password = useField('password')
const passRecoverLoading = ref(false)

const otp = ref('')
const identity = ref('')
const otp_loading = ref(false)
const countDown = ref(60)
const timerId = ref(null)
const sendOtpBtnStatus = ref(true)

const identityHolder = ref(true)
const otpHolder = ref(false)
const selectPassHolder = ref(false)
const googleRegisterBtn = ref(null)

watch(countDown, (val) => {
  // When user wait 10 second
  if (val === 0) sendOtpBtnStatus.value = false

  // When user request new otp code
  if (val === 60) countDownTimer()
})

onMounted(() => {
  setTimeout(() => {
    if (window.google?.accounts?.id && googleRegisterBtn.value) {
      window.google.accounts.id.initialize({
        client_id:
          '231452968451-rd7maq3v4c8ce6d1e36uk3qacep20lp8.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: true,
      })

      window.google.accounts.id.renderButton(googleRegisterBtn.value, {
        text: 'Login',
        size: 'large',
        width: '252',
        theme: 'outline',
      })

      google_register_loading.value = false
    }
  }, 4000)
})

async function handleCredentialResponse(value) {
  const auth = useAuth()
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
      closeDialog()
      navigateTo('/user')
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

// Handle OTP request
const requestPassRecover = async () => {
  passRecoverLoading.value = true
  const auth = useAuth()
  try {
    await auth.forgotPassword({
      identity: identity.value,
    })
    $toast.success('Otp code sent')
    identityHolder.value = false
    otpHolder.value = true
    countDownTimer()
  }
  catch (error) {
    const errorData = error?.response?._data

    if (error?.response?.status === 400) $toast.error(errorData.message)
    else $toast.error('Something went wrong.')
  }
}

// Handle OTP confirmation
const onFinish = async () => {
  try {
    const response = await useApiService.post(
      '/api/v1/users/recovery',
      new URLSearchParams({
        type: 'confirm',
        identity: identity.value,
        code: otp.value,
      }),
    )
    if (response.status === 1) {
      otpHolder.value = false
      selectPassHolder.value = true
      passRecoverLoading.value = false
    }
  }
  catch (error) {
    const errorData = error?.response?._data

    if (error?.response?.status === 400) $toast.error(errorData.message)
    else $toast.error('Something went wrong.')
  }
}

// Resend OTP code
const sendOtpCodeAgain = async () => {
  try {
    const _response = await useApiService.post(
      '/api/v1/users/recovery',
      new URLSearchParams({
        type: 'resend_code',
        identity: identity.value,
      }),
    )
    countDown.value = 60
    sendOtpBtnStatus.value = true
    $toast.success('Otp code sent again')
  }
  catch (error) {
    const errorData = error?.response?._data

    if (error?.response?.status === 400) $toast.error(errorData.message)
    else $toast.error('Something went wrong.')
  }
}

// Timer for countdown
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

// Final register (level 3: receive password from user)
const submit = handleSubmit(async () => {
  passRecoverLoading.value = true
  try {
    await useApiService.post(
      '/api/v1/users/recovery',
      new URLSearchParams({
        type: 'resetpass',
        identity: identity.value,
        pass: password.value.value,
      }),
    )

    $toast.success('Password reset successfully')
    closeDialog()
  }
  catch (error) {
    const errorData = error?.response?._data

    if (error?.response?.status === 400) $toast.error(errorData.message)
    else $toast.error('Something went wrong.')
  }
  finally {
    passRecoverLoading.value = false
  }
})

// Cancel password recovery
const _cancelPassRecover = () => {
  emit('update:dialog', false)
  identityHolder.value = true
  otpHolder.value = false
  selectPassHolder.value = false
}

const emit = defineEmits([
  'switchToLogin',
  'switchToRegister',
  'switchToRecover',
  'update:dialog',
])
// Switch to login page
const switchToLogin = () => {
  emit('switchToLogin')
}

// Switch to register page
const switchToRegister = () => {
  emit('switchToRegister')
}

function closeDialog() {
  identityHolder.value = true
  otpHolder.value = false
  selectPassHolder.value = false
  emit('update:dialog', false)
}
</script>

<template>
  <v-dialog
    :model-value="props.dialog"
    max-width="300px"
    style="z-index: 20001"
    @update:model-value="(val) => emit('update:dialog', val)"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Password recovery</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            class="text-center"
          >
            <v-divider class="my-2" />

            <div v-show="google_register_loading">
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
              v-show="!google_register_loading"
              ref="googleRegisterBtn"
            />
          </v-col>
          <v-col cols="12">
            <div v-show="identityHolder">
              <!-- <validation-observer ref="observer" v-slot="{ invalid }"> -->
              <form @submit.prevent="requestPassRecover">
                <v-row>
                  <v-col cols="12">
                    <!-- <validation-provider
                        v-slot="{ errors }"
                        name="request_identity"
                        rules="required"
                      > -->
                    <v-text-field
                      v-model="identity"
                      dense
                      label="Email"
                      :error-messages="errors"
                      outlined
                    />
                    <!-- </validation-provider> -->
                  </v-col>

                  <v-col cols="12">
                    <v-divider class="mb-3" />
                    <p class="text-h6 text-center pointer">
                      <span @click="switchToLogin">Login</span>
                      |
                      <span @click="switchToRegister">Register</span>
                    </p>

                    <v-divider class="mt-3" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="6"
                    lg="6"
                  >
                    <v-btn
                      outlined
                      @click="closeDialog"
                    >
                      Cancel
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="6"
                    lg="6"
                  >
                    <v-btn
                      color="primary"
                      type="submit"
                      :loading="passRecoverLoading"
                      :disabled="invalid"
                    >
                      Recover
                    </v-btn>
                  </v-col>
                </v-row>
              </form>
              <!-- </validation-observer> -->
            </div>
            <div v-show="otpHolder">
              <!-- Otp holder -->
              <v-col cols="12">
                <p class="text-h6">
                  Please enter code received your email address?
                </p>
                <v-otp-input
                  v-model="otp"
                  :disabled="otp_loading"
                  length="5"
                  @finish="onFinish"
                />
              </v-col>
              <v-col cols="12">
                <v-divider class="my-3 text-center" />
                <v-btn
                  plain
                  class="text-none pointer"
                  :disabled="sendOtpBtnStatus"
                  @click="sendOtpCodeAgain()"
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
            <div v-show="selectPassHolder">
              <!-- Otp holder -->
              <v-col cols="12">
                <p class="text-h6">
                  Please enter password
                </p>
                <!-- <validation-observer
                  ref="final_reg_observer"
                  v-slot="{ invalid }"
                > -->
                <form @submit.prevent="submit()">
                  <v-row>
                    <v-col cols="12">
                      <!-- <validation-provider
                          v-slot="{ errors }"
                          name="password"
                          rules="required|min:4"
                        > -->
                      <v-text-field
                        v-model="password.value.value"
                        label="Password"
                        outlined
                        :error-messages="
                          errors.password ? [errors.password] : []
                        "
                        dense
                        :type="show1 ? 'text' : 'password'"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        required
                        @click:append="show1 = !show1"
                      />
                      <!-- </validation-provider> -->
                    </v-col>
                    <!--     Confirm Password       -->
                    <v-col cols="12">
                      <!-- <validation-provider
                          name="confirmPassword"
                          v-slot="{ errors }"
                          rules="required|min:4|confirmed:password"
                        > -->
                      <v-text-field
                        v-model="confirmPassword.value.value"
                        type="password"
                        :error-messages="
                          errors.confirmPassword ? [errors.confirmPassword] : []
                        "
                        label="Confirm password"
                        dense
                        outlined
                      />
                      <!-- </validation-provider> -->
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      cols="6"
                      lg="6"
                    >
                      <v-btn
                        outlined
                        @click="closeDialog"
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                    <v-col
                      cols="6"
                      lg="6"
                    >
                      <v-btn
                        color="primary"
                        type="submit"
                        :loading="passRecoverLoading"
                        :disabled="invalid"
                      >
                        Reset
                      </v-btn>
                    </v-col>
                  </v-row>
                </form>
                <!-- </validation-observer> -->
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
