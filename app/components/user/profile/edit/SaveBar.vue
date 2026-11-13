<template>
  <v-slide-y-reverse-transition>
    <div
      v-if="dirty"
      class="save-bar"
      role="region"
      aria-label="Unsaved changes"
    >
      <v-sheet
        color="secondary"
        rounded="lg"
        class="save-bar__inner d-flex flex-wrap align-center justify-space-between ga-3 pa-3 px-sm-5"
      >
        <span class="text-body-1">{{ valid ? 'You have unsaved changes' : 'Fix the highlighted fields to save' }}</span>
        <div class="d-flex ga-2">
          <v-btn
            variant="text"
            class="text-none"
            :disabled="saving"
            @click="emit('cancel')"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            class="text-none font-weight-bold"
            :loading="saving"
            :disabled="!valid"
            @click="emit('save')"
          >
            Save changes
          </v-btn>
        </div>
      </v-sheet>
    </div>
  </v-slide-y-reverse-transition>
</template>

<script setup lang="ts">
defineProps<{ dirty: boolean, valid: boolean, saving: boolean }>()
const emit = defineEmits<{ save: [], cancel: [] }>()
</script>

<style scoped>
.save-bar {
  position: sticky;
  bottom: 12px;
  z-index: 5;
}

.save-bar__inner {
  color: rgb(var(--v-theme-on-secondary));
  box-shadow: 0 6px 24px rgba(var(--v-theme-shadowNeutral), 0.25);
}
</style>
