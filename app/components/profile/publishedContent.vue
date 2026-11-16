<template>
  <section class="profile-section bg-surface rounded-lg border-sm border-opacity-100 border-grey200 pa-4 pa-sm-6 overflow-hidden">
    <div class="d-flex flex-column flex-sm-row align-sm-start justify-space-between ga-3 mb-5">
      <div>
        <div class="d-flex align-center ga-2 mb-1">
          <v-avatar
            color="primary50"
            rounded="lg"
            size="36"
          >
            <v-icon
              icon="md:menu_book"
              color="primaryStrong"
              size="20"
            />
          </v-avatar>
          <h2 class="text-h6 text-sm-h4 font-weight-bold text-grey900">
            Published content
          </h2>
        </div>
        <p class="text-body-1 text-grey500">
          Learning resources created and shared by this teacher.
        </p>
      </div>

      <div class="d-flex ga-2 flex-shrink-0">
        <div class="content-summary rounded-lg border-sm border-opacity-100 border-grey100 bg-grey50 px-3 py-2 text-center">
          <div class="text-h6 font-weight-bold text-grey900">
            {{ publishedContent.length }}
          </div>
          <div class="text-caption text-grey500">
            Resources
          </div>
        </div>
        <div class="content-summary rounded-lg border-sm border-opacity-100 border-grey100 bg-grey50 px-3 py-2 text-center">
          <div class="text-h6 font-weight-bold text-grey900">
            1.8K
          </div>
          <div class="text-caption text-grey500">
            Learners
          </div>
        </div>
      </div>
    </div>

    <div class="content-filters d-flex ga-1 bg-grey50 pa-1 rounded-lg overflow-x-auto mb-5">
      <v-btn
        v-for="filter in filters"
        :key="filter.value"
        :color="selectedType === filter.value ? 'secondary' : 'transparent'"
        :variant="selectedType === filter.value ? 'flat' : 'text'"
        rounded="lg"
        height="38"
        class="flex-shrink-0 px-3"
        @click="selectedType = filter.value"
      >
        <v-icon
          :icon="filter.icon"
          size="17"
          class="mr-1"
        />
        <span
          class="text-caption font-weight-medium"
          :class="selectedType === filter.value ? 'text-grey200' : 'text-grey700'"
        >{{ filter.label }}</span>
        <span
          class="filter-count rounded-pill ml-2 px-2"
          :class="selectedType === filter.value ? 'bg-primary text-grey900' : 'bg-grey100 text-grey500'"
        >{{ countByType(filter.value) }}</span>
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="item in visibleContent"
        :key="item.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-card
          flat
          rounded="lg"
          class="content-card h-100 d-flex flex-column border-sm border-opacity-100 border-grey200 overflow-hidden"
        >
          <div
            class="content-card__visual d-flex align-center justify-center position-relative overflow-hidden"
            :class="`content-card__visual--${item.type}`"
          >
            <div class="content-card__pattern position-absolute rounded-circle" />
            <v-avatar
              color="surface"
              rounded="lg"
              size="54"
              class="content-card__icon"
            >
              <v-icon
                :icon="typeDetails[item.type].icon"
                :color="typeDetails[item.type].color"
                size="28"
              />
            </v-avatar>
            <v-chip
              color="surface"
              variant="flat"
              size="small"
              class="content-card__type position-absolute"
            >
              <span
                class="text-caption font-weight-bold"
                :class="`text-${typeDetails[item.type].color}`"
              >{{ typeDetails[item.type].label }}</span>
            </v-chip>
          </div>

          <div class="d-flex flex-column flex-grow-1 pa-4">
            <h3 class="content-card__title text-body-1 font-weight-bold text-grey900 mb-2 overflow-hidden">
              {{ item.title }}
            </h3>
            <p class="content-card__description text-caption text-grey500 mb-4 overflow-hidden">
              {{ item.description }}
            </p>

            <div class="d-flex align-center justify-space-between mt-auto pt-3 border-t-sm border-opacity-100">
              <span class="d-flex align-center ga-1 text-caption text-grey500">
                <v-icon
                  :icon="item.metricIcon"
                  size="16"
                />
                {{ item.metric }}
              </span>
              <span class="text-caption text-grey400">{{ item.date }}</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex justify-center mt-5">
      <v-btn
        variant="outlined"
        color="grey500"
        rounded="pill"
        class="px-5"
      >
        View all published content
        <v-icon
          icon="md:arrow_forward"
          end
          size="18"
        />
      </v-btn>
    </div>
  </section>
</template>

<script setup lang="ts">
type ContentType = 'paper' | 'exam' | 'tutorial' | 'blog'
type ContentFilter = 'all' | ContentType

