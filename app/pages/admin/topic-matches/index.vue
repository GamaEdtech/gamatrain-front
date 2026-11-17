<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 text-body-2 text-grey600 mb-2">
      An AI suggests matches between GAMA's topics and other boards' topics. Approving a match links the two topics, so each
      board's papers and tutorials lists also show the other's.
    </div>
    <div class="w-100 d-flex flex-wrap align-center ga-2">
      <v-select
        v-model="status"
        :items="STATUS_FILTERS"
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
      <v-autocomplete
        v-model="boardId"
        :items="boards"
        item-title="title"
        item-value="id"
        label="Board"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @update:model-value="changeBoard"
      />
      <v-autocomplete
        v-model="gradeId"
        :items="grades"
        item-title="title"
        item-value="id"
        label="Grade"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        :disabled="!boardId"
        @update:model-value="changeGrade"
      />
      <v-autocomplete
        v-model="subjectId"
        :items="subjects"
        item-title="title"
        item-value="id"
        label="Subject"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        :disabled="!gradeId"
        @update:model-value="changeSubject"
      />
      <v-autocomplete
        v-model="topicId"
        :items="topics"
        item-title="title"
        item-value="id"
        label="Topic"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        :disabled="!subjectId"
        @update:model-value="search"
      />
      <v-btn
        v-if="topicId && can(ADMIN_PERMISSIONS.topicMatches.suggest)"
        rounded="pill"
        color="primary"
        variant="tonal"
        height="40"
        prepend-icon="md:auto_awesome"
        :loading="loadingSuggest"
        @click="suggestForTopic"
      >
        Suggest with AI
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="can(ADMIN_PERMISSIONS.topicMatches.add)"
        rounded="pill"
        color="success"
        flat
        height="40"
        prepend-icon="md:add"
        @click="showAdd = true"
      >
        Add match
      </v-btn>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="list"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loadingList"
      item-label="Matches"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    >
      <template #actions>
        <v-btn
          size="small"
          flat
          icon
          color="info"
          :loading="loadingList"
          @click="fetchMatches"
        >
          <v-icon
            color="white"
            size="20"
          >
            md:refresh
          </v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >
            Refresh Data
          </v-tooltip>
        </v-btn>
      </template>
    </common-data-table>

    <admin-common-delete-modal
      v-model="showDeleteModal"
      @confirm="confirmRemove"
    />

    <v-dialog
      v-model="showAdd"
      max-width="480"
    >
      <v-card rounded="lg">
        <v-card-title>Add a match</v-card-title>
        <v-card-text class="d-flex flex-column ga-3">
          <span class="text-body-2">The two topics' ids (from Types). The match waits for approval.</span>
          <v-text-field
            v-model="newGamaTopic"
            label="GAMA topic id"
            type="number"
            variant="outlined"
            density="compact"
            hide-details
          />
          <v-text-field
            v-model="newExternalTopic"
            label="Other board's topic id"
            type="number"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showAdd = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!newGamaTopic || !newExternalTopic"
            @click="addMatch"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, TopicMatchDTO, TopicMatchStatus, TopicPathDTO, TypeItemDTO } from '@/types'
import { ADMIN_PERMISSIONS } from '~/constants'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Topic matching' })

const STATUS_FILTERS = [
  { title: 'All', value: null },
  { title: 'Waiting', value: 'Pending' },
  { title: 'Approved', value: 'Approved' },
]

const { can } = useAdminAccess()
const { list, totalCount, pageCount, loadingList, loadingSuggest, getList, approve, unapprove, remove, add, suggest } = useTopicMatchAdmin()
const typeLists = useTypeLists()

const pathText = (path: TopicPathDTO) => [path.board?.title, path.grade?.title, path.subject?.title].filter(Boolean).join(' › ')

