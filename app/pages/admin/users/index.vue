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
      <div class="d-flex align-center justify-end ga-1 flex-wrap">
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

        <span
          class="text-grey400 text-no-wrap text-h5 font-weight-semibold"
        >
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Users
        </span>
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
    <div class="w-100 mt-4">
      <v-data-table
        :headers="headers"
        :items="list"
        :items-per-page="pageSize"
        class="elevation-1 set-height-table"
        :loading="loading"
        fixed-header
        hide-default-footer
      >
        <template #headers="{ columns }">
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="`bg-grey100 text-grey700 text-h5 font-weight-bold pa-2 text-center
               ${index == 0 ? `` : `th-min-width`}`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.id`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold"
          >
            {{ item.id }}
          </div>
        </template>

        <template #[`item.username`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center"
          >
            {{ !item.username ? `unknown` : item.username }}
          </div>
        </template>
        <template #[`item.firstName`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center"
          >
            {{ !item.firstName && !item.lastName ? `unknown` : (item.firstName ? item.firstName : "") + " "+ (item.lastName ? item.lastName : "") }}
          </div>
        </template>
        <template #[`item.email`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ item.email }}
          </div>
        </template>
        <template #[`item.phoneNumber`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ !item.phoneNumber ? '-' : item.phoneNumber }}
          </div>
        </template>
        <template #[`item.enabled`]="{ item }">
          <div
            class="w-100 d-flex justify-center align-center"
          >
            <v-chip
              :color="item.enabled ? `success`:`error`"
              class="font-weight-bold text-h5"
            >
              {{ item.enabled ? `Enable`:`Disable` }}
            </v-chip>
          </div>
        </template>

        <template #[`item.registrationDate`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold"
          >
            {{ formatLocal(item.registrationDate, "DD/MM/YYYY HH:mm:ss") }}
          </div>
        </template>

        <template #[`item.referralId`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold"
          >
            {{ !item.referralId ? '-': item.referralId }}
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div
            class="d-flex justify-center align-center"
          >
            <v-btn
              icon
              flat
              @click="openModalToggleStatus(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:person
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Toggle status
              </v-tooltip>
            </v-btn>
            <v-btn
              icon
              flat
              @click="openModalDelete(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:delete
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                delete
              </v-tooltip>
            </v-btn>
            <v-btn
              icon
              flat
              @click="openModalMoreAction(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:settings
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                More
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div
        class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4"
      >
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="4"
          next-icon="md:arrow_forward"
          prev-icon="md:arrow_back"
          size="40"
          class="custom-pagination"
          @update:model-value="changePageNumber"
        />
      </div>

      <div class="position-absolute right-0 select-size-div">
        <v-select
          v-model="pageSize"
          :items="allPageSize"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          rounded
          hide-details
          max-width="140"
          class="rounded-pill"
          @update:model-value="changePageSize"
        />
      </div>
    </div>

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
  SearchFilterUser,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { loadingGetData: loading, data: list, getData, totalCount, pageCount, deleteItem, loadingDeleteItem, toggleStatus, loadingToggleStatus } = useUserManagerAdmin()
const { formatLocal } = useDateTime()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw' },
  { title: 'Username', key: 'username', sortable: false, width: '10vw' },
  {
    title: 'Name',
    key: 'firstName',
    sortable: false,
    width: '10vw',
  },
  { title: 'Email', key: 'email', sortable: false, width: '15vw' },
  { title: 'Phone Number', key: 'phoneNumber', sortable: false, width: '10vw' },
  { title: 'Status', key: 'enabled', sortable: false, width: '10vw' },
  { title: 'Registration Date', key: 'registrationDate', sortable: false, width: '10vw' },
  { title: 'ReferralId', key: 'referralId', sortable: false, width: '10vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
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

const changePageNumber = async () => {
  await fetchUsers()
}

const changePageSize = async () => {
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
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.description-width {
  min-width: 200px;
}
.reverse-icon {
  transform: rotateZ(180deg);
}
.select-size-div {
  top: 18px;
}
.btn-filter-container{
  height : 48px;
}
.filter-mobile-container{
  width: 170px;
}

:deep(.custom-pagination li button:hover) {
  background-color: rgb(var(--v-theme-primary));
  opacity: 0.6;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background: rgb(var(--v-theme-primary)) !important;
}
:deep(.custom-pagination .v-pagination__item--is-active .v-btn__overlay){
  opacity: 0 !important;
}
</style>
