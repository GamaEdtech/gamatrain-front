<template>
  <div class="w-100 d-flex flex-column ga-4">
    <v-alert
      v-if="pending?.waiting"
      type="warning"
      variant="tonal"
      density="comfortable"
      icon="md:schedule"
      title="Your changes are waiting for review"
    >
      The website keeps showing the published version until an admin approves them.
    </v-alert>
    <v-alert
      v-else-if="pending?.reviewNotes?.length"
      type="error"
      variant="tonal"
      density="comfortable"
      title="Your last changes were not approved"
    >
      <ul class="pl-4">
        <li
          v-for="note in pending.reviewNotes"
          :key="note"
        >
          {{ note }}
        </li>
      </ul>
    </v-alert>

    <v-card
      variant="outlined"
      rounded="lg"
      class="files-card"
    >
      <div class="d-flex flex-wrap align-center justify-space-between ga-3 pa-4">
        <div>
          <div class="text-subtitle-1 font-weight-medium">
            Files
          </div>
          <div class="text-caption text-grey600">
            The question paper (PDF) is required. Every other file is optional.
          </div>
        </div>
        <div class="d-flex flex-wrap align-center ga-2">
          <v-select
            v-model="addRole"
            :items="roleOptions"
            item-title="title"
            item-value="value"
            label="Add a"
            density="compact"
            variant="outlined"
            rounded="pill"
            hide-details
            class="add-select"
          />
          <v-select
            v-if="addRole === 'extra'"
            v-model="addTypeId"
            :items="extraTypes"
            item-title="title"
            item-value="id"
            label="Kind"
            density="compact"
            variant="outlined"
            rounded="pill"
            hide-details
            :loading="loadingExtraTypeFile"
            class="add-select"
          />
          <v-btn
            color="success"
            rounded="pill"
            flat
            prepend-icon="md:upload"
            :disabled="addRole === 'extra' && !addTypeId"
            @click="pick({ kind: 'add', role: addRole, typeId: addTypeId })"
          >
            Upload
          </v-btn>
        </div>
      </div>

      <div
        v-for="row in rows"
        :key="row.key"
        class="file-row d-flex flex-wrap align-center ga-3 px-4 py-3"
        :class="rowClass(row)"
      >
        <v-avatar
          :color="roleColor[row.role]"
          variant="tonal"
          rounded="lg"
          size="40"
        >
          <span class="text-caption font-weight-bold">{{ badge(row) }}</span>
        </v-avatar>

        <div class="flex-grow-1 file-name">
          <div
            class="font-weight-medium"
            :class="{ 'text-decoration-line-through text-grey600': isRemoved(row) }"
          >
            {{ paperFileLabel({ role: row.role, ext: row.ext, type_title: typeTitle(row) }, isPaper) }}
            <span
              v-if="row.role === 'question'"
              class="text-caption text-grey600 font-weight-regular"
            >· required</span>
          </div>
          <div class="text-caption text-grey600">
            {{ meta(row) }}
          </div>
        </div>

        <v-select
          v-if="row.role === 'extra' && !isRemoved(row)"
          :model-value="row.typeId"
          :items="extraTypes"
          item-title="title"
          item-value="id"
          label="Kind"
          density="compact"
          variant="outlined"
          rounded="pill"
          hide-details
          class="kind-select"
          @update:model-value="setType(row, $event)"
        />

        <v-chip
          size="small"
          variant="tonal"
          :color="status(row).color"
        >
          {{ status(row).text }}
        </v-chip>

        <div class="d-flex ga-1">
          <v-progress-circular
            v-if="row.uploading"
            indeterminate
            size="22"
            color="primary"
          />
          <v-btn
            v-if="canOpen(row)"
            variant="text"
            size="small"
            :loading="opening === row.key"
            @click="open(row)"
          >
            Open
          </v-btn>
          <v-btn
            v-if="row.id !== undefined && !isRemoved(row) && !row.uploading"
            variant="text"
            size="small"
            @click="pick({ kind: 'replace', row })"
          >
            Replace
          </v-btn>
          <v-btn
            v-if="hasLocalChange(row)"
            variant="text"
            size="small"
            @click="undo(row)"
          >
            Undo
          </v-btn>
          <v-btn
            v-else-if="row.role !== 'question' && !isRemoved(row) && (row.id === undefined || canRemove)"
            variant="text"
            size="small"
            color="error"
            @click="remove(row)"
          >
            Remove
          </v-btn>
        </div>
      </div>

      <div
        v-if="!rows.length"
        class="text-body-2 text-grey600 px-4 pb-4"
      >
        No files yet. Start with the question paper (PDF).
      </div>
    </v-card>

    <input
      ref="fileInput"
      type="file"
      class="d-none"
      :accept="accept"
      @change="onPicked"
    >
  </div>
</template>

<script setup lang="ts">
import type { PaperFileChangeDTO, PaperFileDTO, PaperFileRole, PaperPendingEditDTO } from '@/types'
import { paperFileAccepts, paperFileLabel } from '~/utils/paperFiles'

