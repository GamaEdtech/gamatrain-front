<template>
  <v-container
    fluid
    class="d-flex flex-column align-center justify-center main-random-trader"
  >
    <div class="shadow-div" />
    <div
      class="d-flex flex-column align-center justify-center mb-6 z-index-class mt-16"
    >
      <h1 class="text-h1 text-white font-weight-bold d-flex align-center ga-2">
        <v-img
          src="/favicon-32x32-dark.png"
          width="32"
          height="32"
        />
        GamaTrain.com
      </h1>
      <h1 class="text-h4 text-white font-weight-bold mt-4">
        Buy 50K of $GET and
      </h1>

      <h1 class="text-h2 text-white font-weight-bold mt-4">
        Win 10$ of $GET Every Day
      </h1>
    </div>

    <div class="d-flex justify-center w-100 flex-wrap ga-1 z-index-class">
      <template v-if="!loadingWinner">
        <div
          v-for="(slot, idx) in slots"
          :key="idx"
          class="container-digit d-flex align-center justify-center"
        >
          <span class="char-item text-h4 font-weight-bold">
            {{ slot.currentChar }}
          </span>
        </div>
      </template>
      <template v-else>
        <div
          v-for="slot in 44"
          :key="slot"
          class="container-digit d-flex align-center justify-center"
        >
          <span class="char-item text-h4 font-weight-bold"> * </span>
        </div>
      </template>
    </div>

    <v-btn
      color="primary"
      rounded="pill"
      flat
      variant="outlined"
      class="text-white text-h5 font-weight-bold my-6 z-index-class"
      :loading="loadingTraders"
      @click="getTraders"
    >
      {{ showTransactions ? "Hide Traders" : "Show Today Traders" }}
    </v-btn>

    <div
      v-if="dataTable.length > 0 && showTransactions"
      class="w-100 mt-4 d-flex justify-center z-index-class"
    >
      <v-data-table
        :headers="headers"
        :items="dataTable"
        class="elevation-1 set-height-table bg-primary-gray-700"
        :items-per-page="-1"
        fixed-header
        hide-default-footer
      >
        <template #headers="{ columns }">
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="`bg-primary-gray-700 text-white text-h5 font-weight-bold pa-2 th-min-width text-left ${
                index == columns.length - 1 ? `description-width` : ``
              }`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.date`]="{ item }">
          <div
            class="text-white text-h5 d-flex justify-start align-center font-weight-bold"
          >
            {{ formatLocal(item.date, "DD/MM/YYYY") }}
          </div>
        </template>
        <template #[`item.wallet`]="{ item }">
          <div
            class="text-white text-h5 d-flex justify-start align-center font-weight-bold"
          >
            {{ item.wallet }}
          </div>
        </template>

        <template #[`item.signature`]="{ item }">
          <div
            class="text-white text-h5 d-flex justify-start align-center font-weight-bold"
          >
            {{ item.signature }}
          </div>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script setup>
const { $toast } = useNuxtApp()
const { formatLocal } = useDateTime()
const winnerWallet = ref('')
const randomCharacters
  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const slots = ref()
const headers = [
  { title: 'Date', key: 'date', sortable: false, width: '5vw' },
  { title: 'Wallet', key: 'wallet', sortable: false, width: '45vw' },
  { title: 'Signature', key: 'signature', sortable: false, width: '50vw' },
]
const dataTable = ref([])
const loadingTraders = ref(false)
const loadingWinner = ref(true)
let intervalId = null
const showTransactions = ref(false)

const startRolling = () => {
  stopRolling()

  intervalId = setInterval(() => {
    slots.value.forEach((slot) => {
      slot.currentChar
        = randomCharacters[Math.floor(Math.random() * randomCharacters.length)]
    })
  }, 100)

  setTimeout(() => {
    stopRolling()
  }, 5000)
}

const stopRolling = () => {
  if (intervalId) {
    clearInterval(intervalId)
    slots.value.forEach((slot, index) => {
      slot.currentChar = winnerWallet.value[index]
    })
    intervalId = null
  }
}

const getTraders = async () => {
  if (showTransactions.value) {
    showTransactions.value = false
  }
  else {
    try {
      loadingTraders.value = true
      const response = await useApiService.get('/api/get-traders')
      if (response.randomWallet) {
        dataTable.value = response.transactions
      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
      loadingTraders.value = false
      showTransactions.value = true
    }
  }
}

onMounted(async () => {
  setTimeout(() => {
    loadingWinner.value = false
    startRolling()
  }, 2000)
})

onBeforeUnmount(stopRolling)

const { data: winnerData, error } = await useAsyncData(
  'dailyWinner',
  async () => {
    const res = await $fetch('/api/daily-winner?action=get')
    return res
  },
)

if (winnerData.value?.success && winnerData.value?.data) {
  winnerWallet.value = winnerData.value.data.wallet
  slots.value = winnerWallet.value.split('').map(ch => ({
    targetChar: ch,
    currentChar: '*',
  }))
}
else if (error.value) {
  console.error(error.value)
}
else {
  $toast.error(winnerData.value?.message || 'Failed to load daily winner')
}

defineOgImageComponent('RandomTrader', {
  walletAddress: winnerWallet.value,
})
</script>

<style scoped>
.main-random-trader {
  min-height: 100vh;
  background: #000;

  position: relative;
  overflow: hidden;
}

.shadow-div {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle,
    rgba(255, 179, 0, 1) 0%,
    rgba(0, 0, 0, 1) 34%
  );
  transform: translate(-50%, -50%) scale(1);
  transform-origin: center;
  animation: pulseCircle 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes pulseCircle {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.4;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
}

.z-index-class {
  z-index: 2;
}

.container-digit {
  min-width: 30px;
  min-height: 30px;
  border-radius: 8px;
  background-color: black;
  overflow: hidden;
  position: relative;
  border: 1px solid #ffb300;
}

.char-item {
  color: #ffb300;
}
.set-height-table {
  max-height: 50vh;
  max-width: 1400px;
  border: 1px solid #344054;
  border-radius: 8px;
}
.th-min-width {
  min-width: 130px;
}
.description-width {
  min-width: 200px;
}
</style>
