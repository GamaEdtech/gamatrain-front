<script setup>
import DeleteItemModal from '@/components/admin/contactus/deleteItemModal.vue'
import viewMessageDetailsModal from '@/components/admin/contactus/viewMessageDetailsModal.vue'
import useApiService from '~/composables/useApiService'

definePageMeta({
  layout: 'admin',
  auth: true,
})

const { $toast } = useNuxtApp()

const list = ref([])
const headers = [
  { title: 'Name', key: 'fullName', sortable: false, width: '15vw' },
  { title: 'Subject', key: 'subject', sortable: false, width: '15vw' },
  { key: 'attachedFile', sortable: false, width: '17vw' },
  { title: 'Date', key: 'date', width: '10vw' },
  { title: 'Actions', key: 'actions', sortable: false, width: '5vw' },
]

const tableLoading = ref(true)
const dialogVisible = ref(false)
const isDeleteModalOpen = ref(false)
const selectedMessage = ref('')
const selectedEmail = ref('')
const selectedName = ref('')
const selectedId = ref(null)
const selectedDeleteId = ref(null)
const search = ref(null)
const filter = ref('all')
const filteredList = ref([])
const selectedAction = ref(null)
const selectedPageSize = ref(10)
const page = ref(1)
const pageCount = ref(0)
const totalCount = ref(0)
const selected = ref([])
const disableNextBtn = ref(false)
const disableBackBtn = ref(false)

const allActions = [
  { label: 'Delete All', value: 'deleteAll' },
  { label: 'Read All', value: 'readAll' },
]

const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const fetchContactUs = async () => {
  tableLoading.value = true
  try {
    const response = await useApiService.get('/api/v2/admin/contacts', {
      'PagingDto.PageFilter.Size': selectedPageSize.value,
      'PagingDto.PageFilter.Skip': (page.value - 1) * selectedPageSize.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    })
    list.value = response.data.list
    filteredList.value = list.value
    totalCount.value = response.data.totalRecordsCount
    pageCount.value = Math.ceil(totalCount.value / selectedPageSize.value)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    tableLoading.value = false
  }
}

