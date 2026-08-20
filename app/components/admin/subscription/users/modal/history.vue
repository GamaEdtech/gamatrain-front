<template>
  <div class="w-100 d-flex flex-column pa-4 ga-3">
    <div class="w-100 d-flex flex-column ga-1">
      <span class="text-h5 font-weight-bold text-grey700">
        User #{{ userId }}
      </span>
      <span class="text-h6 text-grey500 font-weight-medium">
        Full subscription history
      </span>
    </div>

    <template v-if="loadingGetData">
      <admin-subscription-users-history-card-skeleton
        v-for="index in 5"
        :key="index"
      />
    </template>

    <template v-else-if="historyList.length > 0">
      <admin-subscription-users-history-card
        v-for="item in historyList"
        :key="item.id"
        :subscription="item"
      />
    </template>

    <div
      v-else
      class="w-100 d-flex flex-column align-center justify-center empty-state pa-8"
    >
      <v-icon
        size="42"
        color="grey400"
      >
        md:history
      </v-icon>
      <span class="text-h5 text-grey600 font-weight-bold mt-3">
        No subscription history found.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminUserSubscriptionListDTO,
} from '@/types'

interface IHistoryModal {
  userId: string | number
}

const props = defineProps<IHistoryModal>()
const {
  data,
  getData,
  loadingGetData,
} = useUserSubscriptionAdmin()

const historyList = computed<AdminUserSubscriptionListDTO[]>(() => data.value)

onMounted(async () => {
  await getData({
    page: 1,
    pageSize: 1000,
    userId: props.userId.toString(),
    status: '',
  })
})
</script>

<style scoped>
.empty-state {
  border: 1px solid rgb(var(--v-theme-grey200));
  border-radius: 8px;
  min-height: 180px;
}
</style>
