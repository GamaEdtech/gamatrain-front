<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex align-center justify-space-between ga-2 mt-4">
      <v-btn
        rounded="pill"
        color="primary"
        flat
        variant="outlined"
        height="40"
        @click="showAddModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Add Plan</span>
      </v-btn>

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
        <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold">
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Plans
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
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.id }}
          </div>
        </template>

        <template #[`item.title`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.title }}
          </div>
        </template>

        <template #[`item.isActive`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              :color="item.isActive ? `success` : `error`"
              class="font-weight-bold text-h5"
            >
              {{ item.isActive ? `Active` : `Inactive` }}
            </v-chip>
          </div>
        </template>

        <template #[`item.highlight`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              :color="item.highlight ? `success` : `grey400`"
              class="font-weight-bold text-h5"
            >
              {{ item.highlight ? `Highlighted` : `Normal` }}
            </v-chip>
          </div>
        </template>

        <template #[`item.prices`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.prices?.length ?? 0 }}
          </div>
        </template>

        <template #[`item.featureGroups`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.featureGroups.length }}
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div class="d-flex justify-center align-center">
            <v-btn
              icon
              flat
              @click="openFeaturesModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:extension
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Manage Features
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              @click="openDeleteModal(item)"
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
      <admin-subscription-plans-add @add-item-success-full="addItemSuccessFull" />
    </admin-common-modal>

    <admin-common-modal
      v-if="showDetailModal"
      v-model:show-dialog="showDetailModal"
      title="Edit"
    >
      <admin-subscription-plans-detail
        :id="selectedItemIdForDetail"
        @edit-item-success-full="editItemSuccessFull"
      />
    </admin-common-modal>

    <admin-common-modal
      v-if="showFeaturesModal && selectedPlanForFeatures"
      v-model:show-dialog="showFeaturesModal"
      title="Features"
    >
      <admin-subscription-plans-features
        :plan="selectedPlanForFeatures"
        @features-success-full="featuresSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type { AdminSubscriptionPlanDTO } from '@/types'

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  deleteItem,
  loadingDeleteItem,
} = useSubscriptionPlanAdmin()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
  { title: 'Title', key: 'title', sortable: false, width: '22vw' },
  { title: 'Status', key: 'isActive', sortable: false, width: '12vw' },
  { title: 'Highlight', key: 'highlight', sortable: false, width: '12vw' },
  { title: 'Prices', key: 'prices', sortable: false, width: '24vw' },
  { title: 'Features', key: 'featureGroups', sortable: false, width: '10vw' },
  { title: 'Action', key: 'Action', sortable: false, width: '12vw' },
]

const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const showDeleteModal = ref(false)
const selectedItemIdForDelete = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedItemIdForDetail = ref('')
const showFeaturesModal = ref(false)
const selectedPlanForFeatures = ref<AdminSubscriptionPlanDTO | null>(null)

const fetchPlans = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
  })
}

const changePageNumber = async () => {
  await fetchPlans()
}

const changePageSize = async () => {
  page.value = 1
  await fetchPlans()
}

onMounted(async () => {
  await fetchPlans()
})

const addItemSuccessFull = async () => {
  showAddModal.value = false
  await fetchPlans()
}

const openDeleteModal = (item: AdminSubscriptionPlanDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchPlans()
}

const openDetailModal = (item: AdminSubscriptionPlanDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

const editItemSuccessFull = async () => {
  showDetailModal.value = false
  await fetchPlans()
}

const openFeaturesModal = (item: AdminSubscriptionPlanDTO) => {
  selectedPlanForFeatures.value = item
  showFeaturesModal.value = true
}

const featuresSuccessFull = async () => {
  showFeaturesModal.value = false
  selectedPlanForFeatures.value = null
  await fetchPlans()
}

const refreshData = async () => {
  await fetchPlans()
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
