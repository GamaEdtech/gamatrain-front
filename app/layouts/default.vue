<template>
  <v-app>
    <error-temp
      v-if="!isOnline"
      status-code="disconnect"
    />
    <template v-else>
      <div
        v-if="isLoading"
        class="w-100 h-100 position-fixed left-0 top-0 d-flex justify-center align-center custom-ovarlay"
      >
        <v-progress-circular
          :model-value="progress"
          color="#ffb300"
          :size="80"
          :width="8"
          class="text-h4 font-weight-black"
        >
          {{ progress }}%
        </v-progress-circular>
      </div>
      <common-header />
      <div>
        <slot />
      </div>
      <!-- Blog container -->
      <home-blog-container v-if="showBlogSlider" />
      <!-- End blog container -->
      <common-footer />
      <menu-bottom-nav-menu v-if="showBottomNavSlider" />
      <AppGlobalSnackbar />
      <client-only>
        <lazy-common-random-coin />
      </client-only>
    </template>
  </v-app>
</template>

<script setup>
const isLoading = ref(false)
const progress = ref(0)
let animationFrame = null
let startTime = null
const duration = 10000
const route = useRoute()
const { isOnline } = useNetwork()

const excludedPaths = ['/', '/search', '/school']
const excludedNames = ['exam-start-id', 'school-add', 'subject-directory', 'governance']

const showBlogSlider = computed(() => {
  return !excludedPaths.includes(route.path) && !excludedNames.includes(route.name)
})

const excludedPathsForBottomNavMenu = ['/school', '/game/car-racing', '/game/castle']
const showBottomNavSlider = computed(() => {
  return !excludedPathsForBottomNavMenu.includes(route.path)
})

onMounted(() => {
  setFavicon()
  const nuxtApp = useNuxtApp()
  nuxtApp.hook('page:start', () => {
    isLoading.value = true
    progress.value = 0
    startTime = null
    animationFrame = requestAnimationFrame(animateProgress)
  })
  nuxtApp.hook('page:finish', () => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
    progress.value = 100
    setTimeout(() => {
      isLoading.value = false
    }, 500)

    setTimeout(() => {
      progress.value = 0
    }, 1000)
  })
  nuxtApp.hook('page:error', () => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
    isLoading.value = false
    progress.value = 0
  })
})

const setFavicon = () => {
  const prefersDarkMode
    = window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches
  const faviconElement = document.querySelector('link[rel="icon"]')
  if (faviconElement) {
    faviconElement.href = prefersDarkMode
      ? '/favicon-dark.ico'
      : '/favicon-light.ico'
  }
}

const animateProgress = (timestamp) => {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  let newProgress = Math.min((elapsed / duration) * 90, 90)
  newProgress = easeOutQuad(newProgress / 90) * 90
  progress.value = Math.floor(newProgress)

  if (newProgress < 90) {
    animationFrame = requestAnimationFrame(animateProgress)
  }
}

const easeOutQuad = (t) => {
  return t * (2 - t)
}
</script>

<style scoped>
.custom-ovarlay {
  background-color: #00000069;
  z-index: 10001;
}
</style>
