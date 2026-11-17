<template>
  <v-container class="w-100 d-flex flex-column">
    <h1 class="text-h6 text-grey700 font-weight-regular">
      Confirm your identity
    </h1>

    <h4 class="text-caption text-grey700 font-weight-regular mt-5">
      For your security, we'll email you a 6-digit code to confirm deleting your account.
    </h4>

    <div
      v-if="!sentTo"
      class="d-flex justify-center mt-8"
    >
      <v-btn
        flat
        rounded="pill"
        width="250"
        height="40"
        class="text-body-1 font-weight-medium"
        color="primary"
        :loading="loadingSendDeleteCode"
        @click="sendCode"
      >
        Send code
      </v-btn>
    </div>

    <template v-else>
      <span class="text-body-2 text-grey700 font-weight-medium mt-8">
        Enter the code we sent to {{ sentTo }}. It expires in 10 minutes.
      </span>

      <v-otp-input
        v-model="code"
        length="6"
        type="number"
        max-width="360"
        class="mt-2"
      />

      <div class="d-flex flex-column align-center ga-1 mt-2">
        <span class="text-caption font-weight-medium text-grey600">
          {{ counter > 0 ? `You can request a new code in ${counter}s` : 'Did not receive the code? Check your spam folder.' }}
        </span>
        <v-btn
          variant="text"
          color="primaryStrong"
          class="text-caption font-weight-bold"
          :disabled="counter > 0"
          :loading="loadingSendDeleteCode"
          @click="sendCode"
        >
          Resend code
        </v-btn>
      </div>

      <v-row>
        <v-col
          cols="12"
          class="pb-0 d-flex justify-center mt-4"
        >
          <v-btn
            flat
            rounded="pill"
            width="250"
            height="40"
            class="text-body-1 font-weight-medium"
            color="primary"
            :disabled="code.length !== 6"
            @click="showConfrimDeleteModal = true"
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <common-modal-base
      v-model:show-dialog="showConfrimDeleteModal"
      title=""
      :max-width="600"
    >
      <user-profile-delete-modal-delete
        :code="code"
        @close="showConfrimDeleteModal = false"
      />
    </common-modal-base>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
})

useSeoMeta({
  title: 'Delete Account',
})

const RESEND_SECONDS = 60

const { sendDeleteCode, loadingSendDeleteCode } = useProfile()

const sentTo = ref('')
const code = ref('')
const counter = ref(0)
const showConfrimDeleteModal = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

const startCounter = () => {
  clearInterval(timer)
  counter.value = RESEND_SECONDS
  timer = setInterval(() => {
    counter.value--
    if (counter.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const sendCode = async () => {
  const response = await sendDeleteCode()
  if (response.succeeded) {
    sentTo.value = response.data || 'your email'
    code.value = ''
    startCounter()
  }
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped></style>
