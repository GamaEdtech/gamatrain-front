<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start position-relative flex-wrap ga-2">
        <div class="btn-filter-container d-none d-md-flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill">
          <v-btn
            v-for="item in ADMIN_LOCATION_FILTER_LIST"
            :key="item.id"
            rounded="pill"
            :color="item.id === selectedLocationFilter ? `primary` : `transparent`"
            flat
            height="40"
            @click="changeFilter(item.id)"
          >
            <span :class="`${item.id === selectedLocationFilter ? `text-grey900` : `text-grey500`} font-weight-bold text-h5`">
              {{ item.title }}
            </span>
          </v-btn>
        </div>

        <div class="filter-mobile-container d-flex d-md-none align-center justify-start">
          <common-gombo-box
            v-model="selectedLocationFilter"
            label="Location"
            :items="ADMIN_LOCATION_FILTER_LIST"
            @update:model-value="changeFilter"
          />
        </div>
      </div>

      <div class="d-flex align-center justify-end ga-2 flex-wrap">
        <v-btn
          size="small"
          flat
          icon
          color="info"
          :loading="loading"
          @click="refreshData"
        >
          <v-icon
            color="white"
            size="20"
          >
            md:refresh
          </v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >
            Refresh Data
          </v-tooltip>
        </v-btn>
        <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold">
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          {{ selectedLocationTitle }}
        </span>
      </div>
    </div>

    <div class="w-100 d-flex flex-column flex-md-row align-stretch align-md-center justify-space-between ga-2 mt-4">
      <v-btn
        rounded="pill"
        color="primary"
        flat
        variant="outlined"
        height="40"
        @click="showAddModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Add {{ selectedLocationLabel }}</span>
      </v-btn>

      <v-text-field
        v-model="search"
        rounded="pill"
        density="compact"
        placeholder="Search"
        variant="outlined"
        autocomplete="off"
        persistent-clear
        base-color="grey200"
        color="primary"
        active-color="primary"
        bg-color="white"
        hide-details
        class="search-input"
      >
        <template #prepend-inner>
          <v-icon
            size="20"
            color="grey400"
          >
            md:search
          </v-icon>
        </template>
      </v-text-field>
    </div>

    <div class="w-100 mt-4">
      <v-data-table
        :headers="headers"
        :items="filteredList"
        :items-per-page="pageSize"
        class="elevation-1 set-height-table"
        :loading="loading"
        fixed-header
        hide-default-footer
      >
        <template #headers="{ columns }">
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="`bg-grey100 text-grey700 text-h5 font-weight-bold pa-2 text-center
               ${index == 0 ? `` : `th-min-width`}`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.id`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold">
            {{ item.id }}
          </div>
        </template>

        <template #[`item.title`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.title }}
          </div>
        </template>

        <template #[`item.localTitle`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.localTitle || '-' }}
          </div>
        </template>

        <template #[`item.code`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.code }}
          </div>
        </template>

        <template #[`item.parentTitle`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.parentTitle || '-' }}
          </div>
        </template>

        <template #[`item.latitude`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.latitude }}
          </div>
        </template>

        <template #[`item.longitude`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.longitude }}
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div class="d-flex justify-center align-center">
            <v-btn
              icon
              flat
              @click="openDeleteModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:delete
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                delete
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              @click="openDetailModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:settings
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Detail
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4">
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="4"
          next-icon="md:arrow_forward"
          prev-icon="md:arrow_back"
          size="40"
          class="custom-pagination"
          @update:model-value="changePageNumber"
        />
      </div>

      <div class="position-absolute right-0 select-size-div">
        <v-select
          v-model="pageSize"
          :items="allPageSize"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          rounded
          hide-details
          max-width="140"
          class="rounded-pill"
          @update:model-value="changePageSize"
        />
      </div>
    </div>

    <admin-common-delete-modal
      v-model="showDeleteModal"
      :loading="loadingDeleteLocation"
      @confirm="confirmDelete"
    />

    <admin-common-modal
      v-model:show-dialog="showAddModal"
      title="Add"
    >
      <admin-locations-modals-add
        :location="selectedLocationFilter"
        :location-type="selectedLocationType"
        @add-location-success-full="addLocationSuccessFull"
      />
    </admin-common-modal>

    <admin-common-modal
      v-if="showDetailModal"
      v-model:show-dialog="showDetailModal"
      title="Edit"
    >
      <admin-locations-modals-detail
        :id="selectedItemIdForDetail"
        :location-type="selectedLocationType"
        @edit-location-success-full="editLocationSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import { ADMIN_LOCATION_FILTER_LIST } from '@/constants'
