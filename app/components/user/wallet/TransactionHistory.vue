<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-column justify-start align-start">
      <div class="w-100 d-flex justify-space-between align-center">
        <h1 class="text-h4 font-weight-bold text-grey700">
          Transaction History
        </h1>

        <v-btn
          color="transparent"
          flat
          icon
          class="d-flex d-sm-none"
          @click="emit('showChart')"
        >
          <v-icon
            color="grey500"
            size="20"
          >
            md:show_chart
          </v-icon>
        </v-btn>
      </div>
      <div class="w-100 d-flex align-center ga-10 mt-6 mb-4 px-4">
        <span
          v-for="status in statusOption"
          :key="status"
          :class="`${status == statusSelect ?`text-primary`:`text-grey500`} text-h5 font-weight-regular cursor-pointer`"
          @click="changeFilterStatus(status)"
        >
          {{ status }}
          <div
            v-if="status == statusSelect"
            class="underline bg-primary w-100"
          />
        </span>
      </div>
    </div>
    <!-- Start Desktop -->
    <div
      v-if="loading"
      class="w-100 mt-4 d-none d-sm-flex"
    >
      <user-wallet-skeleton-table-desktop />
    </div>
    <div
      v-else
      class="w-100 mt-4 d-none d-sm-flex"
    >
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
              :class="`bg-grey100 text-grey700 text-h5 font-weight-medium pa-2 text-center
               ${index == 0 ? `text-start` : `th-min-width`}`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.description`]="{ item }">
          <div
            class="text-grey700 text-h6 d-flex justify-start align-center font-weight-medium"
          >
            {{ item.description }}
          </div>
        </template>

        <template #[`item.points`]="{ item }">
          <div
            class="text-grey700 text-h6 d-flex justify-center align-center font-weight-bold text-center ga-1"
          >
            {{ $numberFormat(item.points) }}<span class="text-subtitle-1 text-grey500 font-weight-regular">{{ item.points > 1 ? 'GEMS' : 'GEM' }}</span>
          </div>
        </template>
        <template #[`item.isDebit`]="{ item }">
          <div
            class="text-h6 d-flex justify-center align-end font-weight-regular ga-1"
          >
            <v-icon
              size="20"
              :color="item.isDebit ? `lightError` : `success`"
            >
              {{ item.isDebit ? `md:upload`:`md:download` }}
            </v-icon>
            <span :class="`${item.isDebit ? `text-lightError` : `text-success`}`">{{
              item.isDebit ? "Spent" : "Earned"
            }}</span>
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div
            class="text-grey500 text-h6 d-flex justify-center align-center font-weight-regular ga-1"
          >
            <v-icon
              size="18"
              color="grey300"
            >
              md:history
            </v-icon>
            {{ formatLocal(item.creationDate, "DD/MM/YYYY HH:mm") }}
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-none d-sm-flex mt-2 position-relative">
      <div
        class="w-100 d-flex justify-center mt-4"
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
    </div>
    <!-- End Desktop -->

    <div class="w-100 d-flex d-sm-none flex-column aligh-start justify-start">
      <template v-if="loading">
        <div
          v-for="i in 10"
          :key="i"
          :class="`${i%2 == 1 ? `bg-grey25 border-odd`:``} card-transaction-mobile w-100 d-flex flex-column align-start justift-start ga-3 pa-4`"
        >
          <v-skeleton-loader
            width="140"
            height="20"
            class="rounded-lg"
          />
          <v-skeleton-loader
            width="80"
            height="20"
            class="rounded-lg"
          />
          <div class="w-100 d-flex align-center justify-space-between">
            <v-skeleton-loader
              width="60"
              height="20"
              class="rounded-lg"
            />

            <v-skeleton-loader
              width="120"
              height="20"
              class="rounded-lg"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="`${index%2 == 0 ? `bg-grey25 border-odd`:``} card-transaction-mobile w-100 d-flex flex-column align-start justift-start ga-3 pa-4`"
        >
          <span
            class="text-grey700 text-h6 font-weight-medium"
          >
            {{ item.description }}
          </span>
          <span
            class="text-grey700 text-h6 d-flex align-center font-weight-bold text-center ga-1"
          >
            {{ $numberFormat(item.points) }}<span class="text-subtitle-1 text-grey500 font-weight-regular">Points</span>
          </span>
          <div class="w-100 d-flex align-center justify-space-between">
            <div
              class="text-h6 d-flex justify-center align-end font-weight-regular ga-1"
            >
              <v-icon
                size="20"
                :color="item.isDebit ? `lightError` : `success`"
              >
                {{ item.isDebit ? `md:upload`:`md:download` }}
              </v-icon>
              <span :class="`${item.isDebit ? `text-lightError` : `text-success`}`">{{
                item.isDebit ? "Spent" : "Earned"
              }}</span>
            </div>

            <span
              class="text-grey500 text-h6 d-flex justify-center align-center font-weight-regular ga-1"
            >
              <v-icon
                size="18"
                color="grey300"
              >
                md:history
              </v-icon>
              {{ formatLocal(item.creationDate, "DD/MM/YYYY HH:mm") }}
            </span>
          </div>
        </div>
      </template>

      <div
        ref="lineSpecifierLoadMoreRef"
        class="line-specifier-load-more"
      />
      <template v-if="isPaginationLoading">
        <div
          class=" card-transaction-mobile w-100 d-flex flex-column align-start justift-start ga-3 pa-4"
        >
          <v-skeleton-loader
            width="140"
            height="20"
            class="rounded-lg"
          />
          <v-skeleton-loader
            width="80"
            height="20"
            class="rounded-lg"
          />
          <div class="w-100 d-flex align-center justify-space-between">
            <v-skeleton-loader
              width="60"
              height="20"
              class="rounded-lg"
            />

            <v-skeleton-loader
              width="120"
              height="20"
              class="rounded-lg"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  AppError,
  ResponseListDTO,
  TransactionDTO,
} from '@/types'

