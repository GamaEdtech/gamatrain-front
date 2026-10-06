<template>
  <nav
    class="services-navigation"
    aria-label="Search services"
  >
    <v-tabs
      :model-value="selectedService"
      class="services-navigation__items"
      hide-slider
      @update:model-value="selectService"
    >
      <v-tab
        v-for="service in services"
        :key="service.id"
        :value="service.id"
        variant="flat"
        base-color="grey25"
        color="brandNavy"
        rounded="lg"
        class="services-navigation__tab d-flex text-none font-weight-semibold pa-1 pa-md-0 px-md-5"
        :class="{ 'text-brandNavy': selectedService !== service.id }"
        :aria-label="service.title"
        aria-controls="search-service-filters"
      >
        <span class="services-navigation__content d-flex align-center ga-2 w-100 h-100">
          <span
            class="services-navigation__icon d-inline-flex align-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span :class="service.icon" />
          </span>
          <span class="services-navigation__copy d-flex flex-column align-start">
            <span class="services-navigation__count font-weight-bold">
              {{ formatCount(service.id) }}
            </span>
            <span class="services-navigation__title text-truncate">{{ service.title }}</span>
          </span>
          <span class="services-navigation__title services-navigation__title--short text-truncate">{{ service.shortTitle }}</span>
        </span>
      </v-tab>
    </v-tabs>
  </nav>
</template>

<script setup lang="ts">
import type { SearchServiceCounts, SearchServiceId } from '@/types/search'
import { SEARCH_SERVICE_OPTIONS } from '@/constants'

const props = withDefaults(defineProps<{
  activeService?: SearchServiceId | string
  serviceCounts?: SearchServiceCounts
}>(), {
  activeService: 'paper',
  serviceCounts: () => ({}),
})

const emit = defineEmits<{
  change: [serviceId: string]
}>()

const selectedService = ref(props.activeService)

watch(
  () => props.activeService,
  (serviceId) => {
    selectedService.value = serviceId
  },
)

const selectService = (serviceId: unknown) => {
  if (typeof serviceId !== 'string' || selectedService.value === serviceId) return

  selectedService.value = serviceId
  emit('change', serviceId)
}

const services = SEARCH_SERVICE_OPTIONS

const formatCount = (serviceId: string) => {
  const count = props.serviceCounts[serviceId as keyof SearchServiceCounts]
  return count == null ? '—' : new Intl.NumberFormat().format(count)
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

/* Colours, corners, hover and focus come from v-tab props; this is layout and the mobile expand animation. */
.services-navigation {
  width: 100%;
  max-width: 1200px;
  min-width: 0;
  border-bottom: 1px solid rgb(var(--v-theme-borderSubtle));
  overflow-x: auto;
  scrollbar-width: none;
}

.services-navigation::-webkit-scrollbar {
  display: none;
}

.services-navigation__items {
  --v-tabs-height: 72px;

  width: max-content;
  height: auto;
}

/* Tabs fill the row (needed for the mobile expand) and v-slide-group must not shift it */
.services-navigation__items :deep(.v-slide-group__content) {
  width: 100%;
  flex: 1 1 auto;
  gap: 8px;
  transform: none !important;
  transition: none !important;
}

/* Three classes to outrank Vuetify's own .v-tab.v-tab.v-btn min-width */
.services-navigation__tab.v-tab.v-btn {
  flex: 0 0 216px;
  min-width: 0;
  letter-spacing: normal;
}

.services-navigation__tab :deep(.v-btn__content) {
  width: 100%;
  min-width: 0;
  height: 100%;
}

.services-navigation__content {
  position: relative;
  overflow: hidden;
}

.services-navigation__icon,
.services-navigation__icon > span {
  width: 36px;
  height: 36px;
  font-size: 36px;
  line-height: 36px;
}

.services-navigation__copy {
  min-width: 0;
  line-height: 1.15;
}

/* px sizes: the app's 10px root font size makes Vuetify's rem-based type scale too small */
.services-navigation__title {
  font-size: 15px;
  line-height: 20px;
}

.services-navigation__count {
  min-height: 16px;
  font-size: 14px;
  line-height: 18px;
  color: rgb(var(--v-theme-primary));
}

.services-navigation__tab:not(.v-tab--selected) .services-navigation__count {
  color: rgba(var(--v-theme-brandNavy), 0.68);
}

.services-navigation__title--short {
  display: none;
}

@media #{map.get(vuetify.$display-breakpoints, 'sm-and-down')} {
  .services-navigation {
    padding: 8px 12px;
    overflow: hidden;
  }

  .services-navigation__items {
    --v-tabs-height: 59px;

    width: 100%;
  }

  .services-navigation__items :deep(.v-slide-group__content) {
    gap: 4px;
  }

  /* Tabs share the row equally; the selected one grows to show its full label */
  .services-navigation__tab.v-tab.v-btn {
    flex: 1 1 0;
    min-width: 44px;
    overflow: hidden;
    transition: flex-grow 360ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .services-navigation__tab.v-tab.v-btn.v-tab--selected {
    flex-grow: 3.5;
  }

  .services-navigation__tab :deep(.v-btn__content) {
    display: block;
  }

  .services-navigation__content {
    display: block !important;
  }

  .services-navigation__icon,
  .services-navigation__icon > span {
    width: 22px;
    height: 22px;
    font-size: 22px;
    line-height: 22px;
  }

  .services-navigation__icon {
    position: absolute;
    top: 7px;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    transition:
      inset-inline-start 300ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .services-navigation__copy {
    position: absolute;
    top: 6px;
    inset-inline-start: 32px;
    width: calc(100% - 32px);
    max-width: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateX(-6px);
    white-space: nowrap;
    transition:
      max-width 300ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 160ms ease,
      transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .services-navigation__title--short {
    display: block;
    position: absolute;
    bottom: 3px;
    inset-inline: 0;
    font-size: 11px;
    line-height: 14px;
    text-align: center;
    transition: opacity 120ms ease;
  }

  .services-navigation__tab.v-tab--selected .services-navigation__icon,
  .services-navigation__tab.v-tab--selected .services-navigation__icon > span {
    width: 24px;
    height: 24px;
    font-size: 24px;
    line-height: 24px;
  }

  .services-navigation__tab.v-tab--selected .services-navigation__icon {
    top: 50%;
    inset-inline-start: 4px;
    transform: translateY(-50%);
  }

  .services-navigation__tab.v-tab--selected .services-navigation__copy {
    top: 50%;
    max-width: 150px;
    opacity: 1;
    transform: translateY(-50%);
    transition-delay: 40ms, 70ms, 40ms;
  }

  .services-navigation__tab.v-tab--selected .services-navigation__count {
    min-height: 14px;
    font-size: 12px;
    line-height: 14px;
  }

  .services-navigation__tab.v-tab--selected .services-navigation__title:not(.services-navigation__title--short) {
    font-size: 14px;
    line-height: 18px;
  }

  .services-navigation__tab.v-tab--selected .services-navigation__title--short {
    opacity: 0;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'md-and-up')} {
  .services-navigation {
    overflow: visible;
  }

  .services-navigation__items {
    width: 100%;
    max-width: 836px;
  }

  .services-navigation__tab.v-tab.v-btn {
    flex: 1 1 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .services-navigation__tab,
  .services-navigation__icon,
  .services-navigation__copy,
  .services-navigation__title--short {
    transition: none;
  }
}
</style>
