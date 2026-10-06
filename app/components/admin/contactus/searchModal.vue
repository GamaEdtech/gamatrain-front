<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-text-field
      v-model="searchFilter.search"
      label="Search"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />

    <v-text-field
      v-model="searchFilter.email"
      label="Email"
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
      <template #activator="{ props: menuProps }">
        <v-text-field
          v-model="searchFilter.startDate"
          readonly
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
          v-bind="menuProps"
          label="Start Date"
          clearable
        />
      </template>
      <v-date-picker
        v-model="searchFilter.startDate"
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
      <template #activator="{ props: menuProps }">
        <v-text-field
          v-model="searchFilter.endDate"
          readonly
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
          v-bind="menuProps"
          label="End Date"
          clearable
        />
      </template>
      <v-date-picker
        v-model="searchFilter.endDate"
        color="primary"
        @update:model-value="() => (endDateMenuOpen = false)"
      />
    </v-menu>

    <v-select
      v-model="searchFilter.unread"
      :items="unreadOptions"
      item-title="label"
      item-value="value"
      label="Status"
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
</template>

<script setup lang="ts">
import type { SearchFilterAdminContactUs } from '@/types'

interface ISearchModal {
  data: SearchFilterAdminContactUs
  loading: boolean
}

const props = defineProps<ISearchModal>()
const emit = defineEmits(['search'])

const startDateMenuOpen = ref(false)
const endDateMenuOpen = ref(false)
const unreadOptions = [
  { label: 'All', value: null },
  { label: 'Unread', value: true },
  { label: 'Read', value: false },
]

const searchFilter = reactive<SearchFilterAdminContactUs>({
  unread: null,
  search: '',
  email: '',
  startDate: '',
  endDate: '',
})

const startSearch = () => {
  emit('search', searchFilter)
}

onMounted(() => {
  searchFilter.unread = props.data.unread
  searchFilter.search = props.data.search
  searchFilter.email = props.data.email
  searchFilter.startDate = props.data.startDate
  searchFilter.endDate = props.data.endDate
})
</script>

<style scoped>
</style>
