<template>
  <div
    class="w-100 d-flex flex-wrap flex-column bg-white pa-2"
  >
    <v-form
      v-model="isFormValid"
      class="w-100"
      @submit.prevent="loginUser"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-2 mb-4">
        <div class="text-h6 text-grey700 font-weight-bold ml-2">
          Email
        </div>
        <v-text-field
          v-model="emailUser"
          rounded="lg"
          height="48"
          placeholder="Email"
          type="email"
          variant="outlined"
          autocomplete="email"
          hide-details="auto"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[email, required]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 font-weight-bold ml-2">
          Password
        </div>
        <v-text-field
          v-model="password"
          rounded="lg"
          height="48"
          placeholder="Password"
          variant="outlined"
          autocomplete="current-password"
          hide-details="auto"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required]"
          :append-inner-icon="
            showCurrentPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showCurrentPassword ? 'text' : 'password'"
          @click:append-inner="showCurrentPassword = !showCurrentPassword"
        />
      </div>

      <div class="w-100 d-flex justify-end mt-1">
        <v-btn
          type="button"
          variant="text"
          color="primary"
          density="compact"
          class="px-0 text-h6 font-weight-bold"
          @click="emit('openForgetPassword')"
        >
          Forgot password?
        </v-btn>
      </div>

      <v-btn
        type="submit"
        block
        color="primary"
        rounded="pill"
        height="44"
        class="mt-2 text-h5 text-grey800 font-weight-bold"
        flat
        :disabled="!isFormValid"
        :loading="loadingLogin"
      >
        Sign in
      </v-btn>
    </v-form>

    <div class="w-100 d-flex align-center ga-3 my-4">
      <v-divider color="grey200" />
      <span class="text-h6 text-grey500">or</span>
      <v-divider color="grey200" />
    </div>

    <common-google-login-button @login-successfull="emit('loginSuccessfull')" />

    <v-btn
      variant="text"
      color="grey700"
      class="mt-3 text-h6 font-weight-medium text-none"
      @click="emit('openRegister')"
    >
      New to GamaTrain?
      <span class="ml-1 text-primary font-weight-bold">Create account</span>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['loginSuccessfull', 'openRegister', 'openRegisterOtp', 'openForgetPassword', 'openOtpCode', 'close'])

const { $toast } = useNuxtApp()
const { email, required } = useValidationRules()
const { login, loadingLogin, setUserToken } = useAuth()
const { getProfile, setUser } = useUser()

const emailUser = ref('')
const password = ref('')
const showCurrentPassword = ref(false)
const isFormValid = ref(false)

const loginUser = async () => {
  const response = await login({
    identity: emailUser.value,
    password: password.value,
    type: 'request',
  })
  if (response.succeeded && response.data) {
    if (response.data.type == 'loginByOTP') {
      $toast.success('Otp code sent')
      emit('openOtpCode', emailUser.value, password.value)
    }
    else if (response.data.type == 'register') {
      $toast.success('Verification code sent.')
      emit('openRegisterOtp', emailUser.value)
    }
    else if (response.data.token) {
      setUserToken(response.data.token)
      const profileData = await getProfile(response.data.token)
      if (profileData.data) {
        const profile = profileData.data.data!
        setUser(profile)
        emit('loginSuccessfull')
      }
      else {
        $toast.error('You are signed in, but we could not load your profile details. Please refresh the page or try again.')
      }
    }
  }
  else {
    $toast.error('We could not sign you in. Please check your email and password, then try again.')
  }
}
</script>

<style scoped>

</style>
