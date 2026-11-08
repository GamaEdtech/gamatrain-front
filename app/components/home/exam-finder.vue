<template>
  <v-card
    class="exam-finder pa-3 pa-sm-5"
    rounded="xl"
    elevation="8"
  >
    <v-chip-group
      v-model="selectedType"
      class="exam-finder__tabs"
      mandatory
      selected-class="bg-secondary"
    >
      <v-chip
        v-for="type in HOME_SEARCH_TYPES"
        :key="type.value"
        :value="type.value"
        :prepend-icon="type.icon"
        variant="text"
        class="font-weight-bold"
      >
        <span class="d-sm-none">{{ type.shortTitle }}</span>
        <span class="d-none d-sm-inline">{{ type.title }}</span>
      </v-chip>
    </v-chip-group>

    <v-form
      class="exam-finder__fields mt-2"
      @submit.prevent="search"
    >
      <div class="position-relative">
        <v-select
          v-model="selectedBoard"
          :items="boardList"
          :base-color="showBoardHint ? 'success500' : undefined"
          item-title="title"
          item-value="id"
          label="Board"
          variant="outlined"
          hide-details
          return-object
          @update:model-value="changeBoard"
          @update:focused="hideBoardHint"
        />
        <div
          v-if="showBoardHint"
          class="exam-finder__hint"
        >
          Select your Board!
        </div>
      </div>
      <v-select
        v-model="selectedGrade"
        :items="gradeList"
        :disabled="gradeLoader"
        item-title="title"
        item-value="id"
        label="Grade"
        variant="outlined"
        hide-details
      />
      <v-text-field
        v-model="keyword"
        class="exam-finder__keyword"
        label="Subject or title"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        autocomplete="off"
        hide-details
      />
      <v-btn
        class="exam-finder__submit text-none font-weight-bold"
        type="submit"
        color="primary"
        size="x-large"
        rounded="lg"
        flat
      >
        {{ searchAction }}
      </v-btn>
    </v-form>

    <div class="d-flex align-center ga-2 mt-3">
      <span class="exam-finder__popular d-none d-sm-inline text-grey600">Popular:</span>
      <v-chip-group>
        <v-chip
          v-for="title in HOME_POPULAR_SEARCHES"
          :key="title"
          :to="searchLink(selectedType, title)"
          size="small"
        >
          {{ title }}
        </v-chip>
      </v-chip-group>
    </div>
  </v-card>
</template>

<script setup>
import { HOME_POPULAR_SEARCHES, HOME_SEARCH_TYPES } from '@/constants/home'

const { data: boardList, getData: getBoards } = useBoard()
const { selectedBoard, selectedGrade, searchLink } = useHomeExplorer()

const selectedType = ref(HOME_SEARCH_TYPES[0].value)
const keyword = ref('')
const gradeList = ref([])
const gradeLoader = ref(false)
const showBoardHint = ref(false)

const searchAction = computed(() => HOME_SEARCH_TYPES.find(type => type.value === selectedType.value)?.action)
const search = () => navigateTo(searchLink(selectedType.value, keyword.value.trim()))

let gradeRequestId = 0
const fetchGradeList = async () => {
  if (!selectedBoard.value) return

  const requestId = ++gradeRequestId
  gradeLoader.value = true
  try {
    const response = await useApiService.get(`/api/v1/types/list`, { type: 'base', section_id: selectedBoard.value.code }, { public: true })
    if (requestId === gradeRequestId) gradeList.value = [{ id: null, title: 'All' }, ...response.data]
  }
  catch (error) {
    console.error('Error fetching grade list:', error)
  }
  finally {
    if (requestId === gradeRequestId) gradeLoader.value = false
  }
}

const changeBoard = () => {
  selectedGrade.value = null
  gradeList.value = []
  fetchGradeList()
}

// First-time visitors get a hint on the board field, until they first use it.
const hideBoardHint = () => {
  showBoardHint.value = false
  localStorage.setItem('boardHintShown', 'true')
}

const restoreBoard = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('selectedBoard'))
    return boardList.value.find(board => board.id === stored?.id)
  }
  catch {
    return undefined
  }
}

watch(selectedBoard, (board) => {
  localStorage.setItem('selectedBoard', JSON.stringify(board))
})

onMounted(async () => {
  showBoardHint.value = localStorage.getItem('boardHintShown') !== 'true'
  await getBoards()
  // A visitor coming back to the page keeps the board and grade they picked.
  selectedBoard.value ??= restoreBoard() ?? boardList.value[0]
  fetchGradeList()
})
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.exam-finder {
  :deep(.v-chip) {
    font-size: 0.875rem;
  }

  :deep(.v-label) {
    font-size: 0.9375rem;
  }
}

.exam-finder__submit :deep(.v-btn__content) {
  font-size: 1rem;
  text-transform: none;
}

// Phones show all four tabs at once: short names, no icons.
@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .exam-finder__tabs :deep(.v-chip__prepend) {
    display: none;
  }

  .exam-finder__tabs :deep(.v-chip) {
    margin-inline: 0.125rem;
    padding: 0 0.625rem;
  }
}

.exam-finder__popular {
  font-size: 0.875rem;
}

.exam-finder__hint {
  position: absolute;
  z-index: 1;
  bottom: -0.9375rem;
  left: 0.625rem;
  padding: 0.1875rem 0.625rem;
  border-radius: 61.875rem;
  color: rgb(var(--v-theme-on-primary));
  background: rgb(var(--v-theme-success500));
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  animation: hint-bob 1.6s ease-in-out infinite;

  // The pointer up to the field.
  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 1.25rem;
    border: 0.3125rem solid transparent;
    border-bottom-color: rgb(var(--v-theme-success500));
  }
}

@keyframes hint-bob {
  50% {
    transform: translateY(-0.1875rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .exam-finder__hint {
    animation: none;
  }
}

.exam-finder__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
}

.exam-finder__keyword,
.exam-finder__submit {
  grid-column: 1 / -1;
}

@media #{map.get(vuetify.$display-breakpoints, 'lg-and-up')} {
  .exam-finder__fields {
    grid-template-columns: 9.375rem 8.75rem 1fr auto;
  }

  .exam-finder__keyword,
  .exam-finder__submit {
    grid-column: auto;
  }

  .exam-finder__submit {
    height: 100%;
  }
}
</style>
