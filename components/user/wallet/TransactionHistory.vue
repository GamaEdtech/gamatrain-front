<template>
  <div>
    <!-- Mobile View Transaction History -->
    <div class="transaction-history-section mt-8 d-block d-sm-none">
      <div class="d-flex justify-space-between align-center mb-2">
        <div class="text-h5 primary-gray-700 font-weight-bold pb-2">
          Transaction History
        </div>
        <v-btn
          icon
          class="chart-toggle-icon"
          :color="isChartVisible ? 'primary' : ''"
          @click="toggleChart"
        >
          <v-icon>mdi-chart-line-variant</v-icon>
        </v-btn>
      </div>

      <div class="transaction-tabs-wrapper mb-4">
        <div class="d-flex align-center justify-space-between">
          <v-tabs
            v-model="activeTab"
            grow
            background-color="transparent"
            slider-color="amber"
          >
            <v-tab class="text-subtitle-2">
              All
            </v-tab>
            <v-tab class="text-subtitle-2">
              Earned
            </v-tab>
            <v-tab class="text-subtitle-2">
              Spent
            </v-tab>
          </v-tabs>
          <v-icon class="ml-1">
            mdi-tune-vertical
          </v-icon>
        </div>
      </div>

      <!-- Loading State for Mobile -->
      <div
        v-if="loading && mobileTransactions.length === 0"
        class="py-4"
      >
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          type="list-item-two-line"
          class="mb-3"
        />
      </div>

      <!-- Transactions List with Infinite Scroll -->
      <v-list
        v-else
        class="transaction-list pa-0"
        flat
      >
        <div
          ref="infiniteContainer"
          class="infinite-container"
          @scroll="handleScroll"
        >
          <v-list-item
            v-for="(transaction, i) in mobileTransactions"
            :key="i"
            class="transaction-item py-3"
          >
            <template #prepend>
              <div class="d-flex flex-column">
                <div class="transaction-name mb-1">
                  {{ transaction.description }}
                </div>
                <div class="d-flex align-center">
                  <div
                    v-if="transaction.isDebit"
                    class=""
                  >
                    <div class="state-icon-wrapper spent">
                      <span class="state-icon spent align-center">
                        <v-icon
                          color="red"
                          size="18"
                        >mdi-tray-arrow-up</v-icon>
                      </span>
                      <span class="state-text spent ml-2">Spent</span>
                    </div>
                  </div>
                  <div
                    v-else
                    class=""
                  >
                    <div class="state-icon-wrapper earned">
                      <span class="state-icon earned align-center">
                        <v-icon
                          color="green"
                          size="18"
                        >mdi-tray-arrow-down</v-icon>
                      </span>
                      <span class="state-text earned ml-2">Earned</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template #append>
              <div class="d-flex flex-column align-end">
                <div class="transaction-amount mb-1">
                  <span class="font-weight-medium">{{
                    transaction.points
                  }}</span>
                  <span class="ml-1 caption grey--text">$GET</span>
                </div>
                <div class="d-flex align-center">
                  <v-icon
                    x-small
                    class="mr-1 grey--text text--lighten-1"
                  >
                    mdi-clock-outline
                  </v-icon>
                  <span class="caption grey--text text--darken-1">{{
                    transaction.creationDate
                  }}</span>
                </div>
              </div>
            </template>
          </v-list-item>

          <!-- Loading More Indicator for Mobile -->
          <div
            v-if="loadingMore"
            class="pa-4 text-center"
          >
            <v-progress-circular
              indeterminate
              color="primary"
              size="24"
            />
          </div>

          <!-- End of List Message -->
          <div
            v-if="!hasMoreItems && mobileTransactions.length > 0"
            class="pa-4 text-center"
          >
            <span class="caption grey--text">No more transactions</span>
          </div>

          <!-- Empty States for Different Tabs -->
          <div
            v-if="mobileTransactions.length === 0 && !loading"
            class="text-center py-8"
          >
            <template v-if="activeTab === 0">
              <v-icon
                size="64"
                color="grey lighten-2"
              >
                mdi-wallet-outline
              </v-icon>
              <p class="mt-4 grey--text">
                No transactions found
              </p>
            </template>
            <template v-if="activeTab === 1">
              <v-icon
                size="64"
                color="green lighten-4"
              >
                mdi-cash-plus
              </v-icon>
              <p class="mt-4 grey--text">
                No earned transactions yet
              </p>
            </template>
            <template v-if="activeTab === 2">
              <v-icon
                size="64"
                color="red lighten-4"
              >
                mdi-cash-minus
              </v-icon>
              <p class="mt-4 grey--text">
                No spent transactions yet
              </p>
            </template>
          </div>
        </div>
      </v-list>
    </div>

    <!-- Desktop View Transaction History -->
    <div
      class="mt-8 d-none d-sm-block"
      elevation="0"
    >
      <div class="text-h5 primary-gray-700 font-weight-bold pb-2">
        Transaction History
      </div>

      <div class="transaction-tabs mb-4">
        <v-tabs
          v-model="activeTab"
          background-color="transparent"
          color="primary"
        >
          <v-tab class="font-weight-regular">
            All
          </v-tab>
          <v-tab class="font-weight-regular">
            Earned
          </v-tab>
          <v-tab class="font-weight-regular">
            Spent
          </v-tab>
        </v-tabs>
      </div>

      <div class="data-table-wrapper">
        <v-data-table-server
          v-model:items-per-page="pageSize"
          :headers="headers"
          :items="transactions"
          :items-length="totalRecords"
          :loading="loading"
          @update:options="loadDesktopTransactions"
        >
          <template #[`item.description`]="{ item }">
            {{ item.description }}
          </template>

          <template #[`item.points`]="{ item }">
            <div class="d-flex align-center">
              <span class="font-weight-bold">{{ item.points }}</span>
              <span class="ml-1 caption grey--text">$GET</span>
            </div>
          </template>

          <template #[`item.isDebit`]="{ item }">
            <div class="d-flex align-center">
              <div v-if="item.isDebit">
                <div class="state-icon-wrapper spent">
                  <span class="state-icon spent align-center">
                    <v-icon
                      color="red"
                      size="18"
                    >mdi-tray-arrow-up</v-icon>
                  </span>
                  <span class="state-text spent ml-2">Spent</span>
                </div>
              </div>
              <div v-else>
                <div class="state-icon-wrapper earned">
                  <span class="state-icon earned align-center">
                    <v-icon
                      color="green"
                      size="18"
                    >mdi-tray-arrow-down</v-icon>
                  </span>
                  <span class="state-text earned ml-2">Earned</span>
                </div>
              </div>
            </div>
          </template>

          <template #[`item.creationDate`]="{ item }">
            <div class="d-flex align-center">
              <v-icon
                small
                class="mr-1 primary-gray-300"
              >
                mdi-clock-outline
              </v-icon>
              <span class="primary-gray-500">{{ item.creationDate }}</span>
            </div>
          </template>
        </v-data-table-server>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApiService } from '~/composables/useApiService'

