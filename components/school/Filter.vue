<template>
  <div class="main-filter-school-div">
    <div class="box-filter-option">
      <div class="container-filter">
        <div class="search-input-contaier">
          <v-text-field
            v-model="filterForm.keyword"
            rounded
            :variant="textFieldVariant"
            bg-color="white"
            prepend-inner-icon="mdi-magnify"
            hide-details
            color="#ffb300"
            active-color="#ffb600"
            label="Search anything..."
            glow
            icon-color="#ffb600"
            :disabled="isExpandMap"
            @update:model-value="changeSearchValue"
          />
        </div>
        <div class="d-flex d-lg-none justify-end w-33 ga-2">
          <v-btn
            size="small"
            icon
            color="#f2f4f7"
            @click="openFilterMobile"
          >
            <v-icon
              size="x-large"
              color="#000000"
            >
              mdi-filter
            </v-icon>
          </v-btn>
          <v-btn
            size="small"
            icon
            color="#f2f4f7"
            @click="openSortNav($event)"
          >
            <v-icon
              size="x-large"
              color="#000000"
            >
              mdi-filter-variant
            </v-icon>
          </v-btn>
        </div>
        <div class="filter-options-div">
          <div
            v-for="item in optionFilter"
            :key="item.name"
            :class="`each-item-filter ${
              item.active && !isExpandMap ? `` : `deactive`
            }`"
            @click="openFilterSection($event, item)"
          >
            {{ item.name }}
            <v-icon
              :color="item.active && !isExpandMap ? `#ffffff` : `#828385`"
            >
              mdi-chevron-down
            </v-icon>

            <div class="line-seperator" />
            <div
              v-if="item.name == `Board` && item.isShow"
              ref="boxStageRef"
              class="main-box-board-option"
            >
              <div
                v-for="stage in filter.stageList"
                :key="stage.id"
                class="item-board"
                @click="selectStage($event, stage)"
              >
                {{ stage.title }}
              </div>
            </div>

            <div
              v-if="item.name == `Tuition fee` && item.isShow"
              ref="boxTuitionRef"
              class="main-box-Tuition"
            >
              <span class="title-Tuition">Maximum Tuition fee</span>
              <span class="subtitle-Tuition">Move the handle</span>

              <v-range-slider
                v-model="valueTuition"
                class="w-100"
                thumb-color="#ffb600"
                color="#ffb600"
                track-color="#E4E7EC"
                density="compact"
                hide-details
                strict
                :max="500000"
                :min="0"
                :step="10000"
                thumb-label="always"
                :ticks="steps"
                show-ticks="always"
                tick-size="6"
                @click.stop
                @end="endTuitionMove"
              >
                <template #thumb-label="{ modelValue }">
                  <span class="text-h5 font-weight-black text-black">${{ modelValue }}</span>
                </template>
              </v-range-slider>
            </div>

            <div
              v-if="item.name == `Sort` && item.isShow"
              ref="boxSortRef"
              class="main-box-sort-option"
            >
              <v-list class="w-100">
                <v-list-item
                  v-for="sortItem in sortList"
                  :key="sortItem.value"
                >
                  <v-checkbox
                    :model-value="filterForm.sort.includes(sortItem.value)"
                    color="primary"
                    class="text-h4"
                    hide-details
                    @click.stop
                    @update:model-value="
                      (val) => handleCheckboxChange(val, sortItem)
                    "
                  >
                    <template #label>
                      <span class="text-h4 font-weight-medium ml-2">{{
                        sortItem.title
                      }}</span>
                    </template>
                  </v-checkbox>
                </v-list-item>
              </v-list>
            </div>
          </div>
          <div class="each-item-filter result-div">
            Results
            <span
              class="count-result"
              data-v-45a0d8f4
            >
              {{ totalSchoolFind ? $numberFormat(totalSchoolFind) : "0" }}
            </span>
          </div>
        </div>

        <div class="result-div-mobile gama-text-overline">
          Results
          <span
            class="count-result gama-text-button"
            data-v-45a0d8f4
          >
            {{ totalSchoolFind ? $numberFormat(totalSchoolFind) : "0" }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="optionFilter[2].isShow"
      ref="boxRegionRef"
      class="box-region-filter"
    >
      <div class="cotainer-dropdown">
        <v-autocomplete
          v-model="filterForm.country"
          rounded
          variant="outlined"
          menu-icon="mdi-chevron-down"
          item-title="title"
          item-value="id"
          hide-details
          autocomplete="new-password"
          role="presentation"
          :items="filter.countryList"
          clearable
          color="#ffb300"
          active-color="#ffb600"
          label="Country"
          :loading="loadingCountry"
          @update:model-value="countryChange"
        />
      </div>
      <div class="cotainer-dropdown">
        <v-autocomplete
          v-model="filterForm.state"
          rounded
          variant="outlined"
          menu-icon="mdi-chevron-down"
          item-title="title"
          item-value="id"
          hide-details
          autocomplete="new-password"
          role="presentation"
          :items="filter.stateList"
          clearable
          color="#ffb300"
          active-color="#ffb600"
          label="State"
          :loading="loadingState"
          :disabled="!filterForm.country"
          @update:model-value="stateChange"
        />
      </div>
      <div class="cotainer-dropdown">
        <v-autocomplete
          v-model="filterForm.city"
          rounded
          variant="outlined"
          menu-icon="mdi-chevron-down"
          item-title="title"
          item-value="id"
          hide-details
          autocomplete="new-password"
          role="presentation"
          :items="filter.cityList"
          clearable
          color="#ffb300"
          active-color="#ffb600"
          label="City"
          :loading="loadingCity"
          :disabled="!filterForm.state"
          @update:model-value="cityChange"
        />
      </div>
    </div>

    <div
      v-if="showSortNavMobile"
      class="overlay-bottom-nav"
    >
      <div
        ref="sortBottomNavRef"
        class="sort-bottom-nav"
      >
        <span class="title">Sort by</span>
        <v-list class="w-100">
          <v-list-item
            v-for="sortItem in sortList"
            :key="sortItem.value"
            class="px-0"
          >
            <v-checkbox
              :model-value="filterForm.sort.includes(sortItem.value)"
              color="primary"
              class="text-h4"
              hide-details
              @click.stop
              @update:model-value="(val) => handleCheckboxChange(val, sortItem)"
            >
              <template #label>
                <span class="text-h4 font-weight-medium ml-2">{{
                  sortItem.title
                }}</span>
              </template>
            </v-checkbox>
          </v-list-item>
        </v-list>
      </div>
    </div>

    <div
      v-if="showFilterMobile"
      class="mobile-filter-div"
    >
      <div class="container-scroll">
        <div class="contaier-region-country-filter">
          <div class="box-chips-query-mobile">
            <div class="container-chips">
              <v-chip
                v-if="filterForm.keyword.length > 0"
                class="text-h4 pa-3"
                size="large"
                variant="outlined"
                color="#252626"
                closable
                @click:close="clearFilter(`keyword`)"
              >
                {{ filterForm.keyword }}
              </v-chip>
              <v-chip
                v-if="
                  filterForm.country
                    && filterForm.country.toString().length > 0
                    && findTitle(`countryList`, filterForm.country)
                "
                class="text-h4 pa-3"
                size="large"
                variant="outlined"
                color="#252626"
                closable
                @click:close="clearFilter(`country`)"
              >
                {{ findTitle("countryList", filterForm.country) }}
              </v-chip>
              <v-chip
                v-if="
                  filterForm.state
                    && filterForm.state.toString().length > 0
                    && findTitle(`stateList`, filterForm.state)
                "
                class="text-h4 pa-3"
                size="large"
                variant="outlined"
                color="#252626"
                closable
                @click:close="clearFilter(`state`)"
              >
                {{ findTitle("stateList", filterForm.state) }}
              </v-chip>

              <v-chip
                v-if="
                  filterForm.city
                    && filterForm.city.toString().length > 0
                    && findTitle(`cityList`, filterForm.city)
                "
                class="text-h4 pa-3"
                size="large"
                variant="outlined"
                color="#252626"
                closable
                @click:close="clearFilter(`city`)"
              >
                {{ findTitle("cityList", filterForm.city) }}
              </v-chip>
            </div>
          </div>
          <div class="cotainer-dropdown">
            <gomboBox
              v-model="filterForm.country"
              label="Country"
              :items="filter.countryList"
              :data-loading="!loadingCountry"
              @update:model-value="countryChange"
            />
          </div>
          <div class="cotainer-dropdown">
            <gomboBox
              v-model="filterForm.state"
              label="State"
              :items="filter.stateList"
              :data-loading="!loadingState"
              :disabled="!filterForm.country"
              @update:model-value="stateChange"
            />
          </div>
          <div class="cotainer-dropdown">
            <gomboBox
              v-model="filterForm.city"
              label="City"
              :items="filter.cityList"
              :data-loading="!loadingCity"
              :disabled="!filterForm.state"
              @update:model-value="cityChange"
            />
          </div>
        </div>
        <div
          v-if="false"
          class="container-checkbox-group"
        >
          <div class="container-each-group">
            <span class="title-group">Board</span>
            <checkboxInput
              v-model="filterForm.stage"
              :options="filter.stageList"
              :multiple="false"
              @update:model-value="stageChange"
            />
          </div>

          <div class="container-each-group">
            <span class="title-group">School Type</span>
            <checkboxInput
              v-model="filterForm.school_type"
              :options="filter.schoolTypeList"
              :multiple="true"
              @update:model-value="schoolTypeChange"
            />
          </div>

          <div class="container-each-group">
            <span class="title-group">Religion</span>
            <checkboxInput
              v-model="filterForm.religion"
              :options="filter.religion"
              :multiple="true"
              @update:model-value="religionChange"
            />
          </div>

          <div class="container-each-group">
            <span class="title-group">Boarding Type</span>
            <checkboxInput
              v-model="filterForm.boarding_type"
              :options="filter.boarding_type"
              :multiple="true"
              @update:model-value="boardingTypeChange"
            />
          </div>

          <div class="container-each-group">
            <span class="title-group">Coed Status</span>
            <checkboxInput
              v-model="filterForm.coed_status"
              :options="filter.coed_status"
              :multiple="true"
              @update:model-value="coedStatusChange"
            />
          </div>
        </div>
        <div class="container-tuition">
          <span class="title-group">Tition fee</span>
          <div class="container-input">
            <v-range-slider
              v-model="valueTuition"
              class="w-100"
              thumb-color="#ffb600"
              color="#ffb600"
              track-color="#E4E7EC"
              density="compact"
              hide-details
              strict
              :max="500000"
              :min="0"
              :step="10000"
              thumb-label="always"
              :ticks="steps"
              show-ticks="always"
              tick-size="6"
              @click.stop
              @end="endTuitionMove"
            >
              <template #thumb-label="{ modelValue }">
                <span class="text-h5 font-weight-black text-black">${{ modelValue }}</span>
              </template>
            </v-range-slider>
          </div>
        </div>
        <div class="w-100 mt-8 d-flex align-center justify-center ga-3">
          <v-btn
            variant="text"
            class="text-h4"
            @click="closeFilterMobile"
          >
            Cancel
          </v-btn>
          <v-btn
            color="#ffb600"
            rounded="xl"
            height="50"
            width="160"
            class="text-h4"
            @click="applyFilterMobie"
          >
            Apply filter
          </v-btn>
        </div>
      </div>
    </div>

    <div
      v-if="!isExpandMap"
      class="box-chips-query-desktop"
    >
      <div class="container-chips">
        <v-chip
          v-if="filterForm.keyword.length > 0"
          class="text-h4 pa-3"
          size="large"
          variant="outlined"
          color="#252626"
          closable
          @click:close="clearFilter(`keyword`)"
        >
          {{ filterForm.keyword }}
        </v-chip>
        <v-chip
          v-if="
            filterForm.country
              && filterForm.country.toString().length > 0
              && findTitle(`countryList`, filterForm.country)
          "
          class="text-h4 pa-3"
          size="large"
          variant="outlined"
          color="#252626"
          closable
          @click:close="clearFilter(`country`)"
        >
          {{ findTitle("countryList", filterForm.country) }}
        </v-chip>
        <v-chip
          v-if="
            filterForm.state
              && filterForm.state.toString().length > 0
              && findTitle(`stateList`, filterForm.state)
          "
          class="text-h4 pa-3"
          size="large"
          variant="outlined"
          color="#252626"
          closable
          @click:close="clearFilter(`state`)"
        >
          {{ findTitle("stateList", filterForm.state) }}
        </v-chip>

        <v-chip
          v-if="
            filterForm.city
              && filterForm.city.toString().length > 0
              && findTitle(`cityList`, filterForm.city)
          "
          class="text-h4 pa-3"
          size="large"
          variant="outlined"
          color="#252626"
          closable
          @click:close="clearFilter(`city`)"
        >
          {{ findTitle("cityList", filterForm.city) }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter, useRoute } from 'vue-router'
import { useClickOutside } from '~/composables/useClickOutside'

import checkboxInput from '~/components/common/checkbox-input.vue'
import gomboBox from '~/components/common/gombo-box.vue'

const props = defineProps({
  sortList: {
    type: Array,
    required: true,
  },
  totalSchoolFind: {
    type: Number,
    required: true,
  },
  isExpandMap: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update-filter'])
const _router = useRouter()
const route = useRoute()

onMounted(() => {
  // Initial data fetch
  getFilterList({ 'PagingDto.PageFilter.Size': 250 }, 'countries')
  // getFilterList({ type: "section" }, "board");
  // getFilterList({ type: "school_type" }, "school_type");
  // getFilterList({ type: "boarding_type" }, "boarding_type");
  // getFilterList({ type: "coed_status" }, "coed_status");
  // getFilterList({ type: "religion" }, "religion");

  // Initialize from route
  if (route.query.country) {
    getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'states')
  }
  if (route.query.state) {
    getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'cities')
  }
})

// Start Global Function , Refs
const optionFilter = ref([
  {
    name: 'Board',
    active: false,
    isShow: false,
  },
  {
    name: 'Tuition fee',
    active: true,
    isShow: false,
  },
  {
    name: 'Region',
    active: true,
    isShow: false,
  },
  {
    name: 'Sort',
    active: true,
    isShow: false,
  },
])

const setDefaultSort = (selectedSorts) => {
  if (!selectedSorts.includes('lastModifyDate')) {
    return ['lastModifyDate', ...selectedSorts]
  }
  return selectedSorts
}
const filterForm = reactive({
  keyword: route.query.keyword || '',
  country: Number(route.query.country) || '',
  state: Number(route.query.state) || '',
  city: Number(route.query.city) || '',
  stage: route.query.stage || '',
  tuitionFeeMax: Number(route.query.tuitionFeeMax) || 0,
  tuitionFeeMin: Number(route.query.tuitionFeeMin) || 0,
  sort: setDefaultSort(
    Array.isArray(route.query.sort)
      ? route.query.sort
      : route.query.sort
        ? route.query.sort.split(',')
        : [],
  ),
  school_type: Array.isArray(route.query.school_type)
    ? route.query.school_type
    : route.query.school_type
      ? [route.query.school_type]
      : [],
  boarding_type: Array.isArray(route.query.boarding_type)
    ? route.query.boarding_type
    : route.query.boarding_type
      ? [route.query.boarding_type]
      : [],
  coed_status: Array.isArray(route.query.coed_status)
    ? route.query.coed_status
    : route.query.coed_status
      ? [route.query.coed_status]
      : [],
  religion: Array.isArray(route.query.religion)
    ? route.query.religion
    : route.query.religion
      ? [route.query.religion]
      : [],
})
const filter = reactive({
  countryList: [],
  stateList: [],
  cityList: [],
  stageList: [],
  schoolTypeList: [],
  boardingTypeList: [],
  coedStatusList: [],
  religionList: [],
})

const getFilterList = async (params, type) => {
  try {
    let endpoint = '/api/v1/types/list'
    if (type === 'countries') {
      loadingCountry.value = true
      endpoint = '/api/v2/locations/countries'
    }
    if (type === 'states') {
      loadingState.value = true
      endpoint = `/api/v2/locations/states/${filterForm.country}`
    }
    if (type === 'cities') {
      loadingCity.value = true
      endpoint = `/api/v2/locations/cities/${filterForm.state}`
    }

    const response = await $fetch(endpoint, { params })

    if (type === 'countries') {
      loadingCountry.value = false
      filter.countryList = response.data.list
    }
    if (type === 'states') {
      loadingState.value = false
      filter.stateList = response.data.list
    }
    if (type === 'cities') {
      loadingCity.value = false
      filter.cityList = response.data.list
    }
    if (type === 'board') filter.stageList = response.data
    if (type === 'school_type') filter.schoolTypeList = response.data
    if (type === 'boarding_type') filter.boarding_type = response.data
    if (type === 'coed_status') filter.coed_status = response.data
    if (type === 'religion') filter.religion = response.data
  }
  catch (err) {
    console.error('Error fetching location data:', err)
  }
}

const updateQueryParams = () => {
  const query = {}

  if (filterForm.keyword) query.keyword = filterForm.keyword
  if (filterForm.country) query.country = filterForm.country
  if (filterForm.state) query.state = filterForm.state
  if (filterForm.city) query.city = filterForm.city
  if (filterForm.stage) query.stage = filterForm.stage
  if (filterForm.tuitionFeeMin > 0)
    query.tuitionFeeMin = filterForm.tuitionFeeMin
  if (filterForm.tuitionFeeMax > 0)
    query.tuitionFeeMax = filterForm.tuitionFeeMax
  if (filterForm.sort.length > 0 && filterForm.sort != undefined)
    query.sort = filterForm.sort

  if (filterForm.school_type.length > 0 && filterForm.school_type != undefined)
    query.school_type = filterForm.school_type

  if (
    filterForm.boarding_type.length > 0
    && filterForm.boarding_type != undefined
  )
    query.boarding_type = filterForm.boarding_type
  if (filterForm.coed_status.length > 0 && filterForm.coed_status != undefined)
    query.coed_status = filterForm.coed_status
  if (filterForm.religion.length > 0 && filterForm.religion != undefined)
    query.religion = filterForm.religion
  emit('update-filter', query)
}

const openFilterSection = (event, filter) => {
  event.stopPropagation()
  if (filter.active && !props.isExpandMap) {
    const lastShowOption = optionFilter.value.filter(item => item.isShow)
    if (lastShowOption.length > 0) {
      if (lastShowOption[0].name == filter.name) {
        filter.isShow = false
      }
      else {
        lastShowOption[0].isShow = false
        filter.isShow = true
      }
    }
    else {
      filter.isShow = true
    }
  }
}

const clearFilter = (key) => {
  filterForm[key] = ''
  if (key == 'country') {
    filter.stateList = []
    filterForm.state = ''
    filter.cityList = []
    filterForm.city = ''
  }
  if (key == 'state') {
    filter.cityList = []
    filterForm.city = ''
  }
  if (key == 'city') {
    filterForm.city = ''
  }
  updateQueryParams()
}

const findTitle = (list, id) => {
  const itemFounded = filter[list].filter(item => item.id == Number(id))
  if (itemFounded.length > 0) {
    return itemFounded[0].title
  }
  return null
}

// Start Section Filter Location
const boxRegionRef = ref(null)
const loadingCountry = ref(false)
const loadingState = ref(false)
const loadingCity = ref(false)

useClickOutside(boxRegionRef, () => {
  // optionFilter.value.filter((item) => item.name == "Region")[0].isShow = false;
})

const countryChange = () => {
  filter.stateList = []
  filterForm.state = ''
  filter.cityList = []
  filterForm.city = ''
  if (filterForm.country) {
    getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'states')
  }
  updateQueryParams()
}

