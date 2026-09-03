<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start px-2 pa-md-0">
    <h1 class="text-h4 text-grey700 font-weight-regular">
      My Tickets
    </h1>
    <v-btn
      rounded="pill"
      color="primary"
      flat
      height="34"
      class="mt-2"
      @click="openCreateModal"
    >
      <v-icon
        color="grey800"
        size="20"
      >
        md:add
      </v-icon>
      <span class="text-grey800 font-weight-bold text-h6">New Ticket</span>
    </v-btn>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="list || []"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="pageSizeOptions"
      :loading="loading"
      item-label="Tickets"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    />

    <common-modal-base
      v-model:show-dialog="showCreateModal"
      title="New Ticket"
      subtitle="Send a new support request."
      :max-width="560"
    >
      <user-ticket-modals-create
        @back="showCreateModal = false"
        @success="handleTicketCreated"
      />
    </common-modal-base>
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, TicketListDTO } from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useSeoMeta({
  title: 'Ticket manage',
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
} = useTicket()

const headers: DataTableHeader<TicketListDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
  { title: 'Sender', key: 'sender', sortable: false, width: '16vw', emptyText: 'unknown' },
  { title: 'Email', key: 'email', sortable: false, width: '20vw', emptyText: 'unknown' },
  { title: 'Subject', key: 'subject', sortable: false, width: '24vw', align: 'start' },
  {
    title: 'Status',
    key: 'isReadByAdmin',
    sortable: false,
    width: '12vw',
    type: 'chip',
    getText: item => item.isReadByAdmin ? 'Read' : 'Unread',
    getChipColor: item => item.isReadByAdmin ? 'success' : 'warning',
  },
  {
    title: 'Receivers',
    key: 'receivers',
    sortable: false,
    width: '10vw',
    emptyText: '-',
    getText: item => item.receivers?.length ? item.receivers.join(', ') : '-',
  },
  {
    title: 'Created At',
    key: 'creationDate',
    sortable: false,
    width: '38vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm',
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '10vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:visibility',
        tooltip: 'Details',
        to: item => `/user/ticket/${item.id}`,
      },
    ],
  },
]

const pageSize = ref(10)
const page = ref(1)
const pageSizeOptions = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]
const showCreateModal = ref(false)

const fetchTickets = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchTickets()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchTickets()
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const handleTicketCreated = async () => {
  page.value = 1
  await fetchTickets()
}

onMounted(async () => {
  await fetchTickets()
})
</script>
