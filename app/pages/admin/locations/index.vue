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
    </div>

    <div class="w-100 d-flex flex-column flex-md-row align-stretch align-md-center justify-space-between ga-2 mt-4">
      <v-btn
        rounded="pill"
        color="primary"
        flat
        variant="outlined"
        height="40"
        max-width="200"
        @click="showAddModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Add {{ selectedLocationLabel }}</span>
      </v-btn>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="list || []"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loading"
      :item-label="selectedLocationTitle"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    >
      <template #actions>
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
      </template>
    </common-data-table>

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
  AdminLocationFilterDTO,
  AdminLocationTypeDTO,
  DataTableHeader,
  LocationItemDTO,
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

const headers: DataTableHeader<LocationItemDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '20vw' },
  { title: 'Title', key: 'title', sortable: false, width: '40vw' },
  { title: 'Code', key: 'code', sortable: false, width: '30vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '10vw',
    type: 'actions',
    actions: [
      { icon: 'md:delete', tooltip: 'delete', onClick: (item: LocationItemDTO) => openDeleteModal(item) },
      { icon: 'md:settings', tooltip: 'Detail', onClick: (item: LocationItemDTO) => openDetailModal(item) },
    ],
  },
]

const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const selectedLocationFilter = ref<AdminLocationFilterDTO>('country')
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
  return selectedLocationItem.value!.locationType
})

const selectedLocationTitle = computed(() => selectedLocationItem.value?.title)

const selectedLocationLabel = computed(() => selectedLocationFilter.value)

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
  await fetchLocations()
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchLocations()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
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

const openDeleteModal = (item: LocationItemDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteLocation(selectedLocationType.value, selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchLocations()
}

const openDetailModal = (item: LocationItemDTO) => {
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
.btn-filter-container{
  min-height : 48px;
}
.filter-mobile-container{
  width: 170px;
}
</style>