// Props
defineProps({
  isChartVisible: { type: Boolean, default: false },
})

// Emits
const emit = defineEmits(['toggle-chart'])

// Composables
const auth = useAuth()

// --- Unified Reactive State ---
const activeTab = ref(0)
const token = ref('')
const transactionType = ref(null)
const loading = ref(false) // Unified loading state for initial load
const loadingMore = ref(false) // Specific loading state for mobile infinite scroll

// Data states
const transactions = ref([]) // For Desktop Table
const mobileTransactions = ref([]) // For Mobile List

// Pagination & Infinite Scroll states
const totalRecords = ref(0)
const pageSize = ref(10) // For Desktop
const hasMoreItems = ref(true) // For Mobile
const MOBILE_PAGE_SIZE = 15

// Template Refs
const infiniteContainer = ref(null)

// --- Data table headers ---
const headers = [
  {
    title: 'Description',
    key: 'description',
    sortable: true,
    align: 'start',
    class: 'font-weight-medium',
  },
  {
    title: 'Amount',
    key: 'points',
    sortable: true,
    align: 'start',
    class: 'font-weight-medium',
  },
  {
    title: 'State',
    key: 'isDebit',
    sortable: true,
    align: 'start',
    class: 'font-weight-medium',
  },
  {
    title: 'Date',
    key: 'creationDate',
    sortable: true,
    align: 'start',
    class: 'font-weight-medium',
  },
]

