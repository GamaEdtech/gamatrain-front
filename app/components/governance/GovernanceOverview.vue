<template>
  <div class="governance-overview__section mt-10 py-7">
    <div class="governance-overview__shape">
      <v-container>
        <h1 class="text-h4 text-md-h3 font-weight-bold text-white text-center mb-5">
          Your Governance Overview
        </h1>

        <!-- Show connect message if wallet is not ready -->
        <div
          v-if="!connected"
          class="text-center text-white py-10"
        >
          Connect your wallet to see your overview.
        </div>

        <!-- Show overview when connected -->
        <div v-else>
          <div class="governance-overview__cover">
            <img
              class="governance-overview__image"
              src="/static/governance/governance-overview.webp"
              alt=""
            >
          </div>

          <div class="governance-overview__staking-dashboard">
            <div class="governance-overview__stat-item">
              <span class="governance-overview__label">Staked $GET</span>
              <span class="governance-overview__value">15,000</span>
            </div>
            <div class="governance-overview__divider" />
            <div class="governance-overview__stat-item">
              <span class="governance-overview__label">Reward Earned</span>
              <span class="governance-overview__value">84.333</span>
            </div>
            <div class="governance-overview__divider" />
            <div class="governance-overview__stat-item">
              <span class="governance-overview__label">Proposals Voted</span>
              <span class="governance-overview__value">3</span>
            </div>
            <div class="governance-overview__divider" />
            <div class="governance-overview__stat-item">
              <span class="governance-overview__label">Days Staked</span>
              <span class="governance-overview__value">45</span>
            </div>
          </div>

          <div class="mt-6 d-flex justify-center">
            <v-btn
              color="#FFB600"
              variant="flat"
              rounded
              :size="isMdAndUp ? 'large' : 'default'"
            >
              Vote Now
            </v-btn>
            <v-btn
              color="#98A2B3"
              variant="outlined"
              rounded
              class="ml-3"
              :size="isMdAndUp ? 'large' : 'default'"
            >
              Claim Reward
            </v-btn>
          </div>

          <div class="text-caption text-md-button text-center mt-2 mt-sm-4">
            <span class="text-white">Available Balance From Wallet </span><span class="pl-1 primary-blue-500">{{ shortAddress }}</span><span class="pl-1 text-white">1,250 $GET</span>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const display = useDisplay()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isMdAndUp = computed(() => (display as any)?.mdAndUp?.value ?? false)

// --- STATE ---
const connected = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const publicKey = ref<any | null>(null)

// --- LIFECYCLE HOOK ---
onMounted(async () => {
  const { workspace } = useGovernance()
  // Use workspace state directly
  watch(() => workspace.connected.value, (val) => {
    connected.value = val
  }, { immediate: true })
  watch(() => workspace.publicKey.value, (pk) => {
    publicKey.value = pk
  }, { immediate: true })
})

// --- COMPUTED PROPERTIES ---
const shortAddress = computed(() => {
  const pk = publicKey.value
  if (!pk) return ''
  const base58 = pk.toBase58()
  return `${base58.slice(0, 4)}...${base58.slice(-4)}`
})
</script>

<style scoped>
.governance-overview__cover {
  width: 80%;
  margin: 0 auto;
  margin-bottom: -10px;
}

.governance-overview__image {
  width: 100%;
}

.governance-overview__section {
  background: #24292f;
}

.governance-overview__shape {
  border-radius: 20%;
}

.governance-overview__staking-dashboard {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #24292f;
  border-radius: 9999px;
  padding: 12px 10px;
  font-family: Arial, sans-serif;
  color: #ffffff;
  margin: 0 auto;
  border: 1px solid #363a3f;
  width: 100%;
  flex-wrap: wrap;
}

.governance-overview__staking-dashboard::before {
  content: "";
  position: absolute;
  background: #404347;
  width: 100px;
  height: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.governance-overview__staking-dashboard::after {
  content: "";
  position: absolute;
  background: #404347;
  width: 1px;
  height: 70px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.governance-overview__stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 12px 14px;
  width: 50%;
}

.governance-overview__label {
  font-size: 10px;
  font-weight: 500;
  color: #98a2b3;
}

.governance-overview__value {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin-left: 5px;
}

.governance-overview__divider {
  display: none;
}

@media only screen and (min-width: 600px) {
  .governance-overview__staking-dashboard::before,
  .governance-overview__staking-dashboard::after {
    content: unset;
  }

  .governance-overview__section {
    background: #24292f;
  }

  .governance-overview__shape {
    border-radius: 20%;
  }

  .governance-overview__staking-dashboard {
    display: flex;
    align-items: center;
    background-color: #24292f;
    border-radius: 9999px;
    padding: 12px 10px;
    font-family: Arial, sans-serif;
    color: #ffffff;
    margin: 0 auto;
    border: 1px solid #363a3f;
    width: 100%;
  }

  .governance-overview__stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    text-align: center;
    padding: 0 10px;
  }

  .governance-overview__label {
    font-size: 12px;
    font-weight: 500;
    color: #98a2b3;
  }

  .governance-overview__value {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin-left: 5px;
  }

  .governance-overview__divider {
    display: block;
    width: 1px;
    height: 40px;
    background-color: #404347;
  }
}

@media only screen and (min-width: 960px) {
  .governance-overview__cover {
    width: 45%;
  }

  .governance-overview__image {
    width: 100%;
    max-height: 260px;
  }

  .governance-overview__staking-dashboard {
    max-width: 770px;
  }
}
</style>