/**
 * A paper's files as one list (create and edit, teacher and admin): add a file of a role, replace, remove or change an
 * extra file's kind. Nothing is saved here: uploads give keys, and `changes` (the add/edit's `files`) is sent on Submit.
 * On a published paper the backend keeps the changes for review; `pending` shows the edit already waiting.
 */
const props = withDefaults(defineProps<{
  /** The paper's published files; none for a new paper. */
  files?: PaperFileDTO[]
  /** The owner's edit waiting for review (or a rejected one's notes). */
  pending?: PaperPendingEditDTO | null
  /** Needed to open a stored file. */
  paperId?: string | number
  admin?: boolean
  isPaper?: boolean
  /** Whether a stored file may be removed (false past review, except a published paper's edit or an admin). */
  canRemove?: boolean
}>(), { files: () => [], pending: null, paperId: undefined, isPaper: true, canRemove: true })

const changes = defineModel<PaperFileChangeDTO[]>('changes', { default: () => [] })
const uploading = defineModel<boolean>('uploading', { default: false })

const { $toast } = useNuxtApp()
const { uploadItemFile, getFileLink } = usePastPaper({ admin: props.admin })
const { extraTypeFile, loadingExtraTypeFile, getExtraTypeFile } = useBoard()

interface Row {
  key: string
  /** The stored file's id (negative: a new file of the edit waiting for review); none for a file added here. */
  id?: number
  role: PaperFileRole
  typeId: number | null
  originalTypeId: number | null
  ext: string | null
  size: string | null
  pages: number | null
  /** What the edit waiting for review does with it. */
  waiting?: 'added' | 'replaced' | 'changed' | 'removed'
  /** Changed here, not saved yet. */
  upload?: string
  localName?: string
  removed?: boolean
  uploading?: boolean
}

const roleColor: Record<PaperFileRole, string> = { question: 'error', word: 'info', answer: 'teal', extra: 'deep-purple' }
const roleOptions = computed(() => [
  { title: 'Question paper (PDF)', value: 'question' },
  { title: 'Mark scheme', value: 'answer' },
  { title: 'Question paper (Word)', value: 'word' },
  { title: 'Other file', value: 'extra' },
])
const extraTypes = computed(() => (extraTypeFile.value ?? []).map(item => ({ id: Number(item.id), title: item.title })))

const rows = ref<Row[]>([])
const addRole = ref<PaperFileRole>('question')
const addTypeId = ref<number | null>(null)

let keySeed = 0
const fromFiles = () => {
  const built: Row[] = props.files.map(file => ({
    key: `file-${file.id}`,
    id: file.id,
    role: file.role,
    typeId: file.type_id,
    originalTypeId: file.type_id,
    ext: file.ext,
    size: file.size,
    pages: file.pages,
  }))
  for (const change of props.pending?.waiting ? props.pending.files : []) {
    const row = built.find(item => item.id === change.id)
    if (row) {
      row.waiting = change.change
      if (change.change !== 'removed') {
        row.typeId = change.type_id ?? row.typeId
        row.originalTypeId = row.typeId
      }
      continue
    }
    built.push({
      key: `pending-${change.id}`,
      id: change.id,
      role: change.role,
      typeId: change.type_id,
      originalTypeId: change.type_id,
      ext: change.ext,
      size: change.size,
      pages: change.pages,
      waiting: change.change,
    })
  }
  rows.value = built
  // The first role the paper doesn't have yet.
  addRole.value = (['question', 'answer', 'word'] as const).find(role => !built.some(row => row.role === role)) ?? 'extra'
}

watch(() => [props.files, props.pending], fromFiles, { immediate: true, deep: true })

onMounted(() => {
  if (!extraTypeFile.value?.length) getExtraTypeFile('test_extra_file')
})

const typeTitle = (row: Row) => extraTypes.value.find(item => item.id === row.typeId)?.title ?? null
const isRemoved = (row: Row) => row.removed || row.waiting === 'removed'
const hasLocalChange = (row: Row) => Boolean(row.upload || row.removed || (row.id !== undefined && row.typeId !== row.originalTypeId))
const badge = (row: Row) => (['doc', 'docx', 'word'].includes(String(row.ext).toLowerCase()) ? 'DOC' : String(row.ext || 'file').slice(0, 4).toUpperCase())

const meta = (row: Row) => {
  if (row.localName) return `${row.localName} · new, saved when you submit`
  return [row.ext?.toUpperCase(), row.pages ? `${row.pages} pages` : '', row.size].filter(Boolean).join(' · ')
}

const status = (row: Row): { text: string, color: string } => {
  if (row.removed) return { text: 'Will be removed', color: 'error' }
  if (row.upload) return { text: row.id === undefined ? 'New' : 'New version', color: 'warning' }
  if (row.waiting === 'removed') return { text: 'Removed after review', color: 'error' }
  if (row.waiting === 'added') return { text: 'New file, waiting for review', color: 'warning' }
  if (row.waiting) return { text: 'New version, waiting for review', color: 'warning' }
  return { text: props.files.length ? 'Saved' : 'New', color: 'success' }
}

const rowClass = (row: Row) => ({
  'bg-red-lighten-5': isRemoved(row),
  'bg-amber-lighten-5': !isRemoved(row) && Boolean(row.upload || row.waiting),
})

