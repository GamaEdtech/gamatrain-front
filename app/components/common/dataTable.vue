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
            v-else-if="header.type === 'chip'"
            class="w-100 d-flex justify-center align-center"
          >
            <v-chip
              :color="getChipColor(slotProps.item, header)"
              class="font-weight-bold text-h5"
            >
              {{ getCellText(slotProps.item, header) }}
            </v-chip>
          </div>
          <div
            v-else-if="header.type === 'link'"
            class="d-flex justify-center align-center"
          >
            <NuxtLink
              :to="getLinkTo(slotProps.item, header)"
              :target="header.target"
              class="text-grey600 text-h5 font-weight-bold text-decoration-none text-center"
            >
              {{ getCellText(slotProps.item, header) }}
            </NuxtLink>
          </div>
          <div
            v-else-if="header.type === 'actions'"
            class="d-flex justify-center align-center"
          >
            <v-btn
              v-for="action in getVisibleActions(slotProps.item, header)"
              :key="action.icon"
              icon
              flat
              :to="getActionTo(slotProps.item, action)"
              :href="getActionHref(slotProps.item, action)"
              :target="action.target"
              :disabled="getActionDisabled(slotProps.item, action)"
              @click="action.onClick?.(slotProps.item)"
            >
              <v-icon
                size="20"
                :color="action.color || 'grey800'"
              >
                {{ action.icon }}
              </v-icon>
              <v-tooltip
                v-if="action.tooltip"
                activator="parent"
                location="top"
              >
                {{ action.tooltip }}
              </v-tooltip>
            </v-btn>
          </div>
          <div
            v-else
            :class="getCellClass(header)"
          >
            <v-icon
              v-if="header.icon"
              size="18"
              :color="header.iconColor || 'grey300'"
            >
              {{ header.icon }}
            </v-icon>
            {{ getCellText(slotProps.item, header) }}
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
          :disabled="loading"
          next-icon="md:arrow_forward"
          prev-icon="md:arrow_back"
          size="40"
          class="custom-pagination"
        />
      </div>

      <div
        v-if="showPageSizeSelector"
        class="position-absolute right-0 select-size-div"
      >
        <v-select
          v-model="pageSizeModel"
          :items="pageSizeOptions"
          :disabled="loading"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          rounded
          hide-details
          max-width="140"
          class="rounded-pill"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="20"
              color="primary"
              class="mr-2"
            />
          </template>
        </v-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TItem extends object">
import type { DataTableAction, DataTableHeader } from '@/types'

type DateInput = string | number | Date | null | undefined
type ActionValue = string | boolean
type ItemResolver<TValue extends ActionValue> = TValue | ((item: TItem) => TValue)
type TableAction = DataTableAction<TItem>
type TableHeader = DataTableHeader<TItem>

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
  showPageSizeSelector?: boolean
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
  showPageSizeSelector: true,
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

const { formatLocal } = useDateTime()
const { $numberFormat } = useNuxtApp()

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

  return value === null || value === undefined || value === '' ? undefined : value
}

const getCellText = (item: TItem, header: TableHeader) => {
  if (header.getText) {
    return header.getText(item)
  }

  const value = getItemValue(item, header.key)
  const emptyText = header.emptyText ?? '-'

  if (header.type === 'date') {
    return formatLocal(getDateValue(value), header.dateFormat || 'DD/MM/YYYY HH:mm') || emptyText
  }

  if (value === undefined) {
    return emptyText
  }

  if (header.type === 'number') {
    return getNumberValue(value)
  }

  if (header.type === 'currency') {
    return `${header.prefix || ''}${getNumberValue(value)}${header.suffix || ''}`
  }

  if (header.type === 'percent') {
    return `${getNumberValue(value)}%`
  }

  return value
}

const getDateValue = (value: unknown): DateInput => {
  if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {
    return value
  }

  return undefined
}

const getChipColor = (item: TItem, header: TableHeader) => {
  return header.getChipColor?.(item) || 'primary'
}

const getLinkTo = (item: TItem, header: TableHeader) => {
  return header.getTo?.(item) || '#'
}

function resolveActionValue<TValue extends ActionValue>(item: TItem, value?: ItemResolver<TValue>) {
  return typeof value === 'function' ? value(item) : value
}

const getVisibleActions = (item: TItem, header: TableHeader) => {
  return header.actions?.filter(action => resolveActionValue(item, action.show) !== false) || []
}

const getActionTo = (item: TItem, action: TableAction) => {
  return resolveActionValue(item, action.to)
}

const getActionHref = (item: TItem, action: TableAction) => {
  return resolveActionValue(item, action.href)
}

const getActionDisabled = (item: TItem, action: TableAction) => {
  return resolveActionValue(item, action.disabled) || false
}

const getNumberValue = (value: unknown) => {
  return typeof value === 'number' ? $numberFormat(value) : value
}

const getCellClass = (header: TableHeader) => {
  const justifyClass = header.align === 'start'
    ? 'justify-start text-start'
    : header.align === 'end'
      ? 'justify-end text-end'
      : 'justify-center text-center'

  return `text-grey600 text-h5 d-flex ${justifyClass} align-center font-weight-bold ga-1`
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
