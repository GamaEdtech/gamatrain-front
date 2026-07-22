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
      <div class="d-flex align-center justify-end ga-1 flex-wrap">
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
        <span
          class="text-grey400 text-no-wrap text-h5 font-weight-semibold"
        >
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Schools
        </span>
      </div>
    </div>
    <div class="w-100 mt-4">
      <v-data-table
        :headers="headers"
        :items="list"
        :items-per-page="pageSize"
        class="elevation-1 set-height-table"
        :loading="loadingGetData"
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
          <div
            class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold"
          >
            {{ item.id }}
          </div>
        </template>

        <template #[`item.creationUser`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center"
          >
            {{ !item.creationUser ? `unknown` : item.creationUser }}
          </div>
        </template>
        <template #[`item.identifierId`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ item.identifierId }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold"
          >
            {{ formatLocal(item.creationDate, "DD/MM/YYYY HH:mm:ss") }}
          </div>
        </template>

        <template #[`item.status`]="{ item }">
          <div
            class="w-100 d-flex justify-center align-center"
          >
            <v-chip
              :color="getColorBadgeStatus(item.status)"
              class="font-weight-bold text-h5"
            >
              {{ item.status }}
            </v-chip>
          </div>
        </template>

        <template #[`item.comment`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold"
          >
            {{ item.comment ? item.comment :'' }}
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div
            class="d-flex justify-center align-center"
          >
            <v-btn
              icon
              flat
              size="small"
              @click="openDetaiModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:plagiarism
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Details
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              variant="text"
              size="small"
              :disabled="!item.identifierId"
              :to="`/school/${item.identifierId}`"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:arrow_circle_right
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                School Page
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div
        class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4"
      >
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
const { formatLocal } = useDateTime()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw' },
  { title: 'User', key: 'creationUser', sortable: false, width: '15vw' },
  {
    title: 'Identifier Id',
    key: 'identifierId',
    sortable: false,
    width: '10vw',
  },
  { title: 'Created At', key: 'creationDate', sortable: false, width: '20vw' },
  { title: 'Status', key: 'status', sortable: false, width: '10vw' },
  {
    title: 'Comment',
    key: 'comment',
    sortable: false,
    width: '20vw',
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
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
const selectedSchool = ref()

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

const changePageNumber = async () => {
  await fetchContributions()
}

const changePageSize = async () => {
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
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.description-width {
  min-width: 200px;
}
.reverse-icon {
  transform: rotateZ(180deg);
}
.select-size-div {
  top: 18px;
}
.btn-filter-container{
  height : 48px;
}
.filter-mobile-container{
  width: 170px;
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
</style>
