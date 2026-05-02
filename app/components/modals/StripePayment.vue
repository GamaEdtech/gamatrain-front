<template>
  <div class="w-100 d-flex align-center justify-center mt-6 recharge-input">
    <v-btn
      color="#344054"
      max-width="40"
      min-width="40"
      height="40"
      rounded="lg"
      flat
      :disabled="loadingPayment"
      @click="decreaseAmount"
    >
      <div class="circle-div d-flex align-center justify-center bg-white">
        <v-icon
          color="#344054"
          size="22"
        >
          md:remove
        </v-icon>
      </div>
    </v-btn>

    <v-text-field
      v-model="formattedAmount"
      class="w-100 mx-4 text-center"
      variant="outlined"
      hide-details
      density="comfortable"
      rounded="lg"
      color="#ffb300"
      :disabled="loadingPayment"
      @input="onAmountInput"
    >
      <template #prepend-inner>
        <v-icon
          size="24"
          color="#168118"
        >
          md:attach_money
        </v-icon>
      </template>
    </v-text-field>

    <v-btn
      color="#344054"
      max-width="40"
      min-width="40"
      height="40"
      rounded="lg"
      flat
      :disabled="loadingPayment"
      @click="increaseAmount"
    >
      <div class="circle-div d-flex align-center justify-center bg-white">
        <v-icon
          color="#344054"
          size="20"
        >
          md:add
        </v-icon>
      </div>
    </v-btn>
  </div>

  <div class="w-100 d-flex justify-center align-center ga-2 mt-6">
    <v-btn
      v-for="i in 3"
      :key="i"
      color="white"
      class="text-h5 font-weight-bold border-solid border-grey700 border-sm"
      rounded="pill"
      flat
      width="100"
      height="38"
      :disabled="loadingPayment"
      @click="select(i)"
    >
      <v-icon
        size="20"
        color="#168118"
      >
        md:attach_money
      </v-icon>{{ i * 5 }}
    </v-btn>
  </div>

  <v-btn
    color="success"
    flat
    rounded="lg"
    max-width="250"
    min-width="250"
    class="font-weight-bold text-white text-h5 mt-4 mx-auto"
    :loading="loadingPayment"
    @click="pay"
  >
    Pay With Stripe
  </v-btn>
</template>

<script setup lang="ts">
import type { PaymentCurrency, PaymentGateway } from '~/types/api'
import { usePayment } from '../../composables/api/usePayment'

const route = useRoute()
const { startPayment, loadingPayment, savePathRedirect } = usePayment()

const step = ref(5)
const decimals = ref(1)
const currency: PaymentCurrency = 'USDC'
const gateway: PaymentGateway = 'Stripe'
const amount = ref<number>(5)
const formattedAmount = ref<string>('5')

const formatNumber = (value: string | number): string => {
  if (value === null || value === undefined || value === '') return ''

  const num = typeof value === 'number' ? value.toString() : value
  if (isNaN(Number(num))) return num

  const [intPart, decPart] = num.split('.')

  const formattedInt = intPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return decPart ? `${formattedInt}.${decPart}` : formattedInt ?? ''
}

const onAmountInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const val = target.value

  let cleanVal = val.replace(/,/g, '')

  if (cleanVal === '.') {
    formattedAmount.value = '0.'
    amount.value = 0
    target.value = formattedAmount.value
    return
  }

  if (/^\d+\.$/.test(cleanVal)) {
    formattedAmount.value = cleanVal
    amount.value = parseFloat(cleanVal) || 0
    target.value = formattedAmount.value
    return
  }

  if (cleanVal.includes('.')) {
    const [intPart, decPart = ''] = cleanVal.split('.')

    if (decPart.length > decimals.value) {
      cleanVal = intPart + '.' + decPart.slice(0, decimals.value)
    }
  }

  if (!/^\d*\.?\d*$/.test(cleanVal)) return

  const numeric = parseFloat(cleanVal)
  amount.value = isNaN(numeric) ? 0 : numeric

  formattedAmount.value = formatNumber(cleanVal)
  target.value = formattedAmount.value
}

const increaseAmount = () => {
  amount.value = parseFloat(
    (amount.value + step.value).toFixed(decimals.value),
  )
  formattedAmount.value = formatNumber(amount.value)
}

const decreaseAmount = () => {
  amount.value = Math.max(
    0,
    parseFloat(
      (amount.value - step.value).toFixed(decimals.value),
    ),
  )
  formattedAmount.value = formatNumber(amount.value)
}

const select = (multiplier: number) => {
  amount.value = parseFloat(
    (multiplier * step.value).toFixed(decimals.value),
  )
  formattedAmount.value = formatNumber(amount.value)
}

const pay = async () => {
  const payload = {
    amount: amount.value,
    currency,
    gateway,
    title: 'Gamatrain Usage Invoice',
    description: 'One-time charge for use of the Gamatrain e-learning platform. Payment grants access to platform features and learning materials.',
  }
  const response = await startPayment(payload)
  if (response.succeeded && response.data && response.data.url) {
    savePathRedirect(route.fullPath)
    window.location.href = response.data.url
  }
}
</script>

<style scoped>
</style>
