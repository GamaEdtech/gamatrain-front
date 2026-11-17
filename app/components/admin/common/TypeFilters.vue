<template>
  <v-autocomplete
    :model-value="boardId"
    :items="boards"
    item-title="title"
    item-value="id"
    label="Board"
    density="compact"
    hide-details
    clearable
    rounded="pill"
    variant="outlined"
    class="type-filter"
    @update:model-value="changeBoard"
  />
  <v-autocomplete
    :model-value="gradeId"
    :items="grades"
    item-title="title"
    item-value="id"
    label="Grade"
    density="compact"
    hide-details
    clearable
    rounded="pill"
    variant="outlined"
    class="type-filter"
    :disabled="!boardId"
    @update:model-value="changeGrade"
  />
  <v-autocomplete
    :model-value="subjectId"
    :items="subjects"
    item-title="title"
    item-value="id"
    label="Subject"
    density="compact"
    hide-details
    clearable
    rounded="pill"
    variant="outlined"
    class="type-filter"
    :disabled="!gradeId"
    @update:model-value="changeSubject"
  />
  <v-autocomplete
    v-if="withTopic"
    :model-value="topicId"
    :items="topics"
    item-title="title"
    item-value="id"
    label="Topic"
    density="compact"
    hide-details
    clearable
    rounded="pill"
    variant="outlined"
    class="type-filter"
    :disabled="!subjectId"
    @update:model-value="changeTopic"
  />
</template>

<script setup lang="ts">
import type { TypeItemDTO } from '@/types'

// Board, grade, subject (and topic) filters from gama-api's type lists; each choice clears the ones below it.
withDefaults(defineProps<{ withTopic?: boolean }>(), { withTopic: false })
const emit = defineEmits<{ change: [] }>()
const boardId = defineModel<string | null>('boardId', { default: null })
const gradeId = defineModel<string | null>('gradeId', { default: null })
const subjectId = defineModel<string | null>('subjectId', { default: null })
const topicId = defineModel<string | null>('topicId', { default: null })

const typeLists = useTypeLists()
const boards = ref<TypeItemDTO[]>([])
const grades = ref<TypeItemDTO[]>([])
const subjects = ref<TypeItemDTO[]>([])
const topics = ref<TypeItemDTO[]>([])

const changeBoard = async (value: string | null) => {
  boardId.value = value
  gradeId.value = subjectId.value = topicId.value = null
  grades.value = value ? await typeLists.grades(value) : []
  subjects.value = topics.value = []
  emit('change')
}

const changeGrade = async (value: string | null) => {
  gradeId.value = value
  subjectId.value = topicId.value = null
  subjects.value = value ? await typeLists.subjects(value) : []
  topics.value = []
  emit('change')
}

const changeSubject = async (value: string | null) => {
  subjectId.value = value
  topicId.value = null
  topics.value = value ? await typeLists.topics(value) : []
  emit('change')
}

const changeTopic = (value: string | null) => {
  topicId.value = value
  emit('change')
}

onMounted(async () => {
  boards.value = await typeLists.boards()
})
</script>

<style scoped>
.type-filter {
  min-width: 160px;
  max-width: 230px;
}
</style>
