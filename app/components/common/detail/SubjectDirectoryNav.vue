<template>
  <v-card
    v-if="directoryLink"
    :to="directoryLink"
    color="grey25"
    elevation="1"
    rounded="lg"
    hover
    class="subject-directory-card d-flex align-center justify-space-between ga-2 ga-md-6 w-100 px-4 py-1 py-md-3 border border-borderSubtle border-opacity-100 text-brandNavy"
  >
    <div class="d-flex align-center flex-grow-1 ga-2 ga-md-4 overflow-hidden">
      <v-avatar
        color="brandNavy"
        rounded="lg"
        size="40"
        aria-hidden="true"
      >
        <!-- The glyph is drawn left of centre in the icon font; ps-1 recentres it -->
        <span class="subject-directory-card__glyph icon-subject-directory ps-1" />
      </v-avatar>

      <div class="d-flex flex-column flex-grow-1 overflow-hidden">
        <span class="subject-directory-card__title font-weight-bold text-truncate">
          {{ subjectTitle }} Subject directory
        </span>
        <div class="d-flex align-center ga-1">
          <span class="subject-directory-card__subtitle text-brandNavy opacity-70 text-truncate">
            All resources in one place.
          </span>
          <v-chip
            tag="span"
            color="primary"
            variant="flat"
            size="small"
            class="subject-directory-card__action d-md-none ms-auto flex-shrink-0 text-brandNavy font-weight-semibold"
          >
            Open directory →
          </v-chip>
        </div>
      </div>
    </div>

    <v-btn
      tag="span"
      color="primary"
      variant="flat"
      rounded="lg"
      height="40"
      class="subject-directory-card__action d-none d-md-flex flex-shrink-0 text-none text-brandNavy font-weight-semibold"
    >
      Open directory →
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  contentData?: {
    section?: string | number | null
    base?: string | number | null
    lesson?: string | number | null
    lesson_title?: string | null
  }
}>()

const hasValue = (value: unknown) => value !== undefined && value !== null && value !== ''

// Only link when board, grade and subject are all known: empty result lists and teacher
// profiles have none of them, which used to produce ?board=undefined&grade=undefined&subject=undefined.
const directoryLink = computed(() => {
  const { section, base, lesson } = props.contentData ?? {}
  if (![section, base, lesson].every(hasValue)) return null

  return {
    path: '/subject-directory',
    query: { board: String(section), grade: String(base), subject: String(lesson) },
  }
})

// The search API pads some titles (e.g. " Mathematics 5").
const subjectTitle = computed(() => props.contentData?.lesson_title?.trim() ?? '')
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

/* px sizes: the app's 10px root font size makes Vuetify's rem-based type scale too small */
.subject-directory-card__glyph { font-size: 22px; }
.subject-directory-card__title { font-size: 18px; line-height: 24px; }
.subject-directory-card__subtitle,
.subject-directory-card__action { font-size: 14px; line-height: 20px; letter-spacing: normal; }

/* Phones (below Vuetify's md breakpoint): smaller text, which no utility class covers in px */
@media #{map.get(vuetify.$display-breakpoints, 'sm-and-down')} {
  .subject-directory-card { min-height: 65px; }
  .subject-directory-card__glyph { font-size: 18px; }
  .subject-directory-card__title { font-size: 14px; line-height: 20px; }
  .subject-directory-card__subtitle { font-size: 12px; line-height: 16px; }
  .subject-directory-card__action { font-size: 11px; line-height: 16px; }
}
</style>
