<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-wrap align-center ga-2">
      <v-select
        id="payout-status-filter"
        v-model="statusFilter"
        :items="statusOptions"
        item-title="title"
        item-value="value"
        label="Status"
        variant="outlined"
        density="compact"
        rounded="lg"
        hide-details
        class="filter-field"
        @update:model-value="applyFilter"
      />
      <v-text-field
        id="payout-user-filter"
        v-model="userIdFilter"
        label="User ID"
        type="number"
        hide-spin-buttons
        variant="outlined"
        density="compact"
        rounded="lg"
        hide-details
        clearable
        class="filter-field"
        @keyup.enter="applyFilter"
        @click:clear="clearUser"
      />
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
      item-label="Payouts"
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
          :loading="loading"
          class="mr-1"
          @click="fetchPayouts"
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
      v-if="selectedPayout && selectedDecision"
      v-model:show-dialog="showDecisionModal"
      :title="decisionTitle"
      :max-width="480"
    >
      <admin-commission-modal-payout-decision
        ref="decisionRef"
        :payout="selectedPayout"
        :decision="selectedDecision"
        :loading="loadingDecision"
        @submit="submitDecision"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type {
  CommissionPayoutDTO,
  CommissionPayoutDecision,
  CommissionPayoutStatus,
  DataTableHeader,
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
  loadingDecision,
  decide,
} = useCommissionPayoutAdmin()

const fullName = (name: string | null | undefined, id: number | null | undefined) => {
  if (name && name.trim()) return name.trim()
  return id ? `#${id}` : ''
}

const dateText = (value: string | null) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '')

const headers: DataTableHeader<CommissionPayoutDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw' },
  {
    title: 'Owner',
    key: 'userFirstName',
    sortable: false,
    width: '12vw',
    getText: (item: CommissionPayoutDTO) => fullName(`${item.userFirstName ?? ''} ${item.userLastName ?? ''}`, item.userId),
  },
  { title: 'Amount', key: 'amountUsd', sortable: false, width: '8vw', type: 'currency', prefix: '$' },
  {
    title: 'Method',
    key: 'method',
    sortable: false,
    width: '7vw',
    type: 'chip',
    getText: (item: CommissionPayoutDTO) => (item.method === 'StripeConnect' ? 'Stripe' : 'Manual'),
    getChipColor: (item: CommissionPayoutDTO) => (item.method === 'StripeConnect' ? 'primary' : 'grey500'),
  },
  { title: 'Send To', key: 'destination', sortable: false, width: '16vw' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '8vw',
    type: 'chip',
    getChipColor: (item: CommissionPayoutDTO) => getPayoutStatusColor(item.status),
  },
  {
    title: 'Requested',
    key: 'creationDate',
    sortable: false,
    width: '10vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm',
  },
  {
    title: 'Approved By',
    key: 'approvedByFullName',
    sortable: false,
    width: '12vw',
    getText: (item: CommissionPayoutDTO) => item.approvedByUserId
      ? `${fullName(item.approvedByFullName, item.approvedByUserId)} · ${dateText(item.approvalDate)}`
      : '-',
  },
  {
    title: 'Paid By',
    key: 'paidByFullName',
    sortable: false,
    width: '14vw',
    getText: (item: CommissionPayoutDTO) => item.paidByUserId
      ? `${fullName(item.paidByFullName, item.paidByUserId)} · ${dateText(item.paidDate)} · ref ${item.transferReference ?? ''}`
      : '-',
  },
  {
    title: 'Rejected / Cancelled',
    key: 'rejectedByFullName',
    sortable: false,
    width: '14vw',
    getText: (item: CommissionPayoutDTO) => {
      if (item.rejectedByUserId) return `${fullName(item.rejectedByFullName, item.rejectedByUserId)}: ${item.rejectionReason ?? ''}`
      if (item.cancellationDate) return `Cancelled by owner · ${dateText(item.cancellationDate)}`
      return '-'
    },
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '10vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:check_circle',
        tooltip: 'Approve',
        color: 'success',
        show: (item: CommissionPayoutDTO) => item.status === 'Pending',
        onClick: (item: CommissionPayoutDTO) => openDecision(item, 'approve'),
      },
      {
        icon: 'md:payments',
        // An Approved Stripe payout only exists when an approval stopped half-way; this finishes its transfer.
        tooltip: 'Mark as paid',
        color: 'success',
        show: (item: CommissionPayoutDTO) => item.status === 'Approved',
        onClick: (item: CommissionPayoutDTO) => openDecision(item, 'paid'),
      },
      {
        icon: 'md:cancel',
        tooltip: 'Reject',
        color: 'error',
        // An Approved Stripe payout may already be transferred, so the backend refuses to reject it.
        show: (item: CommissionPayoutDTO) => item.status === 'Pending' || (item.status === 'Approved' && item.method === 'Manual'),
        onClick: (item: CommissionPayoutDTO) => openDecision(item, 'reject'),
      },
    ],
  },
]

const statusOptions: { title: string, value: CommissionPayoutStatus | '' }[] = [
  { title: 'All', value: '' },
  { title: 'Pending', value: 'Pending' },
  { title: 'Approved', value: 'Approved' },
  { title: 'Paid', value: 'Paid' },
  { title: 'Rejected', value: 'Rejected' },
  { title: 'Cancelled', value: 'Cancelled' },
]

const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

// Pending first: that's the queue an admin opens this page for.
const statusFilter = ref<CommissionPayoutStatus | ''>('Pending')
const userIdFilter = ref<string | null>(null)

const showDecisionModal = ref(false)
const selectedPayout = ref<CommissionPayoutDTO | null>(null)
const selectedDecision = ref<CommissionPayoutDecision | null>(null)
const decisionRef = ref<{ clearCode: () => void } | null>(null)

const decisionTitle = computed(() => {
  switch (selectedDecision.value) {
    case 'approve':
      return 'Approve payout'
    case 'reject':
      return 'Reject payout'
    default:
      return selectedPayout.value?.method === 'StripeConnect' ? 'Finish Stripe transfer' : 'Confirm transfer'
  }
})

const fetchPayouts = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    status: statusFilter.value,
    userId: userIdFilter.value ? Number(userIdFilter.value) : null,
  })
}

const applyFilter = async () => {
  page.value = 1
  await fetchPayouts()
}

const clearUser = async () => {
  userIdFilter.value = null
  await applyFilter()
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchPayouts()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchPayouts()
}

const openDecision = (item: CommissionPayoutDTO, decision: CommissionPayoutDecision) => {
  selectedPayout.value = item
  selectedDecision.value = decision
  showDecisionModal.value = true
}

const submitDecision = async (body: { twoFactorCode: string, reason?: string, transferReference?: string }) => {
  if (!selectedPayout.value || !selectedDecision.value) return
  const response = await decide(selectedPayout.value.id, selectedDecision.value, body)
  if (response.succeeded) {
    showDecisionModal.value = false
    await fetchPayouts()
  }
  else {
    decisionRef.value?.clearCode()
  }
}

onMounted(async () => {
  await fetchPayouts()
})
</script>

<style scoped>
.filter-field {
  max-width: 220px;
  min-width: 160px;
}
</style>
