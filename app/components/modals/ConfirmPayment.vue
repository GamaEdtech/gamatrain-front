<template>
  <div class="w-100 d-flex flex-column align-center justify-center">
    <span class="text-h5 mt-4 text-center">
      {{ textConfrim }}
    </span>

    <div
      class="balance-info pa-4 rounded-lg d-flex align-center justify-center ga-2 mt-4"
    >
      <v-icon color="primary">
        md:wallet
      </v-icon>
      <span>Your current balance:
        <strong>{{ formatNumber(userBalance/1000000) }} $GET</strong></span>
    </div>

    <div class="w-100 d-flex ga-2 align-center justify-center">
      <v-btn
        color="success"
        flat
        rounded="lg"
        max-width="200"
        class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
        :loading="isProcessing"
        @click="confirmPayment"
      >
        Confirm
      </v-btn>
      <v-btn
        :disabled="isProcessing"
        color="error"
        flat
        variant="outlined"
        rounded="lg"
        max-width="200"
        class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
        @click="cancelPayment"
      >
        Cancel
      </v-btn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  textConfrim: {
    type: String,
    default:
      'You need to pay 5 $GET to download this file. Do you want to proceed?',
  },
  userBalance: {
    type: Number,
    default: 0,
  },
  isProcessing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const { formatNumber } = useFormatNumber()

const confirmPayment = () => {
  emit('confirm')
}

const cancelPayment = () => {
  emit('cancel')
}
</script>

<style scoped>
.balance-info {
  background-color: #ebebeb;
  border: 1px solid #e0e0e0;
}
</style>
