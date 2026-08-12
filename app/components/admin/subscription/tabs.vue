<template>
  <div class="w-100 d-flex flex-column">
    <v-tabs
      v-model="activeTab"
      color="primary"
      bg-color="grey100"
      rounded="lg"
      class="subscription-tabs"
    >
      <v-tab
        v-for="tabItem in tabs"
        :key="tabItem.value"
        :value="tabItem.value"
        class="text-h5 font-weight-bold"
      >
        {{ tabItem.title }}
      </v-tab>
    </v-tabs>

    <v-window
      v-model="activeTab"
      class="w-100 mt-4"
    >
      <v-window-item value="plans">
        <admin-subscription-plans />
      </v-window-item>

      <v-window-item value="features">
        <admin-subscription-features />
      </v-window-item>

      <v-window-item value="prices">
        <admin-subscription-prices />
      </v-window-item>

      <v-window-item value="gatewayMappings">
        <admin-subscription-gateway-mappings />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('plans')

const tabs = [
  { title: 'Plans', value: 'plans' },
  { title: 'Features', value: 'features' },
  { title: 'Prices', value: 'prices' },
  { title: 'Gateway Mappings', value: 'gatewayMappings' },
]
</script>

<style scoped>
.subscription-tabs {
  min-height: 48px;
}
</style>
