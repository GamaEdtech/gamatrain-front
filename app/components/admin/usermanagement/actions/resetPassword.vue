<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-1"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Password
        </div>
        <v-text-field
          v-model="password"
          rounded="lg"
          density="compact"
          placeholder="Password"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :append-inner-icon="
            showPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.minPassword]"
          @click:append-inner="showPassword = !showPassword"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Confirm Password
        </div>
        <v-text-field
          v-model="confirmPassword"
          rounded="lg"
          density="compact"
          placeholder="Confirm Password"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :append-inner-icon="
            showConfirmPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showConfirmPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.matchPassword]"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
        />
      </div>
    </v-form>
    <v-btn
      color="success"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-8 mx-auto"
      :disabled="!isFormValid"
      :loading="loadingEditPassword"
      flat
      @click="savePassword"
    >
      Save
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface IResetPassword {
  id: string
}

const props = defineProps<IResetPassword>()
const emit = defineEmits(['ResetPasswordSuccessFull'])

const { editPassword, loadingEditPassword } = useUserManagerAdmin()

const isFormValid = ref(false)
const password = ref('')
const showPassword = ref(false)
const confirmPassword = ref('')
const showConfirmPassword = ref(false)

const rules = {
  required: (v: string) => !!v || 'This field is required',
  minPassword: (v: string) => (v && v.length >= 6) || 'Password must be at least 6 characters',
  matchPassword: (v: string) => v === password.value || 'Passwords must match',
}

const savePassword = async () => {
  if (!isFormValid.value) return

  const response = await editPassword(password.value, confirmPassword.value, props.id)
  if (response.succeeded) {
    password.value = ''
    confirmPassword.value = ''
    emit('ResetPasswordSuccessFull')
  }
}
</script>

<style scoped>
</style>
