<template>
  <div class="test-page">
    <v-container>
      <v-row justify="center">
        <v-col
          cols="12"
          md="10"
        >
          <v-card class="pa-6">
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
