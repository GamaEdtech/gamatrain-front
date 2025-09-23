<template>
  <div>
    <v-container
      id="leader-board-page-header"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="text-white gtext-h3 font-weight-bold mt-4">
                Leader Board
              </h1>
              <p class="text-white gtext-t1 font-weight-medium">
                Season 2
              </p>
            </div>
            <div id="submain-title-holder">
              <v-img
                class="leader-board-second-third"
                src="/images/leader-board-second.png"
              >
                <v-img
                  v-if="winners.second"
                  class="leader-board-second-third-avatar"
                  :src="winners.second"
                />
              </v-img>
              <v-img
                class="leader-board-first"
                src="/images/leader-board-first.png"
              >
                <v-img
                  v-if="winners.first"
                  class="leader-board-first-avatar"
                  :src="winners.first"
                />
              </v-img>
              <v-img
                class="leader-board-second-third"
                src="/images/leader-board-third.png"
              >
                <v-img
                  v-if="winners.third"
                  class="leader-board-second-third-avatar"
                  :src="winners.third"
                />
              </v-img>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <div class="filter-container">
      <div class="d-flex w-100 justify-start justify-md-center ga-2">
        <template
          v-for="(filter, index) in filters"
          :key="filter.title || index"
        >
          <CommonChipSelectFilter
            :ref="(el) => (filters[index].refElement = el)"
            :title="filter.title"
            :api="filter.api"
            :selected-item="filter.selectedItem"
            :extra-api-params="filter.extraApiParams"
            :static-list="filter.staticList"
            :disabled="filter.disabled"
            @update-selected-item="updateSelectedItem($event, index)"
          />
        </template>
      </div>
      <div class="justify-space-between d-flex w-100 mt-4">
        <div class="d-flex ga-2">
          <template v-for="(filter, index) in filters">
            <v-chip
              v-if="filter.selectedItem"
              :key="filter.title"
              variant="flat"
              class="text-h5 pl-5 pr-5"
              color="#F2F4F7"
              :closable="index != FILTER_INDEX.Services"
              @click:close="clearFilter(filter, index)"
            >
              {{ filter.selectedItem?.title }}
            </v-chip>
          </template>
        </div>
      </div>
    </div>
    <div class="scrollable-table">
      <v-data-table
        :headers="headers"
        :items="list"
        class="elevation-1 mb-10"
        items-per-page="100"
        :loading="tableLoading"
        hide-default-footer
      >
        <template #[`item.index`]="{ index }">
          <div class="d-flex align-center ml-2">
            <span class="truncate-text">{{ index + 1 }}</span>
          </div>
        </template>

        <template #[`item.name`]="{ item }">
          <div class="d-flex align-center">
            <img
              v-if="item.avatar"
              class="user-avatar mr-2"
              :src="item.avatar"
              alt=""
            >

            <span class="truncate-text">{{ item.name }}</span>
          </div>
        </template>

        <template #[`item.address`]="{ item }">
          <div class="d-flex align-center">
            <span class="truncate-text">{{ item.address }}</span>
          </div>
        </template>
        <template #[`item.points`]="{ item }">
          <div class="d-flex align-center ml-1">
            <span class="truncate-text">{{ item.points }}</span>
          </div>
        </template>
      </v-data-table>
    </div>

    <v-row
      align="center"
      class="mt-10"
    >
      <v-col cols="12">
        <div class="stay-update">
          <p class="gtext-t1 font-weight-heavy text-white mt-15 mb-12">
            Stay in the loop with updates
          </p>
          <div class="email-subscription-container">
            <v-text-field
              v-model="emailAddress"
              type="text"
              variant="solo"
              density="comfortable"
              hide-details
              @click:append-inner="toggleMarker"
            >
              <template #prepend-inner>
                <span class="primary-gray-300 gtext-t6"><v-icon>mdi-email-outline </v-icon></span>
                <span class="primary-gray-300 gtext-t6 ml-2">|</span>
                <span
                  v-if="emailAddress == ''"
                  class="primary-gray-300 gtext-t6 ml-2 w-max-content"
                >Enter your Email</span>
              </template>
            </v-text-field>

            <v-btn
              density="default"
              color="primary"
              class="subscribe-button"
            >
              Subscribe
            </v-btn>
          </div>
          <div class="gtext-t5 text-white mt-4">
            We care about your data in our
            <NuxtLink
              to="/"
              class="privacy-policy-link"
            >privacy policy.</NuxtLink>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import useApiService from '~/composables/useApiService'

