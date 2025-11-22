<script setup>
import DeleteItemModal from '@/components/admin/contactus/deleteItemModal.vue'
import addLocation from '~/components/admin/locations/addLocation.vue'
import editLocation from '~/components/admin/locations/editLocation.vue'
import useApiService from '~/composables/useApiService'

definePageMeta({
  layout: 'admin',
  auth: true,
})

const { $toast } = useNuxtApp()

const list = ref([])

const headers = [
  { title: 'Title', key: 'title', sortable: false, width: '25vw' },
  { title: 'Code', key: 'code', sortable: false, width: '15vw' },
  { title: 'Actions', key: 'actions', sortable: false, width: '5vw' },
]

const tableLoading = ref(true)
const showAddLocationDialog = ref(false)
const showEditLocationDialog = ref(false)
const isDeleteModalOpen = ref(false)
const selectedId = ref(null)
const selectedDeleteId = ref(null)
const search = ref(null)
const filter = ref('country')
const filteredList = ref([])
const selectedAction = ref(null)
const selectedPageSize = ref(10)
const page = ref(1)
const pageCount = ref(0)
const totalCount = ref(0)
const selected = ref([])
const locationType = ref('countries')

const selectedLocation = reactive({
  id: null,
  title: '',
  localTitle: '',
  code: '',
  parentId: 0,
  parentTitle: '',
  latitude: 0,
  longitude: 0,
})

const allActions = [
  { label: 'Delete All', value: 'deleteAll' },
]

const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const fetchLocations = async () => {
  tableLoading.value = true
  try {
    const response = await useApiService.get(`/api/v2/admin/locations/${locationType.value}`, {
      'PagingDto.PageFilter.Size': selectedPageSize.value,
      'PagingDto.PageFilter.Skip': (page.value - 1) * selectedPageSize.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    })
    list.value = response.data.list
    filteredList.value = list.value
    totalCount.value = response.data.totalRecordsCount
    pageCount.value = Math.ceil(totalCount.value / selectedPageSize.value)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    tableLoading.value = false
  }
}

