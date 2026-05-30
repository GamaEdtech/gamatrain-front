<template>
  <div class="chips-container" aria-label="Active filters">
    <v-chip
      v-for="chip in chips"
      :key="chip.name"
      closable
      class="primary-gray-600 filter-chip"
      variant="outlined"
      size="large"
      @click:close="handleRemove(chip.name)"
    >
      {{ chip.name }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
/**
 * --------------------------------------------------------------------------
 * SchoolFilterChips Component
 * --------------------------------------------------------------------------
 *
 * A reusable presentational component for displaying active filter chips.
 *
 * Features:
 * - Displays active filter chips
 * - Allows removing chips
 * - Stateless and parent-controlled
 *
 * Parent Responsibilities:
 * - Manage chips state
 * - Add/remove chips
 * - Handle emitted events
 * 
 * Props:
 * @param chips
 *
 * Emits:
 * @emits remove-chip
 *
 * --------------------------------------------------------------------------
 */

type Chip = {
  name: string;
};

const props = defineProps<{
  chips: Chip[];
}>();

const emit = defineEmits<{
  (e: "remove-chip", chipName: string): void;
}>();

const handleRemove = (chipName: string) => {
  emit("remove-chip", chipName);
};
</script>

<style scoped>
.chips-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;

  .filter-chip {
    font-weight: 400;
    font-size: 12px;
  }
}
</style>
