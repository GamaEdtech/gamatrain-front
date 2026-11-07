<template>
  <div class="w-100 d-flex flex-column pa-2">
    <div class="w-100 d-flex flex-column ga-1 bg-grey100 rounded-lg pa-3">
      <span class="text-h5 text-grey700 font-weight-bold">
        #{{ usageEvent.id }} · {{ usageEvent.amount }} {{ usageEvent.featureName || usageEvent.featureCode }}
      </span>
      <span class="text-h6 text-grey600">
        {{ usageEvent.userEmail || `user ${usageEvent.userId}` }} · {{ usageEvent.planTitle }}
      </span>
      <span class="text-h6 text-grey600">
        The quota goes back to this subscription. A charge can be refunded once, and never more than the
        subscription has used in its current period.
      </span>
    </div>

    <span class="text-h5 text-grey600 mt-4 mb-1">Authenticator code</span>
    <v-otp-input
      v-model="code"
      length="6"
      type="number"
      variant="outlined"
      class="px-0"
      :disabled="loadingRefundUsageItem"
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
      color="warning"
      :disabled="!isValid"
      :loading="loadingRefundUsageItem"
      rounded="xl"
      height="40"
      flat
      class="text-h5 mt-6"
      @click="submit"
    >
      Refund quota
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { AdminSubscriptionUsageDTO } from '@/types'

const props = defineProps<{
  usageEvent: AdminSubscriptionUsageDTO
}>()

const emit = defineEmits<{
  refunded: []
}>()

const { refundUsageItem, loadingRefundUsageItem } = useUserSubscriptionAdmin()

const code = ref('')

const isValid = computed(() => /^\d{6}$/.test(code.value))

const submit = async () => {
  if (!isValid.value || loadingRefundUsageItem.value) return

  const response = await refundUsageItem(props.usageEvent.id, code.value)
  if (response.succeeded) {
    emit('refunded')
    return
  }

  // A used or wrong code can't be retried.
  code.value = ''
}
</script>
