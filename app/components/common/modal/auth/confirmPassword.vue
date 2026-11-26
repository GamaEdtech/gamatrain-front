<template>
  <div class="w-100 d-flex flex-column bg-surface pa-2">
    <p class="text-body-2 text-grey600 mt-2 mb-4">
      {{ mode === 'register'
        ? `Choose a password for ${email}. You'll be signed in right away.`
        : `Choose a new password for ${email}. You'll be signed in, and signed out everywhere else.` }}
    </p>

    <v-form
      ref="formRef"
      class="w-100 d-flex flex-column ga-4"
      @submit.prevent="submitPassword"
    >
      <!-- Lets password managers save the new password under the right account. -->
      <input
        type="email"
        name="email"
        autocomplete="username"
        :value="email"
        class="d-sr-only"
        tabindex="-1"
        aria-hidden="true"
        readonly
      >

      <div class="w-100 d-flex flex-column ga-1">
        <label
          for="auth-new-password"
          class="text-caption text-grey700 font-weight-bold ml-2"
        >{{ mode === 'register' ? 'Password' : 'New password' }}</label>
        <v-text-field
          id="auth-new-password"
          v-model="password"
          rounded="lg"
          height="48"
          placeholder="At least 8 characters"
          variant="outlined"
          autocomplete="new-password"
          hide-details="auto"
          base-color="grey300"
          color="primary"
          bg-color="surface"
          :rules="[required, passwordRule]"
          :append-inner-icon="showPassword ? 'md:visibility' : 'md:visibility_off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
          @update:model-value="errorMessage = ''"
        />
      </div>

      <div class="w-100 d-flex flex-column ga-1">
        <label
          for="auth-confirm-password"
          class="text-caption text-grey700 font-weight-bold ml-2"
        >Confirm password</label>
        <v-text-field
          id="auth-confirm-password"
          v-model="confirmPassword"
          rounded="lg"
          height="48"
          placeholder="Type it again"
          variant="outlined"
          autocomplete="new-password"
          hide-details="auto"
          base-color="grey300"
          color="primary"
          bg-color="surface"
          :rules="[required, confirmPasswordRule]"
          :type="showPassword ? 'text' : 'password'"
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
        <v-btn
          v-if="codeExpired"
          variant="text"
          density="compact"
          color="primaryStrong"
          class="px-1 text-body-2 font-weight-bold text-none"
          @click="emit('restart')"
        >
          Get a new code
        </v-btn>
      </v-alert>

      <v-btn
        type="submit"
        block
        color="primary"
        rounded="pill"
        height="44"
        class="text-body-1 font-weight-bold text-none"
        flat
        :loading="loadingRegister || loadingForgetPassword"
      >
        {{ mode === 'register' ? 'Create account' : 'Save password' }}
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components'
import type { AuthCodeMode } from '@/types'

const props = defineProps<{
  email: string
  code: string
  mode: AuthCodeMode
}>()
const emit = defineEmits<{
  loginSuccessfull: []
  restart: []
}>()

const { required, password: passwordRule } = useValidationRules()
const { register, loadingRegister, resetPassword, loadingForgetPassword, completeSignIn } = useAuth()
const { trackSignUp } = useGtmEvents()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
// The button stays enabled: a click on an incomplete form shows what is missing instead of doing nothing, which
// visitors read as a broken button.
const formRef = ref<VForm | null>(null)
const errorMessage = ref('')
// The code lives 10 minutes: past that (or too many wrong tries) the person must ask for a new one.
const codeExpired = computed(() => /expired|new code/i.test(errorMessage.value))

const confirmPasswordRule = (value: string) =>
  value === password.value || 'The passwords don\'t match.'

const submitPassword = async () => {
  if (loadingRegister.value || loadingForgetPassword.value) return
  if (!(await formRef.value?.validate())?.valid) return
  errorMessage.value = ''

  const data = { email: props.email, code: props.code, password: password.value }
  const response = props.mode === 'register' ? await register(data) : await resetPassword(data)
  if (!response.succeeded || !response.data?.token) {
    errorMessage.value = response.message || 'We could not save your password. Please try again.'
    return
  }
  if (props.mode === 'register') trackSignUp({ method: 'email' })

  if (await completeSignIn(response.data.token)) {
    emit('loginSuccessfull')
    return
  }

  errorMessage.value = 'Your password is saved, but we could not load your profile. Refresh the page to continue.'
}
</script>
