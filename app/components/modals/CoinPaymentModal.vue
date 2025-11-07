<template>
  <v-dialog
    :model-value="isOpen"
    max-width="600px"
    persistent
    @update:model-value="$emit('update:isOpen', $event)"
  >
    <v-card class="coin-payment-modal">
      <div class="d-flex flex-column align-center justify-center pt-6">
        <span style="font-size: 80px">🎮</span>

        <v-card-title
          class="font-size-18 primary-gray-700 font-bold text-center"
        >
          Game On!
        </v-card-title>
      </div>

      <div class="text-box">
        <v-card-text class="d-flex flex-column align-center justify-center">
          <span class="text-center">
            {{ textModal }}
          </span>
          <div class="balance-info d-flex align-center justify-center ga-2">
            <v-icon color="orange">
              mdi-wallet
            </v-icon>
            <span>Your current balance:
              <strong>{{ formatNumber(userBalance) }} points</strong></span>
          </div>
          <span
            v-if="userBalance < 5"
            class="text-error text-center"
          >
            Insufficient balance! You need
            {{ formatNumber(5000000 - userBalance) }} more points.
          </span>
        </v-card-text>

        <v-card-actions class="action-buttons">
          <v-btn
            variant="flat"
            color="success"
            class="w-50 rounded-pill white--text"
            :disabled="userBalance < 5000000 || isProcessing"
            :loading="isProcessing"
            @click="confirmPayment"
          >
            <v-icon left>
              mdi-check
            </v-icon>
            Confirm Payment
          </v-btn>

          <v-btn
            variant="flat"
            color="bg-white"
            class="w-50 rounded-pill black--text"
            :disabled="isProcessing"
            @click="closeModal"
          >
            <v-icon left>
              mdi-close
            </v-icon>
            Cancel
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  userBalance: {
    type: Number,
    default: 0,
  },
  isProcessing: {
    type: Boolean,
    default: false,
  },
  textModal: {
    type: String,
    default:
      'Unlock this file by finding 5 Coins hidden on the site—don’t worry, it’s all part of the game!',
  },
})

const emit = defineEmits(['update:isOpen', 'confirm', 'close'])

// Use the existing formatNumber composable
const { formatNumber } = useFormatNumber()

const confirmPayment = () => {
  if (props.userBalance >= 5000000) {
    emit('confirm')
  }
}

const closeModal = () => {
  emit('update:isOpen', false)
  emit('close')
}
</script>

<style scoped>
.coin-payment-modal {
  max-width: 600px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.icon-container {
  background-color: #fff3e0;
  border-radius: 50%;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  margin: 10px 5px;
  align-items: center;
}

.text-box {
  background-color: #f2f4f7;
  width: 100%;
  margin: 0;
  padding: 15px 50px;
}

.text-box span {
  font-size: 16px;
  color: #101828;
  font-weight: 500;
  margin: 10px 20px;
}

.balance-info {
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.font-size-18 {
  font-size: 18px;
}

.primary-gray-700 {
  color: #374151;
}
</style>