const viewLocationDetails = async (id) => {
  try {
    const response = await useApiService.get(`/api/v2/admin/locations/${locationType.value}/${id}`)

    selectedLocation.id = response.data.id
    selectedLocation.title = response.data.title
    selectedLocation.localTitle = response.data.localTitle
    selectedLocation.code = response.data.code
    selectedLocation.parentId = response.data.parentId
    selectedLocation.parentTitle = response.data.parentTitle
    selectedLocation.latitude = response.data.latitude
    selectedLocation.longitude = response.data.longitude
    showEditLocationDialog.value = true
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}

const deleteLocation = async () => {
  try {
    await useApiService.remove(`/api/v2/admin/locations/${locationType.value}/${selectedDeleteId.value}`)

    list.value = list.value.filter(i => i.id !== selectedDeleteId.value)
    filteredList.value = list.value
    $toast.success('Location deleted successfully!')
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    isDeleteModalOpen.value = false
    fetchLocations()
  }
}

const handleDelete = (id) => {
  isDeleteModalOpen.value = true
  selectedDeleteId.value = id
}

const doAll = async () => {
  if (selectedAction.value === 'Delete All') {
    for (const item of selected.value) {
      selectedDeleteId.value = item
      await deleteLocation()
    }

    selected.value = []
    $toast.success('All selected Locations are deleted Succesfully')
  }
}

onMounted(() => {
  selectedAction.value = allActions[0].label
  selectedPageSize.value = allPageSize[0].value
})

watch(page, () => {
  fetchLocations()
})

watch(selectedPageSize, () => {
  page.value = 1
  fetchLocations()
})

watch(filter, (val) => {
  if (val === 'country') {
    locationType.value = 'countries'
    page.value = 1
    fetchLocations()
  }
  else if (val === 'state') {
    locationType.value = 'states'
    page.value = 1
    fetchLocations()
  }
  else {
    locationType.value = 'cities'
    page.value = 1
    fetchLocations()
  }
}, { immediate: true })

watch(search, (val) => {
  if (!val) {
    filteredList.value = list.value
  }
  else {
    const term = val.toString().toLowerCase()
    filteredList.value = list.value.filter(item =>
      item.title?.toLowerCase().includes(term)
      || item.code?.toString().toLowerCase().includes(term),
    )
  }
})
</script>

<template>
  <div>
    <div class="d-flex flex-column justify-space-between align-center ga-2 mb-1 flex-md-row">
      <div class="d-flex flex-column flex-sm-row align center ga-2 align-center">
        <div class="filterBtns mb-0">
          <v-btn
            :class="{ 'active-filter': filter === 'country', 'inactive-filter': filter !== 'country' }"
            depressed
            rounded
            variant="plain"
            class="gtext-t4 font-weight-medium"
            @click="filter = 'country'"
          >
            Countries
          </v-btn>
          <v-btn
            :class="{ 'active-filter': filter === 'state', 'inactive-filter': filter !== 'state' }"
            depressed
            rounded
            variant="plain"
            class="gtext-t4 font-weight-medium"
            @click="filter = 'state'"
          >
            States
          </v-btn>

          <v-btn
            :class="{ 'active-filter': filter === 'city', 'inactive-filter': filter !== 'city' }"
            depressed
            class="ml-2 gtext-t4 font-weight-medium"
            rounded
            variant="plain"
            @click="filter = 'city'"
          >
            Cities
          </v-btn>
        </div>
        <v-btn
          depressed
          rounded
          variant="tonal"
          class="gtext-t5 font-weight-medium bg-primary-success-500 text-white max-width-fit"
          @click="showAddLocationDialog = true"
        >
          <v-icon class="mr-1">
            mdi mdi-plus-circle
          </v-icon>
          New {{ filter }}
        </v-btn>
      </div>
      <v-text-field
        v-model="search"
        label="Search anything..."
        variant="outlined"
        density="compact"
        rounded
        hide-details
        class="searchInput"
      >
        <template #prepend-inner>
          <span class="primary-gray-300"><v-icon>mdi-magnify </v-icon></span>
          <span class="primary-gray-300 ">|</span>
        </template>
      </v-text-field>
    </div>

    <div class="d-flex justify-end ga-2 align-center pr-2">
      <p class="primary-gray-500 gtext-t6 font-weight-bold">
        {{ totalCount }}
      </p>
      <p class="gray--text gtext-t6 font-weight-semibold">
        {{ filter }}
      </p>
    </div>
    <div class="scrollable-table">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="filteredList"
        :items-per-page="selectedPageSize"
        class="elevation-1"
        :loading="tableLoading"
        hide-default-footer
        show-select
      >
        <template #[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-btn
              variant="plain"
              class="px-0 min-width-10"
            >
              <v-icon
                small
                class="mr-2 gtext-t1"
                @click="viewLocationDetails(item.id)"
              >
                mdi mdi-file-edit
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Edit
              </v-tooltip>
            </v-btn>
            <v-btn
              variant="plain"
              class="px-0 min-width-10"
            >
              <v-icon
                small
                class="gtext-t1"
                @click="handleDelete(item.id)"
              >
                mdi-delete
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Delete
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <DeleteItemModal
        v-model="isDeleteModalOpen"
        @confirm="deleteLocation"
      />

      <addLocation
        v-model="showAddLocationDialog"
        :location="filter"
        :location-type="locationType"
        @fetch-locations="fetchLocations"
      />
      <editLocation
        :id="selectedId"
        v-model="showEditLocationDialog"
        :location-type="locationType"
        :location="selectedLocation"
        @fetch-locations="fetchLocations"
      />
    </div>

    <v-row
      class="mt-2"
      align="center"
      justify="space-between"
      no-gutters
    >
      <v-col
        cols="12"
        class="d-flex flex-wrap flex-sm-nowrap align-center justify-space-between"
      >
        <div class="d-flex align-center mb-2 mb-sm-0">
          <v-select
            v-model="selectedAction"
            :items="allActions"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            rounded
            hide-details
            class="rounded-pill footerBtns"
            :disabled="selected.length === 0"
          />
          <v-btn
            class="rounded-pill gtext-t5 bg-primary-gray-700 text-white ml-4"
            :disabled="selected.length === 0"
            @click="doAll"
          >
            <span>Do</span>
          </v-btn>
        </div>

        <!-- Pagination (hidden on mobile here) -->
        <div class="d-none d-sm-flex">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="5"
            class="custom-pagination"
            next-icon="mdi-arrow-right"
            prev-icon="mdi-arrow-left"
          />
        </div>

        <div class="mb-2 mb-sm-0">
          <v-select
            v-model="selectedPageSize"
            :items="allPageSize"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            rounded
            hide-details
            class="rounded-pill footerBtns"
          />
        </div>
      </v-col>

      <!-- Pagination (visible only on xs, second row) -->
      <v-col
        cols="12"
        class="d-flex justify-center d-sm-none mt-2"
      >
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="5"
          class="custom-pagination"
          next-icon="mdi-arrow-right"
          prev-icon="mdi-arrow-left"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.scrollable-table {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.searchInput{
  min-width: 270px !important;
  max-width: 360px;
}

:deep(.v-field__outline){
    --v-field-border-width: 1px !important;
    --v-field-border-opacity: 0.38 !important;
}

:deep(.v-data-table__th){
    color: #344054 !important;
    font-family: Inter, sans-serif !important;
    font-size: 1.4rem !important;
    line-height: 2.4rem !important;
    font-weight: 500;
    white-space: nowrap;
}

:deep(.v-table__wrapper > table > thead > tr){
  background-color: #F2F4F7 !important;
}

.filterBtns{
    display: flex;
    padding: 4px;
    background-color: #0000001A;
    border-radius: 28px;
    align-items: center;
}

.footerBtns{
  width: 150px !important;
  max-width: 150px !important;
}

.v-pagination > li > button {
  margin: 0.1rem !important;
}

.custom-pagination {
  width: 100% !important;
  justify-content: center !important;
}
:deep(.custom-pagination li),:deep(.custom-pagination li button){
  min-width: 36px !important;
  width: 36px !important;
  height: 36px !important;
}
:deep(.custom-pagination li button:hover){
  background-color: #ffb300;
  opacity: 0.7;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background: #ffb300 !important;
}

:deep(.v-data-table td) {
  cursor: default !important;
}

.active-filter {
  background-color: #FFB600 !important;
  color: #101828 !important;
}

.inactive-filter {
  color: #667085 !important;
}

:deep(.v-btn--variant-plain){
  opacity: 1 !important;
}

.max-width-fit{
    max-width: fit-content !important;
}
.min-width-10{
  min-width: 10px !important;
  height: 20px !important;
}
</style>