const router = useRouter()
const route = useRoute()

const headers = [
  { title: 'Rank', key: 'index', sortable: false, width: '10vw' },
  { title: 'Name', key: 'name', sortable: false, width: '25vw' },
  { title: 'Address', key: 'address', sortable: false, width: '40vw' },
  { title: 'Points', key: 'points', sortable: false, width: '20vw' },
]

const emailAddress = ref('')
const tableLoading = ref(false)
const list = ref([])
const suspendLeaderboardWatch = false

const filtersList = reactive({
  country: { id: null, title: null },
  state: { id: null, title: null },
  city: { id: null, title: null },
  board: { id: null, title: null },
  grade: { id: null, title: null },
  schoolId: { id: null, title: null },
  year: { id: null, title: null },
  month: { id: null, title: null },
})

const winners = reactive({
  first: null,
  second: null,
  third: null,
})

// start date and end date generation based on year and month
function getYearRange(year) {
  const start = new Date(year, 0, 1)
  const end = new Date(year + 1, 0, 0)
  return { start, end }
}

function getMonthRange(year, month) {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0)
  return { start, end }
}

function formatForApi(date) {
  return date.toISOString()
}

const registrationDateRange = computed(() => {
  const year = filtersList.year.id
  const month = filtersList.month.id
  if (!year) return { RegistrationDateStart: null, RegistrationDateEnd: null }

  let range
  if (month) {
    range = getMonthRange(year, month)
  }
  else {
    range = getYearRange(year)
  }

  return {
    RegistrationDateStart: formatForApi(range.start),
    RegistrationDateEnd: formatForApi(range.end),
  }
})

const fetchLeaderBoard = async () => {
  tableLoading.value = true
  try {
    const response = await useApiService.get(
      '/api/v2/identities/leader-board',
      {
        Board: filtersList.board?.id || '',
        Grade: filtersList.grade?.id || '',
        CountryId: filtersList.country?.id || '',
        StateId: filtersList.state?.id || '',
        CityId: filtersList.city?.id || '',
        SchoolId: filtersList.schoolId?.id || '',
        RegistrationDateStart:
          registrationDateRange.value.RegistrationDateStart || '',
        RegistrationDateEnd:
          registrationDateRange.value.RegistrationDateEnd || '',
      },
    )
    list.value = response.data
    winners.first = list.value[0]?.avatar
    winners.second = list.value[1]?.avatar || ''
    winners.third = list.value[2]?.avatar || ''
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    tableLoading.value = false
  }
}

watch(
  filtersList,
  () => {
    if (suspendLeaderboardWatch) return
    fetchLeaderBoard()
  },
  { deep: true },
)

