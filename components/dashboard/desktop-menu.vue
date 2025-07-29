<template>
  <div class="dashboard-menu">
    <!-- Desktop dashboard menu -->
    <div class="dashboard-menu-container">
      <v-list-item
        class="px-2"
        to="/user"
      >
        <template #prepend>
          <v-avatar>
            <v-img src="/images/dashboard-icon.png" />
          </v-avatar>
        </template>

        <v-list-item-title class="text-h5">
          Dashboard
        </v-list-item-title>
      </v-list-item>

      <v-divider />
      <navigation />
    </div>
    <!-- End desktop dashboard menu -->
  </div>
</template>

<script setup>
import Navigation from '@/components/dashboard/navigation'
</script>

<style scoped>
.dashboard-menu-container {
  background-color: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100%;
}
</style>
