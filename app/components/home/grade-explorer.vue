<template>
  <v-container id="content-stats-container">
    <div>
      <!-- The row always keeps its height, so the hint appearing after load doesn't push the selector down. -->
      <div class="board-hint-row">
        <div
          v-show="showBoardHint"
          class="board-hint"
        >
          <div class="hint-container">
            <div class="hint">
              <div class="pt-14">
                <div class="px-5">
                  Select your Board!
                </div>
                <div class="arrow pt-3">
                  <img
                    src="/images/select-board-arrow.svg"
                    alt=""
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ex-selector">
        <div class="ex-board-select">
          <v-select
            v-model="selectedBoard"
            color="#4C4AFF"
            base-color="#4C4AFF"
            bg-color="#4C4AFF"
            :items="boardList"
            density="compact"
            item-title="title"
            item-value="id"
            hide-details
            return-object
            @update:model-value="fetchGradeList"
            @update:focused="handleBoardFocused"
          >
            <template
              v-if="!selectedBoard"
              #prepend-inner
            >
              <span
                class="select-shimmer"
                aria-hidden="true"
              />
            </template>
            <template #selection>
              <div class="d-flex align-center ex-select-board-label pr-5">
                <div v-if="selectedBoard?.icon">
                  <v-avatar
                    size="small"
                    variant="text"
                  >
                    <v-img :src="`/images/boards/${selectedBoard?.icon}.svg`" />
                  </v-avatar>
                </div>
                <div class="pl-2 ex-select-board-label">
                  <span class="ex-select-board-title">
                    {{ selectedBoard?.title }}
                  </span>
                </div>
              </div>
            </template>
          </v-select>
        </div>
        <div class="ex-grade-select">
          <v-select
            v-model="selectedGrade"
            :disabled="gradeLoader"
            color="#4C4AFF"
            base-color="#4C4AFF"
            bg-color="#4C4AFF"
            :items="gradeList"
            density="compact"
            item-title="title"
            item-value="id"
            hide-details
          >
            <template
              v-if="!gradeList.length"
              #prepend-inner
            >
              <span
                class="select-shimmer"
                aria-hidden="true"
              />
            </template>
          </v-select>
        </div>
      </div>
      <div class="mt-4 w-100 d-none d-sm-flex">
        <v-slide-group
          ref="categorySlider"
          class="category-slider pt-4 d-flex align-center position-relative"
          show-arrows
          center-active
        >
          <template #prev>
            <v-btn
              v-show="categorySlider?.hasPrev"
              aria-label="Previous plans"
              icon
              flat
              size="30"
              class="slider-arrow-button"
              color="surface"
            >
              <v-icon
                size="24"
                color="grey700"
              >
                md:chevron_left
              </v-icon>
            </v-btn>
          </template>

          <template #next>
            <v-btn
              v-show="categorySlider?.hasNext"
              aria-label="Next plans"
              icon
              flat
              size="30"
              class="slider-arrow-button"
              color="surface"
            >
              <v-icon
                size="24"
                color="grey700"
              >
                md:chevron_right
              </v-icon>
            </v-btn>
          </template>

          <v-slide-group-item
            v-for="(category, index) in categories"
            :key="category.key"
          >
            <nuxt-link
              :to="categoryLink(category)"
              class="category-item mx-1 mx-sm-2 mt-2"
            >
              <div
                class="ex-category__card"
                :class="category.accent"
              >
                <div class="d-flex align-center">
                  <div
                    class="ex-category__card--title mb-4"
                  >
                    <template v-if="category.stat === null">
                      <span
                        class="stat-reel"
                        aria-hidden="true"
                      >
                        <span
                          v-for="reel in 3"
                          :key="reel"
                          class="stat-reel__strip"
                        >01234567890</span>
                      </span>
                      <span class="d-sr-only">Loading</span>
                    </template>
                    <template v-else>
                      {{ formatStat(displayStats[index]) }}
                    </template>
                  </div>
                </div>

                <div class="d-flex align-center">
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
                    <span class="pl-1 d-block">
                      <v-icon
                        class="card-chevron"
                        size="x-large"
                        color="grey400"
                      >mdi-chevron-right</v-icon>
                    </span>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </v-slide-group-item>
        </v-slide-group>
      </div>
      <div class="mt-10 d-flex d-sm-none">
        <v-row justify="center">
          <v-col
            v-for="(category, index) in categories"
            :key="category.key"
            class="category-item"
            cols="12"
            sm="4"
            md="3"
            lg="2"
          >
            <nuxt-link
              :to="categoryLink(category)"
              class="d-block"
            >
              <div
                class="ex-category__card"
                :class="category.accent"
              >
                <div class="d-flex align-center">
                  <div
                    class="ex-category__card--title mb-sm-4 pr-6 pr-md-0"
                  >
                    <template v-if="category.stat === null">
                      <span
                        class="stat-reel"
                        aria-hidden="true"
                      >
                        <span
                          v-for="reel in 3"
                          :key="reel"
                          class="stat-reel__strip"
                        >01234567890</span>
                      </span>
                      <span class="d-sr-only">Loading</span>
                    </template>
                    <template v-else>
                      {{ formatStat(displayStats[index]) }}
                    </template>
                  </div>
                  <span class="d-sm-none">
                    <v-icon
                      class="card-chevron"
                      size="x-large"
                      color="grey400"
                    >mdi-chevron-right</v-icon>
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
                        class="card-chevron"
                        size="x-large"
                        color="grey400"
                      >mdi-chevron-right</v-icon>
                    </span>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { useSearchApi } from '@/composables/api/search/useSearch.api'
