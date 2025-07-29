<template>
  <v-card
    class="order-btn-holder d-block d-md-none"
    width="100%"
  >
    <v-card-text class="pb-0">
      <v-row class="px-10 text-center">
        <v-col
          v-for="(item, key) in examPrices"
          :key="key"
          cols="12"
          class="pb-1 pt-0"
        >
          <!-- For not authenticated user -->
          <v-btn
            v-show="!isLoggedIn"
            v-if="key === 'participation'"
            block
            color="success"
            @click="handleLogin"
          >
            Start Exam{{ item.price > 0 ? " | $" + item.price : "" }}
          </v-btn>

          <!-- For authenticated user -->
          <v-btn
            v-show="isLoggedIn"
            v-if="key === 'participation'"
            :to="`/exam/start/${examId}`"
            block
            color="success"
          >
            <span v-if="userExamStatus === 1"> Show result </span>
            <span v-else>
              Start Exam{{ item.price > 0 ? " | $" + item.price : "" }}
            </span>
          </v-btn>

          <!-- Word download button -->
          <v-btn
            v-else-if="key === 'word'"
            block
            color="primary"
          >
            Download WORD{{ item.price > 0 ? " | $" + item.price : "" }}
          </v-btn>

          <!-- PDF download button -->
          <v-btn
            v-else-if="key === 'pdf'"
            :loading="downloadLoading"
            block
            color="error"
            @click="handleDownload('pdf')"
          >
            Download PDF{{ item.price > 0 ? " | $" + item.price : "" }}
          </v-btn>
        </v-col>

        <v-col cols="12">
          <div
            v-if="!isFree"
            class="mb-4"
          >
            <p v-if="!isLoggedIn">
              <span class="mdi mdi-bell icon" />
              <span
                class="login blue--text pointer"
                @click="handleLogin"
              >
                Login
              </span>
              <span
                class="register blue--text pointer"
                @click="handleRegister"
              >
                (register)
              </span>
              <span>to download and charge wallet.</span>
            </p>
            <span v-else>
              Your wallet charge is ${{ credit }}
              <nuxt-link
                v-if="isLoggedIn"
                class="blue--text"
                to="/user/charge-wallet"
              >(Top Up Wallet)</nuxt-link>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  examId: {
    type: [String, Number],
    required: true,
  },
  examPrices: {
    type: Object,
    default: () => ({}),
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  credit: {
    type: [Number, String],
    default: 0,
  },
  userExamStatus: {
    type: [Number, String],
    default: 0,
  },
  downloadLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['download', 'login', 'register'])

// Computed properties
const isFree = computed(() => {
  if (!props.examPrices) return true

  const participation = props.examPrices.participation
  const pdf = props.examPrices.pdf

  if (participation?.price > 0 && pdf?.price > 0) {
    return false
  }

  return true
})

// Methods
function handleDownload(type) {
  emit('download', type)
}

function handleLogin() {
  emit('login')
}

function handleRegister() {
  emit('register')
}
</script>

<style scoped>
.order-btn-holder {
  position: fixed !important;
  bottom: 0 !important;
  right: 0 !important;
  left: 0 !important;
  z-index: 2 !important;
  border-top: 0.1rem solid #e1e2e3;
}

.order-btn-holder .v-btn {
  width: 40% !important;
}

.order-btn-holder span {
  font-size: 1.3rem;
}

.pointer {
  cursor: pointer;
}
</style>
