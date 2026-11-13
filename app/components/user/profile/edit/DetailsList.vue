<template>
  <v-list
    class="pa-0 details-list"
    bg-color="transparent"
  >
    <v-list-item
      v-for="row in rows"
      :key="row.code"
      class="px-0 details-list__row"
    >
      <v-list-item-title class="text-body-2 font-weight-bold text-grey900">
        {{ row.label }}
      </v-list-item-title>
      <v-list-item-subtitle
        class="text-wrap details-list__value"
        :class="row.value ? 'text-grey800' : 'text-grey500'"
      >
        {{ row.value || row.empty }}
      </v-list-item-subtitle>
      <template #append>
        <v-btn
          variant="text"
          color="info"
          class="text-none"
          :aria-label="`${row.value ? 'Edit' : 'Add'} ${row.label.toLowerCase()}`"
          @click="emit('edit', row.code)"
        >
          {{ row.value ? 'Edit' : 'Add' }}
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import type { ProfileFieldCode, User } from '@/types'

const props = defineProps<{ user: User | null | undefined }>()
const emit = defineEmits<{ edit: [code: ProfileFieldCode] }>()

/** The profile fields edited in their own dialog, shown with their current value. */
const rows = computed(() => [
  {
    code: 'currentStatusSentence' as const,
    label: 'What you\'re working towards',
    value: props.user?.currentStatusSentence?.trim(),
    empty: 'One line, like "IGCSE in June, aiming for an A in Physics"',
  },
  {
    code: 'biography' as const,
    label: 'Bio',
    value: props.user?.biography?.trim(),
    empty: 'A few lines about you and what you like to study',
  },
  {
    code: 'skills' as const,
    label: 'Subjects you\'re good at',
    value: (props.user?.skills ?? []).filter(Boolean).join(', '),
    empty: 'Shown as skills on your profile',
  },
])
</script>

<style scoped>
.details-list__row {
  min-height: 64px;
}

.details-list__row + .details-list__row {
  border-top: 1px solid rgb(var(--v-theme-borderSubtle));
}

.details-list__value {
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
