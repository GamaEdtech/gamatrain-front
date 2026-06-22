<template>
  <v-form
    v-model="isFormValid"
    class="w-100 d-flex flex-column pa-4"
  >
    <h1 class="text-h4 text-grey700 font-weight-regular">
      Cancel deletion request
    </h1>

    <h4 class="text-h6 text-grey700 font-weight-regular mt-5">
      For your security, please enter your password to cancel the account deletion request and keep your account active.
    </h4>
    <div
      class="w-100 d-flex flex-column ga-1 mt-8"
    >
      <span class="text-h6 text-grey700 font-weight-medium">Password</span>
      <v-text-field
        v-model="passwordUser"
        density="compact"
        variant="outlined"
        label=""
        outlined
        rounded="pill"
        color="primary"
        :append-inner-icon="
          showPassword ? 'md:visibility' : 'md:visibility_off'
        "
        :type="showPassword ? 'text' : 'password'"
        :rules="[password, required]"
        @click:append-inner="showPassword = !showPassword"
      />
    </div>
    <div class="w-100 d-flex align-center justify-center">
      <v-btn
        flat
        rounded="pill"
        width="250"
        height="40"
        class="text-h5 font-weight-medium text-grey800"
        color="primary"
        :disabled="!isFormValid"
        :loading="loadingCancelDeleteItem"
        @click="cancelDelete"
      >
        Cancel Deletion
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import type { User } from '@/types'

const emit = defineEmits(['close'])

const { cancelDeleteItem, loadingCancelDeleteItem } = useProfile()
const { password, required } = useValidationRules()
const { user, setUser } = useUser()

const showPassword = ref(false)
const passwordUser = ref('')
const isFormValid = ref(false)

const cancelDelete = async () => {
  const response = await cancelDeleteItem({
    password: passwordUser.value,
    username: user.value?.userName ?? '',
  })
  if (response.succeeded) {
    setUser({
      ...user.value as User,
      orphanDate: null,
    })
    emit('close')
  }
}
</script>

<style scoped></style>
