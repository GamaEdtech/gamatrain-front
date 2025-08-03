<template>
  <div class="test-page">
    <v-container>
      <v-row justify="center">
        <v-col
          cols="12"
          md="10"
        >
          <v-card class="pa-6">
            <v-card-title class="text-h4 text-center mb-4">
              Token Purchase Test
            </v-card-title>

            <v-alert
              type="info"
              variant="tonal"
              class="mb-6"
            >
              <strong>Test Instructions:</strong>
              <ol class="mt-2">
                <li>Click "Connect Wallet to Buy $GET" button</li>
                <li>Select a wallet from the modal (Phantom recommended)</li>
                <li>Approve the connection in your wallet</li>
                <li>Enter an amount to see the swap quote</li>
                <li>Click "Buy $GET Now" to execute the swap</li>
              </ol>
            </v-alert>

            <TokenPurchase />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Token Purchase Test',
  layout: 'default',
})
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  padding: 2rem 0;
}
</style>
