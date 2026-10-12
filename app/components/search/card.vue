<template>
  <v-card
    :to="createLinkCard(information)"
    color="grey25"
    elevation="0"
    rounded="lg"
    min-height="174"
    max-width="1200"
    hover
    class="d-flex w-100 border border-grey200 border-opacity-100"
  >
    <div class="container-img w-100 bg-grey100">
      <v-img
        v-if="information.lesson_pic"
        :alt="information.title ?? undefined"
        :src="information.lesson_pic"
        cover
        class="h-100"
      />
      <div
        v-else
        class="h-100 d-flex align-center justify-center flex-column text-center pa-3 text-grey600 font-weight-bold text-h6 text-sm-h5"
      >
        <span>{{ fallbackSubject.name }}</span>
        <span v-if="fallbackSubject.code">{{ fallbackSubject.code }}</span>
      </div>
    </div>

    <div class="d-flex flex-column flex-grow-1 overflow-hidden px-4 py-3">
      <div class="d-flex align-start justify-space-between ga-4 mb-2">
        <div class="d-flex align-center ga-2 overflow-hidden">
          <v-avatar
            :image="information.avatar || '/images/default-user.svg'"
            size="26"
            class="border border-grey200 border-opacity-100"
          />
          <span class="text-grey500 font-weight-semibold text-truncate">{{ publisherName }}</span>
        </div>

        <div
          class="d-flex align-center flex-shrink-0 ga-3 ga-md-6"
          aria-label="Resource information"
        >
          <difficulty-indicator
            v-if="hasDifficulty"
            :level="information.level ?? undefined"
            :size="16"
          />
          <v-avatar
            v-if="hasPdfAvailable"
            v-tooltip:top="'PDF file'"
            size="16"
            color="grey50"
            role="img"
            aria-label="PDF file"
          >
            <span
              class="icon-pdf text-lightError"
              aria-hidden="true"
            />
          </v-avatar>
          <v-icon
            v-if="information.is_paper && information.a_file"
            v-tooltip:top="'Mark scheme'"
            icon="md:check_box_outlined"
            color="success"
            size="16"
            role="img"
            aria-label="Mark scheme"
          />
          <v-avatar
            v-if="!information.is_paper && information.q_file_word"
            v-tooltip:top="'Word file'"
            size="16"
            rounded
            color="transparent"
            role="img"
            aria-label="Word file"
          >
            <span
              class="icon-word text-info"
              aria-hidden="true"
            />
          </v-avatar>
          <v-icon
            v-if="isFeaturedResource"
            v-tooltip:top="'Featured resource'"
            icon="md:local_fire_department"
            color="lightError"
            size="16"
            role="img"
            aria-label="Featured resource"
          />
          <quality-indicator
            v-if="hasQualityRating"
            :score="qualityScore"
            :size="16"
          />
        </div>
      </div>

      <h2 class="text-h5 text-md-h4 text-grey700 font-weight-bold text-break mb-1">
        {{ information.title }}
      </h2>
      <p
        v-if="description"
        class="text-h6 text-grey500 text-truncate ma-0"
      >
        {{ description }}
      </p>

      <div class="d-flex align-center flex-nowrap overflow-hidden ga-1 mt-2 mt-sm-4">
        <v-chip
          v-for="tag in subjectTags"
          :key="tag"
          label
          variant="flat"
          color="grey200"
          class="text-grey600 border border-grey300 border-opacity-100 px-2 flex-shrink-0"
        >
          {{ tag }}
        </v-chip>
      </div>

      <div class="d-flex align-center flex-nowrap overflow-hidden ga-3 ga-lg-5 text-grey700 mt-3 text-h6 text-sm-h5">
        <span
          v-if="information.test_type_title"
          class="d-flex align-center ga-1 flex-shrink-0"
        >
          <v-icon
            icon="md:segment_outlined"
            size="12"
            aria-hidden="true"
          />
          {{ information.test_type_title }}
        </span>
        <span
          v-if="information.tests_num && legacyType === 'azmoon'"
          class="d-flex align-center ga-1 flex-shrink-0"
        >
          <v-icon
            icon="md:list"
            size="12"
            aria-hidden="true"
          />
          {{ information.tests_num }} questions
        </span>
        <span
          v-if="information.views"
          class="d-flex align-center ga-1 flex-shrink-0"
        >
          <v-icon
            icon="md:visibility_outlined"
            size="12"
            aria-hidden="true"
          />
          {{ information.views }}
        </span>
        <span class="d-flex align-center ga-1 flex-shrink-0">
          <v-icon
            icon="md:calendar_month_outlined"
            size="12"
            aria-hidden="true"
          />
          {{ formattedDate }}
        </span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { SearchCardItem, LegacySearchType } from '@/types/search'
import { getLegacySearchType } from '@/utils/searchServices'

const props = withDefaults(defineProps<{
  information?: SearchCardItem
}>(), {
  information: () => ({ id: '' }),
})

const route = useRoute()
const { $stripHtmlTags } = useNuxtApp()

const legacyType = computed(() => getLegacySearchType(route.query.type))

const publisherName = computed(() => {
  const name = [props.information.first_name, props.information.last_name]
    .filter(Boolean)
    .join(' ')
    .trim()
  return name || props.information.username || 'GamaTrain'
})

const fallbackSubject = computed(() => {
  const title = String(props.information.lesson_title || '').trim()
  const subjectMatch = title.match(/^(.*?)\s*(\(\d+\))$/)

  return {
    name: subjectMatch?.[1]?.trim() || title,
    code: subjectMatch?.[2] || '',
  }
})

const subjectTags = computed(() => [
  props.information.section_title,
  props.information.base_title,
  props.information.lesson_title,
].filter((tag): tag is string => Boolean(tag)))

const description = computed(() => $stripHtmlTags(
  String(props.information.description || props.information.summary || ''),
  1200,
))

const qualityScore = computed(() => {
  const score = Number(props.information.referee_score ?? props.information.ref_score ?? 0)
  return Number.isFinite(score) ? Math.min(5, Math.max(0, Math.round(score))) : 0
})

const hasDifficulty = computed(() =>
  !props.information.is_paper
  && ['1', '2', '3'].includes(String(props.information.level)),
)

const hasQualityRating = computed(() =>
  !props.information.is_paper && qualityScore.value > 0,
)

const isFeaturedResource = computed(() =>
  !props.information.is_paper && qualityScore.value === 5,
)

const formattedDate = computed(() => {
  const subdate = props.information.subdate
  if (!subdate) return ''
  // The API sends "YYYY-MM-DD HH:mm:ss"; the ISO "T" form parses in every browser.
  const date = new Date(subdate.replace(' ', 'T'))
  return Number.isNaN(date.getTime())
    ? subdate
    : date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
})

// Exam Hub PDFs are generated by the exam-detail flow and do not use q_file.
const hasPdfAvailable = computed(() =>
  legacyType.value === 'azmoon' || Boolean(props.information.q_file),
)

const DETAIL_ROUTE_BY_TYPE: Partial<Record<LegacySearchType, string>> = {
  test: 'paper',
  dars: 'tutorial',
  azmoon: 'exam',
}

const createLinkCard = (information: SearchCardItem) =>
  `/${DETAIL_ROUTE_BY_TYPE[legacyType.value] ?? 'paper'}/${information.id}/${information.title_url}`
</script>

<style scoped>
.container-img{
  min-width : 146px;
  max-width : 146px;
}
@media (max-width: 600px) {
  .container-img {
    min-width: 96px;
    max-width : 96px;
  }
}
</style>
