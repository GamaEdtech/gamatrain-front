<template>
  <div class="w-100 d-flex align-center">
    <div
      v-for="service in services"
      :key="service.id"
      class="rounded-lg cursor-pointer d-flex justify-start align-center px-2 py-2 ga-2 service-div"
      :class="`
       ${activeService === service.id ? 'bg-grey700 flex-row w-100 w-sm-25' : 'bg-white flex-column flex-sm-row width-service'}
      `"
      @click="selectService(service.id)"
    >
      <span
        class="d-flex align-center justify-center"
        :class="activeService === service.id ? 'text-white text-h3' : 'text-grey700 text-h4 text-sm-h3'"
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
          :class="activeService === service.id ? 'text-white' : 'text-grey700'"
        >
          {{ service.title }}
        </span>
        <span
          class="d-flex d-sm-none text-h6 text-sm-h5 font-weight-bold text-truncate"
          :class="activeService === service.id ? 'text-white' : 'text-grey700'"
        >
          {{ service.shortTitle }}
        </span>
      </div>
    </div>
  </div>
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
.service-div{
  transition: 0.5s;
}
.width-service{
  width : 25%
}
@media (max-width: 600px) {
  .width-service{
    width : 20%
  }
}
</style>