const FILTER_INDEX = {
  Country: 0,
  State: 1,
  City: 2,
  Board: 3,
  Grade: 4,
  School: 5,
  Year: 6,
  Month: 7,
}
const filters = ref([
  {
    selectedItem: null,
    title: 'Country',
    disabled: false,
    hasSearch: true,
    refElement: null,
    api: '/api/v2/locations/countries',
    idInParams: true,
    filtersDependInxe: [FILTER_INDEX.State],
    queryKey: 'country',
  },
  {
    selectedItem: null,
    title: 'State',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: '/api/v2/locations/states',
    idInParams: true,
    dependencies: [
      {
        parent: FILTER_INDEX.Country,
        targetKey: 'country_id',
        sourceKey: 'id',
      },
    ],
    queryKey: 'state',
  },
  {
    selectedItem: null,
    title: 'City',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: '/api/v2/locations/cities',
    idInParams: true,
    dependencies: [
      { parent: FILTER_INDEX.State, targetKey: 'state_id', sourceKey: 'id' },
    ],
    queryKey: 'city',
  },
  {
    selectedItem: null,
    title: 'Board',
    disabled: false,
    hasSearch: false,
    refElement: null,
    api: '/api/v1/types/list',
    idInParams: false,
    extraApiParams: {
      type: `section`,
    },
    queryKey: 'section',
  },
  {
    selectedItem: null,
    title: 'Grade',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: '/api/v1/types/list',
    idInParams: false,
    extraApiParams: {
      type: `base`,
    },
    dependencies: [
      { parent: FILTER_INDEX.Board, targetKey: 'section_id', sourceKey: 'id' },
    ],
    queryKey: 'base',
  },
  {
    selectedItem: null,
    title: 'School',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: '/api/v2/schools',
    idInParams: false,
    extraApiParams: {},
    dependencies: [
      { parent: FILTER_INDEX.City, targetKey: 'CityId', sourceKey: 'id' },
      { parent: FILTER_INDEX.Board, targetKey: 'section', sourceKey: 'id' },
    ],
    queryKey: 'school',
  },
  {
    selectedItem: null,
    title: 'Year',
    disabled: false,
    hasSearch: false,
    refElement: null,
    api: null,
    idInParams: false,
    extraApiParams: {},
    dependencies: [],
    staticList: Array.from({ length: 2 }, (_, i) => 2024 + i)
      .reverse()
      .map(year => ({
        title: `${year}`,
        id: year,
      })),
    queryKey: 'year',
  },
  {
    selectedItem: null,
    title: 'Month',
    disabled: true,
    hasSearch: false,
    refElement: null,
    api: null,
    idInParams: false,
    extraApiParams: {},
    dependencies: [
      { parent: FILTER_INDEX.Year, targetKey: 'YearId', sourceKey: 'id' },
    ],
    staticList: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ].map((month, index) => ({
      title: month,
      id: index + 1,
    })),
    queryKey: 'month',
  },
])

const isBatchUpdating = ref(false)
const updateSelectedItem = (itemSelected, index, isRoot = true) => {
  if (isRoot) isBatchUpdating.value = true
  console.log('parrent', index, itemSelected)
  filters.value[index].selectedItem = itemSelected

  filters.value.forEach((child, childIndex) => {
    if (!child.dependencies) return

    const relevantDeps = child.dependencies.filter(
      dep => dep.parent === index,
    )
    if (relevantDeps.length === 0) return

    child.selectedItem = null

    if (!child.idInParams) {
      relevantDeps.forEach((dep) => {
        const parentItem = filters.value[dep.parent].selectedItem
        child.extraApiParams[dep.targetKey]
          = parentItem?.[dep.sourceKey] ?? null
      })
    }
    const allReady = child.dependencies.every((dep) => {
      const parentItem = filters.value[dep.parent].selectedItem
      return parentItem && parentItem[dep.sourceKey] !== undefined
    })
    console.log('child', child)

    if (allReady) {
      child.disabled = false
      child.refElement.getItems(child.idInParams ? itemSelected.id : '')
    }
    else {
      child.disabled = true
    }
    updateSelectedItem(null, childIndex, false)
  })

  if (isRoot) {
    isBatchUpdating.value = false
    updateQueryFromFilters()
  }
}

const clearFilter = (filter, index, isRoot = true) => {
  if (isRoot) isBatchUpdating.value = true
  console.log('remove filter', filter, index)

  filters.value[index].selectedItem = null

  filters.value.forEach((child, childIndex) => {
    if (!child.dependencies?.length) return

    const isChild = child.dependencies.some(dep => dep.parent === index)
    if (isChild) {
      child.disabled = true
      clearFilter(child, childIndex, false)
    }
  })

  if (isRoot) {
    isBatchUpdating.value = false
    updateQueryFromFilters()
  }
}

function updateQueryFromFilters() {
  const query = { ...route.query }

  filters.value.forEach((f) => {
    if (!f.queryKey) return
    if (f.selectedItem?.id) {
      query[f.queryKey] = f.selectedItem.id
    }
    // else {
    //   delete query[f.queryKey]
    // }
  })
  console.log('query create', query)

  router.replace({ query })
}