import { useCountUp } from '@/composables/useCountUp'

const { data: boardList, getData: getBoards } = useBoard()
const { getHomeStats } = useSearchApi()

const categorySlider = ref(null)

const categories = ref([
  {
    type: 'paper',
    statKey: 'paper',
    accent: 'accent-paper',
    key: 'papers',
    stat: null,
    title: 'Past Paper',
    icon: 'icon-paper',
  },
  {
    type: 'study-materials',
    statKey: 'studyMaterials',
    accent: 'accent-study-materials',
    key: 'study-materials',
    stat: null,
    title: 'Study Materials',
    icon: 'icon-study-materials',
  },
  {
    type: 'quizhub',
    statKey: 'exam',
    accent: 'accent-quizhub',
    key: 'exams',
    stat: null,
    title: 'Exam Hub',
    icon: 'icon-exam',
  },
  {
    type: 'tutorial',
    statKey: 'tutorial',
    accent: 'accent-tutorial',
    key: 'tutorial',
    stat: null,
    title: 'Tutorial',
    icon: 'icon-tutorial',
  },
  {
    type: 'teacher',
    statKey: 'teacher',
    accent: 'accent-teacher',
    key: 'teachers',
    stat: null,
    title: 'Teacher',
    icon: 'icon-teacher',
  },
  {
    type: 'school',
    statKey: 'school',
    accent: 'accent-school',
    key: 'schools',
    stat: null,
    title: 'Schools',
    icon: 'icon-school',
  },
])
const { $numberFormat } = useNuxtApp()
const displayStats = useCountUp(() => categories.value.map(category => category.stat))
const formatStat = stat => (typeof stat === 'number' ? $numberFormat(stat) : stat)

const _selectLoader = ref(true)
const gradeList = ref([])
const gradeLoader = ref(false)
const selectedBoard = ref(null)
const selectedGrade = ref(null)
const showBoardHint = ref(false)
let categoryCountRequestId = 0

const categoryLink = (category) => {
  return category.type === 'school' ? `/school` : category.type === 'teacher' ? '/teacher' : `/search?type=${category.type}&section=${selectedBoard.value?.code}&base=${selectedGrade.value}`
}
const fetchInitialData = async () => {
  await getBoards()

  // Try to restore selectedBoard from localStorage
  let storedBoard = null
  try {
    storedBoard = JSON.parse(localStorage.getItem('selectedBoard'))
  }
  catch {
    // Ignore parse errors - use default board
  }
  if (storedBoard && storedBoard.id) {
    // Find the matching board in the new boardList by id
    const match = boardList.value.find(b => b.id === storedBoard.id)
    selectedBoard.value = match || boardList.value[0]
  }
  else {
    selectedBoard.value = boardList.value[0]
  }
  fetchGradeList()
}
const fetchGradeList = async () => {
  try {
    if (!selectedBoard.value) {
      return
    }

    gradeLoader.value = true
    const params = { type: 'base' }
    params.section_id = selectedBoard.value.code
    const response = await useApiService.get(`/api/v1/types/list`, params, { public: true })

    gradeList.value = [
      { id: null, title: 'All', master_: null, list_order: '0', parent: null },
      ...response.data,
    ]
    if (selectedGrade.value === gradeList.value[0].id)
      fetchCategoryCounts()
    else
      selectedGrade.value = gradeList.value[0].id
  }
  catch (error) {
    console.error('Error fetching grade list:', error)
  }
  finally {
    gradeLoader.value = false
  }
}
// One cached request for every card (search/homestats). A count the backend couldn't fetch shows a dash.
const stopSpinning = () => categories.value.forEach((category) => {
  if (category.stat === null) category.stat = '—'
})

