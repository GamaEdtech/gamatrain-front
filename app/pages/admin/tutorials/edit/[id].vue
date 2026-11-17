<template>
  <div class="w-100 d-flex flex-column ga-4 pb-8">
    <div class="d-flex align-center ga-2">
      <v-btn
        variant="text"
        prepend-icon="md:arrow_back"
        to="/admin/tutorials"
      >
        Tutorials
      </v-btn>
      <h1 class="text-h6">
        {{ isNew ? 'Add tutorial' : `Edit tutorial #${id}` }}
      </h1>
      <v-spacer />
      <v-btn
        v-if="!isNew && status === 'Confirmed'"
        variant="text"
        prepend-icon="md:visibility"
        :href="`/tutorial/${id}`"
        target="_blank"
      >
        View
      </v-btn>
    </div>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    />

    <v-form
      v-else
      ref="form"
      class="d-flex flex-column ga-4"
      @submit.prevent="submit"
    >
      <v-row dense>
        <v-col
          cols="12"
          md="8"
          class="d-flex flex-column ga-3"
        >
          <v-text-field
            v-model="title"
            label="Title"
            hint="As on gama-api: &quot;Book | Topic&quot; makes the page description read well."
            persistent-hint
            variant="outlined"
            density="compact"
            counter="1000"
            :rules="[required, (v: string) => !v || v.length <= 1000 || 'At most 1000 characters']"
          />
          <common-rich-editor
            v-model="content"
            mode="full"
            :rules="[required]"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="d-flex flex-column ga-3"
        >
          <v-select
            v-model="status"
            :items="STATUSES"
            item-title="title"
            item-value="value"
            label="Status"
            hint="Only published tutorials are on the website."
            persistent-hint
            variant="outlined"
            density="compact"
          />
          <v-autocomplete
            v-model="boardId"
            :items="boards"
            item-title="title"
            item-value="id"
            label="Board"
            variant="outlined"
            density="compact"
            :rules="[required]"
            @update:model-value="changeBoard"
          />
          <v-autocomplete
            v-model="gradeId"
            :items="grades"
            item-title="title"
            item-value="id"
            label="Grade"
            variant="outlined"
            density="compact"
            clearable
            :disabled="!boardId"
            @update:model-value="changeGrade"
          />
          <v-autocomplete
            v-model="subjectId"
            :items="subjects"
            item-title="title"
            item-value="id"
            label="Subject"
            variant="outlined"
            density="compact"
            :rules="[required]"
            :disabled="!gradeId && !subjectId"
            @update:model-value="changeSubject"
          />
          <v-autocomplete
            v-model="topicIds"
            :items="topics"
            :item-title="topicTitle"
            item-value="id"
            label="Topics"
            hint="Usually a season and its chapter, in that order."
            persistent-hint
            variant="outlined"
            density="compact"
            multiple
            chips
            closable-chips
            :disabled="!subjectId"
          />
          <v-textarea
            v-model="description"
            label="Description"
            hint="Leave empty to make it from the content's headings."
            persistent-hint
            variant="outlined"
            density="compact"
            rows="3"
            counter="1000"
          />
          <v-combobox
            v-model="keywords"
            label="Keywords"
            hint="Type a keyword and press Enter."
            persistent-hint
            variant="outlined"
            density="compact"
            multiple
            chips
            closable-chips
          />
          <v-btn
            v-if="!isNew && can(ADMIN_PERMISSIONS.tutorials.keywords)"
            variant="tonal"
            color="primary"
            prepend-icon="md:auto_awesome"
            :loading="loadingKeywords"
            @click="aiKeywords"
          >
            Generate keywords with AI
          </v-btn>
          <div
            v-if="clusters.length"
            class="text-caption text-grey600"
          >
            Learning clusters: {{ clusters.join(' | ') }}
          </div>
          <v-btn
            type="submit"
            color="success"
            variant="flat"
            :loading="loadingSave"
          >
            {{ isNew ? 'Add tutorial' : 'Save' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { TutorialStatus, TypeItemDTO } from '@/types'
import { ADMIN_PERMISSIONS } from '~/constants'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))
const isNew = computed(() => id.value === 'new')
useHead({ title: () => (isNew.value ? 'Add tutorial' : 'Edit tutorial') })

