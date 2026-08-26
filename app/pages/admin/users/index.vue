<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start position-relative flex-wrap ga-2">
        <div class="btn-filter-container d-none d-md-flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill">
          <v-btn
            v-for="status in statusList"
            :key="status"
            rounded="pill"
            :color="status == statusSelect ? `primary`:`transparent`"
            flat
            height="40"
            @click="changeFilterStatus(status)"
          >
            <span :class="`${status == statusSelect ? `text-grey900`:`text-grey500`} font-weight-bold text-h5`">{{ status }}</span>
          </v-btn>
        </div>

        <div class="filter-mobile-container d-flex d-md-none align-center justify-start">
          <common-gombo-box
            v-model="statusSelect"
            label="Status"
            :items="statusList.map((item) => ({
              id: item,
              title: item,
            }))"
            @update:model-value="changeFilterStatus"
          />
        </div>
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-start ga-2 mt-4">
      <v-btn
        rounded="pill"
        color="primary"
        flat
        variant="outlined"
        height="40"
        @click="showAddUserModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Add User</span>
      </v-btn>

      <v-btn
        v-if="isShowClearFilter"
        color="primary"
        rounded="pill"
        height="40"
        width="120"
        class="text-h5 font-weight-bold "
        flat
        variant="outlined"
        @click="clearFilter"
      >
        Clear Filter
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
      item-label="Users"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    >
      <template #actions>
        <v-btn
          variant="plain"
          max-width="20"
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
      </template>
    </common-data-table>

    <admin-common-delete-modal
      v-model="showDeleteModal"
      :loading="loadingDeleteItem"
      @confirm="confirmDelete"
    />

    <admin-common-confirm-modal
      v-model="showToggleStatusModal"
      text="Are you sure you want to change status this user?"
      :loading="loadingToggleStatus"
      @confirm="confirmToggleStatus"
    />

    <admin-common-modal
      v-model:show-dialog="showAddUserModal"
      title="Add"
    >
      <admin-usermanagement-add-user-modal @add-user-success-full="addUserSuccessfull" />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-usermanagement-search-modal
        :data="searchFilter"
        @search="startSearch"
      />
    </admin-common-modal>

    <admin-usermanagement-more-action-modal
      :id="selectedItemIdForMoreAction"
      v-model:show-dialog="moreActionModal"
      @refresh-data="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  AdminUserDTO,
  DataTableHeader,
  SearchFilterUser,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { loadingGetData: loading, data: list, getData, totalCount, pageCount, deleteItem, loadingDeleteItem, toggleStatus, loadingToggleStatus } = useUserManagerAdmin()

const headers: DataTableHeader<AdminUserDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw', align: 'start' },
  { title: 'Username', key: 'username', sortable: false, width: '10vw', emptyText: 'unknown' },
  {
    title: 'Name',
    key: 'firstName',
    sortable: false,
    width: '10vw',
    emptyText: 'unknown',
    getText: (item: AdminUserDTO) => getFullName(item),
  },
  { title: 'Email', key: 'email', sortable: false, width: '15vw' },
  { title: 'Phone Number', key: 'phoneNumber', sortable: false, width: '10vw' },
  {
    title: 'Status',
    key: 'enabled',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getText: (item: AdminUserDTO) => item.enabled ? 'Enable' : 'Disable',
    getChipColor: (item: AdminUserDTO) => item.enabled ? 'success' : 'error',
  },
  {
    title: 'Registration Date',
    key: 'registrationDate',
    sortable: false,
    width: '10vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
  },
  { title: 'ReferralId', key: 'referralId', sortable: false, width: '10vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:person',
        tooltip: 'Toggle status',
        onClick: (item: AdminUserDTO) => openModalToggleStatus(item),
      },
      {
        icon: 'md:delete',
        tooltip: 'delete',
        onClick: (item: AdminUserDTO) => openModalDelete(item),
      },
      {
        icon: 'md:settings',
        tooltip: 'More',
        onClick: (item: AdminUserDTO) => openModalMoreAction(item),
      },
    ],
  },
]
const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]
const statusSelect = ref('All')
const statusList = ['All', 'With Referral', 'Without Referral']
const showDeleteModal = ref(false)
const selectedItemIdForDelete = ref('')
const showToggleStatusModal = ref(false)
const selectedItemIdForToggleStatus = ref('')
const showAddUserModal = ref(false)
const moreActionModal = ref(false)
const selectedItemIdForMoreAction = ref('')
const showSearchModal = ref(false)
const searchFilter = reactive<SearchFilterUser>({
  firstName: '',
  lastName: '',
  email: '',
  referralId: '',
})

const fetchUsers = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    hasReferral: statusSelect.value == 'All' ? null : statusSelect.value == 'With Referral' ? true : false,
    ...searchFilter,
  })
}

const changeFilterStatus = async (status: string | number) => {
  if (status == '') {
    statusSelect.value = 'All'
  }
  else {
    statusSelect.value = status as string
  }
  page.value = 1
  await fetchUsers()
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchUsers()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchUsers()
}

onMounted(async () => {
  await fetchUsers()
})

const openModalDelete = (user: AdminUserDTO) => {
  selectedItemIdForDelete.value = user.id.toString()
  showDeleteModal.value = true
}
const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchUsers()
}

const openModalToggleStatus = (user: AdminUserDTO) => {
  selectedItemIdForToggleStatus.value = user.id.toString()
  showToggleStatusModal.value = true
}
const confirmToggleStatus = async () => {
  await toggleStatus(selectedItemIdForToggleStatus.value)
  selectedItemIdForToggleStatus.value = ''
  showToggleStatusModal.value = false
  await fetchUsers()
}

const addUserSuccessfull = async () => {
  showAddUserModal.value = false
  await fetchUsers()
}

const openModalMoreAction = (user: AdminUserDTO) => {
  selectedItemIdForMoreAction.value = user.id.toString()
  moreActionModal.value = true
}

const refreshData = async () => {
  await fetchUsers()
}

const getFullName = (user: AdminUserDTO) => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()

  return fullName || 'unknown'
}

const isShowClearFilter = computed(() => {
  if (
    searchFilter.firstName.length > 0
    || searchFilter.lastName.length > 0
    || searchFilter.email.length > 0
    || searchFilter.referralId.length > 0
  ) {
    return true
  }
  return false
})

const clearFilter = async () => {
  searchFilter.firstName = ''
  searchFilter.lastName = ''
  searchFilter.email = ''
  searchFilter.referralId = ''
  page.value = 1
  await fetchUsers()
}

const startSearch = async (item: SearchFilterUser) => {
  searchFilter.firstName = item.firstName
  searchFilter.lastName = item.lastName
  searchFilter.email = item.email
  searchFilter.referralId = item.referralId
  page.value = 1
  showSearchModal.value = false
  await fetchUsers()
}
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
