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
      </div>
    </div>

    <common-data-table
      title="Usage Aggregate"
      item-label="Features"
      :headers="aggregateHeaders"
      :items="usageAggregateList"
      :page-size="usageAggregateList.length || 1"
      :total-count="usageAggregateList.length"
      :loading="loadingGetUsageAggregateData"
      :show-pagination="false"
      max-height="36vh"
      class="mt-4"
    />

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      title="Usage Events"
      item-label="Events"
      :headers="usageHeaders"
      :items="usageList"
      :page-count="usagePageCount"
      :total-count="usageTotalCount"
      :page-size-options="allPageSize"
      :loading="loadingGetUsageData"
      max-height="48vh"
      class="mt-8"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    >
      <template #actions>
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
      </template>
    </common-data-table>

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
  AdminSubscriptionUsageAggregateDTO,
  AdminSubscriptionUsageDTO,
  DataTableHeader,
  GetAdminSubscriptionUsageAggregateParams,
  SearchFilterAdminSubscriptionUsage,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

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

const aggregateHeaders: DataTableHeader<AdminSubscriptionUsageAggregateDTO>[] = [
  { title: 'Feature Code', key: 'featureCode', sortable: false, width: '18vw' },
  { title: 'Feature Name', key: 'featureName', sortable: false, width: '34vw' },
  { title: 'Total Amount', key: 'totalAmount', sortable: false, width: '16vw', type: 'number' },
  { title: 'Events', key: 'eventCount', sortable: false, width: '16vw', type: 'number' },
  { title: 'Users', key: 'distinctUserCount', sortable: false, width: '16vw', type: 'number' },
]

const usageHeaders: DataTableHeader<AdminSubscriptionUsageDTO>[] = [
  { title: 'User ID', key: 'userId', sortable: false, width: '8vw' },
  { title: 'Email', key: 'userEmail', sortable: false, width: '18vw' },
  { title: 'Plan', key: 'planTitle', sortable: false, width: '16vw' },
  { title: 'Feature', key: 'featureCode', sortable: false, width: '12vw' },
  { title: 'Amount', key: 'amount', sortable: false, width: '8vw', type: 'number' },
  { title: 'Identifier ID', key: 'identifierId', sortable: false, width: '12vw' },
  {
    title: 'Creation Date',
    key: 'creationDate',
    sortable: false,
    width: '16vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm',
  },
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
  toDate: searchFilter.toDate ? dayjs(searchFilter.toDate).endOf('day').toISOString() : '',
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

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchUsageData()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
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
</style>
