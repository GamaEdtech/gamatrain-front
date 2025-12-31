<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-column overflow-y-auto bg-white pa-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <v-row class="d-flex align-center">
        <v-col cols="10">
          <span class="text-h4">Payment</span>
        </v-col>
        <v-col
          cols="2"
          class="d-flex align-center justify-end ga-2"
        >
          <v-icon
            size="x-large"
            color="#D0D5DD"
            @click="closeModal"
          >
            md:close
          </v-icon>
        </v-col>
      </v-row>

      <div class="w-100 d-flex flex-column align-center justify-center mt-8">
        <img
          width="100"
          height="100"
          src="/images/gama-coin.svg"
          alt="GAMA coin"
        >
        <span class="font-weight-bold text-h4 mt-4">Game On!</span>
      </div>

      <modals-confirm-payment
        v-if="amountToPay < userBalance"
        :is-processing="isProcessing"
        :user-balance="userBalance"
        @confirm="confirmPayment"
        @cancel="closeModal"
      />

      <modals-charge-wallet
        v-if="amountToPay > userBalance"
        :user-balance="userBalance"
      />
    </div>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

const { mdAndUp } = useDisplay()

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  userBalance: {
    type: Number,
    default: 0,
  },
  isProcessing: {
    type: Boolean,
    default: false,
  },
  amountToPay: {
    type: Number,
    default: 5000000,
  },
})

const emit = defineEmits(['update:showDialog', 'confirm', 'close'])

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('update:showDialog', false)
  emit('close')
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event) => {
  event.stopPropagation()
}

const confirmPayment = () => {
  if (props.userBalance >= 5000000) {
    emit('confirm')
  }
}
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .mobile-style {
    max-height: 90%;
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
