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

        <span class="text-h5 text-grey600 mt-6 mb-2">Get paid with</span>
        <v-btn-toggle
          v-model="method"
          mandatory
          divided
          rounded="lg"
          color="primary"
          variant="outlined"
          density="comfortable"
          class="w-100 method-toggle"
        >
          <v-btn
            value="StripeConnect"
            class="flex-grow-1"
          >
            Stripe
          </v-btn>
          <v-btn
            value="Manual"
            class="flex-grow-1"
          >
            Bank / PayPal (manual)
          </v-btn>
        </v-btn-toggle>

        <!-- Stripe: setup or status -->
        <div
          v-if="method === 'StripeConnect'"
          class="w-100 d-flex flex-column ga-2 mt-4"
        >
          <v-skeleton-loader
            v-if="loadingPayoutAccount && !payoutAccount"
            height="64"
            class="rounded-lg"
          />
          <div
            v-else-if="payoutAccount?.payoutsEnabled"
            class="d-flex align-center ga-2 text-h5 text-grey600"
          >
            <v-icon
              color="success"
              size="20"
            >
              md:verified
            </v-icon>
            Paid to your Stripe account. Stripe then sends it to your bank.
          </div>
          <template v-else>
            <span class="text-h5 text-grey600">
              {{ payoutAccount?.hasAccount
                ? 'Your Stripe setup isn\'t finished yet. Continue where you left off.'
                : 'Set up Stripe once: it asks for your ID and bank details and takes a few minutes.' }}
            </span>
            <common-gombo-box
              v-if="!payoutAccount?.hasAccount"
              v-model="country"
              label="Country of your bank account"
              :items="countryItems"
              :data-loading="loadingCountries"
              rounded="lg"
              density="compact"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
            />
            <v-btn
              color="primary"
              flat
              rounded="lg"
              :disabled="!payoutAccount?.hasAccount && !country"
              :loading="loadingOnboarding"
              @click="setUpStripe"
            >
              {{ payoutAccount?.hasAccount ? 'Continue Stripe setup' : 'Set up Stripe payouts' }}
            </v-btn>
          </template>
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
          v-else-if="method === 'Manual' || payoutAccount?.payoutsEnabled"
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

          <template v-if="method === 'Manual'">
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
          </template>

          <span class="text-h6 text-grey400 mt-2">
            {{ method === 'Manual'
              ? 'An admin reviews every request and sends the money by hand. We email you when it\'s sent.'
              : 'An admin reviews every request; once approved, Stripe sends it to your account right away. We email you when it\'s sent.' }}
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
import type { CommissionPayoutMethod } from '@/types'

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
  payoutAccount,
  loadingPayoutAccount,
  getPayoutAccount,
  loadingOnboarding,
  startStripeOnboarding,
} = useCommissionPayout()
const { countries, getCountries, loadingCountries } = useLocation()

const method = ref<CommissionPayoutMethod>('StripeConnect')
const amount = ref('')
const destination = ref('')
const country = ref<string | null>(null)

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const countryItems = computed(() => countries.value.map(item => ({ id: item.code, title: item.title })))

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

const isValid = computed(() => {
  if (amount.value === '' || amountError.value) return false
  if (method.value === 'StripeConnect') return payoutAccount.value?.payoutsEnabled === true
  return destination.value.trim() !== '' && !destinationError.value
})

const reset = () => {
  amount.value = ''
  destination.value = ''
  method.value = 'StripeConnect'
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

const setUpStripe = async () => {
  await startStripeOnboarding(payoutAccount.value?.hasAccount ? null : country.value)
}

const submit = async () => {
  if (!isValid.value) return
  const response = await requestPayout({
    amountUsd: Number(amount.value),
    method: method.value,
    destination: method.value === 'Manual' ? destination.value.trim() : undefined,
  })
  if (response.succeeded) {
    reset()
    closeModal()
    emit('requested')
  }
}

watch(() => props.showDialog, async (open) => {
  if (open) {
    reset()
    await Promise.all([getBalance(), getPayoutAccount()])
    if (canRequest.value) amount.value = String(balance.value.availableUsd)
    if (!payoutAccount.value?.hasAccount && !countries.value.length) {
      await getCountries({ pageSize: 300 })
    }
  }
})
</script>

<style scoped>
.method-toggle :deep(.v-btn) {
  text-transform: none;
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