const STATUSES: { title: string, value: TutorialStatus }[] = [
  { title: 'Waiting', value: 'Pending' },
  { title: 'Published', value: 'Confirmed' },
  { title: 'Needs changes', value: 'NeedsChanges' },
  { title: 'Rejected', value: 'Rejected' },
  { title: 'Deactivated', value: 'Deactivated' },
]

const { can } = useAdminAccess()
const { loadingSave, loadingKeywords, getTutorial, save, generateKeywords } = useTutorialAdmin()
const typeLists = useTypeLists()
const required = (value: unknown) => (Array.isArray(value) ? value.length > 0 : !!value) || 'Required'

const form = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const loading = ref(true)
const title = ref('')
const content = ref('')
const description = ref('')
const status = ref<TutorialStatus>('Pending')
const boardId = ref<string | null>(null)
const gradeId = ref<string | null>(null)
const subjectId = ref<string | null>(null)
const topicIds = ref<string[]>([])
const keywords = ref<string[]>([])
const clusters = ref<string[]>([])
const boards = ref<TypeItemDTO[]>([])
const grades = ref<TypeItemDTO[]>([])
const subjects = ref<TypeItemDTO[]>([])
const topics = ref<TypeItemDTO[]>([])

const topicTitle = (item: TypeItemDTO) => (item.season ? `${item.title} (season)` : item.title)

const changeBoard = async () => {
  gradeId.value = null
  subjectId.value = null
  topicIds.value = []
  grades.value = boardId.value ? await typeLists.grades(boardId.value) : []
  subjects.value = []
  topics.value = []
}

const changeGrade = async () => {
  subjectId.value = null
  topicIds.value = []
  subjects.value = gradeId.value ? await typeLists.subjects(gradeId.value) : []
  topics.value = []
}

const changeSubject = async () => {
  topicIds.value = []
  topics.value = subjectId.value ? await typeLists.topics(subjectId.value) : []
}

const aiKeywords = async () => {
  const result = await generateKeywords(Number(id.value))
  if (result) {
    keywords.value = result.keywords
    clusters.value = result.clusters
  }
}

const submit = async () => {
  if (!(await form.value?.validate())?.valid) return
  const result = await save(isNew.value ? null : Number(id.value), {
    title: title.value,
    content: content.value,
    description: description.value || null,
    boardId: Number(boardId.value),
    gradeId: gradeId.value ? Number(gradeId.value) : null,
    subjectId: Number(subjectId.value),
    topicIds: topicIds.value.map(Number),
    keywords: keywords.value,
    status: status.value,
  })
  if (result && isNew.value) await router.replace(`/admin/tutorials/edit/${result}`)
}

onMounted(async () => {
  boards.value = await typeLists.boards()
  if (!isNew.value) {
    const tutorial = await getTutorial(id.value)
    if (!tutorial) {
      await router.replace('/admin/tutorials')
      return
    }

    title.value = tutorial.title
    content.value = tutorial.content ?? ''
    description.value = tutorial.description ?? ''
    status.value = tutorial.status
    keywords.value = [...tutorial.keywords]
    boardId.value = tutorial.boardId ? String(tutorial.boardId) : null
    gradeId.value = tutorial.gradeId ? String(tutorial.gradeId) : null
    subjectId.value = tutorial.subjectId ? String(tutorial.subjectId) : null
    if (boardId.value) grades.value = await typeLists.grades(boardId.value)
    if (gradeId.value) subjects.value = await typeLists.subjects(gradeId.value)
    // A copied tutorial's subject may sit under another grade than the one stored: keep it selectable.
    if (subjectId.value && !subjects.value.some(s => s.id === subjectId.value)) {
      subjects.value = [...subjects.value, { id: subjectId.value, title: tutorial.subjectTitle ?? subjectId.value }]
    }

    if (subjectId.value) topics.value = await typeLists.topics(subjectId.value)
    topicIds.value = tutorial.topics.map(t => String(t.id))
  }

  loading.value = false
})
</script>
