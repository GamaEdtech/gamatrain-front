<template>
  <div class="d-flex flex-column ga-4 settings-page">
    <h1 class="text-h6 font-weight-bold text-grey900 d-flex align-center ga-2">
      <v-icon
        color="teal"
        aria-hidden="true"
      >
        mdi-account-cog-outline
      </v-icon>
      Settings
    </h1>

    <user-setting-weekly-report-card />

    <v-card
      flat
      rounded="lg"
      border
      class="pa-4 pa-sm-6 settings-page__card"
    >
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-switch
            v-model="pushNotice"
            color="teal"
            label="Receive notifications (Push notifications)"
            hide-details
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-switch
            v-model="directMessage"
            color="teal"
            label="Receive direct message"
            hide-details
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
})

useHead({
  title: 'Settings',
})

// Not wired to the backend yet (unchanged from before; only the weekly report card above saves).
const pushNotice = ref(false)
const directMessage = ref(true)
</script>

<style scoped>
.settings-page {
  max-width: 960px;
}

.settings-page__card {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}
</style>
