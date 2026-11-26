<template>
  <div class="w-100 d-flex flex-column bg-surface pa-2">
    <p class="text-body-2 text-grey600 mt-2 mb-4">
      Enter your email. We'll send you a 6-digit code to confirm it's yours.
    </p>

    <v-form
      ref="formRef"
      class="w-100 d-flex flex-column ga-3"
      @submit.prevent="sendCode"
    >
      <div class="w-100 d-flex flex-column ga-1">
        <label
          for="auth-register-email"
          class="text-caption text-grey700 font-weight-bold ml-2"
        >Email</label>
        <v-text-field
          id="auth-register-email"
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

      <v-checkbox
        v-model="termsAccepted"
        color="primary"
        density="compact"
        hide-details="auto"
        :rules="[(value: boolean) => value || 'Please accept the terms to continue.']"
      >
        <template #label>
          <span class="text-caption font-weight-medium text-grey700">
            I agree to the
            <nuxt-link
              to="/terms"
              target="_blank"
              class="text-primaryStrong font-weight-bold"
              @click.stop
            >terms and conditions</nuxt-link>
          </span>
        </template>
      </v-checkbox>

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
          v-if="hasAccount"
          variant="text"
          density="compact"
          color="primaryStrong"
          class="px-1 text-body-2 font-weight-bold text-none"
          @click="emit('openLogin', emailUser)"
        >
          Sign in instead
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
        :loading="loadingCode"
      >
        Send code
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
      @click="emit('openLogin', emailUser)"
    >
      Already have an account?
      <span class="ml-1 text-primaryStrong font-weight-bold">Sign in</span>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components'

const props = withDefaults(defineProps<{ email?: string }>(), { email: '' })
const emit = defineEmits<{
  openLogin: [email: string]
  loginSuccessfull: []
  codeSent: [email: string]
}>()

const { $toast } = useNuxtApp()
const { email: emailRule, required } = useValidationRules()
const { sendRegisterCode, loadingCode } = useAuth()

const emailUser = ref(props.email)
const termsAccepted = ref(false)
// The button stays enabled: a click on an incomplete form shows what is missing (e.g. the terms box) instead of doing
// nothing, which visitors read as a broken button.
const formRef = ref<VForm | null>(null)
const errorMessage = ref('')
// The backend says so when the address already has an account: offer to sign in instead.
const hasAccount = computed(() => /already has an account/i.test(errorMessage.value))

const sendCode = async () => {
  if (loadingCode.value) return
  if (!(await formRef.value?.validate())?.valid) return
  errorMessage.value = ''

  const response = await sendRegisterCode(emailUser.value)
  if (response.succeeded) {
    $toast.success('We sent you a code. Check your email.')
    emit('codeSent', emailUser.value.trim())
    return
  }

  errorMessage.value = response.message || 'We could not send the code. Please try again.'
}
</script>