const viewMessageDetails = async (id) => {
  try {
    const response = await useApiService.get(`/api/v2/admin/contacts/${id}`)

    selectedMessage.value = response.data.body
    selectedEmail.value = response.data.email
    selectedName.value = response.data.fullName
    selectedId.value = response.data.id
    dialogVisible.value = true

    const index = list.value.findIndex(item => item.id === id)
    setTimeout(() => {
      if (index !== -1) {
        list.value[index] = { ...list.value[index], isRead: true }
      }
    }, 1500)

    disableNextBtn.value = index >= list.value.length - 1
    disableBackBtn.value = index <= 0
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}

const goToNextMessage = (id) => {
  const index = list.value.findIndex(item => item.id === id)
  if (index < list.value.length - 1) {
    viewMessageDetails(list.value[index + 1].id)
  }
}

const goToPreviousMessage = (id) => {
  const index = list.value.findIndex(item => item.id === id)
  if (index > 0) {
    viewMessageDetails(list.value[index - 1].id)
  }
}

const deleteMessage = async () => {
  try {
    await useApiService.remove(`/api/v2/admin/contacts/${selectedDeleteId.value}`)

    list.value = list.value.filter(i => i.id !== selectedDeleteId.value)
    filteredList.value = list.value
    $toast.success('Message deleted successfully!')
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    isDeleteModalOpen.value = false
    fetchContactUs()
  }
}

const handleDelete = (id) => {
  isDeleteModalOpen.value = true
  selectedDeleteId.value = id
}

const doAll = async () => {
  if (selectedAction.value === 'Delete All') {
    for (const item of selected.value) {
      selectedDeleteId.value = item
      await deleteMessage()
    }

    selected.value = []
    $toast.success('All selected messages deleted!')
  }
  else {
    for (const id of selected.value) {
      const index = list.value.findIndex(msg => msg.id === id)
      try {
        await $fetch(`/api/v2/admin/contacts/${id}/toggle`, {
          method: 'PATCH',
        })

        list.value[index] = { ...list.value[index], isRead: true }
        selected.value = []
        $toast.success('All selected messages marked as read!')
      }
      catch (err) {
        console.error(`Failed to mark message ${id} as read`, err)
      }
    }
  }
}

onMounted(() => {
  selectedAction.value = allActions[0].label
  selectedPageSize.value = allPageSize[0].value
  fetchContactUs()
})

watch(page, () => {
  filter.value = 'all'
  fetchContactUs()
})

watch(selectedPageSize, () => {
  page.value = 1
  fetchContactUs()
})

watch(filter, (val) => {
  if (val === 'read') {
    filteredList.value = list.value.filter(item => item.isRead)
  }
  else if (val === 'unread') {
    filteredList.value = list.value.filter(item => !item.isRead)
  }
  else {
    filteredList.value = list.value
  }
}, { immediate: true })
</script>

<template>
  <div>
    <div class="d-flex flex-column justify-space-between align-center mb-1 flex-sm-row">
      <div class="filterBtns mb-4 mb-sm-0">
        <v-btn
          :class="{ 'active-filter': filter === 'all', 'inactive-filter': filter !== 'all' }"
          depressed
          rounded
          variant="plain"
          class="gtext-t4 font-weight-medium"
          @click="filter = 'all'"
        >
          All
        </v-btn>
        <v-btn
          :class="{ 'active-filter': filter === 'unread', 'inactive-filter': filter !== 'unread' }"
          depressed
          rounded
          variant="plain"
          class="gtext-t4 font-weight-medium"
          @click="filter = 'unread'"
        >
          Unread
        </v-btn>

        <v-btn
          :class="{ 'active-filter': filter === 'read', 'inactive-filter': filter !== 'read' }"
          depressed
          class="ml-2 gtext-t4 font-weight-medium"
          rounded
          variant="plain"
          @click="filter = 'read'"
        >
          Read
        </v-btn>
      </div>

      <v-text-field
        v-model="search"
        label="Search anything..."
        variant="outlined"
        density="compact"
        rounded
        hide-details
        class="searchInput"
      >
        <template #prepend-inner>
          <span class="primary-gray-300"><v-icon>mdi-magnify </v-icon></span>
          <span class="primary-gray-300 ">|</span>
        </template>
      </v-text-field>
    </div>
    <div class="d-flex justify-end ga-2 align-center px-2">
      <p class="primary-gray-500 gtext-t6 font-weight-bold">
        {{ totalCount }}
      </p>
      <p class="gray--text gtext-t6 font-weight-semibold">
        Messages
      </p>
    </div>
    <div class="scrollable-table">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="filteredList"
        :items-per-page="selectedPageSize"
        class="elevation-1"
        :loading="tableLoading"
        hide-default-footer
        show-select
      >
        <template #[`item.fullName`]="{ item }">
          <div class="d-flex align-center">
            <v-avatar
              v-if="item.avatar"
              size="40"
              class="mr-2"
            >
              <img
                :src="item.avatar"
                alt="Avatar"
              >
            </v-avatar>
            <span :class="item.isRead === false ? 'font-weight-bold' : ''">{{ item.fullName }}</span>
          </div>
        </template>

        <template #[`item.subject`]="{ item }">
          <div class="d-flex align-center">
            <span :class="item.isRead === false ? 'font-weight-bold' : ''">{{ item.subject }}</span>
          </div>
        </template>

        <template #[`header.attachedFile`]>
          <div class="d-flex align-center">
            <v-icon
              small
              class="mr-1"
            >
              mdi-paperclip
            </v-icon>
            Attachment File
          </div>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex ga-2">
            <v-btn
              variant="plain"
              class="px-0 min-width-10"
            >
              <v-icon
                small
                class="gtext-t1"
                @click="viewMessageDetails(item.id)"
              >
                mdi-file-find
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Details
              </v-tooltip>
            </v-btn>
            <v-btn
              variant="plain"
              class="px-0 min-width-10"
            >
              <v-icon
                small
                class="gtext-t1"
                @click="handleDelete(item.id)"
              >
                mdi-delete
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Delete
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <viewMessageDetailsModal
        v-model="dialogVisible"
        :message="selectedMessage"
        :email="selectedEmail"
        :name="selectedName"
        :disable-next="disableNextBtn"
        :disable-back="disableBackBtn"
        @next="goToNextMessage(selectedId)"
        @back="goToPreviousMessage(selectedId)"
      />

      <DeleteItemModal
        v-model="isDeleteModalOpen"
        @confirm="deleteMessage"
      />
    </div>

    <v-row
      class="mt-2"
      align="center"
      justify="space-between"
      no-gutters
    >
      <v-col
        cols="12"
        class="d-flex flex-wrap flex-sm-nowrap align-center justify-space-between"
      >
        <div class="d-flex align-center mb-2 mb-sm-0">
          <v-select
            v-model="selectedAction"
            :items="allActions"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            rounded
            hide-details
            class="rounded-pill footerBtns"
            :disabled="selected.length === 0"
          />
          <v-btn
            class="rounded-pill gtext-t5 bg-primary-gray-700 text-white ml-4"
            :disabled="selected.length === 0"
            @click="doAll"
          >
            <span>Do</span>
          </v-btn>
        </div>

        <!-- Pagination (hidden on mobile here) -->
        <div class="d-none d-sm-flex">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="5"
            class="custom-pagination"
            next-icon="mdi-arrow-right"
            prev-icon="mdi-arrow-left"
          />
        </div>

        <div class="mb-2 mb-sm-0">
          <v-select
            v-model="selectedPageSize"
            :items="allPageSize"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            rounded
            hide-details
            class="rounded-pill footerBtns"
          />
        </div>
      </v-col>

      <!-- Pagination (visible only on xs, second row) -->
      <v-col
        cols="12"
        class="d-flex justify-center d-sm-none mt-2"
      >
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="5"
          class="custom-pagination"
          next-icon="mdi-arrow-right"
          prev-icon="mdi-arrow-left"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.scrollable-table {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.searchInput{
  width: 360px !important;
  max-width: 360px;
}

:deep(.v-field__outline){
    --v-field-border-width: 1px !important;
    --v-field-border-opacity: 0.38 !important;
}

:deep(.v-data-table__th){
    color: #344054 !important;
    font-family: Inter, sans-serif !important;
    font-size: 1.4rem !important;
    line-height: 2.4rem !important;
    font-weight: 500;
    white-space: nowrap;
}

:deep(.v-table__wrapper > table > thead > tr){
  background-color: #F2F4F7 !important;
}

.filterBtns{
    display: flex;
    padding: 4px;
    background-color: #0000001A;
    border-radius: 28px;
    align-items: center;
}

.footerBtns{
  width: 150px !important;
  max-width: 150px !important;
}

.v-pagination > li > button {
  margin: 0.1rem !important;
}

.custom-pagination {
  width: 100% !important;
  justify-content: center !important;
}
:deep(.custom-pagination li),:deep(.custom-pagination li button){
  min-width: 36px !important;
  width: 36px !important;
  height: 36px !important;
}
:deep(.custom-pagination li button:hover){
  background-color: #ffb300;
  opacity: 0.7;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background: #ffb300 !important;
}

:deep(.v-data-table td) {
  cursor: default !important;
}

.active-filter {
  background-color: #FFB600 !important;
  color: #101828 !important;
}

.inactive-filter {
  color: #667085 !important;
}

:deep(.v-btn--variant-plain){
  opacity: 1 !important;
}

.min-width-10{
  min-width: 10px !important;
  height: 20px !important;
}
</style>
