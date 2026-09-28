<template>
  <div class="w-100 d-flex flex-column pa-4">
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
import type { SearchFilterAdminCommission } from '@/types'

interface SearchModalProps {
  data: SearchFilterAdminCommission
  loading: boolean
}

const props = defineProps<SearchModalProps>()
const emit = defineEmits(['search'])

const startDateMenuOpen = ref(false)
const endDateMenuOpen = ref(false)

const searchFilter = reactive<SearchFilterAdminCommission>({
  startDate: '',
  endDate: '',
})

const startSearch = () => {
  emit('search', searchFilter)
}

onMounted(() => {
  searchFilter.startDate = props.data.startDate
  searchFilter.endDate = props.data.endDate
})
</script>
