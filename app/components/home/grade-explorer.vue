<template>
  <v-container
    id="content-stats-container"
    class="pt-6 pt-md-8 pb-2"
  >
    <h2 class="d-sr-only">
      Explore exam resources by category
    </h2>
    <v-row dense>
      <v-col
        v-for="(category, index) in categories"
        :key="category.key"
        cols="6"
        sm="4"
        lg="2"
      >
        <nuxt-link
          :to="categoryLink(category)"
          class="category-item d-block h-100"
        >
          <div
            class="ex-category__card h-100"
            :class="category.accent"
          >
            <div class="ex-category__card--title">
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
            <div class="d-flex align-center ga-2">
              <div class="ex-category__card--icon">
                <span
                  class="stat-icon"
                  :class="category.icon"
                />
              </div>
              <span class="ex-category__card--subtitle">
                {{ category.title }}
              </span>
            </div>
          </div>
        </nuxt-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useSearchApi } from '@/composables/api/search/useSearch.api'
import { useCountUp } from '@/composables/useCountUp'

const { getHomeStats } = useSearchApi()
const { data: boardList, loadingGetData: boardsLoading } = useBoard()
const { selectedBoard, selectedGrade, searchLink } = useHomeExplorer()

const categories = ref([
  { type: 'paper', statKey: 'paper', accent: 'accent-paper', key: 'papers', stat: null, title: 'Past Paper', icon: 'icon-paper' },
  { type: 'study-materials', statKey: 'studyMaterials', accent: 'accent-study-materials', key: 'study-materials', stat: null, title: 'Study Materials', icon: 'icon-study-materials' },
  { type: 'quizhub', statKey: 'exam', accent: 'accent-quizhub', key: 'exams', stat: null, title: 'Exam Hub', icon: 'icon-exam' },
  { type: 'tutorial', statKey: 'tutorial', accent: 'accent-tutorial', key: 'tutorial', stat: null, title: 'Tutorial', icon: 'icon-tutorial' },
  { type: 'teacher', statKey: 'teacher', accent: 'accent-teacher', key: 'teachers', stat: null, title: 'Teacher', icon: 'icon-teacher' },
  { type: 'school', statKey: 'school', accent: 'accent-school', key: 'schools', stat: null, title: 'Schools', icon: 'icon-school' },
])
const { $numberFormat } = useNuxtApp()
const displayStats = useCountUp(() => categories.value.map(category => category.stat))
const formatStat = stat => (typeof stat === 'number' ? $numberFormat(stat) : stat)

let categoryCountRequestId = 0

const categoryLink = (category) => {
  if (category.type === 'school') return '/school'
  if (category.type === 'teacher') return '/teacher'
  return searchLink(category.type)
}

// One cached request for every card (search/homestats). A count the backend couldn't fetch shows a dash.
const stopSpinning = () => categories.value.forEach((category) => {
  if (category.stat === null) category.stat = '—'
})

const fetchCategoryCounts = async () => {
  if (!selectedBoard.value) return

  const requestId = ++categoryCountRequestId
  // Back to the loader, so a card never shows the old selection's count next to the new selection's link.
  categories.value.forEach((category) => {
    category.stat = null
  })
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

watch([selectedBoard, selectedGrade], fetchCategoryCounts, { immediate: true })

// Without boards there's nothing to count, so don't leave the loaders spinning.
watch(boardsLoading, (loading) => {
  if (!loading && !boardList.value.length) stopSpinning()
})
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

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
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 14px;
  background: rgba(var(--accent), 0.1);
  transition: background-color 0.3s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.stat-icon {
  display: inline-block;
  font-size: 1.5rem;
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
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgb(var(--v-theme-grey200));
  padding: 1rem 0.5rem;
  border-radius: 20px;
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
}

@for $i from 1 through 6 {
  .v-col:nth-child(#{$i}) .category-item {
    animation-delay: #{($i - 1) * 70}ms;
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
  .ex-category__card--icon {
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

  .category-item:hover .ex-category__card--icon {
    transform: none;
  }

  .category-item:hover .stat-icon {
    animation: none;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'md-and-up')} {
  .ex-category__card--title {
    font-size: 26px;
  }
}
</style>
