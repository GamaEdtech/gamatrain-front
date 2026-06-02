<template>
  <div class="w-100 h-screen d-flex flex-column align-center justify-center">
    <div
      v-if="status === 'loading'"
      class="text-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
        width="6"
      />
      <p class="mt-4 text-h4 text-grey700 font-weight-bold">
        Checking your payment...
      </p>
    </div>

    <div
      v-else-if="status === 'success'"
      class="text-center"
    >
      <v-icon
        color="success"
        size="64"
      >
        md:check_circle_outlined
      </v-icon>
      <p class="mt-4 text-h4 text-success font-weight-bold">
        Payment Successful
      </p>
      <p class="mt-2 text-h5 text-grey700 font-weight-medium">
        Your wallet has been charged successfully.
      </p>
    </div>

    <div
      v-else
      class="text-center"
    >
      <v-icon
        color="error"
        size="64"
      >
        md:error_outlined
      </v-icon>
      <p class="mt-4 text-h4 text-error font-weight-bold">
        Payment Failed
      </p>
      <p class="mt-2 text-h5 text-grey700 font-weight-medium">
        Something went wrong. Please try again.
      </p>
    </div>

    <v-btn
      class="mt-6 font-weight-bold text-h5"
      color="primary"
      rounded="pill"
      flat
      width="250"
      @click="goBack"
    >
      Return To App
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

type Status = 'loading' | 'success' | 'error'

const route = useRoute()
const router = useRouter()
const { verifyPayment, getPathRedirect, removePathRedirect } = usePayment()
const { trackVerifyPayment } = useGtmEvents()

const status = ref<Status>('loading')

const paymentId = route.params.id as string
const transactionId = route.query.transactionId as string

const verify = async () => {
  const response = await verifyPayment(paymentId, transactionId)
  if (response.succeeded && response.data) {
    status.value = 'success'
    trackVerifyPayment({
      status: 'success',
    })
  }
  else {
    status.value = 'error'
    trackVerifyPayment({
      status: 'fail',
    })
  }
}

const goBack = () => {
  const redirect = getPathRedirect()

  if (redirect) {
    removePathRedirect()
    router.push(redirect)
  }
  else {
    router.push('/user')
  }
}

onMounted(async () => {
  await verify()
})
</script>

<style scoped>
</style>
