<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-wrap align-center ga-2">
      <v-select
        v-model="kind"
        :items="KINDS"
        item-title="title"
        item-value="value"
        label="List"
        density="compact"
        hide-details
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @update:model-value="search"
      />
      <v-text-field
        v-model="parent"
        :label="parentLabel"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @keyup.enter="search"
        @click:clear="clearParent"
      />
      <v-text-field
        v-model="title"
        label="Title"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @keyup.enter="search"
        @click:clear="clearTitle"
      />
      <v-switch
        v-model="includeDeleted"
        label="Show hidden"
        color="primary"
        density="compact"
        hide-details
        @update:model-value="search"
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
      <v-btn
        rounded="pill"
        color="primary"
        variant="outlined"
        height="40"
        @click="openEditor()"
      >
        Add item
      </v-btn>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="list || []"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loading"
      item-label="Items"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    />

    <admin-common-delete-modal
      v-model="showDeleteModal"
      :loading="loadingDeleteItem"
      @confirm="confirmDelete"
    />

    <v-dialog
      v-model="showEditor"
      max-width="560"
    >
      <v-card rounded="lg">
        <v-card-title>{{ editingId ? `Edit item ${editingId}` : `Add to ${kindTitle}` }}</v-card-title>
        <v-card-text class="d-flex flex-column ga-4">
          <v-text-field
            v-model="form.title"
            label="Title"
            variant="outlined"
            density="compact"
            hide-details
          />
          <v-text-field
            v-model.number="form.listOrder"
            label="List order"
            type="number"
            variant="outlined"
            density="compact"
            hide-details
          />
          <v-text-field
            v-model="form.parent"
            :label="parentLabel"
            hint="Several parents: 6627+6657. A subject's: course,grade (0,4161)."
            persistent-hint
            variant="outlined"
            density="compact"
          />
          <v-text-field
            v-model="form.parent2"
            label="Parent 2"
            variant="outlined"
            density="compact"
            hide-details
          />
          <v-textarea
            v-model="form.metadata"
            label="Metadata (JSON)"
            hint="e.g. {&quot;is_paper&quot;:true} for a paper classification, {&quot;season&quot;:true} for a topic heading"
            persistent-hint
            rows="3"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showEditor = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="loadingSave"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { AdminTypeItemDTO, DataTableHeader } from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

// The lists the backend copies, by gama-api's list number, with what their parent is.
const KINDS = [
  { title: 'Boards', value: 1, parent: '' },
  { title: 'Grades', value: 2, parent: 'Board id' },
  { title: 'Subjects', value: 4, parent: 'course,grade (e.g. 0,4161)' },
  { title: 'Courses', value: 5, parent: 'Board id' },
  { title: 'Classifications', value: 6, parent: 'Board id' },
  { title: 'Topics', value: 11, parent: 'Subject id' },
  { title: 'Papers', value: 22, parent: '' },
  { title: 'Extra file types', value: 20, parent: '' },
  { title: 'Variants', value: 29, parent: '' },
]

const {
  data: list,
  totalCount,
  pageCount,
  loadingGetData: loading,
  loadingSave,
  loadingDeleteItem,
  getData,
  saveItem,
  deleteItem,
} = useTypeAdmin()

const kind = ref(1)
const parent = ref('')
const title = ref('')
const includeDeleted = ref(false)
const page = ref(1)
const pageSize = ref(50)
const allPageSize = [
  { label: '50 Rows', value: 50 },
  { label: '100 Rows', value: 100 },
  { label: '500 Rows', value: 500 },
]

const kindTitle = computed(() => KINDS.find(t => t.value === kind.value)?.title ?? '')
const parentLabel = computed(() => `Parent${KINDS.find(t => t.value === kind.value)?.parent ? ` (${KINDS.find(t => t.value === kind.value)?.parent})` : ''}`)

const headers: DataTableHeader<AdminTypeItemDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
  { title: 'Title', key: 'title', sortable: false, width: '28vw' },
  { title: 'Order', key: 'listOrder', sortable: false, width: '6vw' },
  { title: 'Parent', key: 'parent', sortable: false, width: '16vw', emptyText: '-' },
  { title: 'Metadata', key: 'metadata', sortable: false, width: '18vw', emptyText: '-' },
  {
    title: 'Shown',
    key: 'isDeleted',
    sortable: false,
    width: '8vw',
    type: 'chip',
    getText: item => (item.isDeleted ? 'Hidden' : 'Shown'),
    getChipColor: item => (item.isDeleted ? 'error' : 'success'),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '10vw',
    type: 'actions',
    actions: [
      { icon: 'md:edit', tooltip: 'Edit', onClick: item => openEditor(item) },
      { icon: 'md:visibility_off', tooltip: 'Hide', onClick: item => openDelete(item), show: item => !item.isDeleted },
    ],
  },
]

const fetchItems = async () => {
  await getData({
    kind: kind.value,
    page: page.value,
    pageSize: pageSize.value,
    parent: parent.value || undefined,
    title: title.value || undefined,
    includeDeleted: includeDeleted.value,
  })
}

const search = async () => {
  page.value = 1
  await fetchItems()
}

const clearParent = async () => {
  parent.value = ''
  await search()
}

const clearTitle = async () => {
  title.value = ''
  await search()
}

const changePageNumber = async (value: number) => {
  page.value = value
  await fetchItems()
}

const changePageSize = async (value: number) => {
  pageSize.value = value
  page.value = 1
  await fetchItems()
}

const showEditor = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({ title: '', listOrder: 0, parent: '', parent2: '', metadata: '' })

const openEditor = (item?: AdminTypeItemDTO) => {
  editingId.value = item?.id ?? null
  form.title = item?.title ?? ''
  form.listOrder = item?.listOrder ?? 0
  form.parent = item?.parent ?? parent.value
  form.parent2 = item?.parent2 ?? ''
  form.metadata = item?.metadata ?? ''
  showEditor.value = true
}

const save = async () => {
  const saved = await saveItem({
    kind: kind.value,
    title: form.title,
    listOrder: Number(form.listOrder) || 0,
    parent: form.parent || undefined,
    parent2: form.parent2 || undefined,
    metadata: form.metadata || undefined,
  }, editingId.value ?? undefined)
  if (saved) {
    showEditor.value = false
    await fetchItems()
  }
}

const showDeleteModal = ref(false)
const deletingId = ref<number | null>(null)
const openDelete = (item: AdminTypeItemDTO) => {
  deletingId.value = item.id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (deletingId.value && await deleteItem(deletingId.value)) {
    showDeleteModal.value = false
    await fetchItems()
  }
}

onMounted(fetchItems)
</script>

<style scoped>
.filter-field {
  min-width: 200px;
  max-width: 280px;
}
</style>
