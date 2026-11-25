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
      <div class="pa-4 pb-2">
        <div class="text-subtitle-1 font-weight-medium">
          Files
        </div>
        <div class="text-caption text-grey600">
          The question paper (PDF) is required. We read each PDF and sort it for you; change anything that's wrong.
        </div>
      </div>

      <div class="px-4 pb-4">
        <v-sheet
          class="drop-zone d-flex flex-column align-center justify-center text-center pa-6"
          :class="{ 'drop-zone--over': dragging }"
          rounded="lg"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="onDrop"
        >
          <v-icon
            size="36"
            color="primary"
          >
            md:upload_file
          </v-icon>
          <div class="text-body-1 font-weight-medium mt-2">
            {{ hasQuestion ? 'Drop more files here' : 'Drop the question paper here' }}
          </div>
          <div class="text-caption text-grey600 mb-3">
            {{ hasQuestion
              ? 'Mark scheme, Word copy, insert, audio... each is recognised from its first page when it can be.'
              : 'A PDF. We read its cover and fill in the paper\'s details for you to check.' }}
          </div>
          <v-btn
            color="primary"
            rounded="pill"
            variant="flat"
            prepend-icon="md:folder_open"
            @click="browse()"
          >
            Choose files
          </v-btn>
        </v-sheet>

        <div class="mt-4">
          <div class="text-caption text-grey700 font-weight-medium mb-2">
            What you can add
          </div>
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="main in mainSlots"
              :key="main.role"
              :color="main.done ? 'success' : main.required ? 'error' : undefined"
              :variant="main.done ? 'tonal' : 'outlined'"
              :prepend-icon="main.done ? 'md:check_circle' : 'md:add'"
              @click="pickSlot(main.role)"
            >
              {{ main.title }}<span
                v-if="main.required && !main.done"
                class="ml-1"
              >(required)</span>
            </v-chip>
            <v-chip
              v-for="type in extraTypes"
              :key="type.id"
              variant="outlined"
              prepend-icon="md:add"
              @click="pickSlot('extra', type.id)"
            >
              {{ type.title }}
            </v-chip>
          </div>
          <div class="text-caption text-grey600 mt-2">
            Pick a kind to add that file, or drop several files above and we sort them.
          </div>
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
            class="font-weight-medium d-flex align-center ga-2"
            :class="{ 'text-decoration-line-through text-grey600': isRemoved(row) }"
          >
            {{ paperFileLabel({ role: row.role, ext: row.ext, type_title: typeTitle(row) }, isPaper) }}
            <span
              v-if="row.role === 'question'"
              class="text-caption text-grey600 font-weight-regular"
            >· required</span>
            <v-chip
              v-if="row.auto"
              size="x-small"
              color="primary"
              variant="tonal"
              prepend-icon="md:auto_awesome"
            >
              Recognised
            </v-chip>
          </div>
          <div class="text-caption text-grey600">
            {{ meta(row) }}
          </div>
          <div
            v-if="row.warning"
            class="text-caption text-error mt-1"
          >
            {{ row.warning }}
          </div>
        </div>

        <v-select
          v-if="row.id === undefined && !row.uploading"
          :model-value="row.role"
          :items="roleChoices(row)"
          item-title="title"
          item-value="value"
          label="This is"
          density="compact"
          variant="outlined"
          rounded="pill"
          hide-details
          class="kind-select"
          @update:model-value="setRole(row, $event)"
        />

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
          :error="!row.typeId"
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

        <div class="d-flex align-center ga-1">
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
            @click="browse(row)"
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
    </v-card>

    <input
      ref="fileInput"
      type="file"
      class="d-none"
      :multiple="!replacing && !slot"
      :accept="pickerAccept"
      @change="onPicked"
    >
  </div>
</template>

<script setup lang="ts">
import type { PaperDetectionDTO, PaperFileChangeDTO, PaperFileDTO, PaperFileRole, PaperPendingEditDTO } from '@/types'
import { paperFileAccepts, paperFileLabel } from '~/utils/paperFiles'

/**
 * A paper's files as one list (create and edit, teacher and admin). Files are dropped or chosen; each PDF is read by the
 * backend on upload, which says what it is (question paper, mark scheme, insert, ...) and, for the question paper, what
 * paper it is (`detected`, for the form to fill in). Nothing is saved here: uploads give keys, and `changes` (the add or
 * edit's `files`) is sent on Submit. On a published paper the backend keeps the changes for review; `pending` shows the
 * edit already waiting.
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

const emit = defineEmits<{
  /** The question paper's details, read from its cover. */
  detected: [detection: PaperDetectionDTO]
}>()

const changes = defineModel<PaperFileChangeDTO[]>('changes', { default: () => [] })
const uploading = defineModel<boolean>('uploading', { default: false })

