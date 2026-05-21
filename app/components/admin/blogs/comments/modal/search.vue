<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-menu
      v-model="startDateMenuOpen"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
    >
      <template #activator="{ props }">
        <v-text-field
          v-model="searchFilter.startDate"
          readonly
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
          v-bind="props"
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
      <template #activator="{ props }">
        <v-text-field
          v-model="searchFilter.endDate"
          readonly
          rounded="lg"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-1"
          v-bind="props"
          label="End Date"
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
      :items="statusList.map((item) => ({
        id: item,
        title: item,
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
      flat
      @click="startSearch"
    >
      Search
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  CommentBlogAdminSearchFilter,
  CommentBlogStatus,
} from '@/types'

interface ISearchModal {
  data: {
    startDate: string
    endDate: string
    commenterEmail: string
    commenterName: string
    status?: CommentBlogStatus
  }
}

const propsData = defineProps<ISearchModal>()
const emit = defineEmits(['Search'])

const startDateMenuOpen = ref(false)
const endDateMenuOpen = ref(false)
const statusList = ['Draft', 'Review', 'Confirmed', 'Rejected', 'Deleted']
const searchFilter = reactive<CommentBlogAdminSearchFilter>({
  startDate: '',
  endDate: '',
  commenterEmail: '',
  commenterName: '',
  status: undefined,
})

const startSearch = () => {
  emit('Search', searchFilter)
}

onMounted(() => {
  searchFilter.startDate = propsData.data.startDate
  searchFilter.endDate = propsData.data.endDate
  searchFilter.commenterEmail = propsData.data.commenterEmail
  searchFilter.commenterName = propsData.data.commenterName
  searchFilter.status = propsData.data.status
})
</script>

<style scoped>
</style>
