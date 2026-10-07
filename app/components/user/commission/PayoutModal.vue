<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-column bg-white pa-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <div class="w-100 d-flex align-center justify-space-between">
        <span class="text-h4">Withdraw commission</span>
        <v-icon
          size="x-large"
          color="grey400"
          @click="closeModal"
        >
          md:close
        </v-icon>
      </div>

      <div
        v-if="loadingBalance"
        class="w-100 d-flex flex-column ga-3 mt-6"
      >
        <v-skeleton-loader
          height="56"
          class="rounded-lg"
        />
        <v-skeleton-loader
          height="96"
          class="rounded-lg"
        />
      </div>

      <template v-else>
        <div class="w-100 d-flex justify-space-between align-center bg-grey100 rounded-lg pa-3 mt-6">
          <div class="d-flex flex-column">
            <span class="text-h6 text-grey400">Available</span>
            <span class="text-h4 font-weight-bold text-grey700">${{ formatUsd(balance.availableUsd) }}</span>
          </div>
          <div class="d-flex flex-column align-end">
            <span class="text-h6 text-grey400">Minimum payout</span>
            <span class="text-h5 font-weight-bold text-grey600">${{ formatUsd(balance.payoutThresholdUsd) }}</span>
          </div>
        </div>

        <div
          v-if="balance.openPayoutId"
          class="w-100 text-h5 text-grey600 mt-6"
        >
          You already have a payout request in progress (#{{ balance.openPayoutId }}).
          You can send a new one after it's paid, or cancel it from your payout history while it's still pending.
        </div>

        <div
          v-else-if="!canRequest"
          class="w-100 text-h5 text-grey600 mt-6"
        >
          You can request a payout once your available balance reaches ${{ formatUsd(balance.payoutThresholdUsd) }}.
        </div>

        <v-form
          v-else
          class="w-100 d-flex flex-column mt-6"
          @submit.prevent="submit"
        >
          <span class="text-h5 text-grey600 mb-2">Amount</span>
          <v-text-field
            id="payout-amount"
            v-model="amount"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            color="primary"
            type="number"
            hide-spin-buttons
            prefix="$"
            :error-messages="amountError"
            :hint="`Between $${formatUsd(balance.payoutThresholdUsd)} and $${formatUsd(balance.availableUsd)}`"
            persistent-hint
          >
            <template #append-inner>
              <v-btn
                flat
                color="info"
                variant="tonal"
                rounded="pill"
                size="small"
                class="font-weight-bold"
                @click="amount = String(balance.availableUsd)"
              >
                Max
              </v-btn>
            </template>
          </v-text-field>

          <span class="text-h5 text-grey600 mt-4 mb-2">Send the money to</span>
          <v-textarea
            id="payout-destination"
            v-model="destination"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            color="primary"
            rows="3"
            auto-grow
            counter="500"
            :error-messages="destinationError"
            placeholder="Bank name and IBAN, PayPal email, or wallet address"
          />

          <span class="text-h6 text-grey400 mt-2">
            An admin reviews every request and sends the money by hand. We email you when it's sent.
          </span>

          <v-btn
            type="submit"
            :disabled="!isValid"
            :loading="loadingRequest"
            color="success"
            flat
            rounded="lg"
            class="font-weight-bold text-h5 mt-6"
          >
            Request payout
          </v-btn>
        </v-form>
      </template>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:showDialog', 'requested'])

const { mdAndUp } = useDisplay()
const {
  balance,
  loadingBalance,
  getBalance,
  loadingRequest,
  requestPayout,
} = useCommissionPayout()

const amount = ref('')
const destination = ref('')

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const formatUsd = (value: number) => Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const canRequest = computed(() => balance.value.availableUsd >= balance.value.payoutThresholdUsd)

const amountError = computed(() => {
  if (amount.value === '') return ''
  const value = Number(amount.value)
  if (Number.isNaN(value) || value <= 0) return 'Enter an amount'
  if (!/^\d+(\.\d{1,2})?$/.test(String(amount.value).trim())) return 'Use at most 2 decimals'
  if (value < balance.value.payoutThresholdUsd) return `The minimum is $${formatUsd(balance.value.payoutThresholdUsd)}`
  if (value > balance.value.availableUsd) return 'More than your available balance'
  return ''
})

const destinationError = computed(() => (destination.value.length > 500 ? 'Keep it under 500 characters' : ''))

const isValid = computed(() => amount.value !== '' && !amountError.value && destination.value.trim() !== '' && !destinationError.value)

const reset = () => {
  amount.value = ''
  destination.value = ''
}

const closeModal = () => {
  emit('update:showDialog', false)
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) closeModal()
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

const submit = async () => {
  if (!isValid.value) return
  const response = await requestPayout({ amountUsd: Number(amount.value), destination: destination.value.trim() })
  if (response.succeeded) {
    reset()
    closeModal()
    emit('requested')
  }
}

watch(() => props.showDialog, async (open) => {
  if (open) {
    reset()
    await getBalance()
    if (canRequest.value) amount.value = String(balance.value.availableUsd)
  }
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
