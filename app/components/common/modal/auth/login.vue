<template>
  <div class="w-100 d-flex flex-column bg-surface pa-2">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column ga-4 mt-2"
      @submit.prevent="loginUser"
    >
      <div class="w-100 d-flex flex-column ga-1">
        <label
          for="auth-login-email"
          class="text-caption text-grey700 font-weight-bold ml-2"
        >Email</label>
        <v-text-field
          id="auth-login-email"
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

      <div class="w-100 d-flex flex-column ga-1">
        <div class="d-flex align-center justify-space-between">
          <label
            for="auth-login-password"
            class="text-caption text-grey700 font-weight-bold ml-2"
          >Password</label>
          <v-btn
            type="button"
            variant="text"
            color="primaryStrong"
            density="compact"
            class="px-1 text-caption font-weight-bold text-none"
            @click="emit('openForgetPassword', emailUser)"
          >
            Forgot password?
          </v-btn>
        </div>
        <v-text-field
          id="auth-login-password"
          v-model="password"
          rounded="lg"
          height="48"
          placeholder="Your password"
          variant="outlined"
          autocomplete="current-password"
          hide-details="auto"
          base-color="grey300"
          color="primary"
          bg-color="surface"
          :rules="[required]"
          :append-inner-icon="showPassword ? 'md:visibility' : 'md:visibility_off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
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
        :loading="loadingLogin || loadingCode"
      >
        Sign in
      </v-btn>
    </v-form>

    <div class="w-100 d-flex align-center ga-3 my-4">
      <v-divider color="grey200" />
      <span class="text-caption font-weight-medium text-grey500">or</span>
      <v-divider color="grey200" />
    </div>

    <common-google-login-button @login-successfull="emit('loginSuccessfull')" />

    <v-btn
      variant="text"
      color="grey700"
      class="mt-3 text-caption font-weight-medium text-none"
      @click="emit('openRegister', emailUser)"
    >
      New to GamaTrain?
      <span class="ml-1 text-primaryStrong font-weight-bold">Create an account</span>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ email?: string }>(), { email: '' })
const emit = defineEmits<{
  loginSuccessfull: []
  openRegister: [email: string]
  openForgetPassword: [email: string]
  codeSent: [email: string, notice: string]
}>()

const { email: emailRule, required } = useValidationRules()
const { login, loadingLogin, sendLoginCode, loadingCode, completeSignIn } = useAuth()

const emailUser = ref(props.email)
const password = ref('')
const showPassword = ref(false)
const isFormValid = ref(false)
const errorMessage = ref('')

const loginUser = async () => {
  if (!isFormValid.value || loadingLogin.value) return
  errorMessage.value = ''

  const response = await login({ email: emailUser.value, password: password.value })
  if (!response.succeeded || !response.data?.token) {
    // A wrong password (or too many of them): email a sign-in code instead, as the old backend did. An email with no account
    // gets no code, and the password error stays.
    if (response.reference === 'wrongPassword' || response.reference === 'lockedOut') {
      const code = await sendLoginCode(emailUser.value)
      if (code.succeeded) {
        emit('codeSent', emailUser.value.trim(), response.reference === 'lockedOut'
          ? 'Too many wrong passwords. We emailed you a code to sign in instead.'
          : 'Wrong password. We emailed you a code to sign in instead.')
        return
      }
    }

    errorMessage.value = response.message || 'We could not sign you in. Check your email and password, then try again.'
    return
  }

  if (await completeSignIn(response.data.token)) {
    emit('loginSuccessfull')
    return
  }

  errorMessage.value = 'You are signed in, but we could not load your profile. Refresh the page to continue.'
}
</script>
