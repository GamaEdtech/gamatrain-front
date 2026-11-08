<template>
  <div
    class="custom-overlay d-flex align-end position-fixed w-100"
    @click="clickOnOverlay"
  >
    <div
      class="search-container w-100 bg-surface rounded-t-xl d-flex flex-column align-center pa-4"
      @click="clickOnModal"
    >
      <div class="w-100 d-flex justify-end">
        <v-icon
          size="x-large"
          color="grey400"
          @click="close"
        >
          md:close
        </v-icon>
      </div>
      <div class="w-100 d-flex flex-column ga-2 mt-4 pa-3 overflow-y-auto overflow-x-hidden">
        <div
          v-for="category in categories"
          :key="category.key"
        >
          <nuxt-link
            :to="categoryLink(category)"
          >
            <div class="ex-category__card">
              <div class="d-flex align-center">
                <div class="ex-category__card--title pr-2">
                  {{ typeof category.stat === 'number' ? $numberFormat(category.stat) : category.stat }}
                </div>
                <span>
                  <v-icon
                    size="x-large"
                    color="grey300"
                  >md:chevron_forward</v-icon>
                </span>
              </div>

              <div class="d-flex align-center order-first">
                <div class="ex-category__card--icon">
                  <span
                    class="stat-icon"
                    :class="category.icon"
                  />
                </div>
                <div class="d-flex align-center pl-1">
                  <span class="ex-category__card--subtitle">
                    {{ category.title }}
                  </span>
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResult, SearchTypesStatsDTO } from '@/types'

interface Category {
  type: string
  key: string
  stat: string | number
  title: string
  icon: string
}

const emit = defineEmits(['close'])

const categories = ref<Category[]>([
  {
    type: 'test',
    key: 'papers',
    stat: '--',
    title: 'Past Paper',
    icon: 'icon-paper',
  },
  {
    type: 'azmoon',
    key: 'exams',
    stat: '--',
    title: 'QuizHub',
    icon: 'icon-exam',
  },
  {
    type: 'dars',
    key: 'tutorial',
    stat: '--',
    title: 'Tutorial',
    icon: 'icon-tutorial',
  },
  {
    type: 'question',
    key: 'questions',
    stat: '--',
    title: 'Forum',
    icon: 'icon-q-a',
  },
  {
    type: 'learnfiles',
    key: 'files',
    stat: '--',
    title: 'Multimedia',
    icon: 'icon-multimedia',
  },
  {
    type: 'school',
    key: 'schools',
    stat: '+600K',
    title: 'Schools',
    icon: 'icon-school',
  },

])
const categoryLink = (category: Category) => {
  return category.type === 'school' ? `/school` : `/search?type=${category.type}`
}

const close = () => {
  emit('close')
}