// A stored file opens; a file of the edit waiting for review opens its new version.
const canOpen = (row: Row) => row.id !== undefined && props.paperId !== undefined && !row.upload && row.waiting !== 'removed'
const opening = ref<string | null>(null)
const open = async (row: Row) => {
  if (row.id === undefined || props.paperId === undefined) return
  // Opened on the click and pointed at the link once it arrives, or the browser blocks it as a pop-up.
  const tab = window.open('', '_blank')
  opening.value = row.key
  try {
    const url = await getFileLink(props.paperId, row.id, Boolean(row.waiting))
    if (url && tab) tab.location.href = url
    else tab?.close()
  }
  finally {
    opening.value = null
  }
}

// One hidden file input, for adding a file or replacing one.
type PickTarget = { kind: 'add', role: PaperFileRole, typeId: number | null } | { kind: 'replace', row: Row }
const fileInput = ref<HTMLInputElement | null>(null)
const target = ref<PickTarget | null>(null)
const accept = computed(() => {
  const role = target.value?.kind === 'replace' ? target.value.row.role : target.value?.role
  return role ? paperFileAccepts[role] : ''
})

const pick = async (next: PickTarget) => {
  target.value = next
  await nextTick()
  fileInput.value?.click()
}

const fits = (role: PaperFileRole, file: File) =>
  paperFileAccepts[role].split(',').some(ext => file.name.toLowerCase().endsWith(ext))

const onPicked = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  const picked = target.value
  if (!file || !picked) return

  const role = picked.kind === 'replace' ? picked.row.role : picked.role
  if (!fits(role, file)) {
    $toast.error(`That file type doesn't fit: ${paperFileAccepts[role].replaceAll(',', ', ')}`)
    return
  }

  // A question paper, Word copy or mark scheme replaces the one the paper has; any other file is added.
  let row = picked.kind === 'replace' ? picked.row : undefined
  if (!row && role !== 'extra') row = rows.value.find(item => item.role === role && !isRemoved(item))
  if (!row) {
    row = {
      key: `new-${++keySeed}`,
      role,
      typeId: picked.kind === 'add' ? picked.typeId : null,
      originalTypeId: null,
      ext: null,
      size: null,
      pages: null,
    }
    rows.value.push(row)
    row = rows.value[rows.value.length - 1]!
  }

  row.uploading = true
  uploading.value = true
  try {
    const response = await uploadItemFile(file, role === 'question' ? 'pdf' : undefined)
    const key = response.status == 1 ? response.data?.[0]?.file.name : undefined
    if (key) {
      row.upload = key
      row.localName = file.name
      row.removed = false
      row.ext = file.name.split('.').pop()?.toLowerCase() ?? null
      row.size = null
      row.pages = null
    }
    else if (row.id === undefined) {
      rows.value = rows.value.filter(item => item !== row)
    }
  }
  finally {
    row.uploading = false
    uploading.value = rows.value.some(item => item.uploading)
  }
}

const remove = (row: Row) => {
  if (row.id === undefined) {
    rows.value = rows.value.filter(item => item !== row)
    return
  }
  row.removed = true
}

const undo = (row: Row) => {
  if (row.id === undefined) {
    rows.value = rows.value.filter(item => item !== row)
    return
  }
  row.upload = undefined
  row.localName = undefined
  row.removed = false
  row.typeId = row.originalTypeId
  const stored = props.files.find(file => file.id === row.id)
  row.ext = stored?.ext ?? row.ext
  row.size = stored?.size ?? row.size
  row.pages = stored?.pages ?? row.pages
}

const setType = (row: Row, value: unknown) => {
  row.typeId = value === null || value === undefined ? null : Number(value)
}

// The add/edit's `files`: only what changed here.
watch(rows, () => {
  const list: PaperFileChangeDTO[] = []
  for (const row of rows.value) {
    if (row.id !== undefined) {
      if (row.removed) {
        list.push({ id: row.id, remove: true })
        continue
      }
      const typeChanged = row.role === 'extra' && row.typeId !== row.originalTypeId && row.typeId !== null
      if (row.upload || typeChanged) {
        list.push({
          id: row.id,
          ...(row.upload ? { upload: row.upload } : {}),
          ...(typeChanged ? { type_id: row.typeId! } : {}),
        })
      }
    }
    else if (row.upload) {
      list.push({ role: row.role, upload: row.upload, ...(row.role === 'extra' && row.typeId ? { type_id: row.typeId } : {}) })
    }
  }
  changes.value = list
}, { deep: true, immediate: true })

/** Whether the paper will have a question paper once the changes are saved (it is required). */
const hasQuestion = computed(() => rows.value.some(row => row.role === 'question' && !isRemoved(row) && (row.id !== undefined || row.upload)))
defineExpose({ hasQuestion })
</script>

<style scoped>
.file-row {
  border-top: 1px solid rgb(var(--v-theme-grey200));
}
.file-name {
  min-width: 200px;
}
.add-select {
  min-width: 190px;
  max-width: 220px;
}
.kind-select {
  min-width: 170px;
  max-width: 200px;
}
</style>
