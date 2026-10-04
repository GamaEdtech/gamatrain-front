<template>
  <v-container class="d-flex flex-column align-center margin-top-handle pa-0">
    <div class="w-100 d-flex align-start justify-center px-2">
      <div class="w-100 d-flex flex-column flex-md-row align-stretch ga-3">
        <v-text-field
          v-model="filters.fullName"
          variant="outlined"
          density="compact"
          hide-details
          label="Teacher name"
          rounded="lg"
          base-color="grey400"
          color="primary"
          active-color="primary"
          bg-color="white"
          prepend-inner-icon="md:person_search"
          icon-color="primary"
          glow
          @update:model-value="handleFilterInput"
        />

        <v-text-field
          v-model="filters.skill"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          label="Skill"
          rounded="lg"
          base-color="grey400"
          color="primary"
          active-color="primary"
          bg-color="white"
          prepend-inner-icon="md:psychology"
          icon-color="primary"
          glow
          @update:model-value="handleFilterInput"
        />

        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              flat
              color="grey200"
              height="40"
              class="text-grey700"
              rounded="lg"
            >
              <v-icon
                color="grey500"
                size="20"
                class="mr-1"
              >
                md:sort
              </v-icon>
              {{ selectedSort.title }}
            </v-btn>
          </template>

          <v-list density="compact">
            <v-list-item
              v-for="item in sortItems"
              :key="item.value"
              :active="item.value === selectedSort.value"
              @click="selectSort(item)"
            >
              <v-list-item-title class="text-h6 text-grey700">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-infinite-scroll
      ref="infiniteScroll"
      class="w-100 custome-infinite-scroll"
      mode="intersect"
      side="end"
      margin="80"
      @load="loadNextPage"
    >
      <v-row class="w-100 my-4 justify-start flex-0-1 mx-0">
        <template v-if="isLoadingFilters">
          <v-col
            v-for="item in 4"
            :key="item"
            cols="12"
            sm="6"
            class="h-100"
          >
            <TeachersCardSkeleton />
          </v-col>
        </template>

        <template v-else>
          <v-col
            v-if="firstLoadedPage > 1"
            cols="12"
            class="d-flex justify-center"
          >
            <v-btn
              flat
              rounded="lg"
              color="grey200"
              class="text-grey700"
              :loading="isLoadingPreviousPage"
              @click="loadPreviousPage"
            >
              <v-icon
                color="grey500"
                size="20"
                class="mr-1"
              >
                md:keyboard_arrow_up
              </v-icon>
              Load previous teachers
            </v-btn>
          </v-col>

          <template v-if="isLoadingPreviousPage">
            <v-col
              v-for="item in 2"
              :key="`previous-${item}`"
              cols="12"
              sm="6"
              class="h-100"
            >
              <TeachersCardSkeleton />
            </v-col>
          </template>

          <v-col
            v-if="!isLoadingFilters && !isLoadingNextPage && teachers.length === 0 && isAllDataLoaded"
            cols="12"
          >
            <div class="w-100 d-flex flex-column align-center justify-center ga-4 pa-8 rounded-lg empty-teachers">
              <v-icon
                color="grey300"
                size="48"
              >
                md:person_search
              </v-icon>
              <div class="d-flex flex-column align-center ga-1 text-center">
                <span class="text-h4 font-weight-bold text-grey700">
                  No teachers found
                </span>
                <span class="text-h6 font-weight-regular text-grey500">
                  Try changing the teacher name or skill filter.
                </span>
              </div>
            </div>
          </v-col>

          <v-col
            v-for="teacher in teachers"
            :key="teacher.handle || teacher.fullName"
            cols="12"
            sm="6"
          >
            <TeachersCard :teacher="teacher" />
          </v-col>
        </template>
      </v-row>

      <template #loading>
        <v-row
          v-if="teachers.length > 0 && !isLoadingFilters"
          class="w-100 my-1 justify-start flex-0-1 mx-0"
        >
          <v-col
            v-for="item in 2"
            :key="item"
            cols="12"
            sm="6"
            class="h-100"
          >
            <TeachersCardSkeleton />
          </v-col>
        </v-row>
      </template>

      <template #empty>
        <div />
      </template>
    </v-infinite-scroll>
  </v-container>
</template>

<script setup lang="ts">
import type { GetTeacherProfilesParams, TeacherProfileDTO, TeacherProfileSortFilter } from '@/types'

type SortValue = '' | 'name-asc' | 'name-desc'
type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error'

interface SortItem {
  title: string
  value: SortValue
  sortType?: 'Asc' | 'Desc'
  column?: 'FullName'
}

interface InfiniteScrollLoadOptions {
  done: (status: InfiniteScrollStatus) => void
}

useHead({
  title: 'Teachers | GamaTrain',
})

const route = useRoute()
const router = useRouter()
const { getData } = useTeachers()

const INPUT_DEBOUNCE_MS = 1000
const PAGE_SIZE = 10
let inputTimer: ReturnType<typeof setTimeout> | null = null

const getQueryString = (value: unknown) => {
  return typeof value === 'string' ? value : ''
}

const sortItems: SortItem[] = [
  {
    title: 'No sort',
    value: '',
  },
  {
    title: 'Name A-Z',
    value: 'name-asc',
    sortType: 'Asc',
    column: 'FullName',
  },
  {
    title: 'Name Z-A',
    value: 'name-desc',
    sortType: 'Desc',
    column: 'FullName',
  },
]

