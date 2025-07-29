<script setup>
import DeleteItemModal from '@/components/admin/contactus/deleteItemModal.vue'
import UserDetailModal from '~/components/admin/usermanagment/userDetailModal.vue'
import addUserDialog from '~/components/admin/usermanagment/addUserDialog.vue'
import useApiService from '~/composables/useApiService'

definePageMeta({
  layout: 'admin',
  auth: true,
})

const { $toast } = useNuxtApp()

const list = ref([])
const headers = [
  { title: 'Username', key: 'username', sortable: false, width: '15vw' },
  { title: 'Email', key: 'email', sortable: false, width: '15vw' },
  { title: 'Status', key: 'enabled', sortable: false, width: '10vw' },
  { title: 'Actions', key: 'actions', sortable: false, width: '5vw' },
]

const tableLoading = ref(true)
const dialogVisible = ref(false)
const isDeleteModalOpen = ref(false)
const showAddUserDialog = ref(false)
const selectedEmail = ref('')
const selectedName = ref('')
const selectedId = ref(null)
const selectedPhoneNumber = ref('')
const selectedDeleteId = ref(null)
const filter = ref('all')
const filteredList = ref([])
const selectedAction = ref(null)
const selectedPageSize = ref(10)
const page = ref(1)
const pageCount = ref(0)
const totalCount = ref(0)
const selected = ref([])

const allActions = [
  { label: 'Delete All', value: 'deleteAll' },
]

const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const fetchUsers = async () => {
  tableLoading.value = true
  try {
    const response = await useApiService.get('/api/v2/admin/identities', {
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
    const response = await useApiService.get(`/api/v2/admin/identities/${id}`)

    selectedEmail.value = response.data.email
    selectedName.value = response.data.username
    selectedId.value = response.data.id
    selectedPhoneNumber.value = response.data.phoneNumber
    dialogVisible.value = true
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}

const toggleUserStatus = async (id) => {
  const token = localStorage.getItem('v2_token')
  try {
    const res = await $fetch(`/api/v2/admin/identities/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      } })
    if (res.succeeded) {
      $toast.success('User Status Toggled Successfully')
      fetchUsers()
    }
    else
      $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}

const deleteUser = async () => {
  try {
    const res = await useApiService.remove(`/api/v2/admin/identities/${selectedDeleteId.value}`)

    list.value = list.value.filter(i => i.id !== selectedDeleteId.value)
    filteredList.value = list.value
    if (res.succeeded === true)
      $toast.success('User deleted successfully!')
    else
      $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    isDeleteModalOpen.value = false
    dialogVisible.value = false
    fetchUsers()
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
      await deleteUser()
    }

    selected.value = []
    $toast.success('All selected Users deleted!')
  }
}

onMounted(() => {
  selectedAction.value = allActions[0].label
  selectedPageSize.value = allPageSize[0].value
  fetchUsers()
})

watch(page, () => {
  filter.value = 'all'
  fetchUsers()
})

watch(selectedPageSize, () => {
  page.value = 1
  fetchUsers()
})
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4 flex-row">
      <v-btn
        class="rounded-pill gtext-t5 bg-primary-gray-700 text-white ml-4"
        @click="showAddUserDialog= true"
      >
        <span>New User</span>
      </v-btn>
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
        <template #[`item.username`]="{ item }">
          <div class="d-flex align-center">
            <span class="truncate-text">{{ item.username }}</span>
          </div>
        </template>

        <template #[`item.email`]="{ item }">
          <div class="d-flex align-center">
            <span class="truncate-text">{{ item.email }}</span>
          </div>
        </template>

        <template #[`header.actions`]>
          <div class="d-flex justify-end pr-6">
            Actions
          </div>
        </template>

        <template #[`item.enabled`]="{ item }">
          <span
            v-if="item.enabled == true"
            class="gtext-t5 green-12b76a"
          >enable</span>
          <span
            v-else
            class="gtext-t5 red-F04438"
          >disable</span>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-end pr-2">
            <v-btn
              variant="plain"
              class="px-0 min-width-10"
            >
              <v-icon
                small
                class="mr-2 gtext-t1"
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
                class="mr-2 gtext-t1"
                @click="toggleUserStatus(item.id)"
              >
                mdi mdi-account-alert
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Toggle status
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

      <UserDetailModal
        :id="selectedId"
        v-model="dialogVisible"
        :username="selectedName"
        :email="selectedEmail"
        :phone-number="selectedPhoneNumber"
        @fetch-user="fetchUsers"
      />

      <DeleteItemModal
        v-model="isDeleteModalOpen"
        @confirm="deleteUser"
      />
      <addUserDialog
        v-model="showAddUserDialog"
        @confirm="deleteUser"
        @fetch-user="fetchUsers"
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

        <!-- Pagination (hidden on mobile) -->
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

      <!-- Pagination (visible only on xs) -->
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
  position: relative;
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

.truncate-text {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Vuetify 3 uses a wrapper div inside the table */
:deep(.v-data-table thead) {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #F2F4F7 !important; /* Your desired header color */
}

/* Optional: give each header cell a background too */
:deep(.v-data-table thead th) {
  background-color: #F2F4F7 !important;
}

.red-F04438{
  color: #F04438;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1px solid #F04438;
}
.green-12b76a{
  color: #12b76a;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1px solid #12b76a;
}

.min-width-10{
  min-width: 10px !important;
  height: 10px !important;
}
</style>
