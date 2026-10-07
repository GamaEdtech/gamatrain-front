<template>
  <div class="w-100 d-flex flex-column pa-2">
    <div class="w-100 d-flex flex-column ga-1 bg-grey100 rounded-lg pa-3">
      <span class="text-h5 text-grey700 font-weight-bold">
        #{{ payout.id }} · ${{ formatUsd(payout.amountUsd) }} to {{ ownerName }}
      </span>
      <span class="text-h6 text-grey500">Send to</span>
      <span class="text-h5 text-grey700 destination">{{ payout.destination }}</span>
    </div>

    <span class="text-h5 text-grey600 mt-4">{{ description }}</span>

    <v-textarea
      v-if="decision === 'reject'"
      id="payout-reject-reason"
      v-model="reason"
      label="Reason (shown to the owner)"
      variant="outlined"
      density="comfortable"
      rounded="lg"
      rows="2"
      auto-grow
      counter="1000"
      class="mt-4"
    />

    <v-text-field
      v-if="decision === 'paid'"
      id="payout-transfer-reference"
      v-model="transferReference"
      label="Transfer reference (bank / PayPal transaction id)"
      variant="outlined"
      density="comfortable"
      rounded="lg"
      counter="200"
      class="mt-4"
    />

    <span class="text-h5 text-grey600 mt-4 mb-1">Authenticator code</span>
    <v-otp-input
      v-model="code"
      length="6"
      type="number"
      variant="outlined"
      class="px-0"
      :disabled="loading"
      @finish="submit"
    />
    <span class="text-h6 text-grey400">
      The 6-digit code from your authenticator app.
      <nuxt-link
        to="/admin/two-factor"
        class="text-primary"
      >Not set up yet?</nuxt-link>
    </span>

    <v-btn
      :color="decision === 'reject' ? 'error' : 'success'"
      :disabled="!isValid"
      :loading="loading"
      rounded="xl"
      height="40"
      flat
      class="text-h5 mt-6"
      @click="submit"
    >
      {{ buttonLabel }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { CommissionPayoutDTO, CommissionPayoutDecision } from '@/types'

const props = defineProps<{
  payout: CommissionPayoutDTO
  decision: CommissionPayoutDecision
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [body: { twoFactorCode: string, reason?: string, transferReference?: string }]
}>()

const code = ref('')
const reason = ref('')
const transferReference = ref('')

const formatUsd = (value: number) => Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const ownerName = computed(() => `${props.payout.userFirstName ?? ''} ${props.payout.userLastName ?? ''}`.trim() || `user ${props.payout.userId}`)

const description = computed(() => {
  switch (props.decision) {
    case 'approve':
      return 'Approve this request. You confirm the transfer separately once the money has been sent.'
    case 'reject':
      return 'Reject this request. The amount goes back to the owner\'s available balance.'
    default:
      return 'Confirm you have sent the money. The owner gets an email with the transfer reference.'
  }
})

const buttonLabel = computed(() => {
  switch (props.decision) {
    case 'approve':
      return 'Approve'
    case 'reject':
      return 'Reject'
    default:
      return 'Mark as paid'
  }
})

const isValid = computed(() => {
  if (!/^\d{6}$/.test(code.value)) return false
  if (props.decision === 'reject') return reason.value.trim() !== '' && reason.value.length <= 1000
  if (props.decision === 'paid') return transferReference.value.trim() !== '' && transferReference.value.length <= 200
  return true
})

const submit = () => {
  if (!isValid.value || props.loading) return
  emit('submit', {
    twoFactorCode: code.value,
    reason: props.decision === 'reject' ? reason.value.trim() : undefined,
    transferReference: props.decision === 'paid' ? transferReference.value.trim() : undefined,
  })
}

/** A used or wrong code can't be retried; the parent clears it after a failed attempt. */
const clearCode = () => {
  code.value = ''
}

defineExpose({ clearCode })
</script>

<style scoped>
.destination {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