const clickOnOverlay = () => {
  emit('close')
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

const fetchCategoryCounts = async () => {
  try {
    const params = new URLSearchParams()
    params.append('type', 'test')
    params.append('page', '1')
    const requestUrl = `/api/v1/search?${params.toString()}`
    const response = await useApiService.get<ApiResult<SearchTypesStatsDTO>>(requestUrl, undefined, { public: true })
    if (
      response
      && response.status === 1
      && response.data
      && response.data.types_stats
    ) {
      categories.value.find((cat, _i) => cat.key == 'papers')!.stat
        = parseInt(response.data.types_stats.papers) || 0

      categories.value.find((cat, _i) => cat.key == 'files')!.stat
        = parseInt(response.data.types_stats.learnfiles) || 0

      categories.value.find((cat, _i) => cat.key == 'exams')!.stat
        = parseInt(response.data.types_stats.exams) || 0

      categories.value.find((cat, _i) => cat.key == 'questions')!.stat
        = parseInt(response.data.types_stats.question) || 0

      categories.value.find((cat, _i) => cat.key == 'tutorial')!.stat
        = parseInt(response.data.types_stats.tutorials) || 0
    }
  }
  catch (error) {
    console.error('Error fetching category counts:', error)
  }
}

onMounted(async () => {
  await fetchCategoryCounts()
})
</script>

<style scoped>
.custom-overlay{
  height: calc(100% - var(--bottom-nav-height) - env(safe-area-inset-bottom, 0px));
  background-color: rgba(var(--v-theme-inverseSurfaceStrong), 0.32);
  z-index: 1007;
}
.search-container{
  height: 90%;
}

.stat-icon {
  font-size: 1.4375rem;
}
.icon-multimedia {
  color: rgb(var(--v-theme-greenLight700));
}
.icon-paper {
  color: rgb(var(--v-theme-blue500));
}
.icon-exam {
  color: rgb(var(--v-theme-generalSearchQuiz));
}
.icon-q-a {
  color: rgb(var(--v-theme-warning400));
}
.icon-tutorial {
  color: rgb(var(--v-theme-blue500));
}
.icon-school {
  color: rgb(var(--v-theme-generalSearchSchool));
}
.ex-category__card--title {
  color: rgb(var(--v-theme-grey700));
  font-size: 20px;
  font-weight: 700;
}
.ex-category__card--subtitle {
  color: rgb(var(--v-theme-grey500));
  font-size: 16px;
  font-weight: 500;
}
.ex-category__card {
  background: linear-gradient(
    to bottom,
    rgb(var(--v-theme-surface)),
    rgb(var(--v-theme-grey50))
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  padding: 1.25rem 0.9375rem;
  border-radius: 24px;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s,
    background 0.2s;
}
.ex-category__card:hover {
  box-shadow: 0 8px 24px rgba(var(--v-theme-generalSearchQuiz), 0.12),
    0 2px 6px rgba(var(--v-theme-shadowNeutral), 0.12);
  transform: translateY(-6px) scale(1.01);
  border-color: rgb(var(--v-theme-primaryStrong));
  background: rgb(var(--v-theme-blue50));
  cursor: pointer;
}
.ex-select-board-label {
  display: inline-flex;
  align-items: center;
  letter-spacing: inherit;
  line-height: inherit;
  max-width: 100%;
}
.ex-select-board-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.board-hint-row {
  max-width: 556px;
  position: relative;
  height: 10px;
  width: 100%;
  margin: 0 auto;
}
.ex-selector {
  z-index: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: rgb(var(--v-theme-quizFill));
  max-width: 556px;
  justify-content: flex-start;
  margin: 0 auto;
  padding: 0.625rem 0.3125rem;
  border-radius: 16px;
}
.ex-board-select {
  width: fit-content;
  min-width: 130px;
  position: relative;
}
.ex-board-select::after {
  content: "";
  width: 1px;
  height: 32px;
  background-color: rgb(var(--v-theme-blueGray300));
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translate(-50%, -50%);
}
.ex-grade-select {
  padding-left: 10px;
  width: fit-content;
  min-width: max-content;
  flex-grow: 1;
}

/* @media (min-width: 600px) {
  .ex-category__card {
    background: linear-gradient(
      90deg,
      rgb(var(--v-theme-surface)),
      rgb(var(--v-theme-grey50))
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgb(var(--v-theme-borderSubtle));
    padding: 1.875rem 0.625rem;
    border-radius: 24px;
  }
  .ex-board-select {
    width: max-content;
    min-width: max-content;
    position: relative;
  }
  .ex-board-select::after {
    content: "";
    width: 1px;
    height: 32px;
    background-color: rgb(var(--v-theme-blueGray300));
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .ex-grade-select {
    padding-left: 30px;
    width: 450px;
  }
}
@media (min-width: 960px) {
  .ex-category__card--title {
    font-size: 30px;
    font-weight: 700;
  }
  .ex-category__card--subtitle {
    font-size: 14px;
    font-weight: 500;
  }
} */
</style>
