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
  SearchFilterAdminUserSubscription,
  UserSubscriptionStatus,
} from '@/types'

interface ISearchModal {
  data: SearchFilterAdminUserSubscription
  loading: boolean
}

const props = defineProps<ISearchModal>()
const emit = defineEmits<{
  search: [item: SearchFilterAdminUserSubscription]
}>()

const statusList: UserSubscriptionStatus[] = [
  'Pending',
  'Active',
  'Expired',
  'Cancelled',
]

const searchFilter = reactive<SearchFilterAdminUserSubscription>({
  userId: '',
  status: '',
})

const startSearch = () => {
  emit('search', searchFilter)
}

onMounted(() => {
  searchFilter.userId = props.data.userId
  searchFilter.status = props.data.status
})
</script>

<style scoped>
</style>