const headers: DataTableHeader<TopicMatchDTO>[] = [
  { title: 'GAMA topic', key: 'gamaTopic', sortable: false, width: '16vw', getText: item => item.gama.topic?.title ?? String(item.gama.topic?.id ?? '-') },
  { title: 'GAMA subject', key: 'gamaPath', sortable: false, width: '14vw', getText: item => pathText(item.gama) || '-' },
  { title: 'Other topic', key: 'externalTopic', sortable: false, width: '16vw', getText: item => item.external.topic?.title ?? String(item.external.topic?.id ?? '-') },
  { title: 'Other subject', key: 'externalPath', sortable: false, width: '14vw', getText: item => pathText(item.external) || '-' },
  { title: 'Confidence', key: 'confidence', sortable: false, width: '6vw', suffix: '%' },
  { title: 'Reasoning', key: 'reasoning', sortable: false, width: '18vw', emptyText: '-' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '7vw',
    type: 'chip',
    getText: item => (item.status === 'Approved' ? 'Approved' : 'Waiting'),
    getChipColor: item => (item.status === 'Approved' ? 'success' : 'warning'),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '10vw',
    type: 'actions',
    actions: [
      { icon: 'md:check_circle', tooltip: 'Approve (link the topics)', onClick: item => run(approve(item.id)), show: item => item.status !== 'Approved' && can(ADMIN_PERMISSIONS.topicMatches.approve) },
      { icon: 'md:undo', tooltip: 'Take the approval back', onClick: item => run(unapprove(item.id)), show: item => item.status === 'Approved' && can(ADMIN_PERMISSIONS.topicMatches.unapprove) },
      { icon: 'md:menu_book', tooltip: 'Open the GAMA topic\'s tutorial', href: item => (item.gama.tutorial ? `/tutorial/${item.gama.tutorial.id}` : undefined), target: '_blank', show: item => !!item.gama.tutorial },
      { icon: 'md:delete', tooltip: 'Remove', onClick: item => openRemove(item), show: item => item.status !== 'Approved' && can(ADMIN_PERMISSIONS.topicMatches.remove) },
    ],
  },
]

const page = ref(1)
const pageSize = ref(50)
const allPageSize = [
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
  { label: '100 Rows', value: 100 },
]
const status = ref<TopicMatchStatus | null>('Pending')
const boardId = ref<string | null>(null)
const gradeId = ref<string | null>(null)
const subjectId = ref<string | null>(null)
const topicId = ref<string | null>(null)
const boards = ref<TypeItemDTO[]>([])
const grades = ref<TypeItemDTO[]>([])
const subjects = ref<TypeItemDTO[]>([])
const topics = ref<TypeItemDTO[]>([])

// A subject or topic filter works for either side: GAMA's, or another board's matched into GAMA.
const fetchMatches = () => getList({
  page: page.value,
  pageSize: pageSize.value,
  status: status.value,
  topicId: topicId.value ? Number(topicId.value) : null,
  subjectId: !topicId.value && subjectId.value ? Number(subjectId.value) : null,
})

const search = async () => {
  page.value = 1
  await fetchMatches()
}

const changeBoard = async () => {
  gradeId.value = null
  subjectId.value = null
  topicId.value = null
  grades.value = boardId.value ? await typeLists.grades(boardId.value) : []
  subjects.value = []
  topics.value = []
  await search()
}

const changeGrade = async () => {
  subjectId.value = null
  topicId.value = null
  subjects.value = gradeId.value ? await typeLists.subjects(gradeId.value) : []
  topics.value = []
  await search()
}

const changeSubject = async () => {
  topicId.value = null
  topics.value = subjectId.value ? await typeLists.topics(subjectId.value) : []
  await search()
}

const changePageNumber = async (value: number) => {
  page.value = value
  await fetchMatches()
}

const changePageSize = async (value: number) => {
  pageSize.value = value
  page.value = 1
  await fetchMatches()
}

const run = async (action: Promise<boolean>) => {
  if (await action) await fetchMatches()
}

const suggestForTopic = async () => {
  if (topicId.value && await suggest(Number(topicId.value))) {
    status.value = null
    await search()
  }
}

const selected = ref<TopicMatchDTO | null>(null)
const showDeleteModal = ref(false)
const openRemove = (item: TopicMatchDTO) => {
  selected.value = item
  showDeleteModal.value = true
}

const confirmRemove = async () => {
  if (selected.value && await remove(selected.value.id)) {
    showDeleteModal.value = false
    await fetchMatches()
  }
}

const showAdd = ref(false)
const newGamaTopic = ref('')
const newExternalTopic = ref('')
const addMatch = async () => {
  if (await add(Number(newGamaTopic.value), Number(newExternalTopic.value))) {
    showAdd.value = false
    newGamaTopic.value = ''
    newExternalTopic.value = ''
    await fetchMatches()
  }
}

onMounted(async () => {
  await fetchMatches()
  boards.value = await typeLists.boards()
})
</script>

<style scoped>
.filter-field {
  min-width: 170px;
  max-width: 240px;
}
</style>
