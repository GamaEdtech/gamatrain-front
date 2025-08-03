<template>
  <v-card
    id="search-top-filter"
    rounded="0"
    flat
  >
    <v-window class="tab-header">
      <v-window-item
        v-model="active_tab"
        background-color="#F5F5F5"
        align-tabs="start"
        slider-color="transparent"
        class="pa-2"
      >
        <v-tab
          rounded
          color="rgba(0, 0, 0, .87)"
          class="tab-item"
          :class="{ 'tab-active': $route.query.type === 'test' }"
          @click="openLink('test')"
        >
          <v-badge
            class="py-1 mx-1 badge-sample"
            color="#2962FF"
            :content="content_statistics.test"
            bordered
            offset-y="5"
          >
            <div class="nav-link sample-q-icon">
              <span class="icon icon-paper" />
              Past Papers
            </div>
          </v-badge>
        </v-tab>
        <v-tab
          rounded
          color="rgba(0, 0, 0, .87)"
          class="tab-item"
          :class="{ 'tab-active': $route.query.type === 'learnfiles' }"
          @click="openLink('learnfiles')"
        >
          <v-badge
            bordered
            class="pa-1 mx-1 badge-training"
            :content="content_statistics.learnfiles"
            color="#2E7D32"
            offset-y="5"
          >
            <div class="nav-link training-content-icon">
              <span class="icon icon-multimedia" />
              Multimedia
            </div>
          </v-badge>
        </v-tab>
        <v-tab
          rounded
          color="rgba(0, 0, 0, .87)"
          class="tab-item"
          :class="{ 'tab-active': $route.query.type === 'question' }"
          @click="openLink('question')"
        >
          <v-badge
            bordered
            class="pa-1 mx-1 badge-q"
            :content="content_statistics.question"
            color="#BF360C"
            offset-y="5"
          >
            <div class="nav-link q-a-icon">
              <span class="icon icon-q-a" />
              Forum
            </div>
          </v-badge>
        </v-tab>
        <v-tab
          rounded
          color="rgba(0, 0, 0, .87)"
          class="tab-item"
          :class="{ 'tab-active': $route.query.type === 'azmoon' }"
          @click="openLink('azmoon')"
        >
          <v-badge
            bordered
            class="pa-1 mx-1 badge-online"
            :content="content_statistics.azmoon"
            color="#5600E8"
            offset-y="5"
          >
            <div class="nav-link exam-icon">
              <span class="icon icon-exam" />
              QuizHub
            </div>
          </v-badge>
        </v-tab>
        <v-tab
          rounded
          color="rgba(0, 0, 0, .87)"
          class="tab-item"
          :class="{ 'tab-active': $route.query.type === 'dars' }"
          @click="openLink('dars')"
        >
          <v-badge
            bordered
            class="pa-1 mx-1 badge-tutorial"
            :content="content_statistics.tutorial"
            color="#BD081C"
            offset-y="5"
          >
            <div class="nav-link tutorial-icon">
              <span class="icon icon-tutorial" />
              Tutorial
            </div>
          </v-badge>
        </v-tab>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const active_tab = ref(0)
const content_statistics = ref({
  azmoon: '--',
  dars: '--',
  learnfiles: '--',
  question: '--',
  test: '--',
  tutor: '--',
  tutorial: '--',
})

// Get title for the current section
const _getCurrentSectionTitle = () => {
  const type = route.query.type
  if (type === 'test') return 'Past Papers'
  if (type === 'learnfiles') return 'Multimedia'
  if (type === 'question') return 'Forum'
  if (type === 'azmoon') return 'QuizHub'
  if (type === 'dars') return 'Tutorial'
  if (type === 'tutor') return 'Tutor'
  return 'Past Papers' // Default
}

// Set the active tab based on the route
onBeforeMount(() => {
  setActiveTabFromRoute(route.query.type)
})

// Watch for route changes
watch(
  () => route.query.type,
  (newVal) => {
    setActiveTabFromRoute(newVal)
  },
)

// Helper function to set the active tab
const setActiveTabFromRoute = (routeType) => {
  if (routeType === 'test') active_tab.value = 0
  else if (routeType === 'learnfiles') active_tab.value = 1
  else if (routeType === 'question') active_tab.value = 2
  else if (routeType === 'azmoon') active_tab.value = 3
  else if (routeType === 'dars') active_tab.value = 4
  else if (routeType === 'tutor') active_tab.value = 5
}

// Function to open a link
const openLink = (val) => {
  const query = { type: val }
  if (route.query.section) {
    query.section = route.query.section
  }
  if (route.query.base) {
    query.base = route.query.base
  }
  if (route.query.lesson) {
    query.lesson = route.query.lesson
  }
  if (route.query.topic) {
    query.topic = route.query.topic
  }
  if (route.query.test_type !== 0 && query.type === 'test') {
    query.test_type = route.query.test_type
  }
  if (route.query.level !== 0 && query.type === 'test') {
    query.level = route.query.level
  }
  if (route.query.word === 1 && query.type === 'test') {
    query.word = 1
  }
  if (route.query.pdf === 1 && query.type === 'test') {
    query.pdf = 1
  }
  if (route.query.free === 1 && query.type === 'test') {
    query.free = 1
  }
  if (route.query.a_file === 1 && query.type === 'test') {
    query.a_file = 1
  }

  router.replace({ query: query })
}

// Expose content_statistics for parent components to set
defineExpose({
  content_statistics,
})
</script>

