<template>
  <v-container class="w-100 d-flex flex-column">
    <v-row>
      <v-col
        cols="12"
        class="pl-5 text-h4 teal--text"
      >
        <v-icon
          large
          color="primary"
        >
          md:key_vertical_outlined
        </v-icon>
        <span class="font-weight-bold"> Change Password </span>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="currentPassword"
          density="compact"
          variant="outlined"
          label="Current password"
          outlined
          rounded="lg"
          color="#FFB600"
          :append-inner-icon="
            showCurrentPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showCurrentPassword ? 'text' : 'password'"
          :rules="[requiredRule]"
          @click:append-inner="showCurrentPassword = !showCurrentPassword"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="newPassword"
          density="compact"
          variant="outlined"
          label="New password"
          outlined
          rounded="lg"
          color="#FFB600"
          :append-inner-icon="
            showNewPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showNewPassword ? 'text' : 'password'"
          :rules="passwordRules"
          @click:append-inner="showNewPassword = !showNewPassword"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="repeatNewPassword"
          density="compact"
          variant="outlined"
          label="Repeat new password"
          outlined
          rounded="lg"
          color="#FFB600"
          :append-inner-icon="
            showRepeatNewPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showRepeatNewPassword ? 'text' : 'password'"
          :rules="repeatPasswordRules"
          @click:append-inner="showRepeatNewPassword = !showRepeatNewPassword"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-divider class="my-3" />
      <v-col
        cols="12"
        class="pb-0 d-flex justify-center"
      >
        <v-btn
          flat
          rounded="lg"
          width="250"
          class="text-h5 font-weight-bold"
          color="success"
          :disabled="!isFormValid"
          :loading="loading"
          @click="updatePassword"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
      [key: string]: unknown
    }
  }
  message?: string
  [key: string]: unknown
}
definePageMeta({
  layout: 'dashboard-layout',
})

useSeoMeta({
  title: 'Change Password',
})

const { $toast } = useNuxtApp()
const router = useRouter()

const showCurrentPassword = ref(false)
const currentPassword = ref('')

const showNewPassword = ref(false)
const newPassword = ref('')

const showRepeatNewPassword = ref(false)
const repeatNewPassword = ref('')

const loading = ref(false)

const requiredRule = (v: string) => !!v || 'This field is required'

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Minimum 8 characters',
  (v: string) =>
    /[A-Z]/.test(v) || 'Must include at least one uppercase letter',
  (v: string) =>
    /[a-z]/.test(v) || 'Must include at least one lowercase letter',
  (v: string) => /\d/.test(v) || 'Must include at least one number',
]

const repeatPasswordRules = [
  (v: string) => !!v || 'Repeat password is required',
  (v: string) => v === newPassword.value || 'Passwords do not match',
]

const isFormValid = computed(() => {
  return (
    currentPassword.value
    && passwordRules.every(rule => rule(newPassword.value) === true)
    && repeatPasswordRules.every(rule => rule(repeatNewPassword.value) === true)
  )
})

const updatePassword = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true

    const payload = {
      oldpass: currentPassword.value,
      newpass: newPassword.value,
      repeat_newpass: repeatNewPassword.value,
    }
    await useApiService.put('/api/v1/users/password', payload)
    $toast.success('Password changed successfully')
    router.push('/user')
  }
  catch (err: unknown) {
    const error = err as ApiError
    $toast.error(error?.response?.data?.message || 'Failed to change password')
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
