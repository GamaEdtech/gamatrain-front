<template>
  <div
    class="w-100 d-flex flex-wrap flex-column bg-white pa-2"
  >
    <v-form v-model="isFormValid">
      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
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
          :rules="[required, passwordRule]"
          :append-inner-icon="showPassword ? 'md:visibility' : 'md:visibility_off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 font-weight-bold ml-2">
          Confirm password
        </div>
        <v-text-field
          v-model="confirmPassword"
          rounded="lg"
          height="48"
          placeholder="Confirm password"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required, confirmPasswordRule]"
          :append-inner-icon="showConfirmPassword ? 'md:visibility' : 'md:visibility_off'"
          :type="showConfirmPassword ? 'text' : 'password'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
        />
      </div>
    </v-form>

    <v-divider
      :thickness="2"
      class="border-opacity-100 mt-8"
      color="grey200"
    />
    <span
      class="w-100 font-weight-medium text-h5 text-grey700 mt-4 text-center cursor-pointer"
      @click="emit('openLogin')"
    >Back to <span class="text-primary font-weight-bold">login
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
        :loading="loadingRegister || loadingForgetPassword"
        @click="submitPassword"
      >
        Continue
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConfirmPasswordMode } from '@/types'

interface IConfirmPasswordModal {
  identity: string
  mode: ConfirmPasswordMode
}

const props = defineProps<IConfirmPasswordModal>()
const emit = defineEmits(['openLogin', 'close'])

const { $toast } = useNuxtApp()
const { required, password: passwordRule } = useValidationRules()
const {
  register,
  loadingRegister,
  forgetPassword,
  loadingForgetPassword,
} = useAuth()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isFormValid = ref(false)

const confirmPasswordRule = (value: string) =>
  value === password.value || 'Passwords do not match.'

const submitPassword = async () => {
  const payload = {
    identity: props.identity,
    password: password.value,
    type: props.mode === 'register' ? 'register' : 'resetpass',
  }

  const response = props.mode === 'register'
    ? await register(payload)
    : await forgetPassword(payload)

  if (response.succeeded) {
    $toast.success(props.mode === 'register'
      ? 'Your account has been created. You can now sign in.'
      : 'Your password has been reset. You can now sign in.')
    emit('openLogin')
    return
  }

  $toast.error('We could not update your password. Please try again.')
}
</script>

<style scoped>

</style>