<style lang="scss" scoped>
#search-top-filter {
  position: sticky;
  top: 60px;
  z-index: 5;
  overflow-x: scroll;
  .icon-paper,
  .icon-multimedia,
  .icon-q-a,
  .icon-exam,
  .icon-tutorial {
    font-size: 2.5rem !important;
    margin-top: 0.5rem;
  }
}
@media (max-width: 600px) {
  #search-top-filter {
    top: 50px;
    margin-bottom: 3rem;
  }
}

/* Tab container */
:deep(.v-tabs) {
  background-color: #f5f5f5 !important;
  border-radius: 1.2rem !important;
}

:deep(.v-btn__overlay) {
  background-color: unset !important;
  border-radius: unset !important;
  opacity: unset !important;
  transition: unset !important;
  box-shadow: unset !important;
  border: unset !important;
  margin: unset !important;
  padding: unset !important;
}

/* Direct targeting of active tabs with our custom class */
.tab-item.tab-active {
  position: relative;
  z-index: 1;
  .nav-link {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
    border-radius: 1.4rem !important;
    color: rgba(0, 0, 0, 0.9) !important;
    font-weight: 500;
  }

  span.icon {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Color-specific active tab styles */
.tab-item.tab-active {
  /* Past Papers active tab */
  .badge-sample .nav-link {
    background: rgba(41, 98, 255, 0.08) !important;
    border-color: rgba(41, 98, 255, 0.3) !important;
  }

  /* Multimedia active tab */
  .badge-training .nav-link {
    background: rgba(46, 125, 50, 0.08) !important;
    border-color: rgba(46, 125, 50, 0.3) !important;
  }

  /* Forum active tab */
  .badge-q .nav-link {
    background: rgba(191, 54, 12, 0.08) !important;
    border-color: rgba(191, 54, 12, 0.3) !important;
  }

  /* QuizHub active tab */
  .badge-online .nav-link {
    background: rgba(86, 0, 232, 0.08) !important;
    border-color: rgba(86, 0, 232, 0.3) !important;
  }

  /* Tutorial active tab */
  .badge-tutorial .nav-link {
    background: rgba(189, 8, 28, 0.08) !important;
    border-color: rgba(189, 8, 28, 0.3) !important;
  }
}

/* Badge styling */
:deep(.v-badge) {
  display: inline-block;
  .v-badge__badge {
    left: calc(100% - 8px) !important;
    font-size: 1.1rem !important;
    padding: 0.8rem !important;
    font-weight: bold !important;
    min-width: min-content !important;
    min-height: 22px !important;
    border-radius: 11px !important;
    background: #2962ff !important;
    color: #fff !important;
  }
}

.v-badge .nav-link {
  align-items: center !important;
  display: flex !important;
}

/* Badge colors for each type */
:deep(.badge-sample .v-badge__badge) {
  background-color: #2962ff !important;
  color: white !important;
}

:deep(.badge-training .v-badge__badge) {
  background-color: #2e7d32 !important;
  color: white !important;
}

:deep(.badge-q .v-badge__badge) {
  background-color: #bf360c !important;
  color: white !important;
}

:deep(.badge-online .v-badge__badge) {
  background-color: #5600e8 !important;
  color: white !important;
}

:deep(.badge-tutorial .v-badge__badge) {
  background-color: #bd081c !important;
  color: white !important;
}

/* Icon styling for each tab type */
.sample-q-icon span {
  font-size: 3rem !important;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #2962ff;
}

.training-content-icon span {
  font-size: 3rem !important;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #2e7d32;
}

.q-a-icon span {
  font-size: 3rem !important;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #bf360c;
}

.exam-icon span {
  font-size: 3rem !important;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #5600e8;
}

.tutorial-icon span {
  font-size: 3rem !important;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #bd081c;
}

.teacher-icon span {
  font-size: 3rem !important;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #8e24aa;
}

.tab-header {
  margin: 1rem 0 !important;
  border-radius: 1.2rem !important;
  background-color: #f5f5f5 !important;
  padding: 0rem !important;
  border: none !important;
  min-width: max-content;
  cursor: unset !important;
  touch-action: pan-x !important;
}

.tab-item {
  text-transform: none !important;
  font-size: 1.2rem !important;
  transition: all 0.25s ease-in-out;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.8rem 0.8rem 0.8rem 0 !important;
  margin: 0.2rem !important;
  transition: all 0.2s ease;
}

/* Make non-active tabs more subtle */
.tab-item:not(.tab-active) .nav-link {
  color: rgba(0, 0, 0, 0.6);

  span.icon {
    opacity: 0.7;
  }
}

:deep(.badge-sample .v-badge__badge) {
  background-color: #2962ff !important;
}
:deep(.badge-training .v-badge__badge) {
  background-color: #2e7d32 !important;
}
:deep(.badge-q .v-badge__badge) {
  background-color: #bf360c !important;
}
:deep(.badge-online .v-badge__badge) {
  background-color: #5600e8 !important;
}
:deep(.badge-tutorial .v-badge__badge) {
  background-color: #bd081c !important;
}
:deep(.v-tabs__prev) {
  display: none !important;
}
:deep(.v-tabs__next) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 8px;
  z-index: 10;
}
:deep(.v-tabs__wrapper) {
  padding-left: 0 !important;
  padding-right: 48px !important;
}

.selected-tab .nav-link {
  display: none !important;
}
::-webkit-scrollbar {
  display: none;
}
::-webkit-scrollbar-thumb {
  border-radius: 0.8rem;
  background: #cacdd3;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
</style>
