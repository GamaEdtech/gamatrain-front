<template>
  <v-container class="d-flex flex-column margin-top-handle">
    <v-row class="justify-center">
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
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { GetTeacherProfilesParams, TeacherProfileDTO, TeacherProfileSortFilter } from '@/types'

type SortValue = '' | 'name-asc' | 'name-desc'

interface SortItem {
  title: string
  value: SortValue
  sortType?: 'Asc' | 'Desc'
  column?: 'FullName'
}

useHead({
  title: 'Teachers | GamaTrain',
})

const route = useRoute()
const router = useRouter()
const { totalCount, getData } = useTeachers()

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

const teachers = ref<TeacherProfileDTO[]>([])
const page = ref(Number(route.query.page) || 1)
const isAllDataLoaded = ref(false)
const isLoadingTeachers = ref(false)

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

const updateTeachersData = (items: TeacherProfileDTO[], reset = false) => {
  teachers.value = reset ? items : [...teachers.value, ...items]
  isAllDataLoaded.value = teachers.value.length >= totalCount.value || items.length < PAGE_SIZE
}

const handleFilterInput = () => {
  if (inputTimer) {
    clearTimeout(inputTimer)
  }

  inputTimer = setTimeout(() => {
    handleFiltersChanged()
  }, INPUT_DEBOUNCE_MS)
}

const selectSort = (item: SortItem) => {
  selectedSort.value = item
  handleFiltersChanged()
}

const fetchTeachers = async (reset = false) => {
  isLoadingTeachers.value = true

  try {
    const response = await getData(getTeacherParams())
    const items = response?.data?.list ?? []

    updateTeachersData(items, reset)

    return response
  }
  finally {
    isLoadingTeachers.value = false
  }
}

const handleFiltersChanged = async () => {
  page.value = 1
  teachers.value = []
  isAllDataLoaded.value = false
  await updateQuery()
  await fetchTeachers(true)
}

// const loadNextPage = async () => {
//   if (isLoadingTeachers.value || isAllDataLoaded.value) {
//     return
//   }

//   page.value += 1
//   await updateQuery()
//   await fetchTeachers()
// }

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
  'teachers-list',
  () => getData(getTeacherParams()),
)

if (initialTeachersResponse.value?.data) {
  updateTeachersData(initialTeachersResponse.value.data.list, true)
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
</style>
