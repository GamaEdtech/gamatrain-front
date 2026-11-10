<template>
  <ClientOnly>
    <v-slide-y-reverse-transition>
      <v-sheet
        v-if="items.length"
        color="grey800"
        class="compare-tray"
        elevation="8"
        role="region"
        aria-label="Schools picked to compare"
      >
        <div class="compare-tray__inner d-flex align-center flex-wrap ga-2">
          <strong class="text-surface">{{ items.length }} of {{ SCHOOL_COMPARE_MAX }} picked</strong>
          <div class="compare-tray__chips d-none d-sm-flex ga-1">
            <v-chip
              v-for="item in items"
              :key="item.id"
              size="small"
              variant="outlined"
              color="surface"
              closable
              :close-label="`Remove ${item.name}`"
              @click:close="remove(item.id)"
            >
              {{ item.name }}
            </v-chip>
          </div>
          <v-spacer />
          <v-btn
            variant="outlined"
            color="surface"
            rounded="pill"
            class="text-none"
            @click="clear"
          >
            Clear
          </v-btn>
          <v-btn
            color="primary"
            rounded="pill"
            class="text-none font-weight-bold"
            :to="compareLink"
            :disabled="items.length < 2"
          >
            {{ items.length < 2 ? 'Pick one more' : 'Compare side by side' }}
          </v-btn>
        </div>
      </v-sheet>
    </v-slide-y-reverse-transition>
  </ClientOnly>
</template>

<script setup lang="ts">
const { items, remove, clear, compareLink } = useSchoolCompare()
</script>

<style scoped>
.compare-tray {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1004;
  padding-bottom: env(safe-area-inset-bottom);
}

.compare-tray__inner {
  max-width: 1360px;
  margin: 0 auto;
  padding: 10px 16px;
}

.compare-tray__chips {
  min-width: 0;
  overflow-x: auto;
}
</style>