const stateChange = () => {
  filter.cityList = []
  filterForm.city = ''
  if (filterForm.state) {
    getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'cities')
  }
  updateQueryParams()
}

const cityChange = () => {
  updateQueryParams()
}

// End Section Filter Location

// Start Section Filter Search
const { width } = useDisplay()

const textFieldVariant = computed(() => {
  return width.value > 1280 ? 'solo' : 'outlined'
})

const changeSearchValue = () => {
  updateQueryParams()
}

// End Section Filter Search

// Start Section Stage
const boxStageRef = ref(null)
const selectStage = (event, stage) => {
  event.stopPropagation()
  filterForm.stage = stage.id
  optionFilter.value.filter(item => item.name == 'Board')[0].isShow = false
  updateQueryParams()
}

useClickOutside(boxStageRef, () => {
  optionFilter.value.filter(item => item.name == 'Board')[0].isShow = false
})
const stageChange = () => {
  updateQueryParams()
}
// End Section Stage

// Start Section TuitionFee
const boxTuitionRef = ref(null)
const valueTuition = ref([filterForm.tuitionFeeMin, filterForm.tuitionFeeMax])
const steps = ref({
  0: '',
  100000: '',
  200000: '',
  300000: '',
  400000: '',
  500000: '',
})

useClickOutside(boxTuitionRef, () => {
  optionFilter.value.filter(
    item => item.name == 'Tuition fee',
  )[0].isShow = false
})

