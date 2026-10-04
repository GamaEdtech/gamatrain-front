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
            v-if="loadError && teachers.length === 0"
            cols="12"
          >
            <div class="w-100 d-flex flex-column align-center justify-center ga-4 pa-8 rounded-lg empty-teachers">
              <v-icon
                color="grey300"
                size="48"
              >
                md:cloud_off
              </v-icon>
              <div class="d-flex flex-column align-center ga-1 text-center">
                <span class="text-h4 font-weight-bold text-grey700">
                  Couldn't load teachers
                </span>
                <span class="text-h6 font-weight-regular text-grey500">
                  Check your connection and try again.
                </span>
              </div>
              <v-btn
                flat
                rounded="lg"
                color="primary"
                @click="reloadTeachers"
              >
                Try again
              </v-btn>
            </div>
          </v-col>

          <v-col
            v-else-if="!isLoadingNextPage && teachers.length === 0 && isAllDataLoaded"
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

      <template #error="{ props }">
        <div class="w-100 d-flex justify-center my-4">
          <v-btn
            v-bind="props"
            flat
            rounded="lg"
            color="grey200"
            class="text-grey700"
          >
            Couldn't load more teachers. Try again
          </v-btn>
        </div>
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
type FetchResult = 'ok' | 'error' | 'stale'

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
  title: 'Teachers',
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

const parsedPage = Number(getQueryString(route.query.page))
const initialPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
const teachers = ref<TeacherProfileDTO[]>([])
const page = ref(initialPage)
const firstLoadedPage = ref(initialPage)
const lastLoadedPage = ref(initialPage)
const isAllDataLoaded = ref(false)
const isLoadingFilters = ref(false)
const isLoadingPreviousPage = ref(false)
const isLoadingNextPage = ref(false)
const loadError = ref(false)
const infiniteScroll = ref<{ reset: () => void } | null>(null)
// Bumped on every filter/sort change so responses requested under older filters are dropped
let filtersVersion = 0

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
  filtersVersion++
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
): Promise<FetchResult> => {
  const version = filtersVersion

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
    // getData never throws: failures come back as { succeeded: false }
    const response = await getData(getTeacherParams(pageNumber))

    if (version !== filtersVersion) {
      return 'stale'
    }

    if (!response.succeeded) {
      return 'error'
    }

    updateTeachersData(response.data?.list ?? [], mode)

    return 'ok'
  }
  finally {
    if (loadingType === 'filters') {
      // A newer filter request owns the loading state, leave it on until that one finishes
      if (version === filtersVersion) {
        isLoadingFilters.value = false
      }
    }
    else if (loadingType === 'previous-page') {
      isLoadingPreviousPage.value = false
    }
    else {
      isLoadingNextPage.value = false
    }
  }
}

const reloadTeachers = async (pageNumber = firstLoadedPage.value) => {
  filtersVersion++
  loadError.value = false

  const result = await fetchTeachers('reset', 'filters', pageNumber)
  if (result === 'stale') {
    return
  }

  loadError.value = result === 'error'
  infiniteScroll.value?.reset()
}

const handleFiltersChanged = async () => {
  filtersVersion++
  page.value = 1
  firstLoadedPage.value = 1
  lastLoadedPage.value = 1
  teachers.value = []
  isAllDataLoaded.value = false
  await updateQuery()
  await reloadTeachers(1)
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
  const result = await fetchTeachers('prepend', 'previous-page', previousPage)
  if (result !== 'ok') {
    return
  }

  firstLoadedPage.value = previousPage
  page.value = previousPage
  await updateQuery()
}

const loadNextPage = async ({ done }: InfiniteScrollLoadOptions) => {
  if (isLoadingFilters.value || isLoadingPreviousPage.value || isLoadingNextPage.value) {
    done('ok')
    return
  }

  // The first page failed, the "Try again" button reloads it instead
  if (isAllDataLoaded.value || loadError.value) {
    done('empty')
    return
  }

  const nextPage = lastLoadedPage.value + 1
  const result = await fetchTeachers('append', 'next-page', nextPage)

  if (result === 'stale') {
    done('ok')
    return
  }

  if (result === 'error') {
    done('error')
    return
  }

  lastLoadedPage.value = nextPage
  page.value = nextPage
  await updateQuery()
  done(isAllDataLoaded.value ? 'empty' : 'ok')
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
if (initialTeachersResponse.value?.succeeded) {
  updateTeachersData(initialTeachersResponse.value.data?.list ?? [], 'reset')
}
else {
  loadError.value = true
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