const fetchCategoryCounts = async () => {
  if (!selectedBoard.value) return

  const requestId = ++categoryCountRequestId
  try {
    const { data } = await getHomeStats({
      section: selectedBoard.value.code,
      base: selectedGrade.value ?? undefined,
    })
    if (requestId !== categoryCountRequestId || !data) return

    categories.value.forEach((category) => {
      const count = data[category.statKey]
      if (typeof count === 'number') category.stat = count
    })
  }
  catch (error) {
    console.error('Error fetching category counts:', error)
  }
  finally {
    if (requestId === categoryCountRequestId) stopSpinning()
  }
}

const handleBoardFocused = () => {
  if (selectedBoard.value && showBoardHint.value) {
    localStorage.setItem('boardHintShown', 'true')
    showBoardHint.value = false
  }
}
watch(
  () => selectedGrade.value,
  () => {
    fetchCategoryCounts()
  },
  {
    immediate: true,
  },
)

watch(
  () => selectedBoard.value,
  (_val) => {
    localStorage.setItem('selectedBoard', JSON.stringify(selectedBoard.value))
  },
)

onMounted(() => {
  fetchInitialData()
  if (localStorage.getItem('boardHintShown') === 'true') {
    showBoardHint.value = false
  }
  else {
    showBoardHint.value = true
  }
})
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.board-hint {
  position: absolute;
  left: 0;
  z-index: 2;
  left: 5%;
  bottom: 0;
}
.hint-container {
  position: relative;
  width: 242px;
  /* height: 119px; */
  opacity: 0;
  background: rgba(18, 183, 106, 0.5);
  display: flex;
  justify-content: center;
  border-radius: 120px 120px 0 0;
  animation: hintGrowIn 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s 1 both,
    waveHeightOnly 2.5s ease-in-out 0.7s infinite alternate;
}

@keyframes hintGrowIn {
  0% {
    height: 0;
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    height: 119px;
    opacity: 1;
  }
}

@keyframes waveHeightOnly {
  0% {
    height: 119px;
  }
  50% {
    height: 126px;
  }
  100% {
    height: 119px;
  }
}

.hint {
  position: absolute;
  width: 208px;
  height: 101px;
  background-color: #00c171;
  border-radius: 120px 120px 0 0;
  bottom: 0;
  width: 85%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  text-align: center;
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}

.hint-overlay {
  position: absolute;
  width: 140px; /* Slightly smaller */
  height: 70px; /* Slightly smaller */
  top: 5px; /* Centered inside */
  left: 5px;
  background-color: #ffffff; /* Inner white layer */
  border-radius: 70px 70px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00c171; /* Text color matching outer border */
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

// Each card glows in its own subject colour.
.accent-paper,
.accent-tutorial {
  --accent: var(--v-theme-blue500);
}
.accent-study-materials {
  --accent: var(--v-theme-greenLight700);
}
.accent-quizhub {
  --accent: var(--v-theme-generalSearchQuiz);
}
.accent-teacher {
  --accent: var(--v-theme-generalSearchTeacher);
}
.accent-school {
  --accent: var(--v-theme-generalSearchSchool);
}
// Icon sits on a soft chip of its colour that fills in on hover.
.ex-category__card--icon {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: 14px;
  background: rgba(var(--accent), 0.1);
  transition: background-color 0.3s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.stat-icon {
  display: inline-block;
  font-size: 2.4rem;
  color: rgb(var(--accent));
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
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    rgb(var(--v-theme-surface)),
    rgb(var(--v-theme-grey50))
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(var(--v-theme-grey200));
  padding: 2rem 1.5rem;
  border-radius: 24px;
  transition:
    transform 0.35s var(--card-ease),
    box-shadow 0.35s var(--card-ease),
    border-color 0.25s ease;
  --card-ease: cubic-bezier(0.22, 1, 0.36, 1);

  // Tinted wash that fades in on hover (gradients can't transition directly).
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(
      120% 90% at 50% 0%,
      rgba(var(--accent), 0.16),
      rgba(var(--accent), 0.03) 70%
    );
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  // A light sheen that sweeps across once on hover.
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
      100deg,
      transparent 30%,
      rgba(var(--v-theme-surface), 0.7) 50%,
      transparent 70%
    );
    transform: translateX(-120%) skewX(-20deg);
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  }
}

@keyframes icon-hop {
  40% {
    transform: translateY(-4px) scale(1.12);
  }
  70% {
    transform: translateY(1px) scale(0.96);
  }
}

.ex-category__card--title {
  font-variant-numeric: tabular-nums;
}

.card-chevron {
  transition: transform 0.3s var(--card-ease), color 0.3s ease;
}

