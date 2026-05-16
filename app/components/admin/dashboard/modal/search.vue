<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-text-field
      v-model="searchFilter.userId"
      label="User Id"
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
      v-model="searchFilter.status!"
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
      v-model="searchFilter.gateway!"
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

    <common-gombo-box
      v-model="searchFilter.currency!"
      label="Currency"
      :items="currencyList.map((item) => ({
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
      flat
      @click="startSearch"
    >
      Search
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { PaymentSummaryGetParams } from '@/types'

interface ISearchModal {
  data: PaymentSummaryGetParams
}

const propsData = defineProps<ISearchModal>()
const emit = defineEmits(['searchData'])

const searchFilter = reactive<PaymentSummaryGetParams>({
  userId: null,
  startDate: '',
  endDate: '',
  gateway: null,
  status: null,
  currency: null,
})
const startDateMenuOpen = ref(false)
const endDateMenuOpen = ref(false)
const statusList = ['Pending', 'Paid', 'Failed']
const gatewayList = ['GamaTrain', 'Stripe']
const currencyList = ['SOL', 'USDC', 'GET', 'USDT']

const startSearch = () => {
  emit('searchData', searchFilter)
}

onMounted(() => {
  searchFilter.userId = propsData.data.userId
  searchFilter.startDate = propsData.data.startDate
  searchFilter.endDate = propsData.data.endDate
  searchFilter.gateway = propsData.data.gateway
  searchFilter.status = propsData.data.status
  searchFilter.currency = propsData.data.currency
})
</script>

<style scoped>
</style>
