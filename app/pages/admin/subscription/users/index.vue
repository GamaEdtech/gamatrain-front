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
          User Subscriptions
        </span>
      </div>
    </div>

    <div class="w-100 mt-4">
      <v-data-table
        :headers="headers"
        :items="list"
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

        <template #[`item.status`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              :color="getStatusColor(item.status)"
              class="font-weight-bold text-h5"
            >
              {{ item.status }}
            </v-chip>
          </div>
        </template>

        <template #[`item.expirationDate`]="{ item }">
          <div class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold">
            {{ formatLocal(item.expirationDate, 'DD/MM/YYYY HH:mm') }}
          </div>
        </template>

        <template #[`item.autoRenews`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              :color="item.autoRenews ? `success` : `grey400`"
              class="font-weight-bold text-h5"
            >
              {{ item.autoRenews ? `Yes` : `No` }}
            </v-chip>
          </div>
        </template>

        <template #[`item.gateway`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.gateway }}
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div class="d-flex justify-center align-center ga-1">
            <v-btn
              icon
              flat
              @click="openDetailModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:visibility
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Detail
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              @click="openGrantModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:add_card
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Grant
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              @click="openRevokeModal(item)"
            >
              <v-icon
                size="20"
                color="error"
              >
                md:block
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Revoke now
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              @click="openExtendModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:more_time
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Extend
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              @click="openHistoryModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:history
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                History
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
  </div>
</template>

<script setup lang="ts">
import type {
  AdminUserSubscriptionListDTO,
  SearchFilterAdminUserSubscription,
  UserSubscriptionStatus,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { formatLocal } = useDateTime()
const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
} = useUserSubscriptionAdmin()

const headers = [
  { title: 'User ID', key: 'userId', sortable: false, width: '8vw' },
  { title: 'Email', key: 'userEmail', sortable: false, width: '20vw' },
  { title: 'Plan', key: 'planTitle', sortable: false, width: '18vw' },
  { title: 'Status', key: 'status', sortable: false, width: '10vw' },
  { title: 'Expiration', key: 'expirationDate', sortable: false, width: '14vw' },
  { title: 'Auto Renews', key: 'autoRenews', sortable: false, width: '10vw' },
  { title: 'Gateway', key: 'gateway', sortable: false, width: '10vw' },
  { title: 'Action', key: 'Action', sortable: false, width: '16vw' },
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

const changePageNumber = async () => {
  await fetchUserSubscriptions()
}

const changePageSize = async () => {
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

const openExtendModal = (item: AdminUserSubscriptionListDTO) => {
  selectSubscription(item)
  showExtendModal.value = true
}

const openHistoryModal = (item: AdminUserSubscriptionListDTO) => {
  selectSubscription(item)
  showHistoryModal.value = true
}

const refreshData = async () => {
  await fetchUserSubscriptions()
}

const getStatusColor = (status: UserSubscriptionStatus) => {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Expired':
      return 'grey400'
    case 'Cancelled':
      return 'error'

    default:
      return 'warning'
  }
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
