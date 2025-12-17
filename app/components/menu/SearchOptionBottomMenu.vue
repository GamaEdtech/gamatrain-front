<template>
  <div
    class="custom-overlay d-flex align-end position-fixed w-100"
    @click="clickOnOverlay"
  >
    <div
      class="search-container w-100 bg-white rounded-t-xl d-flex flex-column align-center pa-4"
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
                <div class="ex-category__card--title mb-sm-4 pr-6 pr-md-0">
                  {{ typeof category.stat === 'number' ? $numberFormat(category.stat) : category.stat }}
                </div>
                <span class="d-sm-none">
                  <v-icon
                    size="x-large"
                    color="#D0D5DD"
                  >md:chevron_forward</v-icon>
                </span>
              </div>

              <div class="d-flex align-center order-first order-sm-last">
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
                  <span class="pl-1 d-none d-sm-block">
                    <v-icon
                      size="x-large"
                      color="#D0D5DD"
                    >md:chevron_backward</v-icon>
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
import type { ApiResult, SearchTypesStatsDTO } from '~/types/api'

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
    const response = await useApiService.get<ApiResult<SearchTypesStatsDTO>>(requestUrl)
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
  height: calc(100% - 62px);
  background-color: rgba(0, 0, 0, 0.32);
  z-index: 10000;
}
.search-container{
  height: 90%;
}

.stat-icon {
  font-size: 2.3rem;
}
.icon-multimedia {
  color: #02b719;
}
.icon-paper {
  color: #2e90fa;
}
.icon-exam {
  color: #7c4dff;
}
.icon-q-a {
  color: #fdb022;
}
.icon-tutorial {
  color: #2e90fa;
}
.icon-school {
  color: #a5673f;
}
.ex-category__card--title {
  color: #344054;
  font-size: 20px;
  font-weight: 700;
}
.ex-category__card--subtitle {
  color: #667085;
  font-size: 16px;
  font-weight: 500;
}
.ex-category__card {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1),
    rgba(249, 250, 251, 1)
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(242, 244, 247, 1);
  padding: 2rem 1.5rem;
  border-radius: 24px;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s,
    background 0.2s;
}
.ex-category__card:hover {
  box-shadow: 0 8px 24px 0 rgba(76, 74, 255, 0.1),
    0 1.5px 6px 0 rgba(0, 0, 0, 0.04);
  transform: translateY(-6px) scale(1.01);
  border-color: #ffb600;
  background: #f8faff;
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
  background: #4c4aff;
  max-width: 556px;
  justify-content: flex-start;
  margin: 0 auto;
  padding: 1rem 0.5rem;
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
  background-color: #9ea5d1;
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

@media (min-width: 600px) {
  .ex-category__card {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1),
      rgba(249, 250, 251, 1)
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(242, 244, 247, 1);
    padding: 3rem 1rem;
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
    background-color: #9ea5d1;
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
}
</style>
