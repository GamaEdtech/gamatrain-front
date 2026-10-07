<template>
  <div class="w-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <h2 class="text-h4 font-weight-bold text-grey700">
        Payout Requests
      </h2>
    </div>

    <div
      v-if="loadingPayouts && !payouts.length"
      class="w-100 mt-4"
    >
      <user-commission-skeleton-table-desktop />
    </div>

    <common-data-table
      v-else
      :headers="headers"
      :items="payouts"
      :page="page"
      :page-size="pageSize"
      :page-count="pageCount"
      :total-count="totalCount"
      item-label="Requests"
      :show-page-size-selector="false"
      class="mt-4"
      @update:page="changePageNumber"
    />

    <admin-common-confirm-modal
      v-model="showCancelModal"
      text="Cancel this payout request? The amount goes back to your available balance."
      :loading="loadingCancel"
      @confirm="confirmCancel"
    />
  </div>
</template>

<script setup lang="ts">
import type { CommissionPayoutDTO, DataTableHeader } from '@/types'

const emit = defineEmits(['changed'])

const {
  payouts,
  loadingPayouts,
  totalCount,
  pageCount,
  getPayouts,
  loadingCancel,
  cancelPayout,
} = useCommissionPayout()

const headers: DataTableHeader<CommissionPayoutDTO>[] = [
  { title: '#', key: 'id', sortable: false, width: '6vw' },
  { title: 'Amount', key: 'amountUsd', sortable: false, width: '12vw', type: 'currency', prefix: '$' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '12vw',
    type: 'chip',
    getChipColor: (item: CommissionPayoutDTO) => getPayoutStatusColor(item.status),
  },
  {
    title: 'Requested',
    key: 'creationDate',
    sortable: false,
    width: '16vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm',
  },
  {
    title: 'Details',
    key: 'details',
    sortable: false,
    width: '24vw',
    emptyText: '-',
    getText: (item: CommissionPayoutDTO) => getDetails(item),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '8vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:cancel',
        tooltip: 'Cancel request',
        color: 'error',
        show: (item: CommissionPayoutDTO) => item.status === 'Pending',
        onClick: (item: CommissionPayoutDTO) => openCancelModal(item),
      },
    ],
  },
]

const pageSize = ref(5)
const page = ref(1)
const showCancelModal = ref(false)
const selectedPayoutId = ref<number | null>(null)

const getDetails = (item: CommissionPayoutDTO) => {
  switch (item.status) {
    case 'Paid':
      return item.transferReference ? `Sent - ref ${item.transferReference}` : 'Sent'
    case 'Rejected':
      return item.rejectionReason ?? ''
    case 'Approved':
      return 'Approved, transfer on its way'
    case 'Pending':
      return 'Waiting for review'
    default:
      return ''
  }
}

const fetchPayouts = async () => {
  await getPayouts({ page: page.value, pageSize: pageSize.value })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchPayouts()
}

const openCancelModal = (item: CommissionPayoutDTO) => {
  selectedPayoutId.value = item.id
  showCancelModal.value = true
}

const confirmCancel = async () => {
  if (selectedPayoutId.value == null) return
  const response = await cancelPayout(selectedPayoutId.value)
  if (response.succeeded) {
    showCancelModal.value = false
    await fetchPayouts()
    emit('changed')
  }
}

onMounted(async () => {
  await fetchPayouts()
})

defineExpose({ refresh: fetchPayouts })
</script>
