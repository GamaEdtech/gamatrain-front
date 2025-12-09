<script lang="ts" setup>
const { solanaWalletAddress, required } = useValidationRules()
const walletAddress = ref('')
const giftPass = ref('')
const formIsValid = ref(false)

const receiveGift = () => {
  // Logic to redeem the gift using walletAddress and gift pass
  if (!formIsValid.value) return
  console.log('Redeeming gift for wallet:', walletAddress.value)
  console.log('Gift pass:', giftPass.value)
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
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-text-field
              v-mopdel="giftPass"
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
