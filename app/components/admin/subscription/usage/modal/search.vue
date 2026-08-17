<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-text-field
      v-model="searchFilter.userId"
      label="User ID"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />

    <v-text-field
      v-model="searchFilter.featureCode"
      label="Feature Code"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />

    <v-text-field
      v-model="searchFilter.identifierId"
      label="Identifier ID"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />

    <v-menu
      v-model="fromDateMenuOpen"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
    >
      <template #activator="{ props: menuProps }">
        <v-text-field
          v-model="searchFilter.fromDate"
          readonly
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
          v-bind="menuProps"
          label="From Date"
          clearable
        />
      </template>
      <v-date-picker
        v-model="searchFilter.fromDate"
        color="primary"
        @update:model-value="() => (fromDateMenuOpen = false)"
      />
    </v-menu>

    <v-menu
      v-model="toDateMenuOpen"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
    >
      <template #activator="{ props: menuProps }">
        <v-text-field
          v-model="searchFilter.toDate"
          readonly
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
          v-bind="menuProps"
          label="To Date"
          clearable
        />
      </template>
      <v-date-picker
        v-model="searchFilter.toDate"
        color="primary"
        @update:model-value="() => (toDateMenuOpen = false)"
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
import type {
  SearchFilterAdminSubscriptionUsage,
} from '@/types'

interface ISearchModal {
  data: SearchFilterAdminSubscriptionUsage
  loading: boolean
}

const props = defineProps<ISearchModal>()
const emit = defineEmits<{
  search: [item: SearchFilterAdminSubscriptionUsage]
}>()

const fromDateMenuOpen = ref(false)
const toDateMenuOpen = ref(false)

const searchFilter = reactive<SearchFilterAdminSubscriptionUsage>({
  userId: '',
  featureCode: '',
  identifierId: '',
  fromDate: '',
  toDate: '',
})

const startSearch = () => {
  emit('search', searchFilter)
}

onMounted(() => {
  searchFilter.userId = props.data.userId
  searchFilter.featureCode = props.data.featureCode
  searchFilter.identifierId = props.data.identifierId
  searchFilter.fromDate = props.data.fromDate
  searchFilter.toDate = props.data.toDate
})
</script>

<style scoped>
</style>
