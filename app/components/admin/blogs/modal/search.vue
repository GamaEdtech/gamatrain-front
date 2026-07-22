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
      v-model="searchFilter.email"
      label="Email"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />

    <v-text-field
      v-model="searchFilter.username"
      label="Username"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />

    <common-gombo-box
      v-model="searchFilter.status"
      label="Status"
      :items="USER_BLOG_STATUS.map((item) => ({
        id: item,
        title: item === 'Review' ? 'Pending' : item,
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
import { USER_BLOG_STATUS } from '@/constants'
import type { SearchFilterAdminBlogContribution } from '@/types'

interface ISearchModal {
  data: SearchFilterAdminBlogContribution
  loading: boolean
}

const props = defineProps<ISearchModal>()
const emit = defineEmits(['search'])

const startDateMenuOpen = ref(false)
const endDateMenuOpen = ref(false)

const searchFilter = reactive<SearchFilterAdminBlogContribution>({
  startDate: '',
  endDate: '',
  email: '',
  username: '',
  status: '',
})

const startSearch = () => {
  emit('search', searchFilter)
}

onMounted(() => {
  searchFilter.startDate = props.data.startDate
  searchFilter.endDate = props.data.endDate
  searchFilter.email = props.data.email
  searchFilter.username = props.data.username
  searchFilter.status = props.data.status
})
</script>

<style scoped>
</style>
