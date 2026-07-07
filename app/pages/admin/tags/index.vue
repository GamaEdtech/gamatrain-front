<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start position-relative flex-wrap ga-2">
        <div class="btn-filter-container d-none d-md-flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill">
          <v-btn
            v-for="tagType in TAG_TYPE_FILTER_LIST"
            :key="tagType.id"
            rounded="pill"
            :color="tagType.id === selectedTagType ? `primary` : `transparent`"
            flat
            height="40"
            @click="changeFilterTagType(tagType.id)"
          >
            <span :class="`${tagType.id === selectedTagType ? `text-grey900` : `text-grey500`} font-weight-bold text-h5`">
              {{ tagType.title }}
            </span>
          </v-btn>
        </div>

        <div class="filter-mobile-container d-flex d-md-none align-center justify-start">
          <common-gombo-box
            v-model="selectedTagType"
            label="Tag Type"
            :items="TAG_TYPE_FILTER_LIST"
            @update:model-value="changeFilterTagType"
          />
        </div>
      </div>

      <div class="d-flex align-center justify-end ga-2 flex-wrap">
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
        <span
          class="text-grey400 text-no-wrap text-h5 font-weight-semibold"
        >
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Tags
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
        @click="showAddModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Add Tag</span>
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
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.id }}
          </div>
        </template>

        <template #[`item.name`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.name }}
          </div>
        </template>

        <template #[`item.tagType`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              color="info"
              class="font-weight-bold text-h5"
            >
              {{ item.tagType }}
            </v-chip>
          </div>
        </template>

        <template #[`item.icon`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.icon }}
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div class="d-flex justify-center align-center">
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
              @click="openDetailModal(item)"
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
                Detail
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4">
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

    <admin-common-modal
      v-model:show-dialog="showAddModal"
      title="Add"
    >
      <admin-tags-modals-add @add-item-success-full="addItemSuccessFull" />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="showDetailModal"
      title="Edit"
    >
      <admin-tags-modals-detail
        :id="selectedItemIdForDetail"
        @edit-item-success-full="editItemSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import { TAG_TYPE_FILTER_LIST } from '@/constants'
import type { AdminTagDTO, TagTypeDTO } from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  deleteItem,
  loadingDeleteItem,
} = useTagAdmin()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw' },
  { title: 'Name', key: 'name', sortable: false, width: '25vw' },
  { title: 'Tag Type', key: 'tagType', sortable: false, width: '20vw' },
  { title: 'Icon', key: 'icon', sortable: false, width: '25vw' },
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

const selectedTagType = ref<TagTypeDTO | ''>('')
const showDeleteModal = ref(false)
const selectedItemIdForDelete = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedItemIdForDetail = ref('')

const fetchTags = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    tagType: selectedTagType.value,
  })
}

const changeFilterTagType = async (tagType: string | number) => {
  selectedTagType.value = tagType as TagTypeDTO | ''
  page.value = 1
  await fetchTags()
}

const changePageNumber = async () => {
  await fetchTags()
}

const changePageSize = async () => {
  page.value = 1
  await fetchTags()
}

onMounted(async () => {
  await fetchTags()
})

const addItemSuccessFull = async () => {
  showAddModal.value = false
  await fetchTags()
}

const openModalDelete = (item: AdminTagDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchTags()
}

const openDetailModal = (item: AdminTagDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

const editItemSuccessFull = async () => {
  showDetailModal.value = false
  await fetchTags()
}

const refreshData = async () => {
  await fetchTags()
}
</script>

<style scoped>
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.select-size-div {
  top: 18px;
}
.btn-filter-container{
  min-height : 48px;
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
