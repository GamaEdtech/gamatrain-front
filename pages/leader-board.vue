<script setup>
import filterButtons from '~/components/leaderboard/filterButtons.vue'
import chosenFilters from '~/components/leaderboard/chosenFilters.vue'
import useApiService from '~/composables/useApiService'

const headers = [
  { title: 'Rank', key: 'index', sortable: false, width: '10vw' },
  { title: 'Name', key: 'name', sortable: false, width: '25vw' },
  { title: 'Address', key: 'address', sortable: false, width: '40vw' },
  { title: 'Points', key: 'points', sortable: false, width: '20vw' },
]

const emailAddress = ref('')
const tableLoading = ref(false)
const list = ref([])
let suspendLeaderboardWatch = false

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
const countries = ref([])
const states = ref([])
const cities = ref([])
const boards = ref([])
const grades = ref([])
const schools = ref([])
const winners = reactive({
  first: null,
  second: null,
  third: null,
})

const years = ref(
  Array.from({ length: 2 }, (_, i) => 2024 + i)
    .reverse()
    .map(year => ({ label: `${year}`, value: { id: year, title: `${year}` } })),
)

const months = ref(
  [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ].map((month, index) => ({
    label: month,
    value: { id: index + 1, title: month },
  })),
)

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

const removeFilter = (key) => {
  filtersList[key] = { id: null, title: null }
}