interface PublishedContentItem {
  id: number
  type: ContentType
  title: string
  description: string
  metric: string
  metricIcon: string
  date: string
}

const selectedType = ref<ContentFilter>('all')

const filters: Array<{ label: string, value: ContentFilter, icon: string }> = [
  { label: 'All', value: 'all', icon: 'md:grid_view' },
  { label: 'Past papers', value: 'paper', icon: 'md:description' },
  { label: 'Exams', value: 'exam', icon: 'md:quiz' },
  { label: 'Tutorials', value: 'tutorial', icon: 'md:school' },
  { label: 'Blog', value: 'blog', icon: 'md:article' },
]

const typeDetails: Record<ContentType, { label: string, icon: string, color: string }> = {
  paper: { label: 'Past paper', icon: 'md:description', color: 'info' },
  exam: { label: 'Online exam', icon: 'md:fact_check', color: 'success500' },
  tutorial: { label: 'Tutorial', icon: 'md:school', color: 'primaryStrong' },
  blog: { label: 'Blog post', icon: 'md:article', color: 'warning500' },
}

const publishedContent: PublishedContentItem[] = [
  {
    id: 1,
    type: 'paper',
    title: 'IGCSE Mathematics — Algebra Practice Paper',
    description: 'A focused practice paper with worked solutions for core algebra topics.',
    metric: '428 downloads',
    metricIcon: 'md:download',
    date: 'Oct 18, 2026',
  },
  {
    id: 2,
    type: 'exam',
    title: 'Functions and Graphs: Progress Check',
    description: 'A 25-question online exam covering functions, domains and graphs.',
    metric: '312 attempts',
    metricIcon: 'md:person_check',
    date: 'Oct 12, 2026',
  },
  {
    id: 3,
    type: 'tutorial',
    title: 'Mastering Quadratic Equations',
    description: 'A step-by-step lesson with examples, shortcuts and practice exercises.',
    metric: '256 learners',
    metricIcon: 'md:play_circle',
    date: 'Sep 29, 2026',
  },
  {
    id: 4,
    type: 'blog',
    title: 'Five Revision Habits That Actually Work',
    description: 'Simple ways to plan revision and build confidence before an exam.',
    metric: '184 reads',
    metricIcon: 'md:visibility',
    date: 'Sep 20, 2026',
  },
  {
    id: 5,
    type: 'exam',
    title: 'Geometry Essentials: Mock Exam',
    description: 'Timed questions designed to reveal gaps before the final assessment.',
    metric: '147 attempts',
    metricIcon: 'md:person_check',
    date: 'Sep 11, 2026',
  },
  {
    id: 6,
    type: 'paper',
    title: 'Probability and Statistics Revision Set',
    description: 'Exam-style questions organised from foundation to advanced level.',
    metric: '391 downloads',
    metricIcon: 'md:download',
    date: 'Aug 26, 2026',
  },
]

const visibleContent = computed(() => {
  if (selectedType.value === 'all')
    return publishedContent

  return publishedContent.filter(item => item.type === selectedType.value)
})

const countByType = (type: ContentFilter) => {
  if (type === 'all')
    return publishedContent.length

  return publishedContent.filter(item => item.type === type).length
}
</script>

<style scoped>
.profile-section {
  box-shadow: 0 12px 30px rgba(var(--v-theme-grey400), 0.14);
}

.content-summary {
  min-width: 76px;
}

.content-filters {
  width: fit-content;
  max-width: 100%;
}

.filter-count {
  line-height: 20px;
}

.content-card {
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.content-card:hover {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 10px 24px rgba(var(--v-theme-grey900), 0.08);
  transform: translateY(-3px);
}

.content-card__visual {
  height: 124px;
}

.content-card__visual--paper {
  background: linear-gradient(135deg, rgb(var(--v-theme-blue50)), rgb(var(--v-theme-info)));
}

.content-card__visual--exam {
  background: linear-gradient(135deg, rgb(var(--v-theme-greenLight25)), rgb(var(--v-theme-success500)));
}

.content-card__visual--tutorial {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary50)), rgb(var(--v-theme-primary)));
}

.content-card__visual--blog {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning500), 0.16), rgb(var(--v-theme-warning500)));
}

.content-card__pattern {
  width: 180px;
  height: 180px;
  right: -45px;
  top: -85px;
  border: 24px solid rgba(255, 255, 255, 0.16);
}

.content-card__icon {
  z-index: 1;
  box-shadow: 0 8px 18px rgba(16, 24, 40, 0.13);
}

.content-card__type {
  left: 12px;
  top: 12px;
}

.content-card__title {
  min-height: 48px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.content-card__description {
  min-height: 40px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@media (max-width: 600px) {
  .content-filters {
    width: 100%;
  }
}
</style>
