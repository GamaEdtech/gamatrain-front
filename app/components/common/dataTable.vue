<template>
  <div class="w-100 d-flex flex-column align-start justify-start">
    <div
      v-if="title || itemLabel || $slots.actions"
      class="w-100 d-flex justify-space-between align-center flex-wrap ga-2"
    >
      <span
        v-if="title"
        class="text-h4 font-weight-bold text-grey700"
      >
        {{ title }}
      </span>

      <div class="d-flex align-center justify-end ga-1 flex-wrap ml-auto">
        <slot name="actions" />

        <span
          v-if="itemLabel"
          class="text-grey400 text-no-wrap text-h5 font-weight-semibold"
        >
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          {{ itemLabel }}
        </span>
      </div>
    </div>

    <div class="w-100 mt-4">
      <v-data-table
        :headers="headers"
        :items="items"
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

        <template
          v-for="header in headers"
          :key="header.key"
          #[`item.${header.key}`]="slotProps"
        >
          <slot
            v-if="$slots[`item.${header.key}`]"
            :name="`item.${header.key}`"
            v-bind="slotProps"
          />
          <div
            v-else
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center"
          >
            {{ getItemValue(slotProps.item, header.key) }}
          </div>
        </template>
      </v-data-table>
    </div>

    <div
      v-if="showPagination"
      class="w-100 d-flex mt-2 position-relative ga-6"
    >
      <div class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4">
        <v-pagination
          v-model="pageModel"
          :length="pageCount"
          :total-visible="4"
          next-icon="md:arrow_forward"
          prev-icon="md:arrow_back"
          size="40"
          class="custom-pagination"
        />
      </div>

      <div class="position-absolute right-0 select-size-div">
        <v-select
          v-model="pageSizeModel"
          :items="pageSizeOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          rounded
          hide-details
          max-width="140"
          class="rounded-pill"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TItem extends object">
interface TableHeader {
  title: string
  key: string
  sortable?: boolean
  width?: string | number
}

interface PageSizeOption {
  label: string
  value: number
}

const props = withDefaults(defineProps<{
  headers: TableHeader[]
  items: TItem[]
  loading?: boolean
  page?: number
  pageSize?: number
  pageCount?: number
  totalCount?: number
  title?: string
  itemLabel?: string
  showPagination?: boolean
  pageSizeOptions?: PageSizeOption[]
}>(), {
  loading: false,
  page: 1,
  pageSize: 10,
  pageCount: 0,
  totalCount: 0,
  title: '',
  itemLabel: '',
  showPagination: true,
  pageSizeOptions: () => [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ],
})

const emit = defineEmits<{
  (e: 'update:page' | 'update:pageSize', value: number): void
}>()

defineSlots<{
  actions?: () => unknown
  [name: `item.${string}`]: (props: { item: TItem }) => unknown
}>()

const pageModel = computed({
  get: () => props.page,
  set: value => emit('update:page', value),
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: value => emit('update:pageSize', value),
})

const getItemValue = (item: TItem, key: string) => {
  const value = item[key as keyof TItem]

  return value === null || value === undefined || value === '' ? '-' : value
}
</script>

<style scoped>
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background-color: rgb(var(--v-theme-primary)) !important;
}
:deep(.custom-pagination .v-pagination__item--is-active .v-btn__overlay){
  background-color: rgb(var(--v-theme-primary)) !important;
}
.select-size-div {
  top: 16px;
}
</style>
