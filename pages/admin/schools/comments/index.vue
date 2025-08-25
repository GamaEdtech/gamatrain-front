<script setup>
import commentCard from '~/components/admin/schools/comments/commentCard.vue'
import useApiService from '~/composables/useApiService'

definePageMeta({
  layout: 'admin',
  auth: true,
})

const { $toast } = useNuxtApp()

const list = ref([])
const headers = [
  { title: 'Contributer', key: 'creationUser', sortable: false, width: '15vw' },
  { title: 'Date', key: 'creationDate', sortable: false, width: '15vw' },
  { title: 'Status', key: 'confirmed', sortable: false, width: '10vw' },
  { title: 'Actions', key: 'actions', sortable: false, width: '5vw' },
]

const selectedComment = reactive({
  id: null,
  schoolName: null,
  schoolId: null,
  comment: null,
  artisticActivitiesRate: null,
  behaviorRate: null,
  classesQualityRate: null,
  educationRate: null,
  facilitiesRate: null,
  itTrainingRate: null,
  safetyAndHappinessRate: null,
  tuitionRatioRate: null,
  averageRate: null,
})

const tableLoading = ref(true)
const dialogVisible = ref(false)
const filter = ref('all')
const filteredList = ref([])
const selectedAction = ref(null)
const selectedPageSize = ref(10)
const page = ref(1)
const pageCount = ref(0)
const totalCount = ref(0)
const selected = ref([])

const allActions = [
  { label: 'Delete All', value: 'deleteAll' },
]

const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const fetchComments = async () => {
  tableLoading.value = true
  try {
    const response = await useApiService.get('/api/v2/admin/schools/comments/contributions', {
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

const viewMessageDetails = async (id) => {
  try {
    const response = await useApiService.get(`/api/v2/admin/schools/comments/contributions/${id}`)

    selectedComment.id = response.data.id
    selectedComment.schoolName = response.data.schoolName
    selectedComment.schoolId = response.data.schoolId
    selectedComment.comment = response.data.comment
    selectedComment.artisticActivitiesRate = response.data.artisticActivitiesRate
    selectedComment.behaviorRate = response.data.behaviorRate
    selectedComment.classesQualityRate = response.data.classesQualityRate
    selectedComment.educationRate = response.data.educationRate
    selectedComment.facilitiesRate = response.data.facilitiesRate
    selectedComment.itTrainingRate = response.data.itTrainingRate
    selectedComment.safetyAndHappinessRate = response.data.safetyAndHappinessRate
    selectedComment.tuitionRatioRate = response.data.tuitionRatioRate
    selectedComment.averageRate = response.data.averageRate

    dialogVisible.value = true
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}

onMounted(() => {
  selectedAction.value = allActions[0].label
  selectedPageSize.value = allPageSize[0].value
  fetchComments()
})

watch(page, () => {
  filter.value = 'all'
  fetchComments()
})

watch(selectedPageSize, () => {
  page.value = 1
  fetchComments()
})

watch(filter, (val) => {
  if (val === 'confirmed') {
    filteredList.value = list.value.filter(item => item.status == 'Confirmed')
  }
  else if (val === 'pending') {
    filteredList.value = list.value.filter(item => item.status == 'Review')
  }
  else if (val === 'deleted') {
    filteredList.value = list.value.filter(item => item.status == 'Deleted')
  }
  else {
    filteredList.value = list.value
  }
}, { immediate: true })
</script>

<template>
  <div>
    <div class="d-flex justify-end ga-2 align-center px-2 justify-space-between">
      <div class="filterBtns mb-4">
        <v-btn
          :class="{ 'active-filter': filter === 'all', 'inactive-filter': filter !== 'all' }"
          depressed
          rounded
          variant="plain"
          class="gtext-t4 font-weight-medium"
          @click="filter = 'all'"
        >
          All
        </v-btn>
        <v-btn
          :class="{ 'active-filter': filter === 'confirmed', 'inactive-filter': filter !== 'confirmed' }"
          depressed
          rounded
          variant="plain"
          class="gtext-t4 font-weight-medium"
          @click="filter = 'confirmed'"
        >
          Confirmed
        </v-btn>

        <v-btn
          :class="{ 'active-filter': filter === 'pending', 'inactive-filter': filter !== 'pending' }"
          depressed
          class="ml-2 gtext-t4 font-weight-medium"
          rounded
          variant="plain"
          @click="filter = 'pending'"
        >
          Pending
        </v-btn>
        <v-btn
          :class="{ 'active-filter': filter === 'deleted', 'inactive-filter': filter !== 'deleted' }"
          depressed
          class="ml-2 gtext-t4 font-weight-medium"
          rounded
          variant="plain"
          @click="filter = 'deleted'"
        >
          Rejected
        </v-btn>
      </div>
      <div class="d-flex ga-1">
        <p class="primary-gray-500 gtext-t6 font-weight-bold">
          {{ totalCount }}
        </p>
        <p class="gray--text gtext-t6 font-weight-semibold">
          Comments
        </p>
      </div>
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
      >
        <template #[`item.creationUser`]="{ item }">
          <div class="d-flex align-center">
            <span class="truncate-text">{{ item.creationUser }}</span>
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div class="d-flex align-center">
            <span class="truncate-text">{{ item.creationDate }}</span>
          </div>
        </template>

        <template #[`header.actions`]>
          <div class="d-flex justify-end pr-6">
            Actions
          </div>
        </template>

        <template #[`item.confirmed`]="{ item }">
          <span
            v-if="item.status == 'Confirmed'"
            class="gtext-t5 green-12b76a"
          >Confirmed</span>
          <span
            v-else
            class="gtext-t5 red-F04438"
          >Rejected</span>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-end pr-2">
            <v-btn
              variant="plain"
              class="px-0 min-width-10"
            >
              <v-icon
                small
                class="mr-2 gtext-t1"
                @click="viewMessageDetails(item.id)"
              >
                mdi-file-find
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Details
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <commentCard
        v-model="dialogVisible"
        :selected-comment="selectedComment"
        @fetch-comments="fetchComments"
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
        class="d-flex align-center position-relative"
      >
        <!-- Pagination (centered) -->
        <div class="d-none d-sm-flex pagination-center">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="5"
            class="custom-pagination"
            next-icon="mdi-arrow-right"
            prev-icon="mdi-arrow-left"
          />
        </div>

        <!-- Select (right aligned) -->
        <div class="ml-auto">
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

      <!-- Pagination (visible only on xs) -->
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
  position: relative;
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

.truncate-text {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Vuetify 3 uses a wrapper div inside the table */
:deep(.v-data-table thead) {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #F2F4F7 !important; /* Your desired header color */
}

/* Optional: give each header cell a background too */
:deep(.v-data-table thead th) {
  background-color: #F2F4F7 !important;
}

.red-F04438{
  color: #F04438;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1px solid #F04438;
}
.green-12b76a{
  color: #12b76a;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1px solid #12b76a;
}

.min-width-10{
  min-width: 10px !important;
  height: 20px !important;
}
.pagination-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
