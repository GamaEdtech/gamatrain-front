<template>
  <v-dialog
    v-model="open"
    max-width="440"
  >
    <v-card
      color="secondary"
      rounded="lg"
      class="pa-6 text-center level-reached"
      role="alertdialog"
      aria-labelledby="level-reached-title"
      aria-describedby="level-reached-text"
    >
      <v-avatar
        color="primary"
        size="88"
        class="mx-auto"
        aria-hidden="true"
      >
        <span class="text-h3 font-weight-bold">{{ profileLevelNumber(level) }}</span>
      </v-avatar>
      <p class="ma-0 mt-4 text-caption font-weight-bold text-primary level-reached__eyebrow">
        LEVEL {{ profileLevelNumber(level) }} OF {{ PROFILE_LEVELS.length }}
      </p>
      <h2
        id="level-reached-title"
        class="text-h5 font-weight-bold mt-1"
      >
        You're {{ level }} now
      </h2>
      <p
        id="level-reached-text"
        class="ma-0 mt-2 text-body-1 text-onInverseSurfaceSubtle"
      >
        {{ text }}
      </p>
      <div class="d-flex flex-column ga-2 mt-6">
        <v-btn
          v-if="nextQuest"
          color="primary"
          size="large"
          class="text-none font-weight-bold"
          @click="startNext"
        >
          {{ PROFILE_QUESTS[nextQuest.code].title }}
        </v-btn>
        <v-btn
          variant="outlined"
          size="large"
          class="text-none"
          @click="open = false"
        >
          Back to my profile
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { ProfileLevel, ProfileQuestCode, ProfileQuestDTO } from '@/types'

const props = defineProps<{
  level: ProfileLevel
  percent: number
  quests: ProfileQuestDTO[]
}>()
const open = defineModel<boolean>({ default: false })
const emit = defineEmits<{ start: [code: ProfileQuestCode] }>()

/** The biggest quest left: the quickest way up. */
const nextQuest = computed(() => [...props.quests].filter(t => !t.done).sort((a, b) => b.percent - a.percent)[0])

const text = computed(() => nextQuest.value
  ? `Your profile is ${props.percent}% complete. Next up: ${PROFILE_QUESTS[nextQuest.value.code].title.toLowerCase()}.`
  : 'Your profile is complete. Every quest is done.')

function startNext() {
  open.value = false
  if (nextQuest.value) emit('start', nextQuest.value.code)
}
</script>

<style scoped>
.level-reached {
  color: rgb(var(--v-theme-on-secondary));
}

.level-reached__eyebrow {
  letter-spacing: 0.04em;
}
</style>
