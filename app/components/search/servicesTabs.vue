<template>
  <v-tabs
    :model-value="activeService"
    hide-slider
    color="inherit"
    class="w-100 service-tabs"
    aria-label="Search services"
    @update:model-value="selectService"
  >
    <v-tab
      v-for="service in services"
      :key="service.id"
      :value="service.id"
      :aria-label="service.title"
      class="rounded-lg px-2 py-2 service-tab text-none"
      :class="`
       ${activeService === service.id ? 'bg-grey700' : 'bg-surface'}
      `"
    >
      <div
        class="w-100 d-flex justify-start align-center ga-2"
        :class="activeService === service.id ? 'flex-row' : 'flex-column flex-sm-row'"
      >
        <span
          class="d-flex align-center justify-center"
          :class="activeService === service.id ? 'text-surface text-h3' : 'text-grey700 text-h4 text-sm-h3'"
          aria-hidden="true"
        >
          <span :class="service.icon" />
        </span>

        <div class="d-flex flex-column align-start min-width-0">
          <span
            class="text-h6 text-sm-h5 font-weight-bold d-none d-sm-flex"
            :class="activeService === service.id ? 'text-primary d-flex' : 'text-grey400'"
          >
            <v-progress-circular
              v-if="countsLoading"
              indeterminate
              size="16"
              width="2"
              color="primary"
            />
            <template v-else>
              {{ $numberFormat(getServiceCount(service.id)) }}
            </template>
          </span>
          <span
            class="d-none d-sm-flex text-h6 text-sm-h5 font-weight-bold text-truncate"
            :class="activeService === service.id ? 'text-surface' : 'text-grey700'"
          >
            {{ service.title }}
          </span>
          <span
            class="d-flex d-sm-none text-h6 text-sm-h5 font-weight-bold text-truncate"
            :class="activeService === service.id ? 'text-surface' : 'text-grey700'"
          >
            {{ service.shortTitle }}
          </span>
        </div>
      </div>
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import type { SearchCountService, SearchServiceCounts, SearchServiceId } from '@/types/search'
import { SEARCH_SERVICE_OPTIONS } from '@/constants'

const props = withDefaults(defineProps<{
  activeService: SearchServiceId
  serviceCounts?: SearchServiceCounts
  countsLoading?: boolean
}>(), {
  serviceCounts: () => ({}),
  countsLoading: false,
})

const emit = defineEmits<{
  change: [serviceId: SearchServiceId]
}>()

const { $numberFormat } = useNuxtApp()
const services = SEARCH_SERVICE_OPTIONS

const getServiceCount = (serviceId: SearchServiceId) =>
  props.serviceCounts[serviceId as SearchCountService] ?? 0

const selectService = (serviceId: unknown) => {
  if (typeof serviceId !== 'string') return

  emit('change', serviceId as SearchServiceId)
}
</script>

<style scoped>
.service-tab{
  width: 25%;
  min-width: 0;
  max-width: none;
  height: auto !important;
  min-height: 52px;
  flex: 0 0 25%;
  letter-spacing: 0;
  transition: 0.5s;
}
.service-tabs {
  height: auto;
}
.service-tabs :deep(.v-slide-group__container),
.service-tabs :deep(.v-slide-group__content) {
  height: auto;
}
.service-tabs :deep(.v-slide-group__content) {
  width: 100%;
  align-items: stretch;
}
.service-tab :deep(.v-btn__content) {
  width: 100%;
  min-width: 0;
}
@media (max-width: 599.98px) {
  .service-tab.v-tab.v-btn {
    width: 20%;
    min-width: 0;
    flex: 0 0 20%;
    padding-inline: 4px !important;
  }

  .service-tab.v-tab.v-btn.v-tab--selected {
    width: 40%;
    flex-basis: 40%;
  }
}
</style>
