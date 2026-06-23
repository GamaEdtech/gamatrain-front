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
      v-model="searchFilter.identifierId"
      label="Identifier ID"
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

    <common-gombo-box
      v-model="searchFilter.gateway"
      label="Gateway"
      :items="gatewayList.map((item) => ({
        id: item,
        title: item,
      }))"
      rounded="lg"
      density="compact"
      base-color="grey800"
      color="primary"
      class="mt-6"
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
import type { SearchFilterAdminPayment } from '@/types'

interface ISearchModal {
  data: SearchFilterAdminPayment
  loading: boolean
}

const props = defineProps<ISearchModal>()
const emit = defineEmits(['search'])

const startDateMenuOpen = ref(false)
const endDateMenuOpen = ref(false)
const statusList = ['Pending', 'Paid', 'Failed']
const gatewayList = ['GamaTrain', 'Stripe']

const searchFilter = reactive<SearchFilterAdminPayment>({
  userId: '',
  identifierId: '',
  startDate: '',
  endDate: '',
  status: '',
  gateway: '',
})

const startSearch = () => {
  emit('search', searchFilter)
}

onMounted(() => {
  searchFilter.userId = props.data.userId
  searchFilter.identifierId = props.data.identifierId
  searchFilter.startDate = props.data.startDate
  searchFilter.endDate = props.data.endDate
  searchFilter.status = props.data.status
  searchFilter.gateway = props.data.gateway
})
</script>

<style scoped>
</style>
