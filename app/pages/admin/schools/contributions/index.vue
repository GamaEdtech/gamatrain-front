<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start position-relative flex-wrap ga-2">
        <div class="btn-filter-container d-none d-md-flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill">
          <v-btn
            v-for="status in statusList"
            :key="status"
            rounded="pill"
            :color="status == statusSelect ? `primary`:`transparent`"
            flat
            height="40"
            @click="changeFilterStatus(status)"
          >
            <span :class="`${status == statusSelect ? `text-grey900`:`text-grey500`} font-weight-bold text-h5`">{{ status }}</span>
          </v-btn>
        </div>

        <div class="filter-mobile-container d-flex d-md-none align-center justify-center">
          <common-gombo-box
            v-model="statusSelect"
            label="Status"
            :items="statusList.map((item) => ({
              id: item,
              title: item,
            }))"
            @update:model-value="changeFilterStatus"
          />
        </div>

        <v-menu
          transition="slide-x-transition"
          offset-y
          :close-on-content-click="false"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="primary"
              rounded="xl"
              height="40"
              width="120"
              class="text-h5"
              flat
              variant="outlined"
            >
              Sort
            </v-btn>
          </template>
          <v-list
            density="compact"
            min-width="250"
            nav
            bg-color="#f9fafb"
            class="rounded-lg mt-1"
          >
            <v-list-item
              v-for="sortItem in sortList"
              :key="sortItem.value"
            >
              <v-checkbox
                :model-value="sortSelected.includes(sortItem.value)"
                color="primary"
                class="text-h4"
                hide-details
                false-icon="md:check_box_outline_blank"
                true-icon="md:check_box"
                @click.stop
                @update:model-value="
                  (val) => handleCheckboxChange(val, sortItem)
                "
              >
                <template #label>
                  <span class="text-h5 font-weight-medium ml-2">{{
                    sortItem.title
                  }}</span>
                </template>
              </v-checkbox>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="list || []"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loadingGetData"
      item-label="Schools"
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
          :loading="loadingGetData"
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

    <admin-common-modal
      v-model:show-dialog="showDetailModal"
      title="Detail"
    >
      <admin-schools-contributions-detail-modal
        :contribution-id="selectedSchool?.id"
        :identifier-id="selectedSchool?.identifierId"
        @change-status-successfull="changeStatusSuccessfull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminSchoolContributionBriefDTO,
  DataTableHeader,
  SchoolContributionStatus,
} from '@/types'

interface SortOption {
  title: string
  value: string
}

definePageMeta({
  layout: 'admin',
  auth: true,
})

const { data: list, loadingGetData, totalCount, pageCount, getData } = useSchoolContributionAdmin()

const headers: DataTableHeader<AdminSchoolContributionBriefDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw', align: 'start' },
  { title: 'User', key: 'creationUser', sortable: false, width: '15vw', emptyText: 'unknown' },
  {
    title: 'Identifier Id',
    key: 'identifierId',
    sortable: false,
    width: '10vw',
  },
  { title: 'Created At', key: 'creationDate', sortable: false, width: '20vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm:ss' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getChipColor: (item: AdminSchoolContributionBriefDTO) => getColorBadgeStatus(item.status),
  },
  {
    title: 'Comment',
    key: 'comment',
    sortable: false,
    width: '20vw',
    emptyText: '',
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
    type: 'actions',
    actions: [
      { icon: 'md:plagiarism', tooltip: 'Details', onClick: (item: AdminSchoolContributionBriefDTO) => openDetaiModal(item) },
      {
        icon: 'md:arrow_circle_right',
        tooltip: 'School Page',
        to: (item: AdminSchoolContributionBriefDTO) => `/school/${item.identifierId}`,
        disabled: (item: AdminSchoolContributionBriefDTO) => !item.identifierId,
      },
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
const statusSelect = ref('All')
const statusList = ['All', 'Draft', 'Review', 'Confirmed', 'Rejected', 'Deleted']

const sortSelected = ref<string[]>([])
const sortList = [
  {
    value: 'creationDate',
    title: 'Creation Date',
  },
]

const showDetailModal = ref(false)
const selectedSchool = ref<AdminSchoolContributionBriefDTO | null>(null)

const fetchContributions = async () => {
  await getData({ page: page.value, pageSize: pageSize.value, status: statusSelect.value, sort: sortSelected.value })
}

const changeFilterStatus = async (status: string | number) => {
  if (status == '') {
    statusSelect.value = 'All'
  }
  else {
    statusSelect.value = status as string
  }
  page.value = 1
  await fetchContributions()
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchContributions()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchContributions()
}

onMounted(async () => {
  await fetchContributions()
})

const getColorBadgeStatus = (status: SchoolContributionStatus) => {
  switch (status) {
    case 'Confirmed':
      return 'success'
    case 'Draft':
      return 'info'
    case 'Review':
      return 'warning'
    case 'Rejected':
      return 'error'
    case 'Deleted':
      return 'error'

    default:
      return 'warning'
  }
}

const handleCheckboxChange = async (checked: boolean | null, item: SortOption) => {
  const index = sortSelected.value.indexOf(item.value)
  if (checked && index === -1) {
    sortSelected.value.push(item.value)
  }
  else if (!checked && index !== -1) {
    sortSelected.value.splice(index, 1)
  }
  page.value = 1
  await fetchContributions()
}

const openDetaiModal = async (school: AdminSchoolContributionBriefDTO) => {
  showDetailModal.value = true
  selectedSchool.value = school
}

const changeStatusSuccessfull = async () => {
  showDetailModal.value = false
  selectedSchool.value = null
  page.value = 1
  await fetchContributions()
}

const refreshData = async () => {
  await fetchContributions()
}
</script>

<style scoped>
.btn-filter-container{
  height : 48px;
}
.filter-mobile-container{
  width: 170px;
}
</style>
