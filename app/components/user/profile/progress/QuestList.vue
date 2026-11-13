<template>
  <v-card
    flat
    rounded="lg"
    border
    tag="section"
    class="pa-4 quest-list"
    aria-labelledby="quest-list-title"
  >
    <div class="d-flex flex-wrap justify-space-between align-baseline ga-2">
      <h2
        id="quest-list-title"
        class="text-h6 font-weight-bold text-grey900"
      >
        Level-up quests
      </h2>
      <span class="text-body-2 text-grey600">{{ doneCount }} of {{ quests.length }} done</span>
    </div>

    <p
      v-if="doneCount === quests.length"
      class="ma-0 mt-2 text-body-2 text-grey700"
    >
      Every quest is done. Nice work.
    </p>

    <v-list
      class="pa-0 mt-2"
      bg-color="transparent"
    >
      <v-list-item
        v-for="quest in ordered"
        :key="quest.code"
        class="px-0 quest-list__row"
      >
        <template #prepend>
          <v-icon
            v-if="quest.done"
            color="success500"
            aria-hidden="true"
          >
            mdi-check-circle
          </v-icon>
          <v-icon
            v-else
            color="grey400"
            aria-hidden="true"
          >
            mdi-circle-outline
          </v-icon>
        </template>

        <v-list-item-title
          class="text-wrap"
          :class="quest.done ? 'text-grey500 text-decoration-line-through' : 'font-weight-medium text-grey900'"
        >
          {{ PROFILE_QUESTS[quest.code].title }}
          <span
            v-if="quest.done"
            class="d-sr-only"
          >(done)</span>
        </v-list-item-title>
        <v-list-item-subtitle
          v-if="!quest.done"
          class="text-wrap"
        >
          {{ PROFILE_QUESTS[quest.code].hint }}
        </v-list-item-subtitle>

        <template
          v-if="!quest.done"
          #append
        >
          <div class="d-flex align-center ga-2 ms-2">
            <v-chip
              size="small"
              color="primaryStrong"
              variant="tonal"
              class="font-weight-bold"
            >
              +{{ quest.percent }}%
            </v-chip>
            <v-btn
              variant="tonal"
              color="secondary"
              class="text-none"
              :aria-label="`Start: ${PROFILE_QUESTS[quest.code].title}`"
              @click="emit('start', quest.code)"
            >
              Start
            </v-btn>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import type { ProfileQuestCode, ProfileQuestDTO } from '@/types'

const props = defineProps<{ quests: ProfileQuestDTO[] }>()
const emit = defineEmits<{ start: [code: ProfileQuestCode] }>()

const doneCount = computed(() => props.quests.filter(t => t.done).length)

/** What's left first, in the backend's order (cheap ones first); finished quests after. */
const ordered = computed(() => [...props.quests.filter(t => !t.done), ...props.quests.filter(t => t.done)])
</script>

<style scoped>
.quest-list {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.quest-list__row {
  min-height: 64px;
}

.quest-list__row + .quest-list__row {
  border-top: 1px solid rgb(var(--v-theme-borderSubtle));
}
</style>
