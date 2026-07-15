<template>
  <div
    class="w-100 d-flex flex-wrap flex-column bg-white pa-2"
  >
    <common-google-login-button @login-successfull="emit('loginSuccessfull')" />

    <v-form v-model="isFormValid">
      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
        <div class="text-h6 text-grey700 font-weight-bold ml-2">
          Email
        </div>
        <v-text-field
          v-model="emailUser"
          rounded="lg"
          height="48"
          placeholder="Email"
          variant="outlined"
          autocomplete="off"
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
          autocomplete="off"
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
    </v-form>

    <span
      class="w-100 font-weight-medium text-h5 text-grey700 mt-4 text-start cursor-pointer"
      @click="emit('openForgetPassword')"
    >Forget password?</span>

    <v-divider
      :thickness="2"
      class="border-opacity-100 mt-8"
      color="grey200"
    />
    <span
      class="w-100 font-weight-medium text-h5 text-grey700 mt-4 text-center cursor-pointer"
      @click="emit('openRegister')"
    >Not registered? <span class="text-primary font-weight-bold">Register now
    </span>
    </span>
    <v-divider
      :thickness="2"
      class="border-opacity-100 mt-4"
      color="grey200"
    />

    <div class="w-100 d-flex justify-center align-center ga-2 mt-4">
      <v-btn
        color="grey200"
        variant="outlined"
        rounded="pill"
        height="38"
        width="120"
        class="text-h5 font-weight-medium"
        flat
        @click="emit('close')"
      >
        <span class="text-grey800">
          Cancel
        </span>
      </v-btn>
      <v-btn
        color="primary"
        rounded="pill"
        height="38"
        width="180"
        class="text-h5 text-grey800 font-weight-medium"
        flat
        :disabled="!isFormValid"
        :loading="loadingLogin"
        @click="loginUser"
      >
        Login
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['loginSuccessfull', 'openRegister', 'openForgetPassword', 'openOtpCode', 'close'])

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
      emit('openRegister')
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
