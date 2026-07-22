<template>
  <v-card
    class="order-btn-holder d-block d-md-none"
    width="100%"
  >
    <v-card-text class="pb-0 mb-16">
      <v-row class="px-10 text-center">
        <v-col
          cols="12"
          class="py-4"
        >
          <div v-if="fileExt">
            <v-btn
              block
              color="#E60012"
              variant="flat"
              class="mb-2 text-h6 text-white font-weight-bold position-relative"
              :loading="downloadLoading && !isDownloading"
              @click="startDownload"
            >
              <template v-if="isDownloading">
                <v-progress-circular
                  :model-value="downloadProgress"
                  size="20"
                  width="2"
                  color="white"
                  class="position-absolute"
                  style="z-index: 2;"
                />
              </template>
              <!-- <v-icon
                size="x-large"
                class="btn-icon"
                :class="{ 'text-transparent': isDownloading }"
              >
                mdi-file-pdf-box
              </v-icon> -->
              <span :class="{ 'text-transparent': isDownloading }">
                Download {{ fileExt.toUpperCase() }}{{ showPrice ? " | " + price+ " GEM" : "" }}
              </span>
            </v-btn>
          </div>
        </v-col>

        <v-col
          v-if="!isFree"
          cols="12"
        >
          <div class="mb-4">
            <p v-if="!isLoggedIn">
              <span class="mdi mdi-bell icon" />
              <span
                class="login blue--text pointer"
                @click="handleLogin"
              >Login</span>
              <span
                class="register blue--text pointer"
                @click="handleRegister"
              >
                (register)
              </span>
              <span>to download and charge.</span>
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
import { computed } from 'vue'

const props = defineProps({
  fileExt: {
    type: String,
    default: 'pptx',
  },
  price: {
    type: Number,
    default: 0,
  },
  credit: {
    type: [Number, String],
    default: 0,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  downloadLoading: {
    type: Boolean,
    default: false,
  },
  isDownloading: {
    type: Boolean,
    default: false,
  },
  downloadProgress: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['download', 'login', 'register'])

// Computed properties
const isFree = computed(() => {
  return !props.price || props.price <= 0
})

const showPrice = computed(() => {
  return props.price > 0
})

// Methods
function startDownload() {
  emit('download', props.fileExt)
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

.text-transparent {
  color: transparent !important;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.btn-icon {
  flex-shrink: 0;
  margin-right: 8px;
  position: absolute;
  left: 10px;
}
</style>