const filters = reactive({
  fullName: getQueryString(route.query.fullName),
  skill: getQueryString(route.query.skill),
})

const selectedSort = ref<SortItem>(
  sortItems.find(item => item.value === route.query.sort) ?? sortItems[0]!,
)

const initialPage = Number(route.query.page) || 1
const teachers = ref<TeacherProfileDTO[]>([])
const page = ref(initialPage)
const firstLoadedPage = ref(initialPage)
const lastLoadedPage = ref(initialPage)
const isAllDataLoaded = ref(false)
const isLoadingFilters = ref(false)
const isLoadingPreviousPage = ref(false)
const isLoadingNextPage = ref(false)
const infiniteScroll = ref<{ reset: () => void } | null>(null)

const getSortFilter = (): TeacherProfileSortFilter[] | undefined => {
  if (!selectedSort.value.column || !selectedSort.value.sortType) {
    return undefined
  }

  return [
    {
      sortType: selectedSort.value.sortType,
      column: selectedSort.value.column,
    },
  ]
}

const getTeacherParams = (pageNumber = page.value): GetTeacherProfilesParams => {
  return {
    page: pageNumber,
    pageSize: PAGE_SIZE,
    fullName: filters.fullName,
    skill: filters.skill,
    sortFilter: getSortFilter(),
  }
}

const updateTeachersData = (
  items: TeacherProfileDTO[],
  mode: 'reset' | 'append' | 'prepend' = 'append',
) => {
  if (mode === 'reset') {
    teachers.value = items
  }
  else if (mode === 'prepend') {
    teachers.value = [...items, ...teachers.value]
  }
  else {
    teachers.value = [...teachers.value, ...items]
  }

  if (mode !== 'prepend') {
    isAllDataLoaded.value = items.length < PAGE_SIZE
  }
}

const handleFilterInput = () => {
  isLoadingFilters.value = true
  if (inputTimer) {
    clearTimeout(inputTimer)
  }

  inputTimer = setTimeout(() => {
    handleFiltersChanged()
  }, INPUT_DEBOUNCE_MS)
}

const selectSort = (item: SortItem) => {
  isLoadingFilters.value = true
  selectedSort.value = item
  handleFiltersChanged()
}

const fetchTeachers = async (
  mode: 'reset' | 'append' | 'prepend' = 'reset',
  loadingType: 'filters' | 'previous-page' | 'next-page' = 'filters',
  pageNumber = page.value,
) => {
  if (loadingType === 'filters') {
    isLoadingFilters.value = true
  }
  else if (loadingType === 'previous-page') {
    isLoadingPreviousPage.value = true
  }
  else {
    isLoadingNextPage.value = true
  }

  try {
    const response = await getData(getTeacherParams(pageNumber))
    const items = response?.data?.list ?? []

    updateTeachersData(items, mode)

    return response
  }
  finally {
    if (loadingType === 'filters') {
      isLoadingFilters.value = false
    }
    else if (loadingType === 'previous-page') {
      isLoadingPreviousPage.value = false
    }
    else {
      isLoadingNextPage.value = false
    }
  }
}

const handleFiltersChanged = async () => {
  page.value = 1
  firstLoadedPage.value = 1
  lastLoadedPage.value = 1
  teachers.value = []
  isAllDataLoaded.value = false
  await updateQuery()
  await fetchTeachers('reset', 'filters', page.value)
  infiniteScroll.value?.reset()
}

const loadPreviousPage = async () => {
  if (
    firstLoadedPage.value <= 1
    || isLoadingFilters.value
    || isLoadingPreviousPage.value
    || isLoadingNextPage.value
  ) {
    return
  }

  const previousPage = firstLoadedPage.value - 1
  page.value = previousPage
  await updateQuery()

  await fetchTeachers('prepend', 'previous-page', previousPage)
  firstLoadedPage.value = previousPage
}

const loadNextPage = async ({ done }: InfiniteScrollLoadOptions) => {
  if (isLoadingFilters.value || isLoadingPreviousPage.value || isLoadingNextPage.value) {
    done('ok')
    return
  }

  if (isAllDataLoaded.value) {
    done('empty')
    return
  }

  const nextPage = lastLoadedPage.value + 1
  page.value = nextPage
  await updateQuery()

  try {
    await fetchTeachers('append', 'next-page', nextPage)
    lastLoadedPage.value = nextPage
    done(isAllDataLoaded.value ? 'empty' : 'ok')
  }
  catch {
    done('error')
  }
}

const updateQuery = async () => {
  const query: Record<string, string> = {}

  if (page.value > 1) {
    query.page = String(page.value)
  }

  if (filters.fullName) {
    query.fullName = filters.fullName
  }

  if (filters.skill) {
    query.skill = filters.skill
  }

  if (selectedSort.value.value) {
    query.sort = selectedSort.value.value
  }

  await router.replace({ query })
}

const { data: initialTeachersResponse } = await useAsyncData(
  `teachers-list-${page.value}`,
  () => getData(getTeacherParams()),
)
if (initialTeachersResponse.value?.data) {
  updateTeachersData(initialTeachersResponse.value.data.list ?? [], 'reset')
}

onBeforeUnmount(() => {
  if (inputTimer) {
    clearTimeout(inputTimer)
  }
})
</script>

<style scoped>
.margin-top-handle {
  margin-top: 80px;
  min-height: calc(100vh - 80px);
}
:deep(.custome-infinite-scroll .v-infinite-scroll__side){
  padding : 0
}
.empty-teachers {
  min-height: 220px;
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
