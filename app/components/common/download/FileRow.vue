<template>
  <!-- One downloadable file: badge, name, price, a status line and a go button. The whole row is the button.
       Shared by every download list (exam export, past paper files) so they look and behave the same. -->
  <v-card
    tag="button"
    type="button"
    class="file-row d-flex align-center ga-3 pa-3 w-100 text-left"
    :class="{ 'file-row--owned': owned }"
    rounded="lg"
    elevation="0"
    :aria-label="ariaLabel"
  >
    <span
      class="file-icon d-flex align-end justify-center pb-1 text-white font-weight-heavy rounded"
      :class="`bg-${color}`"
      aria-hidden="true"
    >{{ badge }}</span>

    <span class="flex-grow-1 d-flex flex-column overflow-hidden">
      <span class="text-h5 font-weight-heavy text-brandNavy">{{ label }}</span>

      <span
        v-if="owned"
        class="text-subtitle-1 font-weight-heavy text-success500"
      >Owned</span>
      <span
        v-else-if="points === 0"
        class="text-subtitle-1 font-weight-heavy text-success500"
      >Free</span>
      <span
        v-else-if="points"
        class="d-flex align-center ga-1 text-subtitle-1 font-weight-heavy text-brandNavy text-no-wrap"
      >
        <v-icon
          size="14"
          color="generalSearchQuiz"
          aria-hidden="true"
        >md:diamond_outlined</v-icon>
        {{ points }} Gems
      </span>

      <span
        class="text-h6"
        :class="status?.color ?? 'text-grey500'"
        aria-live="polite"
      >{{ status?.text ?? summary }}</span>
    </span>

    <span
      class="go-button d-flex align-center justify-center rounded-lg"
      :class="owned ? 'bg-success500' : 'bg-primary'"
      aria-hidden="true"
    >
      <v-progress-circular
        v-if="busy"
        :indeterminate="indeterminate"
        :model-value="progress"
        size="18"
        width="2"
      />
      <!-- Counts down to the next automatic retry. -->
      <v-progress-circular
        v-else-if="countdown"
        :model-value="(countdown.secondsLeft / countdown.delay) * 100"
        size="26"
        width="2"
      >
        <span class="text-subtitle-1 font-weight-heavy">{{ countdown.secondsLeft }}</span>
      </v-progress-circular>
      <v-icon
        v-else
        size="18"
      >{{ failed ? 'md:autorenew' : 'md:download' }}</v-icon>
    </span>
  </v-card>
</template>

<script setup lang="ts">
export interface DownloadFileRowStatus {
  text: string
  /** A text color class, e.g. `text-lightError`. */
  color: string
}

const props = defineProps<{
  /** The extension on the file icon, e.g. `PDF`. */
  badge: string
  /** A Vuetify theme color for the file icon. */
  color: string
  label: string
  /** Price in Gems; 0 shows "Free", undefined/null shows no price (e.g. still loading). */
  points?: number | null
  owned?: boolean
  /** The line under the price while idle, e.g. "PDF · 1 MB · 12 pages". */
  summary: string
  /** Replaces the summary while something is happening (preparing, downloading, failed). */
  status?: DownloadFileRowStatus | null
  busy?: boolean
  indeterminate?: boolean
  progress?: number
  countdown?: { secondsLeft: number, delay: number } | null
  failed?: boolean
}>()

const ariaLabel = computed(() => {
  if (props.owned) return `Download ${props.label}, owned`
  if (props.points === 0) return `Download ${props.label}, free`
  if (props.points) return `Download ${props.label}, ${props.points} Gems`
  return `Download ${props.label}`
})
</script>

<style scoped>
.file-row {
  border: 1.5px solid rgb(var(--v-theme-primary50));
  cursor: pointer;
}
.file-row:hover {
  border-color: rgb(var(--v-theme-primary));
}
.file-row:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
.file-row--owned {
  border-color: rgb(var(--v-theme-success300));
}
.file-icon {
  position: relative;
  flex: none;
  width: 36px;
  height: 42px;
  font-size: 0.95rem;
}
.file-icon::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-bottom-left-radius: 5px;
  background: rgba(var(--v-theme-white), 0.45);
}
.go-button {
  flex: none;
  width: 34px;
  height: 34px;
  color: rgb(var(--v-theme-brandNavy));
}
.file-row--owned .go-button {
  color: rgb(var(--v-theme-white));
}
</style>
