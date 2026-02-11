<template>
  <div
    v-if="isLoading || schools.length != 0"
    class="w-100 d-flex flex-column mt-4"
  >
    <span class="text-h3 font-weight-bold text-grey700">
      Nearest School
    </span>

    <v-slide-group
      v-if="isLoading"
      show-arrows
      class="related-content position-relative mt-8"
    >
      <v-slide-group-item
        v-for="i in 10"
        :key="i"
      >
        <school-card-school-mobile-skeleton
          class="mx-4"
        />
      </v-slide-group-item>
    </v-slide-group>
    <v-slide-group
      v-else
      show-arrows
      class="related-content position-relative mt-8"
    >
      <template #prev>
        <v-btn
          icon
          size="sm"
        >
          <v-icon color="#000000">
            md:chevron_backward
          </v-icon>
        </v-btn>
      </template>

      <template #next>
        <v-btn
          icon
          size="sm"
        >
          <v-icon color="#000000">
            md:chevron_forward
          </v-icon>
        </v-btn>
      </template>

      <v-slide-group-item
        v-for="school in schools"
        :key="school.id"
      >
        <school-card-school-mobile
          :school="school"
          class="mx-4"
        />
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  ResponseListDTO,
  SchoolListDTO,
} from '~/types/api'

interface INearestSchool {
  lat?: number
  lng?: number
}

const props = defineProps<INearestSchool>()
const SCHOOL_DISTANCE = 5000
const isLoading = ref(true)
const schools = ref<SchoolListDTO[]>([])

const getSchool = async () => {
  if (props.lat != null && props.lng != null) {
    try {
      isLoading.value = true
      const params = {
        'PagingDto.PageFilter.Skip': 0,
        'PagingDto.PageFilter.Size': 20,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'Location.Radius': SCHOOL_DISTANCE,
        'Location.Latitude': props.lat,
        'Location.Longitude': props.lng,
      }

      const response = await useApiService.get<ApiResult<ResponseListDTO<SchoolListDTO>>>('/api/v2/schools', params)
      if (response.succeeded && response.data && response.data.list.length > 0) {
        schools.value = response.data.list
      }
    }
    catch (err) {
      console.error(err)
    }
    finally {
      isLoading.value = false
    }
  }
}

onMounted(async () => {
  await getSchool()
})
</script>

<style scoped>
:deep(.related-content > .v-slide-group__container > .v-slide-group__content){
  align-items: end;
  padding: 10px 0;
}
:deep(.related-content:hover > .v-slide-group__prev),
:deep(.related-content:hover > .v-slide-group__next) {
  opacity: 1;
  visibility: visible;
  position: absolute;
}

:deep(.related-content > .v-slide-group__wrapper) {
  order: 1;
  width: 100%;
  align-items: center;
}

:deep(.related-content > .v-slide-group__prev),
:deep(.related-content > .v-slide-group__next) {
  order: 2;
  margin-top: 12px;
  background-color: #344054cc;
  border-radius: 50%;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  border: 1px solid #e4e7ec;
  color: white;
  opacity: 0;
  visibility: hidden;
  transition: opacity 300ms ease, visibility 300ms ease;
}

:deep(.related-content > .v-slide-group__prev > i),
:deep(.related-content > .v-slide-group__next > i) {
  color: white !important;
}

:deep(
    .related-content
      > .v-slide-group__prev
      > .theme--light.v-icon.v-icon.v-icon--disabled
  ),
:deep(
    .related-content
      > .v-slide-group__next
      > .theme--light.v-icon.v-icon.v-icon--disabled
  ) {
  color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.related-content > .v-slide-group__prev > .v-slide-group__prev--disabled),
:deep(.v-slide-group__prev--disabled),
:deep(.related-content > .v-slide-group__next > .v-slide-group__next--disabled),
:deep(.v-slide-group__next--disabled) {
  pointer-events: unset !important;
  opacity: 0.6 !important;
  transition: opacity 300ms ease, visibility 300ms ease;
}

:deep(.related-content > .v-slide-group__prev) {
  position: absolute;
  margin-top: 90px;
  left: 20px;
  z-index: 10;
}

:deep(.related-content > .v-slide-group__next) {
  position: absolute;
  margin-top: 90px;
  right: 20px;
  z-index: 10;
}
</style>
