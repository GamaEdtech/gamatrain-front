<template>
  <v-alert
    :type="detection.source === 'ai' ? 'warning' : 'info'"
    variant="tonal"
    density="comfortable"
    :icon="applied ? 'md:auto_awesome' : 'md:document_scanner'"
    class="detected-banner"
  >
    <template #title>
      {{ title }}
    </template>
    <div class="text-body-2 mb-2">
      {{ subtitle }}
    </div>
    <div class="d-flex flex-wrap ga-2">
      <v-chip
        v-for="item in items"
        :key="item.label"
        size="small"
        variant="outlined"
      >
        <span class="text-grey600 mr-1">{{ item.label }}:</span>{{ item.value }}
      </v-chip>
    </div>
    <template
      v-if="!applied"
      #append
    >
      <v-btn
        color="primary"
        variant="flat"
        rounded="pill"
        :loading="loading"
        @click="emit('apply')"
      >
        Apply details
      </v-btn>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
import type { PaperDetectionDTO } from '@/types'
import { MONTH_LIST } from '~/constants/pastpaper'

/**
 * What a question paper's cover said about the paper. `applied`: the form was filled from it (a new paper); otherwise it
 * offers to apply it (an edit, where the user's own values come first).
 */
const props = defineProps<{
  detection: PaperDetectionDTO
  applied?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{ apply: [] }>()

const items = computed(() => {
  const found = props.detection
  const month = MONTH_LIST.find(item => item.id === found.month)?.title
  return [
    { label: 'Board', value: found.board?.title },
    { label: 'Grade', value: found.grade?.title },
    { label: 'Subject', value: found.subject?.title },
    { label: 'Paper', value: found.classification?.title },
    { label: 'Variant', value: found.variant?.title },
    { label: 'Session', value: [month, found.year].filter(Boolean).join(' ') },
    { label: 'Code', value: found.code },
  ].filter(item => item.value)
})

const title = computed(() => (props.applied ? `We filled in ${items.value.length} details from your paper` : 'We read the new question paper'))
const subtitle = computed(() => {
  const check = props.detection.source === 'ai'
    ? 'An AI model read this cover, so please check each detail carefully.'
    : 'Read from the codes printed on the cover. Check them, and change anything that\'s wrong.'
  return props.applied ? check : `${check} Apply them to replace the details below.`
})
</script>

<style scoped>
.detected-banner :deep(.v-chip) {
  background: rgb(var(--v-theme-surface));
}
</style>
