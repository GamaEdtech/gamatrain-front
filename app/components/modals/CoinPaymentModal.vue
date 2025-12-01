<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-wrap flex-column bg-white pa-6 rounded-xl mobile-style"
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

      <modals-confirm-payment
        v-if="amountToPay * 1000000 < userBalance"
        :is-processing="isProcessing"
        :user-balance="userBalance"
        @confirm="confirmPayment"
        @cancel="closeModal"
      />

      <modals-charge-wallet
        v-if="amountToPay * 1000000 > userBalance"
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
    default: 5,
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
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
