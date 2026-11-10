<template>
  <ClientOnly>
    <v-slide-y-reverse-transition>
      <v-sheet
        v-if="items.length"
        ref="trayRef"
        color="surface"
        class="compare-tray"
        elevation="4"
        role="region"
        aria-label="Schools picked to compare"
      >
        <div class="compare-tray__inner d-flex align-center ga-2">
          <span class="text-body-2 text-grey900 text-no-wrap"><strong>{{ items.length }}</strong><span class="d-none d-sm-inline"> of {{ SCHOOL_COMPARE_MAX }}</span> to compare</span>
          <div class="compare-tray__chips d-none d-sm-flex ga-1 flex-grow-1">
            <v-chip
              v-for="item in items"
              :key="item.id"
              size="small"
              variant="tonal"
              color="grey700"
              closable
              :close-label="`Remove ${item.name}`"
              @click:close="remove(item.id)"
            >
              {{ item.name }}
            </v-chip>
          </div>
          <v-spacer class="d-sm-none" />
          <v-btn
            variant="text"
            color="grey700"
            size="small"
            class="text-none flex-shrink-0"
            @click="clear"
          >
            Clear
          </v-btn>
          <v-btn
            color="grey900"
            variant="flat"
            rounded="pill"
            class="text-none flex-shrink-0"
            :to="compareLink"
            :disabled="items.length < 2"
          >
            <template v-if="items.length < 2">
              Pick one more
            </template>
            <template v-else>
              Compare<span class="d-none d-sm-inline">&nbsp;side by side</span>
            </template>
          </v-btn>
        </div>
      </v-sheet>
    </v-slide-y-reverse-transition>
  </ClientOnly>
</template>

<script setup lang="ts">
const { items, remove, clear, compareLink } = useSchoolCompare()

// The bar is fixed over the bottom of the screen. Its height goes into --compare-tray-height, so the page keeps that much
// room at its end and the maps stop above it: nothing (the last school, "Show more", a map card) hides behind it.
const trayRef = ref<{ $el?: HTMLElement } | null>(null)
let observer: ResizeObserver | null = null

const setHeight = (px: number) => document.documentElement.style.setProperty('--compare-tray-height', `${Math.ceil(px)}px`)

watch(trayRef, (tray) => {
  observer?.disconnect()
  observer = null
  const element = tray?.$el
  if (!element) {
    setHeight(0)
    return
  }
  observer = new ResizeObserver(() => setHeight(element.offsetHeight))
  observer.observe(element)
  setHeight(element.offsetHeight)
}, { flush: 'post' })

onBeforeUnmount(() => {
  observer?.disconnect()
  setHeight(0)
})
</script>

<style scoped>
.compare-tray {
  border-top: 1px solid rgb(var(--v-theme-grey100));
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1004;
  padding-bottom: env(safe-area-inset-bottom);
}

.compare-tray__inner {
  max-width: 1360px;
  margin: 0 auto;
  padding: 10px 16px;
}

/* Takes the free width, at least enough for one name, and scrolls sideways when the names don't fit. */
.compare-tray__chips {
  flex: 1 1 160px;
  min-width: 160px;
  overflow-x: auto;
  scrollbar-width: none;
}

.compare-tray__chips .v-chip {
  flex-shrink: 0;
  max-width: 220px;
}
</style>

<style>
/* Room at the end of the page for the bar (0 when it is hidden). */
body {
  padding-bottom: var(--compare-tray-height, 0px);
}
</style>