import type {
  AdminLocationDTO,
  AdminLocationFilterDTO,
  AdminLocationTypeDTO,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const {
  loadingLocations: loading,
  locations: list,
  getLocations,
  locationsTotalCount: totalCount,
  locationsPageCount: pageCount,
  deleteLocation,
  loadingDeleteLocation,
} = useLocationAdmin()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
  { title: 'Title', key: 'title', sortable: false, width: '18vw' },
  { title: 'Local Title', key: 'localTitle', sortable: false, width: '16vw' },
  { title: 'Code', key: 'code', sortable: false, width: '10vw' },
  { title: 'Parent', key: 'parentTitle', sortable: false, width: '16vw' },
  { title: 'Latitude', key: 'latitude', sortable: false, width: '10vw' },
  { title: 'Longitude', key: 'longitude', sortable: false, width: '10vw' },
  { title: 'Action', key: 'Action', sortable: false, width: '12vw' },
]

const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const selectedLocationFilter = ref<AdminLocationFilterDTO>('country')
const search = ref('')
const showDeleteModal = ref(false)
const selectedItemIdForDelete = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedItemIdForDetail = ref('')

const selectedLocationItem = computed(() => {
  return ADMIN_LOCATION_FILTER_LIST.find(item => item.id === selectedLocationFilter.value)
    ?? ADMIN_LOCATION_FILTER_LIST[0]
})

const selectedLocationType = computed<AdminLocationTypeDTO>(() => {
  return selectedLocationItem.value.locationType
})

const selectedLocationTitle = computed(() => selectedLocationItem.value.title)

const selectedLocationLabel = computed(() => selectedLocationFilter.value)

const filteredList = computed(() => {
  if (!search.value) return list.value

  const term = search.value.toLowerCase()

  return list.value.filter((item) => {
    return item.title?.toLowerCase().includes(term)
      || item.localTitle?.toLowerCase().includes(term)
      || item.code?.toLowerCase().includes(term)
      || String(item.parentTitle || '').toLowerCase().includes(term)
  })
})

const fetchLocations = async () => {
  await getLocations({
    page: page.value,
    pageSize: pageSize.value,
    locationType: selectedLocationType.value,
  })
}

const changeFilter = async (locationFilter: string | number) => {
  selectedLocationFilter.value = locationFilter as AdminLocationFilterDTO
  page.value = 1
  search.value = ''
  await fetchLocations()
}

const changePageNumber = async () => {
  await fetchLocations()
}

const changePageSize = async () => {
  page.value = 1
  await fetchLocations()
}

onMounted(async () => {
  await fetchLocations()
})

const addLocationSuccessFull = async () => {
  showAddModal.value = false
  await fetchLocations()
}

const openDeleteModal = (item: AdminLocationDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteLocation(selectedLocationType.value, selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchLocations()
}

const openDetailModal = (item: AdminLocationDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

const editLocationSuccessFull = async () => {
  showDetailModal.value = false
  await fetchLocations()
}

const refreshData = async () => {
  await fetchLocations()
}
</script>

<style scoped>
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.select-size-div {
  top: 18px;
}
.btn-filter-container{
  min-height : 48px;
}
.filter-mobile-container{
  width: 170px;
}
.search-input{
  max-width: 360px;
}

:deep(.custom-pagination li button:hover) {
  background-color: rgb(var(--v-theme-primary));
  opacity: 0.6;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background: rgb(var(--v-theme-primary)) !important;
}
:deep(.custom-pagination .v-pagination__item--is-active .v-btn__overlay){
  opacity: 0 !important;
}

@media screen and (max-width: 960px) {
  .search-input{
    max-width: 100%;
  }
}
</style>
