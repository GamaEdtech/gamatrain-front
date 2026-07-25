<template>
  <div
    class="w-100 d-flex flex-wrap flex-column bg-white pa-2"
  >
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

      <v-checkbox
        v-model="termsAccepted"
        color="primary"
        density="compact"
        hide-details="auto"
        :rules="[required]"
        class="mt-1"
      >
        <template #label>
          <span class="text-h6 text-grey700">
            <span class="font-weight-bold">I agree</span>
            <span class="font-weight-bold text-primary"> terms and conditions</span>
          </span>
        </template>
      </v-checkbox>
    </v-form>

    <v-divider
      :thickness="2"
      class="border-opacity-100 mt-8"
      color="grey200"
    />
    <span
      class="w-100 font-weight-medium text-h5 text-grey700 mt-4 text-center cursor-pointer"
      @click="emit('openLogin')"
    >Already registered? <span class="text-primary font-weight-bold">login now
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
        :loading="loadingRegister"
        @click="registerUser"
      >
        Register
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['openLogin', 'openOtpCode', 'close'])

const { $toast } = useNuxtApp()
const { email, required } = useValidationRules()
const { register, loadingRegister } = useAuth()

const emailUser = ref('')
const termsAccepted = ref(false)
const isFormValid = ref(false)

const registerUser = async () => {
  const response = await register({
    identity: emailUser.value,
    type: 'request',
  })

  if (response.succeeded) {
    $toast.success('Verification code sent.')
    emit('openOtpCode', emailUser.value)
    return
  }

  $toast.error('We could not start your registration. Please try again.')
}
</script>

<style scoped>

</style>
