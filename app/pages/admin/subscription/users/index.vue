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
      item-label="User Subscriptions"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    >
      <template #actions>
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

    <admin-common-modal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-subscription-users-modal-search
        :data="searchFilter"
        :loading="loading"
        @search="startSearch"
      />
    </admin-common-modal>

    <admin-common-modal
      v-if="showDetailModal && selectedSubscription"
      v-model:show-dialog="showDetailModal"
      title="Detail"
    >
      <admin-subscription-users-modal-detail :id="selectedSubscription.id" />
    </admin-common-modal>

    <admin-common-modal
      v-if="showGrantModal && selectedSubscription"
      v-model:show-dialog="showGrantModal"
      title="Grant Subscription"
    >
      <admin-subscription-users-modal-grant
        :subscription="selectedSubscription"
        @grant-success-full="grantSuccessFull"
      />
    </admin-common-modal>

    <admin-common-confirm-modal
      v-model="showRevokeModal"
      text="Revoke this subscription now? This will cancel access immediately and will not wait until the end of the billing period."
      :loading="loadingRevokeItem"
      @confirm="confirmRevoke"
    />

    <admin-common-modal
      v-if="showExtendModal && selectedSubscription"
      v-model:show-dialog="showExtendModal"
      title="Extend Subscription"
    >
      <admin-subscription-users-modal-extend
        :subscription="selectedSubscription"
        @extend-success-full="extendSuccessFull"
      />
    </admin-common-modal>

    <admin-common-modal
      v-if="showHistoryModal && selectedSubscription"
      v-model:show-dialog="showHistoryModal"
      title="History"
      :max-width="900"
    >
      <admin-subscription-users-modal-history :user-id="selectedSubscription.userId" />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminUserSubscriptionListDTO,
  DataTableHeader,
  SearchFilterAdminUserSubscription,
  UserSubscriptionStatus,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  revokeItem,
  loadingRevokeItem,
} = useUserSubscriptionAdmin()

const headers: DataTableHeader<AdminUserSubscriptionListDTO>[] = [
  { title: 'User ID', key: 'userId', sortable: false, width: '8vw' },
  { title: 'Email', key: 'userEmail', sortable: false, width: '20vw' },
  { title: 'Plan', key: 'planTitle', sortable: false, width: '18vw' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getChipColor: (item: AdminUserSubscriptionListDTO) => getStatusColor(item.status),
  },
  {
    title: 'Expiration',
    key: 'expirationDate',
    sortable: false,
    width: '14vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm',
  },
  {
    title: 'Auto Renews',
    key: 'autoRenews',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getText: (item: AdminUserSubscriptionListDTO) => item.autoRenews ? 'Yes' : 'No',
    getChipColor: (item: AdminUserSubscriptionListDTO) => item.autoRenews ? 'success' : 'grey400',
  },
  { title: 'Gateway', key: 'gateway', sortable: false, width: '10vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '16vw',
    type: 'actions',
    actions: [
      { icon: 'md:visibility', tooltip: 'Detail', onClick: (item: AdminUserSubscriptionListDTO) => openDetailModal(item) },
      { icon: 'md:add_card', tooltip: 'Grant', onClick: (item: AdminUserSubscriptionListDTO) => openGrantModal(item) },
      { icon: 'md:block', tooltip: 'Revoke now', color: 'error', onClick: (item: AdminUserSubscriptionListDTO) => openRevokeModal(item) },
      { icon: 'md:more_time', tooltip: 'Extend', onClick: (item: AdminUserSubscriptionListDTO) => openExtendModal(item) },
      { icon: 'md:history', tooltip: 'History', onClick: (item: AdminUserSubscriptionListDTO) => openHistoryModal(item) },
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

const showSearchModal = ref(false)
const searchFilter = reactive<SearchFilterAdminUserSubscription>({
  userId: '',
  status: '',
})

const showDetailModal = ref(false)
const showGrantModal = ref(false)
const showRevokeModal = ref(false)
const showExtendModal = ref(false)
const showHistoryModal = ref(false)
const selectedSubscription = ref<AdminUserSubscriptionListDTO | null>(null)

const fetchUserSubscriptions = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchFilter,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchUserSubscriptions()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchUserSubscriptions()
}

onMounted(async () => {
  await fetchUserSubscriptions()
})

const startSearch = async (item: SearchFilterAdminUserSubscription) => {
  searchFilter.userId = item.userId
  searchFilter.status = item.status
  page.value = 1
  showSearchModal.value = false
  await fetchUserSubscriptions()
}

const isShowClearFilter = computed(() => {
  return searchFilter.userId.length > 0 || searchFilter.status.length > 0
})

const clearFilter = async () => {
  searchFilter.userId = ''
  searchFilter.status = ''
  page.value = 1
  await fetchUserSubscriptions()
}

const selectSubscription = (item: AdminUserSubscriptionListDTO) => {
  selectedSubscription.value = item
}

const openDetailModal = (item: AdminUserSubscriptionListDTO) => {
  selectSubscription(item)
  showDetailModal.value = true
}

const openGrantModal = (item: AdminUserSubscriptionListDTO) => {
  selectSubscription(item)
  showGrantModal.value = true
}

const grantSuccessFull = async () => {
  showGrantModal.value = false
  await fetchUserSubscriptions()
}

const openRevokeModal = (item: AdminUserSubscriptionListDTO) => {
  selectSubscription(item)
  showRevokeModal.value = true
}

const confirmRevoke = async () => {
  if (!selectedSubscription.value) return

  const response = await revokeItem(selectedSubscription.value.id)

  if (response.succeeded) {
    showRevokeModal.value = false
    selectedSubscription.value = null
    await fetchUserSubscriptions()
  }
}

const openExtendModal = (item: AdminUserSubscriptionListDTO) => {
  selectSubscription(item)
  showExtendModal.value = true
}

const extendSuccessFull = async () => {
  showExtendModal.value = false
  await fetchUserSubscriptions()
}

const openHistoryModal = (item: AdminUserSubscriptionListDTO) => {
  selectSubscription(item)
  showHistoryModal.value = true
}

const refreshData = async () => {
  await fetchUserSubscriptions()
}

const getStatusColor = (status: UserSubscriptionStatus) => {
  return useSubscriptionStatusColor(status)
}
</script>

<style scoped>
</style>