const endTuitionMove = (value) => {
  filterForm.tuitionFeeMin = value[0]
  filterForm.tuitionFeeMax = value[1]
  updateQueryParams()
}

// End Section TuitionFee

// Start Section Sort
const boxSortRef = ref(null)
const showSortNavMobile = ref(false)
const sortBottomNavRef = ref(null)

const handleCheckboxChange = (checked, item) => {
  const index = filterForm.sort.indexOf(item.value)
  if (checked && index === -1) {
    filterForm.sort.push(item.value)
  }
  else if (!checked && index !== -1) {
    filterForm.sort.splice(index, 1)
  }
  updateQueryParams()
}

const openSortNav = (event) => {
  event.stopPropagation()
  showSortNavMobile.value = true
}

useClickOutside(boxSortRef, () => {
  optionFilter.value.filter(item => item.name == 'Sort')[0].isShow = false
})

useClickOutside(sortBottomNavRef, () => {
  showSortNavMobile.value = false
})

// End Section Sort

// Start Section School type, Boarding Type, Religion , Ceod Stats
const schoolTypeChange = () => {
  updateQueryParams()
}

const coedStatusChange = () => {
  updateQueryParams()
}

const boardingTypeChange = () => {
  updateQueryParams()
}

const religionChange = () => {
  updateQueryParams()
}

const showFilterMobile = ref(false)

const openFilterMobile = () => {
  showFilterMobile.value = true
}

const applyFilterMobie = () => {
  showFilterMobile.value = false
}

const closeFilterMobile = () => {
  showFilterMobile.value = false
}
// End Section School type

// Add this composable for number formatting
const $numberFormat = (number) => {
  return new Intl.NumberFormat().format(number)
}
</script>

<style scoped>
@import "../../assets/scss/school/filter.scss";
</style>
