<script lang="ts" setup>
useSeoMeta({
  title: 'Receive your gift',
  description: 'Redeem your gift by entering your wallet address and gift pass.',
})
const { $toast } = useNuxtApp()

const { solanaWalletAddress, required } = useValidationRules()
const walletAddress = ref('')
const giftPass = ref('')
const formIsValid = ref(false)
const route = useRoute()
const submitLoading = ref(false)
const receiveGift = async () => {
  if (!formIsValid.value) return

  submitLoading.value = true

  try {
    const id = Array.isArray(route.params.id)
      ? route.params.id[0]
      : route.params.id

    const response = await useApiService.post('/api/solana/gift', {
      to: walletAddress.value,
      id,
      pass: giftPass.value,
    })
    console.log('Gift redeem response:', response)

    if (!response?.success) {
      $toast.error(response.message || 'Failed to redeem gift. Please try again.')
      console.error('Error redeeming gift:', response.error)
    }
    else {
      $toast.success('Gift redeemed successfully!')
    }
  }
  catch (err) {
    console.error(err)
    $toast.error('Unexpected error occurred')
  }
  finally {
    submitLoading.value = false
  }
}
</script>

<template>
  <v-container
    class="mt-12"
  >
    <div class="mt-4">
      <h1>Receive your gift</h1>
      <p class="mb-2">
        Enter gift pass
      </p>
      <v-form v-model="formIsValid">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-text-field
              v-model="walletAddress"
              label="Your Wallet Address"
              outlined
              dense
              autocomplete="off"
              :rules="[solanaWalletAddress, required]"
            />
            <span class="text-blue ">
              You don't have wallet address? Create one at <a
                href="https://jup.ag/?refId=vsw1dbdvmxkz"
                target="_blank"
              >https://jup.ag</a>
            </span>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-text-field
              v-model="giftPass"
              label="Gift Pass"
              outlined
              dense
              :rules="[required]"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-btn
              color="primary"
              size="large"
              :disabled="!formIsValid"
              :loading="submitLoading"
              @click="receiveGift"
            >
              Redeem Gift
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-container>
</template>
