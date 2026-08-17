<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start">
        <v-btn
          v-if="isShowClearFilter"
          color="primary"
          rounded="xl"
          height="40"
          width="120"
          class="text-h5"
          flat
          variant="outlined"
          @click="clearFilter"
        >
          Clear Filter
        </v-btn>
      </div>

      <div class="d-flex align-center justify-end ga-1 flex-wrap">
        <v-btn
          variant="plain"
          max-width="20"
          @click="showSearchModal = true"
        >
          <v-icon
            size="26"
            color="grey500"
          >
            md:search
          </v-icon>
        </v-btn>

        <v-btn
          size="small"
          flat
          icon
          color="info"
          :loading="isLoading"
          class="mr-1"
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
      </div>
    </div>

    <div class="w-100 d-flex flex-column mt-4">
      <div class="w-100 d-flex align-center justify-space-between mb-2">
        <span class="text-h4 text-grey700 font-weight-bold">
          Usage Aggregate
        </span>
        <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold">
          <span class="text-grey500 font-weight-bold mr-1">
            {{ usageAggregateList.length }}
          </span>
          Features
        </span>
      </div>

      <v-data-table
        :headers="aggregateHeaders"
        :items="usageAggregateList"
        :items-per-page="usageAggregateList.length || 1"
        class="elevation-1 aggregate-table"
        :loading="loadingGetUsageAggregateData"
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

        <template #[`item.featureCode`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.featureCode }}
          </div>
        </template>

        <template #[`item.featureName`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.featureName }}
          </div>
        </template>

        <template #[`item.totalAmount`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.totalAmount }}
          </div>
        </template>

        <template #[`item.eventCount`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.eventCount }}
          </div>
        </template>

        <template #[`item.distinctUserCount`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.distinctUserCount }}
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex flex-column mt-8">
      <div class="w-100 d-flex align-center justify-space-between mb-2">
        <span class="text-h4 text-grey700 font-weight-bold">
          Usage Events
        </span>
        <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold">
          <span class="text-grey500 font-weight-bold mr-1">
            {{ usageTotalCount }}
          </span>
          Events
        </span>
      </div>

      <v-data-table
        :headers="usageHeaders"
        :items="usageList"
        :items-per-page="pageSize"
        class="elevation-1 set-height-table"
        :loading="loadingGetUsageData"
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

        <template #[`item.userId`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.userId }}
          </div>
        </template>

        <template #[`item.userEmail`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.userEmail }}
          </div>
        </template>

        <template #[`item.planTitle`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.planTitle }}
          </div>
        </template>

        <template #[`item.featureCode`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.featureCode }}
          </div>
        </template>

        <template #[`item.amount`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.amount }}
          </div>
        </template>

        <template #[`item.identifierId`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.identifierId }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold">
            {{ formatLocal(item.creationDate, 'DD/MM/YYYY HH:mm') }}
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4">
        <v-pagination
          v-model="page"
          :length="usagePageCount"
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
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-subscription-usage-modal-search
        :data="searchFilter"
        :loading="isLoading"
        @search="startSearch"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type {
  GetAdminSubscriptionUsageAggregateParams,
  SearchFilterAdminSubscriptionUsage,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { formatLocal } = useDateTime()
const {
  usageData: usageList,
  usageTotalCount,
  usagePageCount,
  loadingGetUsageData,
  getUsageData,
  usageAggregateData: usageAggregateList,
  loadingGetUsageAggregateData,
  getUsageAggregateData,
} = useUserSubscriptionAdmin()

const aggregateHeaders = [
  { title: 'Feature Code', key: 'featureCode', sortable: false, width: '18vw' },
  { title: 'Feature Name', key: 'featureName', sortable: false, width: '34vw' },
  { title: 'Total Amount', key: 'totalAmount', sortable: false, width: '16vw' },
  { title: 'Events', key: 'eventCount', sortable: false, width: '16vw' },
  { title: 'Users', key: 'distinctUserCount', sortable: false, width: '16vw' },
]

const usageHeaders = [
  { title: 'User ID', key: 'userId', sortable: false, width: '8vw' },
  { title: 'Email', key: 'userEmail', sortable: false, width: '18vw' },
  { title: 'Plan', key: 'planTitle', sortable: false, width: '16vw' },
  { title: 'Feature', key: 'featureCode', sortable: false, width: '12vw' },
  { title: 'Amount', key: 'amount', sortable: false, width: '8vw' },
  { title: 'Identifier ID', key: 'identifierId', sortable: false, width: '12vw' },
  { title: 'Creation Date', key: 'creationDate', sortable: false, width: '16vw' },
]

const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const showSearchModal = ref(false)
const getDefaultFromDate = () => dayjs().startOf('month').format('YYYY-MM-DD')
const getDefaultToDate = () => dayjs().format('YYYY-MM-DD')
const searchFilter = reactive<SearchFilterAdminSubscriptionUsage>({
  userId: '',
  featureCode: '',
  identifierId: '',
  fromDate: getDefaultFromDate(),
  toDate: getDefaultToDate(),
})

const isLoading = computed(() => {
  return loadingGetUsageData.value || loadingGetUsageAggregateData.value
})

const usageQueryDates = computed(() => ({
  fromDate: searchFilter.fromDate ? dayjs(searchFilter.fromDate).toISOString() : '',
  toDate: searchFilter.toDate ? dayjs(searchFilter.toDate).toISOString() : '',
}))

const fetchUsageData = async () => {
  await getUsageData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchFilter,
    ...usageQueryDates.value,
  })
}

const fetchUsageAggregateData = async () => {
  const aggregateParams: GetAdminSubscriptionUsageAggregateParams = {
    userId: searchFilter.userId,
    fromDate: usageQueryDates.value.fromDate,
    toDate: usageQueryDates.value.toDate,
  }

  await getUsageAggregateData(aggregateParams)
}

const fetchData = async () => {
  await Promise.all([
    fetchUsageAggregateData(),
    fetchUsageData(),
  ])
}

const changePageNumber = async () => {
  await fetchUsageData()
}

const changePageSize = async () => {
  page.value = 1
  await fetchUsageData()
}

onMounted(async () => {
  await fetchData()
})

const startSearch = async (item: SearchFilterAdminSubscriptionUsage) => {
  searchFilter.userId = item.userId
  searchFilter.featureCode = item.featureCode
  searchFilter.identifierId = item.identifierId
  searchFilter.fromDate = item.fromDate
  searchFilter.toDate = item.toDate
  page.value = 1
  showSearchModal.value = false
  await fetchData()
}

const isShowClearFilter = computed(() => {
  return (
    searchFilter.userId.length > 0
    || searchFilter.featureCode.length > 0
    || searchFilter.identifierId.length > 0
    || searchFilter.fromDate !== getDefaultFromDate()
    || searchFilter.toDate !== getDefaultToDate()
  )
})

const clearFilter = async () => {
  searchFilter.userId = ''
  searchFilter.featureCode = ''
  searchFilter.identifierId = ''
  searchFilter.fromDate = getDefaultFromDate()
  searchFilter.toDate = getDefaultToDate()
  page.value = 1
  await fetchData()
}

const refreshData = async () => {
  await fetchData()
}
</script>

<style scoped>
.aggregate-table {
  max-height: 36vh;
}
.set-height-table {
  max-height: 48vh;
}
.th-min-width {
  min-width: 130px;
}
.select-size-div {
  top: 18px;
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
