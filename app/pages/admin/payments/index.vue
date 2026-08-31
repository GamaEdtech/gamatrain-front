<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start position-relative flex-wrap ga-2">
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
      :loading="loading"
      item-label="Payments"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    >
      <template #actions>
        <v-btn
          variant="plain"
          max-width="20"
          class="mr-1"
          @click="showSearchModal = true"
        >
          <v-icon
            size="26"
            class="grey500"
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

        <v-btn
          size="small"
          flat
          icon
          color="primary"
          :loading="loadingExportPayments ? 'white' : false"
          class="mr-1"
          @click="exportData"
        >
          <v-icon
            color="white"
            size="20"
          >
            md:file_export
          </v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >
            Export Data
          </v-tooltip>
        </v-btn>
      </template>

      <template #[`item.sourceWallet`]="{ item }">
        <div
          class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold ga-2 cursor-pointer"
          @click="copyWalletAddress(item.sourceWallet)"
        >
          {{ item.sourceWallet ? shortenWallet(item.sourceWallet) : 'unknown' }}

          <v-icon v-if="item.sourceWallet">
            md:content_copy_outlined
          </v-icon>
        </div>
      </template>

      <template #[`item.action`]="{ item }">
        <v-btn
          v-if="canVerifyPayment(item)"
          flat
          size="small"
          class="text-h6"
          color="success"
          variant="outlined"
          @click="openVerifyPaymentModal(item)"
        >
          verify
        </v-btn>
      </template>
    </common-data-table>

    <admin-common-modal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-payment-modal-search
        :data="searchFilter"
        :loading="loading"
        @search="startSearch"
      />
    </admin-common-modal>

    <admin-common-confirm-modal
      v-model="showConfirmPaymentModal"
      text="Are you sure you want to confirm this payment?"
      :loading="loadingVerifyPayment"
      @confirm="confirmPayment"
    />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type {
  ApiResult,
  AdminPaymentDTO,
  DataTableHeader,
  StatusPayment,
  CurrencyPayment,
  PaymentGateway,
  SearchFilterAdminPayment,
} from '@/types'
import { TOKEN_DECIMALS } from '~/composables/useJupiterSwap'

interface SortOption {
  title: string
  value: string
}

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { $toast } = useNuxtApp()
const { verifyPayment, loadingVerifyPayment } = usePayment()
const {
  exportPayments,
  loadingExportPayments,
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
} = usePaymentAdmin()

const headers: DataTableHeader<AdminPaymentDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw', align: 'start' },
  {
    title: 'User',
    key: 'firstName',
    sortable: false,
    width: '15vw',
    emptyText: 'unknown',
    getText: (item: AdminPaymentDTO) => getFullName(item),
  },
  {
    title: 'Amount',
    key: 'amount',
    sortable: false,
    width: '10vw',
    getText: (item: AdminPaymentDTO) => formatAmount(item.amount, item.currency, item.gateway),
  },
  {
    title: 'Currency',
    key: 'currency',
    sortable: false,
    width: '5vw',
    getText: (item: AdminPaymentDTO) => item.gateway === 'Stripe' ? 'USD' : item.currency,
  },
  {
    title: 'Gateway',
    key: 'gateway',
    sortable: false,
    width: '5vw',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '5vw',
    type: 'chip',
    getChipColor: (item: AdminPaymentDTO) => getColorBadgeStatus(item.status),
  },
  {
    title: 'Created At',
    key: 'creationDate',
    sortable: false,
    width: '10vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
  },
  {
    title: 'Verify At',
    key: 'verifyDate',
    sortable: false,
    width: '10vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
    emptyText: 'Pending',
  },
  { title: 'Source Wallet', key: 'sourceWallet', sortable: false, width: '30vw', align: 'start' },
  { title: 'Action', key: 'action', sortable: false, width: '10vw' },
]
const showSearchModal = ref(false)
const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]
const sortSelected = ref<string[]>([])
const sortList = [
  {
    value: 'creationDate',
    title: 'Creation Date',
  },
]

const searchFilter = reactive<SearchFilterAdminPayment>({
  userId: '',
  identifierId: '',
  startDate: '',
  endDate: '',
  status: '',
  gateway: '',
})

const showConfirmPaymentModal = ref(false)
const selectedPaymentForVerfy = ref<AdminPaymentDTO | null>(null)

const fetchPayments = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    sortSelected: sortSelected.value,
    ...searchFilter,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchPayments()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchPayments()
}

