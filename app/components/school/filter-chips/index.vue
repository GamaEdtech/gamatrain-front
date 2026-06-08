<template>
  <div
    class="d-flex justify-space-between flex-wrap ga-1"
    aria-label="Active filters"
  >
    <v-chip
      v-for="chip in chips"
      :key="chip.name"
      closable
      class="text-grey600 text-body-small"
      variant="outlined"
      size="large"
      @click:close="handleRemove(chip.name)"
    >
      {{ chip.name }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
interface IChip {
  name: string
}

defineProps<{
  chips: IChip[]
}>()

const emit = defineEmits<{
  (e: 'removeChip', chipName: string): void
}>()

const handleRemove = (chipName: string) => {
  emit('removeChip', chipName)
}
</script>