const { $toast, $numberFormat } = useNuxtApp()
const { formatLocal } = useDateTime()
const emit = defineEmits(['showChart'])

const headers = [
  { title: 'Description', key: 'description', sortable: false, width: '35vw' },
  { title: 'Amount', key: 'points', sortable: false, width: '20vw' },
  {
    title: 'State',
    key: 'isDebit',
    sortable: false,
    width: '10vw',
  },
  { title: 'Date', key: 'creationDate', sortable: false, width: '35vw' },
]
const list = ref<TransactionDTO[]>([])
const loading = ref(true)
const totalCount = ref(0)
const pageSize = ref(10)
const page = ref(1)
const pageCount = ref(0)
const statusOption = ['All', 'Earned', 'Spent']
const statusSelect = ref('All')
const isAllDataLoaded = ref(false)
const isPaginationLoading = ref(false)
const lineSpecifierLoadMoreRef = ref<HTMLElement>()

const getData = async () => {
  try {
    const params: Record<string, string | number | boolean | null> = {
      'PagingDto.PageFilter.Size': pageSize.value,
      'PagingDto.PageFilter.Skip': (page.value - 1) * pageSize.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    }
    if (statusSelect.value != 'All') {
      params[`IsDebit`] = statusSelect.value == 'Earned' ? false : true
    }
    const response = await useApiService.get<
      ApiResult<ResponseListDTO<TransactionDTO>>
    >('/api/v2/transactions', params)

    if (response.data) {
      return response.data
    }
    else {
      return {
        list: [] as TransactionDTO[],
        totalRecordsCount: 0,
        num: 0,
      }
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
    return {
      list: [] as TransactionDTO[],
      totalRecordsCount: 0,
      num: 0,
    }
  }
  finally {
    loading.value = false
    isPaginationLoading.value = false
  }
}

const setData = (data: ResponseListDTO<TransactionDTO>) => {
  list.value = data.list
  totalCount.value = data.totalRecordsCount
  pageCount.value = Math.ceil(totalCount.value / pageSize.value)
}

const changeFilterStatus = async (status: string) => {
  if (status != statusSelect.value) {
    statusSelect.value = status
    page.value = 1
    loading.value = true
    isAllDataLoaded.value = false
    const data = await getData()
    setData(data)
  }
}

const changePageNumber = async () => {
  loading.value = true
  const data = await getData()
  setData(data)
}

onMounted(async () => {
  setupScrollListener()
  loading.value = true
  const data = await getData()
  setData(data)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollListener)
})

const setupScrollListener = () => {
  window.addEventListener('scroll', handleScrollListener)
}
const setDataInifiniteScroll = (data: ResponseListDTO<TransactionDTO>) => {
  list.value = [...list.value, ...data.list]
  totalCount.value = data.totalRecordsCount
  pageCount.value = Math.ceil(totalCount.value / pageSize.value)
  if (data.list.length < pageSize.value) {
    isAllDataLoaded.value = true
  }
}
const handleScrollListener = async () => {
  const targetDiv = lineSpecifierLoadMoreRef.value
  if (targetDiv) {
    const rect = targetDiv.getBoundingClientRect()
    const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight

    if (
      isDivInView
      && !loading.value
      && !isPaginationLoading.value
      && !isAllDataLoaded.value
    ) {
      isPaginationLoading.value = true
      page.value += 1

      const data = await getData()
      setDataInifiniteScroll(data)
    }
  }
}
</script>

<style scoped>
.underline{
  height: 2px;
}
.border-odd{
  border-top : 2px solid rgb(var(--v-theme-grey100));
  border-bottom : 2px solid rgb(var(--v-theme-grey100))
}
.line-specifier-load-more {
  width: 100%;
  height: 6px;
}
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