// --- Methods ---

const getToken = () => {
  if (import.meta.client) {
    token.value = localStorage.getItem('v2_token') || ''
  }
}

/**
 * REFACTORED: Main function to fetch initial data when tab changes.
 * Sends ONE request and populates both desktop and mobile lists.
 */
const resetAndFetchInitialData = async () => {
  if (loading.value) return
  loading.value = true

  // Reset states
  transactions.value = []
  mobileTransactions.value = []
  totalRecords.value = 0
  hasMoreItems.value = true
  if (infiniteContainer.value) {
    infiniteContainer.value.scrollTop = 0
  }

  try {
    const params = {
      'PagingDto.PageFilter.Size': pageSize.value, // Fetch first page based on desktop size
      'PagingDto.PageFilter.Skip': 0,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    }
    if (transactionType.value !== null) {
      params['IsDebit'] = transactionType.value
    }

    const response = await useApiService('/api/v2/transactions', {
      method: 'GET',
      params,
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (response.succeeded && response.data) {
      // Populate both lists with the same initial data
      transactions.value = response.data.list
      mobileTransactions.value = response.data.list
      totalRecords.value = response.data.totalRecordsCount
      hasMoreItems.value = mobileTransactions.value.length < totalRecords.value
    }
  }
  catch (err) {
    if (err.response && err.response.status === 403) auth.logout()
    console.error('Error fetching initial transactions:', err)
  }
  finally {
    loading.value = false
  }
}

/**
 * Fetches subsequent pages for the DESKTOP table.
 */
const loadDesktopTransactions = async ({
  page,
  itemsPerPage,
  sortBy: _sortBy,
}) => {
  loading.value = true
  const skip = (page - 1) * itemsPerPage

  try {
    const params = {
      'PagingDto.PageFilter.Size': itemsPerPage,
      'PagingDto.PageFilter.Skip': skip,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    }
    if (transactionType.value !== null) {
      params['IsDebit'] = transactionType.value
    }

    const response = await useApiService('/api/v2/transactions', {
      method: 'GET',
      params,
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (response.succeeded && response.data) {
      transactions.value = response.data.list
      totalRecords.value = response.data.totalRecordsCount
    }
  }
  catch (err) {
    if (err.response && err.response.status === 403) auth.logout()
    console.error('Error fetching desktop page:', err)
  }
  finally {
    loading.value = false
  }
}

/**
 * Fetches more items for MOBILE infinite scroll.
 */
const fetchMoreMobileTransactions = async () => {
  if (loadingMore.value || !hasMoreItems.value) return
  loadingMore.value = true

  const skip = mobileTransactions.value.length

  try {
    const params = {
      'PagingDto.PageFilter.Size': MOBILE_PAGE_SIZE,
      'PagingDto.PageFilter.Skip': skip,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': false, // No need for total count here
    }
    if (transactionType.value !== null) {
      params['IsDebit'] = transactionType.value
    }

    const response = await useApiService('/api/v2/transactions', {
      method: 'GET',
      params,
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (response.succeeded && response.data) {
      mobileTransactions.value.push(...response.data.list)
      hasMoreItems.value = mobileTransactions.value.length < totalRecords.value
    }
  }
  catch (err) {
    if (err.response && err.response.status === 403) auth.logout()
    console.error('Error fetching more mobile transactions:', err)
  }
  finally {
    loadingMore.value = false
  }
}

// --- Event Handlers ---
const handleScroll = (event) => {
  const container = event.target
  const scrollPosition = container.scrollTop + container.clientHeight
  const scrollThreshold = container.scrollHeight - 100

  if (scrollPosition >= scrollThreshold) {
    fetchMoreMobileTransactions()
  }
}

const toggleChart = () => {
  emit('toggle-chart')
}

// --- Watchers ---
watch(activeTab, (newTab) => {
  if (newTab === 0) transactionType.value = null
  else if (newTab === 1) transactionType.value = false
  else if (newTab === 2) transactionType.value = true

  // This will now be the single point of entry for fetching data on tab change
  resetAndFetchInitialData()
})

// --- Lifecycle Hooks ---
onMounted(() => {
  getToken()
  resetAndFetchInitialData() // Initial data load on component mount
})
</script>

<style scoped>
.transaction-tabs-wrapper {
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
}
.transaction-tabs-wrapper .v-tabs {
  width: 80%;
}

.transaction-list {
  margin-top: 8px;
}

.transaction-item {
  border-bottom: 1px solid #f5f5f5;
  padding: 12px 0;
}

.transaction-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.transaction-amount {
  font-size: 14px;
}

.state-icon-bg {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-icon-bg-desktop {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-table-wrapper {
  position: relative;
  margin-bottom: 60px; /* Add space for pagination */
}

/* Desktop Transaction History Styles */
:deep(.transaction-tabs .v-tab) {
  min-width: 0;
  text-transform: none;
  font-weight: 400;
  padding: 0 16px;
  font-size: 14px;
}

:deep(.transaction-tabs .v-tabs-slider) {
  height: 2px;
}

:deep(.transaction-table .v-data-table__wrapper) {
  overflow-x: auto;
}

:deep(.transaction-table thead) {
  background-color: #f5f7fa;
  border-radius: 8px;
}

:deep(.transaction-table thead th) {
  font-size: 14px !important;
  color: #4b5563 !important;
  font-weight: 500 !important;
  padding: 12px 16px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

:deep(.transaction-table thead th.sortable .v-data-table-header__icon) {
  color: #9ca3af;
  margin-left: 4px;
}

:deep(.transaction-table tbody td) {
  padding: 16px !important;
  height: auto !important;
}

.transaction-chart {
  margin-bottom: 16px;
  position: relative;
  width: 100%;
}

/* State Colors */
.pending-bg {
  background-color: #ffc107;
}

.spent-bg {
  background-color: #ff5252;
}

.earned-bg {
  background-color: #4caf50;
}

.pending-bg-desktop {
  background-color: rgba(255, 193, 7, 0.15);
}

.pending-bg-desktop i {
  color: #ffc107 !important;
}

.spent-bg-desktop {
  background-color: rgba(255, 82, 82, 0.15);
}

.spent-bg-desktop i {
  color: #ff5252 !important;
}

.earned-bg-desktop {
  background-color: rgba(76, 175, 80, 0.15);
}

.earned-bg-desktop i {
  color: #4caf50 !important;
}

.state-icon-wrapper {
  display: flex;
  align-items: center;
}

.state-icon-wrapper .state-icon {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-icon-wrapper .state-icon.pending {
  background-color: rgba(255, 193, 7, 0.1);
}

.state-icon-wrapper .state-icon.spent {
  background-color: rgba(255, 82, 82, 0.1);
}

.state-icon-wrapper .state-icon.earned {
  background-color: rgba(76, 175, 80, 0.1);
}

.state-icon-wrapper .state-text.pending {
  color: #ffc107;
  font-size: 14px;
}

.state-icon-wrapper .state-text.spent {
  color: #ff5252;
  font-size: 14px;
}

.state-icon-wrapper .state-text.earned {
  color: #4caf50;
  font-size: 14px;
}

/* Add missing skeleton loading styles at the end of the style section */
:deep(.v-skeleton-loader__list-item-two-line) {
  background: rgba(0, 0, 0, 0.05) !important;
  border-radius: 8px;
}

.chart-toggle-icon {
  cursor: pointer;
}

/* Pagination Styles */
:deep(.custom-table-footer) {
  font-size: 14px !important;
}

:deep(.v-data-footer__select) {
  font-size: 14px !important;
}

:deep(.v-data-footer__pagination) {
  font-size: 14px !important;
}

:deep(.v-data-footer__select .v-select) {
  margin: 0 10px !important;
}

:deep(.v-data-footer__select .v-select__selection) {
  font-size: 14px !important;
}

:deep(.v-data-footer) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  margin-top: 15px;
}

:deep(.v-data-footer__icons-before),
:deep(.v-data-footer__icons-after) {
  font-size: 18px !important;
}

.mobile-pagination {
  border-top: 1px solid #f0f0f0;
  margin-top: 16px;
  background: white;
}

.mobile-rows-select {
  min-width: 140px;
}

:deep(.mobile-select) {
  max-width: 65px;
}

:deep(.mobile-select .v-input__slot) {
  min-height: 24px !important;
  padding: 0 !important;
}

:deep(.mobile-select .v-select__selection) {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.87);
}

:deep(.mobile-select .v-input__append-inner) {
  margin-top: 2px !important;
}

:deep(.mobile-select .v-icon) {
  font-size: 16px;
}

:deep(.mobile-pagination .v-btn.v-btn--icon.v-size--x-small) {
  width: 20px;
  height: 20px;
}

:deep(.mobile-pagination .v-btn.v-btn--icon.v-size--x-small .v-icon) {
  font-size: 16px;
}

.caption {
  font-size: 12px !important;
  color: rgba(0, 0, 0, 0.6);
}

.infinite-container {
  height: calc(100vh - 300px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.transaction-list {
  margin-top: 8px;
  height: 100%;
}

/* Add smooth scrolling behavior */
.infinite-container {
  scroll-behavior: smooth;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.infinite-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.infinite-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.empty-state-icon {
  opacity: 0.7;
  margin-bottom: 16px;
}

.empty-state-text {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;
}

.empty-state-subtext {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.38);
}

/* Fix for pagination buttons */
:deep(.v-data-table__wrapper) {
  min-height: 300px;
}

:deep(.v-data-footer .v-btn) {
  min-width: 36px;
  padding: 0 8px;
}

:deep(.v-data-footer .v-btn:not(.v-btn--icon)) {
  cursor: pointer !important;
  pointer-events: auto !important;
}

:deep(.v-data-footer .v-data-footer__icons-before .v-btn),
:deep(.v-data-footer .v-data-footer__icons-after .v-btn) {
  width: 36px;
  min-width: 36px;
  padding: 0;
}

/* Additional specific fixes for pagination buttons */
:deep(.v-data-footer__pagination .v-btn) {
  pointer-events: auto !important;
  cursor: pointer !important;
  opacity: 1 !important;
}

:deep(.v-data-footer__pagination) {
  pointer-events: auto !important;
}

:deep(.v-data-table-footer__pagination) {
  pointer-events: auto !important;
}

:deep(.v-data-table-footer__pagination button),
:deep(.v-data-footer__pagination button) {
  pointer-events: auto !important;
  cursor: pointer !important;
  opacity: 1 !important;
}

/* Fix for v-data-table-footer__pagination specifically */
:deep(.v-data-table-footer)
  :deep(.v-data-footer)
  :deep(.v-data-footer__pagination) {
  pointer-events: auto !important;
}

:deep(.v-data-table-footer)
  :deep(.v-data-footer)
  :deep(.v-data-footer__pagination)
  button {
  pointer-events: auto !important;
  cursor: pointer !important;
  opacity: 1 !important;
}

:deep(.v-data-table-footer) {
  z-index: 1;
  position: relative;
}

:deep(.v-data-table-footer__pagination) {
  z-index: 2;
  position: relative;
}
</style>
