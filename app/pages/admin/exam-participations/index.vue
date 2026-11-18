<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-wrap align-center ga-2">
      <v-text-field
        v-model="examId"
        label="Exam id"
        type="number"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @keyup.enter="search"
        @click:clear="examId = ''; search()"
      />
      <v-select
        v-model="status"
        :items="statusFilters"
        item-title="title"
        item-value="value"
        label="Status"
        density="compact"
        hide-details
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @update:model-value="search"
      />
      <v-text-field
        v-model="from"
        label="Started from"
        type="date"
        density="compact"
        hide-details
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @update:model-value="search"
      />
      <v-text-field
        v-model="to"
        label="Started until"
        type="date"
        density="compact"
        hide-details
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @update:model-value="search"
      />
      <v-text-field
        v-model="text"
        label="Name or email"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @keyup.enter="search"
        @click:clear="text = ''; search()"
      />
      <v-btn
        rounded="pill"
        color="primary"
        flat
        height="40"
        @click="search"
      >
        Search
      </v-btn>
    </div>

    <div class="d-flex flex-wrap ga-2 mt-4">
      <v-chip
        variant="tonal"
        color="primary"
        prepend-icon="md:assignment_outlined"
      >
        {{ number(total) }} attempts
      </v-chip>
      <v-chip
        variant="tonal"
        color="success"
        prepend-icon="md:task_alt"
      >
        {{ number(finished) }} finished
      </v-chip>
      <v-chip
        variant="tonal"
        color="info"
        prepend-icon="md:groups_outlined"
      >
        {{ number(participants) }} people
      </v-chip>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="items"
      :page-count="Math.ceil(total / pageSize)"
      :total-count="total"
      :page-size-options="pageSizes"
      :loading="loading"
      item-label="Attempts"
      class="mt-4"
      @update:page="fetch"
      @update:page-size="search"
    />
  </div>
</template>

<script setup lang="ts">
import type { AdminExamParticipationDTO, DataTableHeader } from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Exam participants' })

const route = useRoute()
const { loading, getParticipations } = useExamAdmin()

const statusFilters = [
  { title: 'All', value: null },
  { title: 'Finished', value: 1 },
  { title: 'Started', value: 0 },
]

const number = (value: number) => value.toLocaleString('en-US')
const duration = (seconds: number | null) => {
  if (!seconds) return '-'
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

const headers: DataTableHeader<AdminExamParticipationDTO>[] = [
  { title: 'Started', key: 'startDate', sortable: false, width: '10vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm' },
  {
    title: 'Exam',
    key: 'examTitle',
    sortable: false,
    width: '24vw',
    type: 'link',
    getText: item => item.examTitle || `#${item.examId}`,
    getTo: item => `/admin/exams/${item.examId}`,
  },
  {
    title: 'Participant',
    key: 'userName',
    sortable: false,
    width: '14vw',
    getText: item => item.userName || (item.coreUserId ? `Not linked (gama-api #${item.coreUserId})` : '-'),
  },
  { title: 'Email', key: 'email', sortable: false, width: '14vw', emptyText: '-' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '7vw',
    type: 'chip',
    getText: item => (item.status === 1 ? 'Finished' : 'Started'),
    getChipColor: item => (item.status === 1 ? 'success' : 'warning'),
  },
  { title: 'Result', key: 'resultScore', sortable: false, width: '6vw', getText: item => (item.resultScore ? `${item.resultScore}%` : '-') },
  { title: 'Time', key: 'submitSeconds', sortable: false, width: '6vw', getText: item => duration(item.submitSeconds) },
]

const items = ref<AdminExamParticipationDTO[]>([])
const total = ref(0)
const finished = ref(0)
const participants = ref(0)
const page = ref(1)
const pageSize = ref(20)
const pageSizes = [{ label: '20 Rows', value: 20 }, { label: '50 Rows', value: 50 }, { label: '100 Rows', value: 100 }]
// Opened from the dashboard's top exams with ?examId=.
const examId = ref(typeof route.query.examId === 'string' ? route.query.examId : '')
const status = ref<number | null>(null)
const from = ref('')
const to = ref('')
const text = ref('')

// The date fields are whole days in the admin's own time zone; "until" includes that day.
const dayStart = (day: string, addDays = 0) => {
  if (!day) return null
  const date = new Date(`${day}T00:00:00`)
  date.setDate(date.getDate() + addDays)
  return date.toISOString()
}

const fetch = async () => {
  const data = await getParticipations({
    page: page.value,
    pageSize: pageSize.value,
    examId: examId.value || null,
    status: status.value,
    from: dayStart(from.value),
    to: dayStart(to.value, 1),
    text: text.value,
  })
  items.value = data.items
  total.value = data.total
  finished.value = data.finished
  participants.value = data.participants
}

const search = async () => {
  page.value = 1
  await fetch()
}

onMounted(fetch)
</script>

<style scoped>
.filter-field {
  min-width: 170px;
  max-width: 250px;
}
</style>
