<template>
  <div class="download-section">
    <!-- Desktop view -->
    <div
      v-if="!checkIsFree"
      class="d-none d-md-block mb-4 gama-text-body2 text-center"
    >
      <span v-if="!isLoggedIn">
        <span class="mdi mdi-bell icon" />
        <span
          class="login pointer"
          @click="openAuthDialog('login')"
        >Login</span>
        <span
          class="register pointer"
          @click="openAuthDialog('register')"
        >
          (register)
        </span>
        to download and charge your wallet.
      </span>
      <span v-else>
        Your wallet charge is ${{ credit }}
        <nuxt-link
          v-if="isLoggedIn"
          class="blue--text"
          to="/user/charge-wallet"
        >(Top Up Wallet)</nuxt-link>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { isAuthenticated } = useAuth()
const props = defineProps({
  fileExt: {
    type: String,
    default: 'pptx',
  },
  price: {
    type: Number,
    default: 0,
  },
  fileId: {
    type: String,
    required: true,
  },
  credit: {
    type: [Number, String],
    default: 0,
  },
})

const emit = defineEmits(['login', 'register'])

// Computed properties
const checkIsFree = computed(() => {
  return !props.price || props.price <= 0
})

// Methods
function openAuthDialog(type) {
  emit(type)
}

const isLoggedIn = computed(() => {
  return isAuthenticated.value ?? false
})
</script>

<style scoped>
.download-section {
  width: 100%;
}

.order-btn-holder {
  position: fixed !important;
  bottom: 0 !important;
  z-index: 2 !important;
  border-top: 0.1rem solid #e1e2e3;
}

.pointer {
  cursor: pointer;
}

.login:hover,
.register:hover {
  text-decoration: underline;
}

p {
  font-size: 1.3rem !important;
}
</style>