const fetchLeaderBoard = async () => {
  tableLoading.value = true
  try {
    const response = await useApiService.get('/api/v2/identities/leader-board', {
      Board: filtersList.board?.id || '',
      Grade: filtersList.grade?.id || '',
      CountryId: filtersList.country?.id || '',
      StateId: filtersList.state?.id || '',
      CityId: filtersList.city?.id || '',
      SchoolId: filtersList.schoolId?.id || '',
      RegistrationDateStart: registrationDateRange.value.RegistrationDateStart || '',
      RegistrationDateEnd: registrationDateRange.value.RegistrationDateEnd || '',
    })
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

async function fetchAndMap(url, params = {}, reverse = true) {
  try {
    const response = await useApiService.get(url, params)
    if (response.succeeded || response.status == 1) {
      let list = response.data.list || response.data
      if (reverse) list = list.slice().reverse()
      return list.map(c => ({
        label: c.title,
        value: { id: c.id, title: c.title },
      }))
    }
  }
  catch (error) {
    console.error(`Failed to fetch from ${url}:`, error)
  }
  return []
}

const fetchCountries = async () => {
  countries.value = await fetchAndMap('/api/v2/locations/countries', {
    'PagingDto.PageFilter.Skip': 0,
    'PagingDto.PageFilter.Size': 1000,
    'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
  })
}

const fetchStates = async (countryId) => {
  if (!countryId) return
  states.value = await fetchAndMap(`/api/v2/locations/states/${countryId}`, {
    'PagingDto.PageFilter.Skip': 0,
    'PagingDto.PageFilter.Size': 1000,
    'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
  })
}

const fetchCities = async (stateId) => {
  if (!stateId) return
  cities.value = await fetchAndMap(`/api/v2/locations/cities/${stateId}`, {
    'PagingDto.PageFilter.Skip': 0,
    'PagingDto.PageFilter.Size': 1000,
    'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
  })
}

const fetchBoards = async (type) => {
  boards.value = await fetchAndMap(`/api/v1/types/list`, { type }, false)
}

const fetchGrades = async (id) => {
  if (!id) return
  grades.value = await fetchAndMap(`/api/v1/types/list`, {
    section_id: id,
    type: 'base',
  }, false)
}

const fetchSchools = async (cityId, sectionId) => {
  if (!cityId || !sectionId) return
  schools.value = await fetchAndMap('/api/v2/schools', {
    'PagingDto.PageFilter.Skip': 0,
    'PagingDto.PageFilter.Size': 1000,
    'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    'CityId': cityId,
    'section': sectionId,
  }, false)
}

watch(
  filtersList,
  () => {
    if (suspendLeaderboardWatch) return
    fetchLeaderBoard()
  },
  { deep: true },
)

watch(
  () => filtersList.country,
  async (newCountry) => {
    suspendLeaderboardWatch = true
    filtersList.state = { id: null, title: null }
    filtersList.city = { id: null, title: null }
    await nextTick()
    suspendLeaderboardWatch = false

    fetchStates(newCountry.id)
  },
  { deep: true },
)
watch(
  () => filtersList.state,
  async (newState) => {
    suspendLeaderboardWatch = true
    filtersList.city = { id: null, title: null }
    await nextTick()
    suspendLeaderboardWatch = false
    fetchCities(newState.id)
  },
  { deep: true },
)
watch(
  () => filtersList.board,
  async (newBoard) => {
    suspendLeaderboardWatch = true
    filtersList.grade = { id: null, title: null }
    await nextTick()
    suspendLeaderboardWatch = false

    fetchGrades(newBoard.id)
  },
  { deep: true },
)
watch(
  () => filtersList.year,
  async (newYear) => {
    if (!newYear.title) {
      suspendLeaderboardWatch = true
      filtersList.month = { id: null, title: null }
      await nextTick()
      suspendLeaderboardWatch = false
    }
  },
  { deep: true },
)
watch(
  () => [filtersList.city.id, filtersList.board.id],
  ([cityId, boardId]) => {
    if (cityId && boardId) {
      fetchSchools(cityId, boardId)
    }
  },
)

onMounted(() => {
  fetchLeaderBoard()
  fetchCountries()
  fetchBoards('section')
})
</script>

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
                src="/images/leaderBoard-Second.png"
              >
                <v-img
                  v-if="winners.second"
                  class="leader-board-second-third-avatar"
                  :src="winners.second"
                />
                <v-img
                  v-else
                  class="leader-board-second-third-avatar"
                  src="data:image/png;base64,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"
                />
              </v-img>
              <v-img
                class="leader-board-first"
                src="/images/leaderBoard-First.png"
              >
                <v-img
                  v-if="winners.first"
                  class="leader-board-first-avatar"
                  :src="winners.first"
                />
                <v-img
                  v-else
                  class="leader-board-first-avatar"
                  src="data:image/png;base64,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"
                />
              </v-img>
              <v-img
                class="leader-board-second-third"
                src="/images/leaderBoard-Third.png"
              >
                <v-img
                  v-if="winners.third"
                  class="leader-board-second-third-avatar"
                  :src="winners.third"
                />
                <v-img
                  v-else
                  class="leader-board-second-third-avatar"
                  src="data:image/png;base64,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"
                />
              </v-img>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <div class="filter-container">
      <div class="d-flex w-100 justify-start justify-md-center ga-2">
        <filterButtons
          v-model="filtersList.country"
          :label="filtersList.country.title || 'Country'"
          :items="countries"
        />
        <filterButtons
          v-model="filtersList.state"
          :disable="!filtersList.country.title"
          :label="filtersList.state.title || 'State'"
          :items="states"
        />
        <filterButtons
          v-model="filtersList.city"
          :disable="!filtersList.state.title"
          :label="filtersList.city.title || 'City'"
          :items="cities"
        />
        <filterButtons
          v-model="filtersList.board"
          :label="filtersList.board.title || 'Board'"
          :items="boards"
        />
        <filterButtons
          v-model="filtersList.grade"
          :disable="!filtersList.board.title"
          :label="filtersList.grade.title || 'Grade'"
          :items="grades"
        />
        <filterButtons
          v-model="filtersList.schoolId"
          :disable="!filtersList.city.title || !filtersList.board.title"
          :label="filtersList.schoolId.title || 'School'"
          :items="schools"
        />
        <filterButtons
          v-model="filtersList.year"
          :label="filtersList.year.title || 'Year'"
          :items="years"
        />
        <filterButtons
          v-model="filtersList.month"
          :disable="!filtersList.year.title"
          :label="filtersList.month.title || 'Month'"
          :items="months"
        />
      </div>
      <div class="justify-space-between d-flex w-100">
        <div class="d-flex ga-2">
          <chosenFilters
            v-for="(value, key) in filtersList"
            v-show="value.title"
            :key="key"
            :label="`${key}: ${value.title}`"
            @click="removeFilter(key)"
          />
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
            <img
              v-else
              class="user-avatar mr-2"
              src="data:image/png;base64,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"
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

<style scoped>
  #leader-board-page-header {
  height: 36rem;
  background-color: #24292F;
  position: relative;

  #main-title-holder {
    background-image: url('public/images/leaderBoard-Rectangle.png');
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

#submain-title-holder{
    background-image: url('public/images/leaderBoard-reverseRectangle.png');
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

    .leader-board-second-third{
      margin-top: 40px;
      width: 75px;
      height: 90px;

      .leader-board-second-third-avatar{
        width: 68px !important;
        height: 68px !important;
        border-radius: 50%;
        z-index: -2;
        margin-left: 21px;
        margin-top:4px ;
      }
    }
    .leader-board-first{
      margin-top: 40px;
      width: 95px;
      height: 113px;

      .leader-board-first-avatar{
        width: 88px !important;
        height: 88px !important;
        border-radius: 50%;
        z-index: -2;
        margin-left: 21px;
        margin-top:4px ;
      }
    }
}

.filter-container{
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

:deep(.v-data-table__td){
    color: #344054 !important;
    font-family: Inter, sans-serif !important;
    font-size: 1.4rem !important;
    line-height: 2.4rem !important;
    font-weight: 500;
    white-space: nowrap;
}

:deep(.v-table__wrapper > table > thead > tr > th){
  background-color: #F2F4F7 !important;
}

.user-avatar{
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

:deep(.pagination-buttons){
  border-radius: 4px;
  border: 1px solid #F2F4F7;
}

:deep(.v-btn__content){
  gap: 8px;
}

.stay-update{
  background-color: #24292F;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.email-subscription-container{
  display: flex;
  position: relative;
  align-items: center;
  button{
    position: absolute;
    border-radius: 48px;
    right: 6px;
  }
}

:deep(.v-field){
  border-radius: 48px;
  min-width: 330px ;
  border: 1px solid #F2F4F7;
  padding-right: 120px;
}

:deep(.v-field-label){
  color: #D0D5DD;
  font-family: Inter, sans-serif;
  font-size: 1.2rem;
  line-height: 1.8rem;
  font-weight: 400;
}

:deep(.v-field__input){
    font-family: Inter, sans-serif;
  font-size: 1.4rem;
  line-height: 1.8rem;
  font-weight: 500;
  color: #475467;
}

.w-max-content{
  width: max-content !important;
  position: absolute;
  left: 40px;
}

:deep(.v-btn__content){
  color: #1D2939;
    font-family: Inter, sans-serif;
  font-size: 1.6rem !important;
  line-height: 3rem;
  font-weight: 500;
}

.privacy-policy-link{
  color: #2e90fa !important;
  text-decoration: underline;
}
</style>
