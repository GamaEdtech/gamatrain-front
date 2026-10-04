<template>
  <v-badge
    class="height-badge d-inline-flex align-center justify-center"
    offset-x="5"
    offset-y="-5"
    :color="count == 0 ? 'transparent' : 'lightError'"
    :content="count == 0 ? '' : count"
  >
    <v-btn
      class="filter-trigger"
      rounded="xl"
      variant="outlined"
      density="comfortable"
      @click="emit('click')"
    >
      <span class="filter-trigger__content d-flex align-center ga-2 font-weight-bold">
        <v-icon size="18">{{ icon }}</v-icon>
        {{ label }}
      </span>
    </v-btn>
  </v-badge>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Filter',
  },
  icon: {
    type: String,
    default: 'md:filter_list',
  },
  count: {
    type: [Number, String],
    default: 0,
  },
})

const emit = defineEmits(['click'])
</script>

<style scoped>
.filter-trigger {
  color: rgb(var(--v-theme-brandNavy));
  background: rgb(var(--v-theme-white));
  border-color: rgb(var(--v-theme-borderSubtle));
  border-radius: 12px !important;
}

.filter-trigger:hover {
  background: rgb(var(--v-theme-softGold));
  border-color: rgb(var(--v-theme-primary-darken-1));
}

.filter-trigger__content {
  color: rgb(var(--v-theme-brandNavy));
  font-size: 14px;
  line-height: 20px;
}

:deep(.height-badge .v-badge__wrapper .v-badge__badge) {
  height: 20px !important;
}
</style>
