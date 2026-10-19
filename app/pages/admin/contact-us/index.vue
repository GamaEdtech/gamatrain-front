<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex align-center justify-start flex-wrap ga-2">
      <v-btn
        rounded="pill"
        color="primary"
        flat
        height="40"
        prepend-icon="md:edit_square"
        @click="showComposeMailModal = true"
      >
        <span class="text-grey900 font-weight-bold text-h5">Compose Mail</span>
      </v-btn>
      <v-btn
        rounded="pill"
        color="grey700"
        flat
        variant="outlined"
        height="40"
        prepend-icon="md:confirmation_number_outlined"
        @click="showCreateTicketModal = true"
      >
        <span class="font-weight-bold text-h5">Create Ticket</span>
      </v-btn>
    </div>

    <admin-common-clear-filter-btn
      v-if="isShowClearFilter"
      class="mt-3"
      @click="clearFilter"
    />

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="list || []"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loading"
      item-label="Contacts"
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

      <template #[`item.subject`]="{ item }">
        <div class="d-flex justify-center align-center ga-2 text-grey600 text-h5 font-weight-bold text-center">
          {{ item.subject }}
          <v-chip
            v-if="isUnread(item)"
            color="warning"
            size="small"
            label
            class="text-h6 font-weight-bold flex-shrink-0"
          >
            {{ item.hasNewReply ? 'New reply' : 'Unread' }}
          </v-chip>
        </div>
      </template>

      <template #[`item.status`]="{ item }">
        <div class="w-100 d-flex justify-center align-center">
          <v-menu>
            <template #activator="{ props: menuProps }">
              <v-chip
                v-bind="menuProps"
                :color="getAdminTicketStatusOption(item.status).color"
                :disabled="updatingStatusId === item.id"
                append-icon="md:arrow_drop_down"
                class="font-weight-bold text-h5"
              >
                {{ getAdminTicketStatusOption(item.status).title }}
              </v-chip>
            </template>
            <v-list density="compact">
              <v-list-item
                v-for="option in ADMIN_TICKET_STATUSES"
                :key="option.value"
                :active="option.value === getAdminTicketStatusOption(item.status).value"
                :color="option.color"
                @click="changeStatus(item, option.value)"
              >
                <v-list-item-title class="text-h5">
                  {{ option.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </common-data-table>

    <admin-common-modal
      v-model:show-dialog="showDeleteModal"
      title="Delete"
    >
      <admin-contactus-delete-item-modal
        :id="selectedItemIdForDelete"
        @delete-success-full="deleteSuccessFull"
      />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="showDetailModal"
      title="Detail"
      :max-width="900"
    >
      <admin-contactus-view-message-details-modal
        :id="selectedItemIdForDetail"
        @reply-success-full="replySuccessFull"
      />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="showComposeMailModal"
      title="Compose"
      :max-width="600"
    >
      <admin-contactus-compose-mail-modal @compose-mail-success-full="showComposeMailModal = false" />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="showCreateTicketModal"
      title="Ticket"
      :max-width="600"
    >
      <admin-contactus-create-ticket-modal @create-ticket-success-full="createTicketSuccessfull" />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-contactus-search-modal
        :data="searchFilter"
        :loading="loading"
        @search="startSearch"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type { AdminContactUsDTO, AdminTicketStatus, DataTableHeader, SearchFilterAdminContactUs } from '@/types'
import { ADMIN_TICKET_STATUSES, getAdminTicketStatusOption } from '@/constants'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]
const showDeleteModal = ref(false)
const selectedItemIdForDelete = ref('')
const showDetailModal = ref(false)
const selectedItemIdForDetail = ref<number | null>(null)
const showComposeMailModal = ref(false)
const showCreateTicketModal = ref(false)
const showSearchModal = ref(false)

const searchFilter = reactive<SearchFilterAdminContactUs>({
  unread: null,
  status: null,
  search: '',
  email: '',
  startDate: null,
  endDate: null,
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  setStatus,
  markAsUnread,
} = useContactUsAdmin()

const updatingStatusId = ref<number | null>(null)

// Same meaning as the backend's Unread filter: the ticket itself or a reply on it is unread by admin.
const isUnread = (contact: AdminContactUsDTO) => !contact.isReadByAdmin || contact.hasNewReply

const changeStatus = async (contact: AdminContactUsDTO, status: AdminTicketStatus) => {
  if (getAdminTicketStatusOption(contact.status).value === status) return

  updatingStatusId.value = contact.id
  const updated = await setStatus(contact.id, status)
  updatingStatusId.value = null
  if (!updated) return

  contact.status = status
  // With a status filter on, the row no longer belongs in this list.
  if (searchFilter.status) await fetchData()
}

const markContactAsUnread = async (contact: AdminContactUsDTO) => {
  if (await markAsUnread(contact.id)) contact.isReadByAdmin = false
}

const fetchData = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchFilter,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchData()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchData()
}

onMounted(async () => {
  await fetchData()
})

const viewDetail = async (contact: AdminContactUsDTO) => {
  // Opening the ticket marks it and its replies read on the backend.
  contact.isReadByAdmin = true
  contact.hasNewReply = false
  selectedItemIdForDetail.value = contact.id
  showDetailModal.value = true
}

const replySuccessFull = async () => {
  selectedItemIdForDetail.value = null
  showDetailModal.value = false
  // An admin reply moves the ticket to Answered and to the top of the list.
  await fetchData()
}

const createTicketSuccessfull = async () => {
  showCreateTicketModal.value = false
  page.value = 1
  await fetchData()
}

const deleteContact = (contact: AdminContactUsDTO) => {
  selectedItemIdForDelete.value = contact.id.toString()
  showDeleteModal.value = true
}
const deleteSuccessFull = async () => {
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchData()
}

const startSearch = async (item: SearchFilterAdminContactUs) => {
  searchFilter.unread = item.unread
  searchFilter.status = item.status
  searchFilter.search = item.search
  searchFilter.email = item.email
  searchFilter.startDate = item.startDate
  searchFilter.endDate = item.endDate
  page.value = 1
  showSearchModal.value = false
  await fetchData()
}

const isShowClearFilter = computed(() => {
  return (
    searchFilter.unread !== null
    || !!searchFilter.status
    || !!searchFilter.search
    || !!searchFilter.email
    || !!searchFilter.startDate
    || !!searchFilter.endDate
  )
})

const clearFilter = async () => {
  searchFilter.unread = null
  searchFilter.status = null
  searchFilter.search = ''
  searchFilter.email = ''
  searchFilter.startDate = null
  searchFilter.endDate = null
  page.value = 1
  await fetchData()
}

const refreshData = async () => {
  await fetchData()
}

const headers: DataTableHeader<AdminContactUsDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw', align: 'start' },
  { title: 'User', key: 'sender', sortable: false, width: '15vw', emptyText: 'unknown' },
  {
    title: 'Email',
    key: 'email',
    sortable: false,
    width: '15vw',
  },
  { title: 'Subject', key: 'subject', sortable: false, width: '20vw' },
  { title: 'Status', key: 'status', sortable: false, width: '10vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:plagiarism',
        tooltip: 'Details',
        onClick: (item: AdminContactUsDTO) => viewDetail(item),
      },
      {
        icon: 'md:mark_email_unread',
        tooltip: 'Mark as unread',
        // Disabled rather than hidden, so every row keeps the same icons in the same places.
        disabled: (item: AdminContactUsDTO) => isUnread(item),
        onClick: (item: AdminContactUsDTO) => markContactAsUnread(item),
      },
      {
        icon: 'md:delete',
        tooltip: 'delete',
        onClick: (item: AdminContactUsDTO) => deleteContact(item),
      },
    ],
  },
]
</script>

<style scoped>
.reverse-icon {
  transform: rotateZ(180deg);
}
.btn-filter-container{
  height : 48px;
}
.filter-mobile-container{
  width: 170px;
}
</style>
