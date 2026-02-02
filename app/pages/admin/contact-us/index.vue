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

        <div class="filter-mobile-container d-flex d-md-none align-center justify-center">
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
      <div class="d-flex align-center justify-end ga-1">
        <span
          class="text-grey400 text-no-wrap text-h5 font-weight-semibold"
        >
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Contacts
        </span>
      </div>
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

        <template #[`item.fullName`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center"
          >
            {{ !item.fullName ? `unknown` : item.fullName }}
          </div>
        </template>
        <template #[`item.email`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ item.email }}
          </div>
        </template>

        <template #[`item.subject`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold"
          >
            {{ item.subject }}
          </div>
        </template>

        <template #[`item.isRead`]="{ item }">
          <div
            class="w-100 d-flex justify-center align-center"
          >
            <v-chip
              :color="item.isRead ? `success`:`warning`"
              class="font-weight-bold text-h5"
            >
              {{ item.isRead ? `Read`:`UnRead` }}
            </v-chip>
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div
            class="d-flex justify-center align-center"
          >
            <v-btn
              icon
              flat
              @click="viewDetail(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:plagiarism
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Details
              </v-tooltip>
            </v-btn>
            <v-btn
              icon
              flat
              @click="deleteContact(item)"
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
    >
      <admin-contactus-view-message-details-modal
        :id="selectedItemIdForDetail"
        @reply-success-full="replySuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  AppError,
  ResponseListDTO,
  AdminContactUsDTO,
} from '~/types/api'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { $toast } = useNuxtApp()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw' },
  { title: 'User', key: 'fullName', sortable: false, width: '15vw' },
  {
    title: 'Email',
    key: 'email',
    sortable: false,
    width: '15vw',
  },
  { title: 'Subject', key: 'subject', sortable: false, width: '20vw' },
  { title: 'Status', key: 'isRead', sortable: false, width: '10vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
  },
]
const list = ref<AdminContactUsDTO[]>([])
const loading = ref(true)
const totalCount = ref(0)
const pageSize = ref(10)
const page = ref(1)
const pageCount = ref(0)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]
const statusSelect = ref('All')
const statusList = ['All', 'Read', 'UnRead']
const showDeleteModal = ref(false)
const selectedItemIdForDelete = ref('')
const showDetailModal = ref(false)
const selectedItemIdForDetail = ref()

const getData = async () => {
  loading.value = true
  try {
    const params: Record<string, string | number | boolean | null> = {
      'PagingDto.PageFilter.Size': pageSize.value,
      'PagingDto.PageFilter.Skip': (page.value - 1) * pageSize.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    }
    if (statusSelect.value != 'All') {
      params[`PagingDto.SearchFilter.phrase`] = statusSelect.value == 'Read' ? true : false
      params[`PagingDto.SearchFilter.column`] = 'isRead'
    }
    const response = await useApiService.get<
      ApiResult<ResponseListDTO<AdminContactUsDTO>>
    >('/api/v2/admin/contacts', params)
    if (response.data) {
      list.value = response.data.list
      totalCount.value = response.data.totalRecordsCount
      pageCount.value = Math.ceil(totalCount.value / pageSize.value)
    }
    else {
      list.value = []
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }
  finally {
    loading.value = false
  }
}

const changeFilterStatus = async (status: string) => {
  if (status == '') {
    statusSelect.value = 'All'
  }
  else {
    statusSelect.value = status
  }
  page.value = 1
  await getData()
}

const changePageNumber = async () => {
  await getData()
}

const changePageSize = async () => {
  page.value = 1
  await getData()
}

onMounted(async () => {
  await getData()
})

const viewDetail = async (contact: AdminContactUsDTO) => {
  contact.isRead = true
  selectedItemIdForDetail.value = contact.id
  showDetailModal.value = true
}

const replySuccessFull = () => {
  selectedItemIdForDetail.value = null
  showDetailModal.value = false
}

const deleteContact = (contact: AdminContactUsDTO) => {
  selectedItemIdForDelete.value = contact.id.toString()
  showDeleteModal.value = true
}
const deleteSuccessFull = async () => {
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await getData()
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
