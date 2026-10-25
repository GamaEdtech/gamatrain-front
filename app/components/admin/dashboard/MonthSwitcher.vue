<template>
  <v-card
    border
    flat
    rounded="pill"
    class="d-inline-flex align-center ga-1 pa-1"
  >
    <v-btn
      icon="md:chevron_left"
      variant="text"
      size="small"
      aria-label="Previous month"
      @click="shift(-1)"
    />

    <v-sheet
      min-width="140"
      color="transparent"
      class="text-h5 font-weight-bold text-grey700 text-center"
    >
      {{ label }}
    </v-sheet>

    <v-btn
      icon="md:chevron_right"
      variant="text"
      size="small"
      aria-label="Next month"
      :disabled="isCurrent"
      @click="shift(1)"
    />

    <v-btn
      v-if="!isCurrent"
      color="primary"
      variant="flat"
      rounded="pill"
      size="small"
      class="text-h6 font-weight-bold ml-1"
      prepend-icon="md:today"
      @click="emit('update:modelValue', currentMonth)"
    >
      This month
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

/** v-model: the month as YYYY-MM. Future months are not offered. */
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const currentMonth = dayjs().format('YYYY-MM')

const isCurrent = computed(() => props.modelValue >= currentMonth)
const label = computed(() => dayjs(`${props.modelValue}-01`).format('MMMM YYYY'))

const shift = (months: number) => {
  const next = dayjs(`${props.modelValue}-01`).add(months, 'month').format('YYYY-MM')
  emit('update:modelValue', next > currentMonth ? currentMonth : next)
}
</script>
