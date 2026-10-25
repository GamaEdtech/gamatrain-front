<template>
  <div class="w-100 d-flex flex-column ga-3">
    <h3 class="text-h4 font-weight-bold text-grey700">
      People you invited
    </h3>

    <div
      v-if="loadingInvited && !invitedUsers.length"
      class="w-100"
    >
      <user-commission-skeleton-table-desktop />
    </div>

    <div
      v-else-if="!invitedUsers.length"
      class="empty-state w-100 bg-grey100 rounded-xl pa-8 d-flex flex-column align-center text-center ga-2"
    >
      <v-icon
        size="48"
        color="grey400"
      >
        md:group_add
      </v-icon>
      <span class="text-h5 font-weight-bold text-grey700">No one has joined through your link yet</span>
      <span class="text-h6 text-grey500">
        Share your link with your students. They'll appear here as soon as they sign up.
      </span>
    </div>

    <!-- Phone: one card per person, the table doesn't fit -->
    <div
      v-else-if="xs"
      class="w-100 d-flex flex-column ga-2"
    >
      <div
        v-for="(item, index) in invitedUsers"
        :key="index"
        class="w-100 bg-grey100 rounded-lg pa-4 d-flex flex-column ga-2"
      >
        <div class="d-flex align-center justify-space-between ga-2">
          <span class="text-h5 font-weight-bold text-grey700">{{ item.displayName }}</span>
          <v-chip
            size="small"
            :color="item.subscribed ? 'success' : 'grey500'"
            class="font-weight-bold"
          >
            {{ item.subscribed ? 'Subscribed' : 'Not subscribed' }}
          </v-chip>
        </div>
        <div class="d-flex align-center justify-space-between text-h6 text-grey500">
          <span>Joined {{ formatLocal(item.joinedDate, 'DD/MM/YYYY') }}</span>
          <span>{{ item.paymentsCount }} {{ item.paymentsCount === 1 ? 'payment' : 'payments' }}</span>
        </div>
        <div class="d-flex align-center justify-space-between">
          <span class="text-h6 text-grey500">You earned</span>
          <span class="text-h5 font-weight-bold text-success">${{ item.earnedUsd.toFixed(2) }}</span>
        </div>
      </div>
      <v-pagination
        v-if="invitedPageCount > 1"
        :model-value="page"
        :length="invitedPageCount"
        density="comfortable"
        @update:model-value="changePage"
      />
    </div>

    <common-data-table
      v-else
      :headers="headers"
      :items="invitedUsers"
      :loading="loadingInvited"
      :page="page"
      :page-size="pageSize"
      :page-count="invitedPageCount"
      :total-count="invitedTotal"
      item-label="People"
      :show-page-size-selector="false"
      @update:page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, InvitedUserDTO } from '@/types'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()
const { formatLocal } = useDateTime()

const {
  invitedUsers,
  loadingInvited,
  invitedTotal,
  invitedPageCount,
  getInvitedUsers,
} = useReferral()

const page = ref(1)
const pageSize = 10

const headers: DataTableHeader<InvitedUserDTO>[] = [
  { title: 'Name', key: 'displayName', sortable: false, width: '22vw' },
  { title: 'Joined', key: 'joinedDate', sortable: false, width: '18vw', type: 'date', dateFormat: 'DD/MM/YYYY' },
  {
    title: 'Status',
    key: 'subscribed',
    sortable: false,
    width: '18vw',
    type: 'chip',
    getText: item => (item.subscribed ? 'Subscribed' : 'Not subscribed'),
    getChipColor: item => (item.subscribed ? 'success' : 'grey500'),
  },
  { title: 'Payments', key: 'paymentsCount', sortable: false, width: '14vw', type: 'number' },
  { title: 'You earned', key: 'earnedUsd', sortable: false, width: '16vw', getText: item => `$${item.earnedUsd.toFixed(2)}` },
]

const load = () => getInvitedUsers({ page: page.value, pageSize })

const changePage = async (value: number) => {
  page.value = value
  await load()
}

onMounted(load)

defineExpose({ refresh: load })
</script>
