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
        Your payment was successful.
      </p>
    </div>

    <!-- Not "failed": the backend can still confirm a payment after this page (Stripe's webhook or the hourly
         check), so telling the customer to try again could make them pay twice. -->
    <div
      v-else
      class="text-center px-4"
      style="max-width: 560px"
    >
      <v-icon
        color="warning"
        size="64"
      >
        md:schedule
      </v-icon>
      <p class="mt-4 text-h4 text-grey700 font-weight-bold">
        We couldn't confirm your payment yet
      </p>
      <p class="mt-2 text-h5 text-grey700 font-weight-medium">
        If you were charged, your plan or points will be applied automatically within a few minutes.
        Please don't pay again.
      </p>
      <p class="mt-2 text-h6 text-grey600">
        Still nothing after an hour?
        <NuxtLink
          to="/contact-us"
          class="text-primary"
        >
          Contact support
        </NuxtLink>
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

type Status = 'loading' | 'success' | 'unconfirmed'

// A payment the backend can't confirm on the first call may be confirmed moments later (the webhook, or a slow
// gateway), so ask a few times before showing the "not confirmed yet" screen.
const VERIFY_ATTEMPTS = 3
const RETRY_DELAY_MS = 3000

const route = useRoute()
const router = useRouter()
const { verifyPayment, getPathRedirect, removePathRedirect } = usePayment()
const { trackVerifyPayment } = useGtmEvents()

const status = ref<Status>('loading')

const paymentId = route.params.id as string
const transactionId = route.query.transactionId as string

const verify = async () => {
  for (let attempt = 1; transactionId && attempt <= VERIFY_ATTEMPTS; attempt++) {
    const response = await verifyPayment(paymentId, transactionId)
    if (response.succeeded && response.data) {
      status.value = 'success'
      trackVerifyPayment({
        status: 'success',
      })
      return
    }

    if (attempt < VERIFY_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
    }
  }

  status.value = 'unconfirmed'
  trackVerifyPayment({
    status: 'fail',
  })
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
