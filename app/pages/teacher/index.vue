<template>
  <div class="mt-16">
    <section class="teacher-band teacher-hero text-white">
      <v-container>
        <v-breadcrumbs
          :items="breadcrumbs"
          class="d-none d-sm-flex pa-0 mb-3 text-h6 text-onInverseSurfaceSubtle"
        >
          <template #divider>
            <v-icon size="16">
              mdi-chevron-right
            </v-icon>
          </template>
        </v-breadcrumbs>

        <h1 class="teacher-hero__title">
          Find your <span class="text-primary">teacher.</span>
        </h1>
        <p class="teacher-hero__lead text-onInverseSurfaceSubtle">
          Browse {{ isFiltered ? '' : total || '' }} teachers on GamaTrain.
          <span class="d-none d-sm-inline">Open a profile to see their skills and experience.</span>
        </p>

        <form
          role="search"
          @submit.prevent
        >
          <v-text-field
            v-model="fullName"
            variant="solo"
            flat
            single-line
            hide-details
            clearable
            rounded="lg"
            bg-color="background"
            max-width="640"
            class="teacher-field"
            label="Search teachers by name"
            spellcheck="false"
            prepend-inner-icon="mdi-magnify"
          />
        </form>
      </v-container>
    </section>

    <v-container
      id="teachers"
      tag="section"
      class="teacher-results pt-6 pb-10"
    >
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3 mb-4">
        <h2
          class="text-h4 text-sm-h3 font-weight-bold text-grey900 text-no-wrap"
          aria-live="polite"
        >
          {{ isFiltered ? 'Results' : 'All teachers' }}
          <span
            v-if="!hasFailed && (teachers.length || !isUpdating)"
            class="ml-1 text-h5 font-weight-medium text-grey500"
          >{{ total }}</span>
        </h2>

        <div class="d-flex flex-grow-1 justify-sm-end ga-3">
          <v-text-field
            v-model="skill"
            variant="outlined"
            density="compact"
            single-line
            hide-details
            clearable
            rounded="lg"
            max-width="220"
            class="teacher-field"
            label="Subject"
            spellcheck="false"
            prepend-inner-icon="mdi-book-open-variant-outline"
          />
          <v-select
            v-model="sort"
            :items="TEACHER_SORT_ITEMS"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            max-width="200"
            class="teacher-field"
            aria-label="Sort teachers"
          />
        </div>
      </div>

      <v-empty-state
        v-if="hasFailed"
        icon="mdi-cloud-off-outline"
        title="Couldn't load teachers"
        text="Check your connection and try again."
        action-text="Try again"
        @click:action="refresh()"
      />

      <v-empty-state
        v-else-if="!teachers.length && !isUpdating"
        icon="mdi-account-search-outline"
        title="No teachers found"
        text="Try another name or subject."
        action-text="Show all teachers"
        @click:action="clearFilters()"
      />

      <template v-else>
        <v-row
          tag="ul"
          class="teacher-results__list"
          :class="{ 'opacity-60': isUpdating && teachers.length }"
        >
          <v-col
            v-for="teacher in teachers"
            :key="teacher.handle"
            tag="li"
            cols="12"
            sm="6"
            md="3"
          >
            <TeachersCard :teacher="teacher" />
          </v-col>

          <!-- Only when there is no list to keep on screen, e.g. a new search after "No teachers found". -->
          <template v-if="!teachers.length">
            <v-col
              v-for="item in SKELETON_CARDS"
              :key="item"
              tag="li"
              cols="12"
              sm="6"
              md="3"
            >
              <v-skeleton-loader
                type="list-item-avatar-two-line"
                class="teacher-skeleton border rounded-xl"
              />
            </v-col>
          </template>
        </v-row>

        <v-pagination
          v-if="pageCount > 1"
          :model-value="page"
          :length="pageCount"
          total-visible="5"
          class="teacher-pagination mt-8"
        >
          <template #prev="{ disabled, 'aria-label': label }">
            <v-btn
              :to="disabled ? undefined : pageLink(page - 1)"
              :disabled="disabled"
              :aria-label="label"
              :active="false"
              icon="mdi-chevron-left"
              variant="outlined"
              density="comfortable"
              rounded="lg"
            />
          </template>

          <template #item="{ isActive, key, page: label, props: item }">
            <span
              v-if="item.ellipsis"
              class="d-flex justify-center align-center h-100 text-grey500"
            >{{ label }}</span>
            <v-btn
              v-else
              :to="pageLink(Number(key))"
              :aria-label="item['aria-label']"
              :aria-current="isActive ? 'page' : undefined"
              :active="false"
              :color="isActive ? 'secondary' : undefined"
              :variant="isActive ? 'flat' : 'text'"
              density="comfortable"
              icon
              rounded="lg"
              class="text-h6"
            >
              {{ label }}
            </v-btn>
          </template>

          <template #next="{ disabled, 'aria-label': label }">
            <v-btn
              :to="disabled ? undefined : pageLink(page + 1)"
              :disabled="disabled"
              :aria-label="label"
              :active="false"
              icon="mdi-chevron-right"
              variant="outlined"
              density="comfortable"
              rounded="lg"
            />
          </template>
        </v-pagination>
      </template>
    </v-container>

    <section class="bg-grey50 py-10">
      <v-container>
        <h2 class="text-h4 text-sm-h3 font-weight-bold text-grey900 mb-6">
          How to choose a teacher
        </h2>
        <v-row>
          <v-col
            v-for="step in GUIDE_STEPS"
            :key="step.title"
            cols="12"
            md="4"
            class="d-flex ga-4"
          >
            <v-avatar
              color="primary50"
              rounded="lg"
              size="44"
            >
              <v-icon
                :icon="step.icon"
                color="primaryStrong"
              />
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold text-grey900 mb-1">
                {{ step.title }}
              </h3>
              <p class="text-h5 font-weight-regular text-grey600">
                {{ step.text }}
                <NuxtLink
                  v-if="step.link"
                  :to="step.link.to"
                  class="text-info font-weight-medium"
                >
                  {{ step.link.title }}
                </NuxtLink>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="teacher-band text-white py-8">
      <v-container class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
        <div>
          <h2 class="text-h2 font-weight-bold mb-1">
            Are you a teacher?
          </h2>
          <p class="text-h5 font-weight-regular text-onInverseSurfaceSubtle">
            Share your lessons and earn from every sale.
          </p>
        </div>
        <v-btn
          to="/earn-money"
          color="primary"
          size="x-large"
          rounded="pill"
          flat
        >
          Earn money
        </v-btn>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
