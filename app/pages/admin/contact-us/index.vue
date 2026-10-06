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
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-start ga-2 mt-4">
      <v-btn
        rounded="pill"
        color="primary"
        flat
        variant="outlined"
        height="40"
        @click="showComposeMailModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Compose Mail</span>
      </v-btn>
      <v-btn
        rounded="pill"
        color="primary"
        flat
        variant="outlined"
        height="40"
        @click="showCreateTicketModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Create Ticket</span>
      </v-btn>
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
import type { AdminContactUsDTO, DataTableHeader, SearchFilterAdminContactUs } from '@/types'

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
  search: '',
  email: '',
  startDate: '',
  endDate: '',
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
} = useContactUsAdmin()

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
  contact.isReadByAdmin = true
  selectedItemIdForDetail.value = contact.id
  showDetailModal.value = true
}

const replySuccessFull = () => {
  selectedItemIdForDetail.value = null
  showDetailModal.value = false
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
    || searchFilter.search.length > 0
    || searchFilter.email.length > 0
    || searchFilter.startDate.toString().length > 0
    || searchFilter.endDate.toString().length > 0
  )
})

const clearFilter = async () => {
  searchFilter.unread = null
  searchFilter.search = ''
  searchFilter.email = ''
  searchFilter.startDate = ''
  searchFilter.endDate = ''
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
  {
    title: 'Status',
    key: 'isReadByAdmin',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getText: (item: AdminContactUsDTO) => item.isReadByAdmin ? 'Read' : 'UnRead',
    getChipColor: (item: AdminContactUsDTO) => item.isReadByAdmin ? 'success' : 'warning',
  },
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
