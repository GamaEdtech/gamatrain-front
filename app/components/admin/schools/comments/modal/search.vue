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

    <v-text-field
      v-model="searchFilter.commenterEmail"
      label="Commenter Email"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />

    <v-text-field
      v-model="searchFilter.commenterName"
      label="Commenter Name"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />

    <common-gombo-box
      v-model="searchFilter.status"
      label="Status"
      :items="SCHOOL_COMMENT_STATUS_FILTER_LIST.filter((item) => item.id).map((item) => ({
        id: item.id,
        title: item.title,
      }))"
      rounded="lg"
      density="compact"
      base-color="grey800"
      color="primary"
      class="mt-1"
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
import { SCHOOL_COMMENT_STATUS_FILTER_LIST } from '@/constants'
import type { SearchFilterAdminSchoolComment } from '@/types'

interface ISearchModal {
  data: SearchFilterAdminSchoolComment
  loading: boolean
}

const props = defineProps<ISearchModal>()
const emit = defineEmits(['search'])

const startDateMenuOpen = ref(false)
const endDateMenuOpen = ref(false)

const searchFilter = reactive<SearchFilterAdminSchoolComment>({
  startDate: '',
  endDate: '',
  commenterEmail: '',
  commenterName: '',
  status: '',
})

const startSearch = () => {
  emit('search', searchFilter)
}

onMounted(() => {
  searchFilter.startDate = props.data.startDate
  searchFilter.endDate = props.data.endDate
  searchFilter.commenterEmail = props.data.commenterEmail
  searchFilter.commenterName = props.data.commenterName
  searchFilter.status = props.data.status
})
</script>

<style scoped>
</style>