const SKELETON_CARDS = 12

const GUIDE_STEPS = [
  {
    icon: 'mdi-magnify',
    title: 'Find a teacher',
    text: 'Search by name, or filter by the subject you need help with.',
  },
  {
    icon: 'mdi-account-check-outline',
    title: 'Check their profile',
    text: 'Read their biography, skills and teaching experience before you decide.',
  },
  {
    icon: 'mdi-clipboard-check-outline',
    title: 'Know what to work on',
    text: 'See which topics need the most help before you start.',
    link: { title: 'Take an online exam', to: '/search?type=quizhub' },
  },
]

const breadcrumbs = TEACHER_BREADCRUMBS.map(({ text, disabled, href }) => ({ title: text, disabled, to: href }))

const {
  ready,
  page,
  teachers,
  total,
  pageCount,
  isUpdating,
  hasFailed,
  isFiltered,
  fullName,
  skill,
  sort,
  pageLink,
  refresh,
  clearFilters,
} = useTeacherDirectory()

await ready
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.teacher-band {
  background: rgb(var(--v-theme-secondary));
}

.v-theme--dark .teacher-band {
  background: rgb(var(--v-theme-surface));
}

.teacher-hero__title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.15;
}

.teacher-hero__lead {
  margin: 0.6rem 0 1.4rem;
  font-size: 1.5rem;
}

.teacher-results {
  // Clears the fixed header when a pagination link jumps here.
  scroll-margin-top: 6.4rem;
}

// The site's root font is 10px, so Vuetify's rem-based field text comes out too small.
.teacher-field :deep(.v-field),
.teacher-field :deep(.v-label) {
  font-size: 1.5rem;
}

// Seven buttons have to fit a 320px phone.
.teacher-pagination :deep(.v-pagination__list) {
  gap: 0.2rem;
}

.teacher-pagination :deep(.v-pagination__item),
.teacher-pagination :deep(.v-pagination__prev),
.teacher-pagination :deep(.v-pagination__next) {
  margin: 0;
}

.teacher-skeleton {
  height: 8.2rem;
}

.teacher-results__list {
  padding: 0;
  list-style: none;
  transition: opacity 0.15s;
}

@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
  .teacher-hero__title {
    font-size: 4rem;
  }

  .teacher-hero__lead {
    margin: 0.8rem 0 2rem;
    font-size: 1.7rem;
  }

  .teacher-skeleton {
    height: 17.6rem;
  }
}
</style>