.category-item:hover .ex-category__card,
.category-item:focus-visible .ex-category__card {
  transform: translateY(-6px);
  border-color: rgba(var(--accent), 0.6);
  box-shadow:
    0 14px 28px -10px rgba(var(--accent), 0.35),
    0 2px 6px rgba(var(--v-theme-grey700), 0.06);

  &::before {
    opacity: 1;
  }

  &::after {
    transform: translateX(120%) skewX(-20deg);
  }

  .ex-category__card--icon {
    background: rgba(var(--accent), 0.2);
    transform: scale(1.08) rotate(-6deg);
  }

  .stat-icon {
    animation: icon-hop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .card-chevron {
    transform: translateX(4px);
    color: rgb(var(--accent)) !important;
  }
}

.category-item:active .ex-category__card {
  transform: translateY(-2px) scale(0.98);
  transition-duration: 0.1s;
}

.category-item:focus-visible {
  outline: none;

  .ex-category__card {
    outline: 2px solid rgb(var(--accent));
    outline-offset: 3px;
  }
}

// Staggered fade-up when the cards first appear.
.category-item {
  animation: card-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;

  @for $i from 1 through 6 {
    &:nth-child(#{$i}) {
      animation-delay: #{($i - 1) * 70}ms;
    }
  }
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

// Slot-machine reels while a count loads. Pure CSS, so they spin from the first paint, before any JavaScript runs,
// for as long as the API takes. Each strip is one digit wide, so its digits wrap one per line.
.stat-reel {
  display: inline-flex;
  gap: 0.08em;
  height: 1.2em;
  overflow: hidden;
  line-height: 1.2;
  vertical-align: middle;
  color: rgba(var(--accent), 0.6);
  mask-image: linear-gradient(transparent, black 30%, black 70%, transparent);
}

.stat-reel__strip {
  width: 1ch;
  word-break: break-all;
  filter: blur(0.5px);
  // 10 digits, then the first again, so the loop is seamless.
  animation: reel-spin 0.8s linear infinite;

  &:nth-child(2) {
    animation-duration: 0.65s;
    animation-delay: -0.2s;
  }

  &:nth-child(3) {
    animation-duration: 0.95s;
    animation-delay: -0.45s;
  }
}

@keyframes reel-spin {
  to {
    transform: translateY(-12em);
  }
}

@media (prefers-reduced-motion: reduce) {
  .category-item {
    animation: none;
  }

  // Still reels show '000', which reads as a real count, so show a dash instead.
  .stat-reel {
    width: 1ch;

    > * {
      display: none;
    }

    &::after {
      content: '—';
    }
  }

  .ex-category__card,
  .ex-category__card::before,
  .ex-category__card::after,
  .ex-category__card--icon,
  .card-chevron {
    transition: none;
  }

  .category-item:hover .ex-category__card::after {
    transform: translateX(-120%) skewX(-20deg);
  }

  .category-item:hover .ex-category__card,
  .category-item:focus-visible .ex-category__card,
  .category-item:active .ex-category__card {
    transform: none;
  }

  .category-item:hover .ex-category__card--icon,
  .category-item:hover .card-chevron {
    transform: none;
  }

  .category-item:hover .stat-icon {
    animation: none;
  }
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
// Shimmering bar inside a selector until its options arrive (the boards and grades load after the page).
.select-shimmer {
  display: block;
  width: 80px;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-white), 0.18) 25%,
    rgba(var(--v-theme-white), 0.45) 50%,
    rgba(var(--v-theme-white), 0.18) 75%
  ) 0 0 / 200% 100%;
  animation: select-shimmer 1.4s linear infinite;
}

@keyframes select-shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .select-shimmer {
    animation: none;
  }
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

@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
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
    border: 1px solid rgb(var(--v-theme-grey200));
    padding: 3rem 1rem;
    border-radius: 24px;
    min-width : 230px;
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
@media #{map.get(vuetify.$display-breakpoints, 'md-and-up')} {
  .ex-category__card--title {
    font-size: 30px;
    font-weight: 700;
  }
  .ex-category__card--subtitle {
    font-size: 14px;
    font-weight: 500;
  }
}

:deep(.v-slide-group__content){
  align-items: flex-end;
  // Room for the hover shadow, which the slider would otherwise clip.
  padding-bottom: 12px;
}

:deep(.category-slider > .v-slide-group__prev),
:deep(.category-slider > .v-slide-group__next) {
  position: absolute;
  top: 50%;
  z-index: 2;
  min-width: 30px;
  transform: translateY(-50%);
}

:deep(.category-slider > .v-slide-group__prev) {
  left: 0;
}

:deep(.category-slider > .v-slide-group__next) {
  right: 0;
}

.slider-arrow-button {
  border: 1px solid rgb(var(--v-theme-grey300));
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.12);
}

:deep(.v-slide-group__prev--disabled .slider-arrow-button),
:deep(.v-slide-group__next--disabled .slider-arrow-button) {
  opacity: 0.45;
  box-shadow: none;
}
</style>
