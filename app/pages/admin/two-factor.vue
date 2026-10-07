<template>
  <div class="w-100 d-flex flex-column ga-6 page">
    <section class="d-flex flex-column ga-2">
      <div class="d-flex align-center ga-3">
        <h1 class="text-h3 font-weight-bold text-grey700">
          Two-factor authentication
        </h1>
        <v-skeleton-loader
          v-if="loadingStatus"
          type="chip"
        />
        <v-chip
          v-else
          :color="enabled ? 'success' : 'warning'"
          size="small"
          variant="flat"
        >
          {{ enabled ? 'On' : 'Not set up' }}
        </v-chip>
      </div>
      <p class="text-h5 text-grey600">
        Approving, rejecting and paying out commission requests asks for a 6-digit code from an authenticator app
        (Google Authenticator, Microsoft Authenticator, 1Password...). Each code works once.
      </p>
    </section>

    <!-- Not set up: setup flow -->
    <section
      v-if="!loadingStatus && !enabled"
      class="bg-grey100 rounded-lg pa-4 d-flex flex-column ga-4"
    >
      <template v-if="!setup">
        <span class="text-h5 text-grey700">Link an authenticator app to your account.</span>
        <v-btn
          color="primary"
          flat
          rounded="lg"
          class="align-self-start"
          :loading="loadingSetup"
          @click="beginSetup"
        >
          Set up authenticator
        </v-btn>
      </template>

      <template v-else>
        <div class="d-flex flex-column flex-sm-row ga-6 align-start">
          <div class="bg-white pa-3 rounded-lg qr-box">
            <QrcodeVue
              :value="setup.authenticatorUri"
              :size="180"
              level="M"
            />
          </div>
          <div class="d-flex flex-column ga-2 setup-text">
            <span class="text-h5 font-weight-bold text-grey700">1. Scan the QR code with your authenticator app</span>
            <span class="text-h6 text-grey500">Can't scan? Enter this key instead:</span>
            <div class="d-flex align-center ga-2">
              <code class="text-h5 shared-key">{{ formattedKey }}</code>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="copyKey"
              >
                <v-icon size="18">
                  md:content_copy
                </v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  Copy key
                </v-tooltip>
              </v-btn>
            </div>

            <span class="text-h5 font-weight-bold text-grey700 mt-4">2. Enter the code the app shows</span>
            <v-otp-input
              v-model="enableCode"
              length="6"
              type="number"
              variant="outlined"
              class="px-0 otp"
              :disabled="loadingAction"
              @finish="turnOn"
            />
            <v-btn
              color="success"
              flat
              rounded="lg"
              class="align-self-start"
              :disabled="!isCode(enableCode)"
              :loading="loadingAction"
              @click="turnOn"
            >
              Turn on
            </v-btn>
          </div>
        </div>
      </template>
    </section>

    <!-- On: turn off -->
    <section
      v-if="!loadingStatus && enabled"
      class="bg-grey100 rounded-lg pa-4 d-flex flex-column ga-2"
    >
      <span class="text-h5 font-weight-bold text-grey700">Turn off</span>
      <span class="text-h6 text-grey500">
        You won't be able to decide payouts until you set it up again. Enter a current code to confirm.
      </span>
      <v-otp-input
        v-model="disableCode"
        length="6"
        type="number"
        variant="outlined"
        class="px-0 otp"
        :disabled="loadingAction"
      />
      <v-btn
        color="error"
        variant="outlined"
        rounded="lg"
        class="align-self-start"
        :disabled="!isCode(disableCode)"
        :loading="loadingAction"
        @click="turnOff"
      >
        Turn off
      </v-btn>
    </section>

    <!-- Reset another admin -->
    <section
      v-if="!loadingStatus && enabled"
      class="bg-grey100 rounded-lg pa-4 d-flex flex-column ga-2"
    >
      <span class="text-h5 font-weight-bold text-grey700">Reset another admin</span>
      <span class="text-h6 text-grey500">
        If an admin lost their phone, turn their two-factor off so they can set it up again. Needs your own code.
      </span>
      <v-text-field
        id="two-factor-reset-user"
        v-model="resetUserId"
        label="Their user ID"
        type="number"
        hide-spin-buttons
        variant="outlined"
        density="compact"
        rounded="lg"
        hide-details
        class="user-field"
      />
      <v-otp-input
        v-model="resetCode"
        length="6"
        type="number"
        variant="outlined"
        class="px-0 otp"
        :disabled="loadingAction"
      />
      <v-btn
        color="warning"
        variant="outlined"
        rounded="lg"
        class="align-self-start"
        :disabled="!resetUserId || !isCode(resetCode)"
        :loading="loadingAction"
        @click="resetOther"
      >
        Reset their two-factor
      </v-btn>
    </section>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Two-factor authentication' })

const { $toast } = useNuxtApp()
const {
  enabled,
  loadingStatus,
  getStatus,
  setup,
  loadingSetup,
  beginSetup,
  loadingAction,
  enable,
  disable,
  resetUser,
} = useTwoFactorAdmin()

const enableCode = ref('')
const disableCode = ref('')
const resetCode = ref('')
const resetUserId = ref('')

const isCode = (value: string) => /^\d{6}$/.test(value)

const formattedKey = computed(() => setup.value?.sharedKey.match(/.{1,4}/g)?.join(' ') ?? '')

const copyKey = async () => {
  try {
    await navigator.clipboard.writeText(setup.value?.sharedKey ?? '')
    $toast.success('Key copied')
  }
  catch {
    $toast.info('Copy the key by hand')
  }
}

const turnOn = async () => {
  if (!isCode(enableCode.value) || loadingAction.value) return
  await enable(enableCode.value)
  enableCode.value = ''
}

const turnOff = async () => {
  if (!isCode(disableCode.value)) return
  await disable(disableCode.value)
  disableCode.value = ''
}

const resetOther = async () => {
  if (!resetUserId.value || !isCode(resetCode.value)) return
  const response = await resetUser(Number(resetUserId.value), resetCode.value)
  resetCode.value = ''
  if (response.succeeded) resetUserId.value = ''
}

onMounted(async () => {
  await getStatus()
})
</script>

<style scoped>
.page {
  max-width: 760px;
}
.qr-box {
  line-height: 0;
}
.setup-text {
  min-width: 0;
}
.shared-key {
  word-break: break-all;
  letter-spacing: 0.04em;
}
.otp {
  max-width: 340px;
}
.user-field {
  max-width: 220px;
}
</style>