onMounted(async () => {
  fetchLeaderBoard()

  // filters.value[FILTER_INDEX.Country].refElement.getItems();
  // filters.value[FILTER_INDEX.Board].refElement.getItems();
  for (let i = 0; i < filters.value.length; i++) {
    const f = filters.value[i]
    if (!f.queryKey) continue

    const idFromQuery = route.query[f.queryKey]
    if (!idFromQuery) continue

    const component = f.refElement
    if (!component || typeof component.getItemById !== 'function') continue

    const selected = await component.getItemById(idFromQuery)

    if (selected) {
      updateSelectedItem(selected, i)
    }
  }
})
</script>

<style scoped>
#leader-board-page-header {
  height: 36rem;
  background-color: #24292f;
  position: relative;

  #main-title-holder {
    background-image: url("public/images/leaderBoard-Rectangle.png");
    background-position: center;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 9.7rem;
    text-align: center;
    height: 110px !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1;

    .gama-text-h1 {
      color: white;
      margin-bottom: 0.8rem;
    }

    .gama-text-subtitle2 {
      color: #ffb600 !important;
    }
  }
}

#submain-title-holder {
  background-image: url("public/images/leaderBoard-reverseRectangle.png");
  background-position: center;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 17rem;
  text-align: center;
  height: 162.25px;
  width: 349px;
  display: flex;
  justify-content: center;

  .leader-board-second-third {
    margin-top: 40px;
    width: 75px;
    height: 90px;

    .leader-board-second-third-avatar {
      width: 68px !important;
      height: 68px !important;
      border-radius: 50%;
      z-index: -2;
      margin-left: 21px;
      margin-top: 4px;
    }
  }
  .leader-board-first {
    margin-top: 40px;
    width: 95px;
    height: 113px;

    .leader-board-first-avatar {
      width: 88px !important;
      height: 88px !important;
      border-radius: 50%;
      z-index: -2;
      margin-left: 21px;
      margin-top: 4px;
    }
  }
}

.filter-container {
  padding: 16px 20px 8px 20px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* Chrome, Safari, Edge */
.filter-container::-webkit-scrollbar {
  height: 6px;
}

.filter-container::-webkit-scrollbar-track {
  background: transparent;
}

.filter-container::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 10px;
}

.filter-container::-webkit-scrollbar-thumb:hover {
  background-color: #888;
}

.scrollable-table {
  max-height: 100%;
  overflow-x: auto;
  position: relative;
  margin: 10px auto;
  padding: 0px 20px;
}

:deep(.v-data-table__td) {
  color: #344054 !important;
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem !important;
  line-height: 2.4rem !important;
  font-weight: 500;
  white-space: nowrap;
}

:deep(.v-table__wrapper > table > thead > tr > th) {
  background-color: #f2f4f7 !important;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

:deep(.pagination-buttons) {
  border-radius: 4px;
  border: 1px solid #f2f4f7;
}

:deep(.v-btn__content) {
  gap: 8px;
}

.stay-update {
  background-color: #24292f;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.email-subscription-container {
  display: flex;
  position: relative;
  align-items: center;
  button {
    position: absolute;
    border-radius: 48px;
    right: 6px;
  }
}

:deep(.v-field) {
  border-radius: 48px;
  min-width: 330px;
  border: 1px solid #f2f4f7;
  padding-right: 120px;
}

:deep(.v-field-label) {
  color: #d0d5dd;
  font-family: Inter, sans-serif;
  font-size: 1.2rem;
  line-height: 1.8rem;
  font-weight: 400;
}

:deep(.v-field__input) {
  font-family: Inter, sans-serif;
  font-size: 1.4rem;
  line-height: 1.8rem;
  font-weight: 500;
  color: #475467;
}

.w-max-content {
  width: max-content !important;
  position: absolute;
  left: 40px;
}

:deep(.v-btn__content) {
  color: #1d2939;
  font-family: Inter, sans-serif;
  font-size: 1.6rem !important;
  line-height: 3rem;
  font-weight: 500;
}

.privacy-policy-link {
  color: #2e90fa !important;
  text-decoration: underline;
}
</style>
