<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start">
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
      <div class="d-flex align-center justify-end ga-1">
        <v-btn
          variant="plain"
          max-width="20"
          @click="showSearchModal = true"
        >
          <v-icon
            size="26"
            color="grey500"
          >
            md:search
          </v-icon>
        </v-btn>

        <span
          class="text-grey400 text-no-wrap text-h5 font-weight-semibold"
        >
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Transactions
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
              :class="`bg-grey100 text-grey700 text-h5 font-weight-bold pa-2 th-min-width ${
                index == 0 || index == columns.length - 1
                  ? `text-left`
                  : `text-center`
              } ${index == columns.length - 1 ? `description-width` : ``}`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.userId`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold"
          >
            {{ item.userId }}
          </div>
        </template>

        <template #[`item.points`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ $numberFormat(item.points) }}
          </div>
        </template>
        <template #[`item.currentBalance`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ $numberFormat(item.currentBalance) }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ $dayjs(item.creationDate).format("DD/MM/YYYY") }}
          </div>
        </template>

        <template #[`item.isDebit`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-end font-weight-bold ga-1"
          >
            <v-icon
              :class="`${item.isDebit ? `reverse-icon` : ``}`"
              size="26"
              :color="item.isDebit ? `error` : `success`"
            >
              md:payment_arrow_down
            </v-icon>
            <span :class="`${item.isDebit ? `text-error` : `text-success`}`">{{
              item.isDebit ? "Debit" : "Credit"
            }}</span>
          </div>
        </template>

        <template #[`item.description`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold"
          >
            {{ item.description }}
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

    <AdminCommonModal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <div class="w-100 d-flex flex-column pa-4">
        <v-text-field
          v-model="userId"
          label="User ID"
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
        />
        <v-text-field
          v-model="name"
          label="Name"
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
        />
        <v-text-field
          v-model="email"
          label="Email"
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
        />
        <v-text-field
          v-model="identifierId"
          label="Identifier ID"
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
        />

        <v-menu
          v-model="startDateMenuOpen"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="startDate"
              readonly
              rounded="lg"
              variant="outlined"
              color="primary"
              density="compact"
              class="mt-1"
              v-bind="props"
              label="Start Date"
              clearable
            />
          </template>
          <v-date-picker
            v-model="startDate"
            color="primary"
            @update:model-value="() => (startDateMenuOpen = false)"
          />
        </v-menu>

        <v-menu
          v-model="endDateMenuOpen"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="endDate"
              readonly
              rounded="lg"
              variant="outlined"
              color="primary"
              density="compact"
              class="mt-1"
              v-bind="props"
              label="End Date"
            />
          </template>
          <v-date-picker
            v-model="endDate"
            color="primary"
            @update:model-value="() => (endDateMenuOpen = false)"
          />
        </v-menu>
        <v-select
          v-model="isDebitFilter"
          :items="isDebitOptions"
          item-title="label"
          item-value="value"
          label="Transaction Type"
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
          clearable
        />

        <v-btn
          color="primary"
          rounded="xl"
          height="40"
          width="200"
          class="text-h5 mt-4 mx-auto"
          :loading="loading"
          flat
          @click="startSearch"
        >
          Search
        </v-btn>
      </div>
    </AdminCommonModal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type {
  ApiResult,
  AppError,
  ResponseListDTO,
  AdminTransactionDTO,
} from '~/types/api'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { $dayjs, $toast } = useNuxtApp()

const headers = [
  { title: 'User ID', key: 'userId', sortable: false, width: '5vw' },
  { title: 'Points', key: 'points', sortable: false, width: '15vw' },
  {
    title: 'Current Balance',
    key: 'currentBalance',
    sortable: false,
    width: '15vw',
  },
  {
    title: 'Creation Date',
    key: 'creationDate',
    sortable: false,
    width: '15vw',
  },
  { title: 'Type', key: 'isDebit', sortable: false, width: '10vw' },
  { title: 'Description', key: 'description', sortable: false, width: '40vw' },
]
const list = ref<AdminTransactionDTO[]>([])
const loading = ref(true)
const totalCount = ref(0)
const showSearchModal = ref(false)
const pageSize = ref(10)
const page = ref(1)
const pageCount = ref(0)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const isDebitFilter = ref(null)
const isDebitOptions = [
  { label: 'All', value: null },
  { label: 'Debit (Money Out)', value: true },
  { label: 'Credit (Money In)', value: false },
]
const userId = ref('')
const name = ref('')
const email = ref('')
const identifierId = ref('')

const startDateMenuOpen = ref(false)
const startDate = ref('')
const endDateMenuOpen = ref(false)
const endDate = ref('')

const getData = async () => {
  loading.value = true
  try {
    const response = await useApiService.get<
      ApiResult<ResponseListDTO<AdminTransactionDTO>>
    >('/api/v2/admin/transactions', {
      'PagingDto.PageFilter.Size': pageSize.value,
      'PagingDto.PageFilter.Skip': (page.value - 1) * pageSize.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      'IsDebit': isDebitFilter.value !== null ? isDebitFilter.value : null,
      'UserId': userId.value,
      'Name': name.value,
      'Email': email.value,
      'IdentifierId': identifierId.value,
      'StartDate': startDate.value ? dayjs(startDate.value).toISOString() : null,
      'EndDate': endDate.value ? dayjs(endDate.value).toISOString() : null,
    })
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

const startSearch = async () => {
  page.value = 1
  showSearchModal.value = false
  await getData()
}

const isShowClearFilter = computed(() => {
  if (
    isDebitFilter.value !== null
    || userId.value.length > 0
    || name.value.length > 0
    || email.value.length > 0
    || identifierId.value.length > 0
    || startDate.value.toString().length > 0
    || endDate.value.toString().length > 0
  ) {
    return true
  }
  return false
})

const clearFilter = async () => {
  isDebitFilter.value = null
  userId.value = ''
  name.value = ''
  email.value = ''
  identifierId.value = ''
  startDate.value = ''
  endDate.value = ''
  page.value = 1
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