const { $toast } = useNuxtApp()
const { uploadItemFile, getFileLink } = usePastPaper({ admin: props.admin })
const { extraTypeFile, getExtraTypeFile } = useBoard()

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
  /** Its role (and kind) came from reading the file. */
  auto?: boolean
  warning?: string
}

const ROLE_TITLES: Record<PaperFileRole, string> = {
  question: 'Question paper (PDF)',
  answer: 'Mark scheme',
  word: 'Question paper (Word)',
  extra: 'Other file',
}
const roleColor: Record<PaperFileRole, string> = { question: 'error', word: 'info', answer: 'teal', extra: 'deep-purple' }
const extraTypes = computed(() => (extraTypeFile.value ?? []).map(item => ({ id: Number(item.id), title: item.title })))
const allAccepted = [...new Set(Object.values(paperFileAccepts).join(',').split(','))].join(',')

const rows = ref<Row[]>([])
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
}

watch(() => [props.files, props.pending], fromFiles, { immediate: true, deep: true })

onMounted(() => {
  if (!extraTypeFile.value?.length) getExtraTypeFile('test_extra_file')
})

const isRemoved = (row: Row) => row.removed || row.waiting === 'removed'
const live = (role: PaperFileRole, except?: Row) => rows.value.find(row => row !== except && row.role === role && !isRemoved(row))
const typeTitle = (row: Row) => extraTypes.value.find(item => item.id === row.typeId)?.title ?? null
const hasLocalChange = (row: Row) => Boolean(row.upload || row.removed || (row.id !== undefined && row.typeId !== row.originalTypeId))
const badge = (row: Row) => (['doc', 'docx', 'word'].includes(String(row.ext).toLowerCase()) ? 'DOC' : String(row.ext || 'file').slice(0, 4).toUpperCase())

/** Whether the paper will have a question paper once the changes are saved (it is required). */
const hasQuestion = computed(() => rows.value.some(row => row.role === 'question' && !isRemoved(row) && (row.id !== undefined || row.upload)))

const meta = (row: Row) => {
  if (row.uploading) return `${row.localName} · uploading and reading...`
  if (row.localName) return `${row.localName} · new, saved when you submit`
  return [row.ext?.toUpperCase(), row.pages ? `${row.pages} pages` : '', row.size].filter(Boolean).join(' · ')
}

const status = (row: Row): { text: string, color: string } => {
  if (row.removed) return { text: 'Will be removed', color: 'error' }
  if (row.upload || row.uploading) return { text: row.id === undefined ? 'New' : 'New version', color: 'warning' }
  if (row.waiting === 'removed') return { text: 'Removed after review', color: 'error' }
  if (row.waiting === 'added') return { text: 'New file, waiting for review', color: 'warning' }
  if (row.waiting) return { text: 'New version, waiting for review', color: 'warning' }
  return { text: 'Saved', color: 'success' }
}

const rowClass = (row: Row) => ({
  'bg-red-lighten-5': isRemoved(row),
  'bg-amber-lighten-5': !isRemoved(row) && Boolean(row.upload || row.waiting),
})

// A new file's role can change, except to a role another file already has (one question, Word copy and mark scheme each).
const roleChoices = (row: Row) => (Object.keys(ROLE_TITLES) as PaperFileRole[])
  .filter(role => role === 'extra' || role === row.role || !live(role, row))
  .map(role => ({ title: ROLE_TITLES[role], value: role }))

const setRole = (row: Row, value: unknown) => {
  row.role = value as PaperFileRole
  row.auto = false
  if (row.role !== 'extra') row.typeId = null
}

const setType = (row: Row, value: unknown) => {
  row.typeId = value === null || value === undefined ? null : Number(value)
}

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

// One hidden input: several new files (sorted by reading them), one file of a chosen kind, or one replacement for a row.
const fileInput = ref<HTMLInputElement | null>(null)
const replacing = ref<Row | null>(null)
type Slot = { role: PaperFileRole, typeId: number | null }
const slot = ref<Slot | null>(null)
const dragging = ref(false)
const pickerAccept = computed(() => {
  const role = replacing.value?.role ?? slot.value?.role
  return role ? paperFileAccepts[role] : allAccepted
})

// The kinds of file a paper can have, so the user sees what else to add: its three main files (ticked once there) and the
// other kinds.
const mainSlots = computed(() => (['question', 'answer', 'word'] as const).map(role => ({
  role,
  title: ROLE_TITLES[role],
  required: role === 'question',
  done: Boolean(live(role)),
})))

const browse = async (row?: Row) => {
  replacing.value = row && 'key' in row ? row : null
  slot.value = null
  await nextTick()
  fileInput.value?.click()
}

