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

        <v-menu
          transition="slide-x-transition"
          offset-y
          :close-on-content-click="false"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="primary"
              rounded="xl"
              height="40"
              width="120"
              class="text-h5"
              flat
              variant="outlined"
            >
              Sort
            </v-btn>
          </template>
          <v-list
            density="compact"
            min-width="250"
            nav
            bg-color="#f9fafb"
            class="rounded-lg mt-1"
          >
            <v-list-item
              v-for="sortItem in sortList"
              :key="sortItem.value"
            >
              <v-checkbox
                :model-value="sortSelected.includes(sortItem.value)"
                color="primary"
                class="text-h4"
                hide-details
                false-icon="md:check_box_outline_blank"
                true-icon="md:check_box"
                @click.stop
                @update:model-value="
                  (val) => handleCheckboxChange(val, sortItem)
                "
              >
                <template #label>
                  <span class="text-h5 font-weight-medium ml-2">{{
                    sortItem.title
                  }}</span>
                </template>
              </v-checkbox>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="d-flex align-center justify-end ga-1">
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

        <span
          class="text-grey400 text-no-wrap text-h5 font-weight-semibold"
        >
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Payments
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
              :class="`bg-grey100 text-grey700 text-h5 font-weight-bold pa-2 ${
                index == columns.length - 1
                  ? `text-left`
                  : `text-center`
              } ${index == columns.length - 1 ? `description-width` : ``}
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

        <template #[`item.firstName`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center"
          >
            {{ !item.firstName && !item.lastName ? `unknown` : item.firstName + ` ` + item.lastName }}
          </div>
        </template>
        <template #[`item.amount`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ formatAmount(item.amount, item.currency) }}
          </div>
        </template>

        <template #[`item.currency`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ item.currency }}
          </div>
        </template>

        <template #[`item.status`]="{ item }">
          <div
            class="w-100 d-flex justify-center align-center"
          >
            <v-chip
              :color="getColorBadgeStatus(item.status)"
              class="font-weight-bold text-h5"
            >
              {{ item.status }}
            </v-chip>
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold"
          >
            {{ $dayjs(item.creationDate).format("DD/MM/YYYY HH:mm:ss") }}
          </div>
        </template>

        <template #[`item.verifyDate`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold"
          >
            {{ item.verifyDate ? $dayjs(item.verifyDate).format("DD/MM/YYYY HH:mm:ss") : 'Pending' }}
          </div>
        </template>

        <template #[`item.sourceWallet`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold ga-2 cursor-pointer"
            @click="copyWalletAddress(item.sourceWallet)"
          >
            {{ item.sourceWallet ? shortenWallet(item.sourceWallet) : 'unknown' }}

            <v-icon v-if="item.sourceWallet">
              md:content_copy_outlined
            </v-icon>
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
  AdminPaymentDTO,
  StatusPayment,
  CurrencyPayment,
} from '~/types/api'
import { TOKEN_DECIMALS } from '~/composables/useJupiterSwap'

interface SortOption {
  title: string
  value: string
}

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { $dayjs, $toast } = useNuxtApp()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw' },
  { title: 'User', key: 'firstName', sortable: false, width: '15vw' },
  {
    title: 'Amount',
    key: 'amount',
    sortable: false,
    width: '10vw',
  },
  {
    title: 'Currency',
    key: 'currency',
    sortable: false,
    width: '5vw',
  },
  { title: 'Status', key: 'status', sortable: false, width: '10vw' },
  { title: 'Created At', key: 'creationDate', sortable: false, width: '10vw' },
  { title: 'Verify At', key: 'verifyDate', sortable: false, width: '10vw' },
  { title: 'Source Wallet', key: 'sourceWallet', sortable: false, width: '35vw' },
]
const list = ref<AdminPaymentDTO[]>([])
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

const userId = ref('')
const identifierId = ref('')

const startDateMenuOpen = ref(false)
const startDate = ref('')
const endDateMenuOpen = ref(false)
const endDate = ref('')
const sortSelected = ref<string[]>([])
const sortList = [
  {
    value: 'creationDate',
    title: 'Creation Date',
  },
]

const getData = async () => {
  loading.value = true
  try {
    const params: Record<string, string | number | boolean | null> = {
      'PagingDto.PageFilter.Size': pageSize.value,
      'PagingDto.PageFilter.Skip': (page.value - 1) * pageSize.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      'UserId': userId.value,
      'IdentifierId': identifierId.value,
      'StartDate': startDate.value ? dayjs(startDate.value).toISOString() : null,
      'EndDate': endDate.value ? dayjs(endDate.value).toISOString() : null,
    }
    if (sortSelected.value && sortSelected.value.length > 0) {
      sortSelected.value.forEach((sortOption, index) => {
        params[`PagingDto.SortFilter[${index}].sortType`] = 'Asc'
        params[`PagingDto.SortFilter[${index}].column`] = sortOption
      })
    }
    const response = await useApiService.get<
      ApiResult<ResponseListDTO<AdminPaymentDTO>>
    >('/api/v2/admin/payments', params)
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
    userId.value.length > 0
    || identifierId.value.length > 0
    || startDate.value.toString().length > 0
    || endDate.value.toString().length > 0
  ) {
    return true
  }
  return false
})

const clearFilter = async () => {
  userId.value = ''
  identifierId.value = ''
  startDate.value = ''
  endDate.value = ''
  page.value = 1
  await getData()
}

const getColorBadgeStatus = (status: StatusPayment) => {
  switch (status) {
    case 'Paid':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Failed':
      return 'error'

    default:
      return 'warning'
  }
}
const shortenWallet = (address: string) => {
  return (
    address.slice(0, 4)
    + '...'
    + address.slice(-4)
  )
}

const copyWalletAddress = (address: string | null | undefined) => {
  if (address) {
    navigator.clipboard.writeText(address)
    $toast.info('Wallet address copy in your clipboard')
  }
}

const formatAmount = (amount: number, currency: CurrencyPayment) => {
  const decimals = TOKEN_DECIMALS[currency]
  const value = amount / (10 ** decimals)
  const fixValue = value
    .toFixed(decimals)
    .replace(/\.?0+$/, '')

  return fixValue
}

const handleCheckboxChange = async (checked: boolean | null, item: SortOption) => {
  const index = sortSelected.value.indexOf(item.value)
  if (checked && index === -1) {
    sortSelected.value.push(item.value)
  }
  else if (!checked && index !== -1) {
    sortSelected.value.splice(index, 1)
  }
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