onMounted(async () => {
  await fetchPayments()
})

const startSearch = async (item: SearchFilterAdminPayment) => {
  searchFilter.userId = item.userId
  searchFilter.identifierId = item.identifierId
  searchFilter.startDate = item.startDate
  searchFilter.endDate = item.endDate
  searchFilter.status = item.status
  searchFilter.gateway = item.gateway
  page.value = 1
  showSearchModal.value = false
  await fetchPayments()
}

const isShowClearFilter = computed(() => {
  if (
    searchFilter.userId.length > 0
    || searchFilter.identifierId.length > 0
    || searchFilter.startDate.toString().length > 0
    || searchFilter.endDate.toString().length > 0
    || searchFilter.status.length > 0
    || searchFilter.gateway.length > 0
  ) {
    return true
  }
  return false
})

const clearFilter = async () => {
  searchFilter.userId = ''
  searchFilter.identifierId = ''
  searchFilter.startDate = ''
  searchFilter.endDate = ''
  searchFilter.status = ''
  searchFilter.gateway = ''
  page.value = 1
  await fetchPayments()
}

const getColorBadgeStatus = (status: StatusPayment) => {
  switch (status) {
    case 'Paid':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Failed':
      return 'error'

    default:
      return 'warning'
  }
}
const shortenWallet = (address: string) => {
  return (
    address.slice(0, 4)
    + '...'
    + address.slice(-4)
  )
}

const copyWalletAddress = (address: string | null | undefined) => {
  if (address) {
    navigator.clipboard.writeText(address)
    $toast.info('Wallet address copy in your clipboard')
  }
}

const formatAmount = (amount: number, currency: CurrencyPayment, gateway: PaymentGateway) => {
  const decimals = TOKEN_DECIMALS[currency]
  if (gateway === 'Stripe')
    return amount
  const value = amount / (10 ** decimals)
  const fixValue = value
    .toFixed(decimals)
    .replace(/\.?0+$/, '')

  return fixValue
}

const getFullName = (item: AdminPaymentDTO) => {
  return useFullName(item)
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
  await fetchPayments()
}

const openVerifyPaymentModal = (item: AdminPaymentDTO) => {
  showConfirmPaymentModal.value = true
  selectedPaymentForVerfy.value = item
}

const confirmPayment = async () => {
  const response = await verifyPayment(selectedPaymentForVerfy.value?.id.toString() ?? '', selectedPaymentForVerfy.value?.transactionId ?? '')
  if (response.succeeded && response.data) {
    $toast.success('Payment successfully confirmed.')
  }
  else {
    $toast.error('There was a problem verifying the payment. Please try again later.')
  }
  showConfirmPaymentModal.value = false
  selectedPaymentForVerfy.value = null
  await fetchPayments()
}

const refreshData = async () => {
  await fetchPayments()
}

const isBlobResponse = (response: unknown): response is Blob => {
  return response instanceof Blob
}

const getExportErrorMessage = (response: ApiResult<string>) => {
  if (response && response.errors?.length && response.errors[0].message) {
    return response.errors[0].message
  }

  if (response.data) {
    return response.data
  }

  return 'The operation failed. Please try again later.'
}

const exportData = async () => {
  const response = await exportPayments({
    startDate: searchFilter.startDate ? dayjs(searchFilter.startDate).toISOString() : null,
    endDate: searchFilter.endDate ? dayjs(searchFilter.endDate).toISOString() : null,
    gateway: searchFilter.gateway
      ? searchFilter.gateway as PaymentGateway
      : null,
    status: searchFilter.status
      ? searchFilter.status as StatusPayment
      : null,
  })

  if (!isBlobResponse(response)) {
    const result = response as ApiResult<string>
    if (!result.succeeded) {
      $toast.error(getExportErrorMessage(result))
      return
    }

    $toast.error('The operation failed. Please try again later.')
    return
  }

  const { saveAs } = await import('file-saver')
  const fileName = `payments-export-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.xlsx`
  saveAs(response, fileName)
  $toast.success('Payment data export successfully!')
}

const canVerifyPayment = (item: AdminPaymentDTO) => {
  const createdAt = dayjs.utc(item.creationDate)

  return (
    item.status === 'Pending'
    && dayjs().diff(createdAt, 'minute') > 20
  )
}
</script>

<style scoped>
.reverse-icon {
  transform: rotateZ(180deg);
}
</style>