// A main file the paper already has is replaced; otherwise a new file of that kind is added.
const pickSlot = async (role: PaperFileRole, typeId: number | null = null) => {
  const existing = role === 'extra' ? undefined : live(role)
  if (existing) {
    await browse(existing)
    return
  }
  replacing.value = null
  slot.value = { role, typeId }
  await nextTick()
  fileInput.value?.click()
}

const onPicked = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const picked = [...(input.files ?? [])]
  input.value = ''
  const target = replacing.value
  const chosen = slot.value
  replacing.value = null
  slot.value = null
  if (target && picked[0]) await replace(target, picked[0])
  else await addFiles(picked, chosen)
}

const onDrop = async (event: DragEvent) => {
  dragging.value = false
  await addFiles([...(event.dataTransfer?.files ?? [])])
}

const extOf = (file: File) => file.name.split('.').pop()?.toLowerCase() ?? ''
const fits = (role: PaperFileRole, file: File) => paperFileAccepts[role].split(',').includes(`.${extOf(file)}`)

// Before the file is read: the first PDF is the question paper, a Word file its Word copy, anything else an extra file.
const guessRole = (file: File): PaperFileRole => {
  const ext = extOf(file)
  if (ext === 'pdf') return live('question') ? 'extra' : 'question'
  if (ext === 'doc' || ext === 'docx') return live('word') ? 'extra' : 'word'
  return 'extra'
}

const upload = async (row: Row, file: File) => {
  row.uploading = true
  row.localName = file.name
  uploading.value = true
  try {
    const response = await uploadItemFile(file, row.role === 'question' ? 'pdf' : undefined)
    const item = response.status == 1 ? response.data?.[0] : undefined
    if (!item?.file.name) return null
    row.upload = item.file.name
    row.removed = false
    row.ext = extOf(file) || null
    row.size = null
    row.pages = null
    return item.detected ?? null
  }
  finally {
    row.uploading = false
    uploading.value = rows.value.some(item => item.uploading)
  }
}

// What the file said about itself: its role and kind, and for the question paper the paper's details.
const applyDetection = (row: Row, detected: PaperDetectionDTO | null, chosen = false) => {
  row.warning = undefined
  if (!detected) return
  const role = detected.fileRole
  // A file read as another role moves there, unless the user chose its kind or that role is taken (a replacement keeps
  // its row's role).
  if (!chosen && row.id === undefined && role && role !== row.role && (role === 'extra' || !live(role, row))) {
    row.role = role
    row.auto = true
  }
  if (!chosen && row.role === 'extra' && detected.fileType) {
    row.typeId = detected.fileType.id
    row.auto = true
  }
  if (row.role === 'question') {
    if (detected.isMarkScheme) row.warning = 'This looks like a mark scheme, not the question paper.'
    else if (detected.board || detected.subject || detected.year) emit('detected', detected)
  }
}

const addFiles = async (files: File[], chosen: Slot | null = null) => {
  for (const file of files) {
    const role = chosen?.role ?? guessRole(file)
    if (!fits(role, file)) {
      $toast.error(`${file.name}: this file type doesn't fit ${ROLE_TITLES[role].toLowerCase()} (${paperFileAccepts[role].replaceAll(',', ', ')}).`)
      continue
    }
    rows.value.push({ key: `new-${++keySeed}`, role, typeId: chosen?.typeId ?? null, originalTypeId: null, ext: extOf(file), size: null, pages: null })
    const row = rows.value[rows.value.length - 1]!
    const detected = await upload(row, file)
    if (!row.upload) {
      rows.value = rows.value.filter(item => item !== row)
      continue
    }
    applyDetection(row, detected, chosen !== null)
  }
}

const replace = async (row: Row, file: File) => {
  if (!fits(row.role, file)) {
    $toast.error(`That file type doesn't fit: ${paperFileAccepts[row.role].replaceAll(',', ', ')}`)
    return
  }
  applyDetection(row, await upload(row, file))
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
  row.warning = undefined
  row.typeId = row.originalTypeId
  const stored = props.files.find(file => file.id === row.id)
  row.ext = stored?.ext ?? row.ext
  row.size = stored?.size ?? row.size
  row.pages = stored?.pages ?? row.pages
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

/** An extra file without a kind can't be saved: the form waits for it. */
const missingKind = computed(() => rows.value.some(row => row.role === 'extra' && !isRemoved(row) && !row.typeId && (row.upload || row.id === undefined)))
defineExpose({ hasQuestion, missingKind })
</script>

<style scoped>
.file-row {
  border-top: 1px solid rgb(var(--v-theme-grey200));
}
.file-name {
  min-width: 200px;
}
.kind-select {
  min-width: 170px;
  max-width: 220px;
}
.drop-zone {
  border: 2px dashed rgb(var(--v-theme-grey300));
  transition: border-color 0.15s, background-color 0.15s;
}
.drop-zone--over {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.06);
}
</style>
