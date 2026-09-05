<template>
  <v-form
    v-model="isFormValid"
    class="w-100 d-flex flex-column pa-4"
    @submit.prevent="save"
  >
    <div class="w-100 d-flex flex-column align-start">
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 font-weight-bold ml-2">
          Username
        </div>
        <v-text-field
          v-model="username"
          rounded="pill"
          height="48"
          placeholder="Enter..."
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="usernameRules"
          :counter="50"
        />
      </div>
    </div>
    <div class="w-100 d-flex justify-center align-center ga-2 mt-16">
      <v-btn
        color="grey200"
        variant="outlined"
        rounded="pill"
        height="38"
        width="80"
        class="text-h5 font-weight-medium"
        flat
        :disabled="loadingEditItem"
        @click="closeModal"
      >
        <span class="text-grey800">
          Discard
        </span>
      </v-btn>
      <v-btn
        color="primary"
        rounded="pill"
        height="38"
        width="220"
        class="text-h5 text-grey800 font-weight-medium"
        flat
        type="submit"
        :loading="loadingEditItem"
        :disabled="!isFormValid"
      >
        Submit
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import type { EditProfileDTO } from '@/types'

interface IModalUsername {
  username?: string
}

const props = withDefaults(defineProps<IModalUsername>(), {
  username: '',
})
const emit = defineEmits<{
  close: []
  success: [data: string]
}>()

const {
  requiredWithMessage,
  minLength,
  maxLength,
} = useValidationRules()
const { editItem, loadingEditItem } = useProfile()

const username = ref(props.username)
const usernameRules = [
  requiredWithMessage('Username is required'),
  minLength(2),
  maxLength(50),
]
const isFormValid = ref(false)

const closeModal = () => {
  emit('close')
}

const save = async () => {
  const trimmedUsername = username.value.trim()
  if (!trimmedUsername || trimmedUsername.length < 2)
    return

  const data: EditProfileDTO = {
    handle: trimmedUsername,
  }

  const response = await editItem(data)

  if (response?.succeeded) {
    emit('success', trimmedUsername)
    emit('close')
  }
}
</script>

<style scoped>
</style>
