<template>
  <div class="main-school-list-div overflow-y-hidden">
    <h1 class="d-none">
      {{ metaTitle }}
    </h1>
    <div class="map-div">
      <v-btn
        class="list-view-button mt-16 ml-12 position-absolute d-none d-lg-flex pa-6 text-h4"
        height="50"
        elevation="4"
        prepend-icon="mdi-menu"
        color="#ffffff"
        rounded="xl"
        @click="changeStatusExpandMap"
      >
        List view
      </v-btn>

      <!-- Map `Near me` floating action button -->
      <SchoolNearMeFab
        :is-map-mode="isMapMode"
        :loading="isFindingNearestSchool"
        @update-filter="applyNearMe"
      />

      <Map
        ref="mapRef"
        :items="newSchoolForMarkersOnMap"
        :use-cluster="true"
        :enable-user-location="true"
        :show-user-location-marker="showUserLocationMarker"
        @map-moved="changeFilterWithMapMoved"
        @map-move-start="handleMapMoveStart"
        @user-location-found="userLocationFound"
        @school-marker-clicked="handleSchoolMarkerClick"
        @school-marker-click-error="handleSchoolMarkerClickError"
      />
    </div>

    <!-- Map Loading Indicator - Only show on map view -->
    <div
      v-if="
        isUserMovingMap
          && (isExpandMapInDesktop || (!openBottomNavFilterList && lgAndDown))
      "
      class="map-loading-overlay"
    >
      <v-progress-circular
        color="amber"
        indeterminate
      />
    </div>

    <!-- School Details Modal -->
    <SchoolDetailsModal
      v-model="showSchoolModal"
      :school="selectedSchool"
      @navigate-to-details="navigateToSchoolDetails"
    />

    <!-- Desktop view -->
    <div
      v-if="!isExpandMapInDesktop"
      class="d-none d-lg-flex flex-column align-center justify-start w-100 h-100 bg-white"
    >
      <schoolFilter
        :data-loading="isFindingNearestSchool"
        :sort-list="sortList"
        :total-school-find="totalSchoolFind"
        :is-expand-map="isExpandMapInDesktop"
        @near-me="applyNearMe"
        @update-filter="updateFilter"
      />
      <div
        class="w-100 bg-grey100 d-flex align-center justify-end pa-5 map-div-button"
      >
        <!-- Filter chips -->
        <!-- <SchoolFilterChips :chips="chips" @remove-chip="removeChip" /> -->

        <div>
          <v-btn
            class="text-h4"
            elevation="4"
            prepend-icon="md:location_on"
            color="success"
            rounded="xl"
            height="50"
            @click="changeStatusExpandMap"
          >
            Map view
          </v-btn>
        </div>
      </div>
      <SchoolList
        :school-list="schools"
        :is-expanded="!isExpandMapInDesktop"
        :is-initial-loading="isInitialSchoolLoading"
        :is-near-loading="isFindingNearestSchool"
        :is-pagination-loading="isPaginationSchoolLoading"
        :is-pagination-previous-loading="isPaginationPreviousSchoolLoading"
        :is-all-data-loaded="isAllSchoolLoaded"
        :page-number-for-load-previous-data="pageNumberForLoadPreviousSchool"
        @load-next-page="loadNextPageSchool"
        @load-previous-page="loadPreviousSchool"
      />
    </div>
    <!-- Desktop view -->

    <!-- Mobile View -->
    <CommonSwipeableBottomSheet
      v-if="lgAndDown"
      v-model:open-sheet="openBottomNavFilterList"
      class="d-flex d-lg-none"
      @update:open-sheet="changeBottomSheetStatus"
    >
      <schoolFilter
        :data-loading="isFindingNearestSchool"
        :sort-list="sortList"
        :total-school-find="totalSchoolFind"
        :is-expand-map="isExpandMapInDesktop"
        @update-filter="updateFilter"
        @near-me="applyNearMe"
      />
      <SchoolList
        :school-list="schools"
        :is-expanded="!isExpandMapInDesktop"
        :is-initial-loading="isInitialSchoolLoading"
        :is-near-loading="isFindingNearestSchool"
        :is-pagination-loading="isPaginationSchoolLoading"
        :is-pagination-previous-loading="isPaginationPreviousSchoolLoading"
        :is-all-data-loaded="isAllSchoolLoaded"
        :page-number-for-load-previous-data="pageNumberForLoadPreviousSchool"
        @load-next-page="loadNextPageSchool"
        @load-previous-page="loadPreviousSchool"
      />
    </CommonSwipeableBottomSheet>
    <!-- Mobile View -->
  </div>
</template>

<script setup>
import { onUnmounted, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import schoolFilter from '~/components/school/Filter.vue'
import Map from '~/components/common/Map.client.vue'
import SchoolDetailsModal from '~/components/school/SchoolDetailsModal.vue'
import SchoolList from '~/components/school/List.vue'
import { useDisplay } from 'vuetify'

const router = useRouter()
const route = useRoute()

const { lgAndDown } = useDisplay()
const { location, fetchLocation } = useCurrentLocation()

const isUserMovingMap = ref(true) // Start with loading indicator visible
const mapRef = ref(null)
const shouldZoomToUserLocation = ref(false)

const sortList = [
  {
    value: 'lastModifyDate',
    title: 'Recently Updated',
  },
  {
    value: 'score',
    title: 'Highest score',
  },
]

const setDefaultSort = (selectedSorts) => {
  if (selectedSorts.includes('distance')) {
    return ['distance']
  }

  if (!selectedSorts.includes('lastModifyDate')) {
    return ['lastModifyDate', ...selectedSorts]
  }

  return selectedSorts
}

const setDefaultSortToRoute = () => {
  const currentSort = route.query.sort
  const hasLastModify
    = currentSort
      && (Array.isArray(currentSort)
        ? currentSort.includes('lastModifyDate')
        : currentSort.split(',').includes('lastModifyDate'))

  if (!hasLastModify) {
    const newSort = currentSort
      ? `lastModifyDate,${currentSort}`
      : 'lastModifyDate'

    router.replace({
      query: {
        ...route.query,
        sort: newSort,
      },
    })
  }
}

const applyNearMe = async () => {
  isAllSchoolLoaded.value = false
  isFindingNearestSchool.value = true

  if (!filterForm.value.sort.includes('distance')) {
    filterForm.value.sort.unshift('distance')
  }

  await handleFetchUserLocation()
}

onMounted(() => {
  setDefaultSortToRoute()
  const footer = document.getElementById('footer-container')
  if (footer) {
    footer.style.display = 'none'
  }
})

onUnmounted(() => {
  const footer = document.getElementById('footer-container')
  if (footer) {
    footer.style.display = 'unset'
  }
})

// Start Filter Section
const filterForm = ref({
  keyword: route.query.keyword || '',
  country: route.query.country || '',
  state: route.query.state || '',
  city: route.query.city || '',
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
  distance: Number(route.query.distance) || null,
  lat: Number(route.query.lat) || null,
  lng: Number(route.query.lng) || null,
  page: Number(route.query.page) || 1,
})

const defaultLatLongDistance = {
  lat: 39.90973623453719,
  lng: -81.12304687500001,
  distance: 5598568,
}

const handleFetchUserLocation = async () => {
  try {
    const loc = await fetchLocation()

    filterForm.value.lat = loc.lat
    filterForm.value.lng = loc.lng
    filterForm.value.distance = defaultLatLongDistance.distance

    userLocationFound([
      loc.lat,
      loc.lng,
    ])

    shouldZoomToUserLocation.value = true
    updateQueryParams()
  }
  catch (error) {
    console.error('Error fetching user location', error)
    shouldZoomToUserLocation.value = false
    isFindingNearestSchool.value = false
  }
}

const userLocationFound = (data) => {
  defaultLatLongDistance.lat = data[0]
  defaultLatLongDistance.lng = data[1]
}

const timer = ref(null)
const isInitialSchoolLoading = ref(false)
const isPaginationSchoolLoading = ref(false)
const isPaginationPreviousSchoolLoading = ref(false)
const isFindingNearestSchool = ref(false)
const schools = ref([])
const newSchoolForMarkersOnMap = ref([])
const isAllSchoolLoaded = ref(false)
const pageNumberForLoadPreviousSchool = ref(
  route.query.page ? Number(route.query.page) : 1,
)
const pageNumberForLoadNextSchool = ref(
  route.query.page ? Number(route.query.page) : 1,
)
const perPage = ref(20)
const totalSchoolFind = ref(0)

const resetParameter = () => {
  filterForm.value.page = 1
  pageNumberForLoadNextSchool.value = 1
  pageNumberForLoadPreviousSchool.value = 1
  isAllSchoolLoaded.value = false
  isInitialSchoolLoading.value = true
  schools.value = []
  // Show loading indicator only when in map view
  if (
    isExpandMapInDesktop.value
    || (!openBottomNavFilterList.value && lgAndDown.value)
  ) {
    isUserMovingMap.value = true
  }
}

const updateFilter = (query) => {
  const hadDistance = filterForm.value.sort?.includes('distance')

  let newSort = [...(query.sort || [])]
  const hasDistance = newSort.includes('distance')

  // No sort selected -> fallback to default
  if (newSort.length === 0) {
    newSort = ['lastModifyDate']
  }

  // 🧠 preserve map state BEFORE mutation
  const mapState = {
    lat: filterForm.value.lat,
    lng: filterForm.value.lng,
    distance: filterForm.value.distance,
  }

  // -----------------------------
  // 1. RESET ONLY NON-MAP FIELDS
  // -----------------------------
  Object.keys(filterForm.value).forEach((key) => {
    if (['lat', 'lng', 'distance'].includes(key)) return
    if (key === 'sort') return

    filterForm.value[key] = undefined
  })

  // -----------------------------
  // 2. APPLY INCOMING QUERY
  // -----------------------------
  Object.entries(query).forEach(([key, value]) => {
    filterForm.value[key] = value
  })

  // -----------------------------
  // 3. SORT HANDLING
  // -----------------------------
  filterForm.value.sort = newSort

  // -----------------------------
  // 4. RESTORE MAP STATE IF STILL IN DISTANCE MODE
  // -----------------------------
  if (hasDistance || hadDistance) {
    filterForm.value.lat = mapState.lat
    filterForm.value.lng = mapState.lng
    filterForm.value.distance = mapState.distance
  }

  // -----------------------------
  // 5. CLEANUP WHEN DISTANCE REMOVED
  // -----------------------------
  if (hadDistance && !hasDistance) {
    filterForm.value.lat = null
    filterForm.value.lng = null
    filterForm.value.distance = null

    location.value = null
    shouldZoomToUserLocation.value = false
    mapRef.value?.removeUserLocationMarker()
  }

  resetParameter()
  updateQueryParams()
}

const handleMapMoveStart = () => {
  // Only show loading if map view is active and will trigger data reload
  if (
    (isExpandMapInDesktop.value && window.innerWidth > 1260)
    || (!openBottomNavFilterList.value && window.innerWidth < 1260)
  ) {
    isUserMovingMap.value = true
  }
}

const changeFilterWithMapMoved = (locationParam) => {
  if (
    (isExpandMapInDesktop.value && window.innerWidth > 1260)
    || (!openBottomNavFilterList.value && window.innerWidth < 1260)
  ) {
    filterForm.value.distance = locationParam.distance
    filterForm.value.lat = locationParam.center[0]
    filterForm.value.lng = locationParam.center[1]
    resetParameter()
    updateQueryParams()
  }
  // Always set to false when movement ends, regardless of conditions
  isUserMovingMap.value = false
}

const updateQueryParams = () => {
  const query = {}
  Object.entries(filterForm.value).forEach(([key, value]) => {
    if (value) {
      if (
        typeof value === 'string'
        || (typeof value === 'number' && value != 0)
      ) {
        query[key] = value
      }
      else if (Array.isArray(value) && value.length) {
        const joinText = value.join(',')
        query[key] = joinText
      }
    }
  })
  router.replace({ query })

  applyFiltersFromQuery(query)
}

const applyFiltersFromQuery = (_query) => {
  debouncedGetSchoolList()
}
const debouncedGetSchoolList = async () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  await nextTick()

  timer.value = setTimeout(() => {
    getSchoolList()
  }, 800)
}

const metaTitle = ref(
  'School Finder: Your Path to Ideal Education - Find Schools Near You',
)
const metaDescription = ref('')
const setMetaData = (informationResponse) => {
  if (informationResponse.filters && informationResponse.filters.length > 0) {
    const titles = {}
    titles['country-title'] = ''
    titles['state-title'] = ''
    titles['city-title'] = ''
    informationResponse.filters.forEach((item) => {
      titles[item.key] = item.value ? item.value : ''
    })

    if (titles['country-title'].length > 0) {
      metaTitle.value
        = titles['city-title']
          + ' '
          + titles['state-title']
          + ' '
          + titles['country-title']
          + ' Schools'
      // Build meta description from location filters
      const location = [
        titles['city-title'],
        titles['state-title'],
        titles['country-title'],
      ]
        .filter(Boolean)
        .join(', ')

      metaDescription.value = location
        ? `Looking for schools in ${location}? Browse top-rated options and find the perfect match for your child's education.`
        : 'Looking for schools? Browse top-rated options and find the perfect match for your child\'s education.'
    }
    else {
      metaTitle.value
        = 'School Finder: Your Path to Ideal Education - Find Schools Near You'
      metaDescription.value
        = 'Looking for schools? Browse top-rated options and find the perfect match for your child\'s education.'
    }
  }
  else {
    metaTitle.value
      = 'School Finder: Your Path to Ideal Education - Find Schools Near You'
    metaDescription.value
      = 'Looking for schools? Browse top-rated options and find the perfect match for your child\'s education.'
  }

  useHead({
    title: metaTitle.value,

    meta: [
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: metaTitle.value,
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: metaTitle.value,
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'GamaTrain',
      },
      {
        hid: 'description',
        name: 'description',
        content: metaDescription.value,
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: metaDescription.value,
      },
    ],
  })
}

const { data: initialSchools, pending: _loadingSchoolsServer }
  = await useAsyncData('schoolListSSR', () => {
    const params = {
      'PagingDto.PageFilter.Skip': (filterForm.value.page - 1) * perPage.value,
      'PagingDto.PageFilter.Size': perPage.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      'Name': filterForm.value.keyword,
      'section': filterForm.value.stage,
      'Tuition.Start':
        filterForm.value.tuitionFeeMin == 0
          ? undefined
          : filterForm.value.tuitionFeeMin,
      'Tuition.End':
        filterForm.value.tuitionFeeMax == 0
          ? undefined
          : filterForm.value.tuitionFeeMax,
      'CountryId': filterForm.value.country,
      'StateId': filterForm.value.state,
      'CityId': filterForm.value.city,
      'school_type': filterForm.value.school_type,
      'religion': filterForm.value.religion,
      'boarding_type': filterForm.value.boarding_type,
      'coed_status': filterForm.value.coed_status,
    }
    if (filterForm.value.sort && filterForm.value.sort.length > 0) {
      filterForm.value.sort.forEach((sortOption, index) => {
        params[`PagingDto.SortFilter[${index}].sortType`] = 'Desc'
        params[`PagingDto.SortFilter[${index}].column`] = sortOption
      })
    }

    return useApiService.get('/api/v2/schools', params)
  })

if (initialSchools.value) {
  setMetaData(initialSchools.value)
  schools.value = initialSchools.value?.data?.list || []
  totalSchoolFind.value = initialSchools.value?.data?.totalRecordsCount || 0
  isInitialSchoolLoading.value = false
  isPaginationSchoolLoading.value = false
  isPaginationPreviousSchoolLoading.value = false
  // Hide loading indicator after initial data is loaded
  isUserMovingMap.value = false
}

const getSchoolList = async () => {
  if (isAllSchoolLoaded.value) return
  try {
    const params = {
      'PagingDto.PageFilter.Skip': (filterForm.value.page - 1) * perPage.value,
      'PagingDto.PageFilter.Size': perPage.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    }
    if (filterForm.value.sort && filterForm.value.sort.length > 0) {
      filterForm.value.sort.forEach((sortOption, index) => {
        params[`PagingDto.SortFilter[${index}].column`] = sortOption

        params[`PagingDto.SortFilter[${index}].sortType`]
          = sortOption === 'distance'
            ? 'Asc'
            : 'Desc'
      })
    }

    if ((filterForm.value.lat && filterForm.value.lng) || filterForm.value.sort.includes('distance')) {
      params['Location.Latitude'] = filterForm.value.lat
      params['Location.Longitude'] = filterForm.value.lng
      params['Location.Radius'] = filterForm.value.distance
    }

    // Always send sort when selected
    params['sort'] = filterForm.value.sort

    // Other filters only in list mode
    if (!isExpandMapInDesktop.value && openBottomNavFilterList.value) {
      params['Name'] = filterForm.value.keyword
      params['section'] = filterForm.value.stage

      params['Tuition.Start']
        = filterForm.value.tuitionFeeMin === 0
          ? undefined
          : filterForm.value.tuitionFeeMin

      params['Tuition.End']
        = filterForm.value.tuitionFeeMax === 0
          ? undefined
          : filterForm.value.tuitionFeeMax

      params['CountryId'] = filterForm.value.country
      params['StateId'] = filterForm.value.state
      params['CityId'] = filterForm.value.city
      params['school_type'] = filterForm.value.school_type
      params['religion'] = filterForm.value.religion
      params['boarding_type'] = filterForm.value.boarding_type
      params['coed_status'] = filterForm.value.coed_status
    }

    const response = await useApiService.get('/api/v2/schools', params)
    setMetaData(response)

    if (response?.data?.list) {
      if (response?.data?.list.length < perPage.value) {
        isAllSchoolLoaded.value = true
      }
      totalSchoolFind.value = response.data.totalRecordsCount
        ? response.data.totalRecordsCount
        : 0

      schools.value
        = isPaginationPreviousSchoolLoading.value
          ? [...response.data.list, ...schools.value]
          : filterForm.value.page === 1
            ? response.data.list
            : [...schools.value, ...response.data.list]

      if (isExpandMapInDesktop.value || !openBottomNavFilterList.value) {
        const schoolList = response?.data?.list

        newSchoolForMarkersOnMap.value = schoolList

        if (shouldZoomToUserLocation.value) {
          const userLocation = location.value

          if (
            Number.isFinite(userLocation?.lat)
            && Number.isFinite(userLocation?.lng)
          ) {
            mapRef.value?.setUserLocation(
              userLocation.lat,
              userLocation.lng,
              10,
            )
            shouldZoomToUserLocation.value = false
          }
        }
      }
    }
    else {
      isAllSchoolLoaded.value = true
    }
  }
  catch (err) {
    console.error(err)
  }
  finally {
    isInitialSchoolLoading.value = false
    isPaginationSchoolLoading.value = false
    isPaginationPreviousSchoolLoading.value = false
    // Hide loading indicator after data is loaded
    isUserMovingMap.value = false
    isFindingNearestSchool.value = false
  }
}

const loadNextPageSchool = () => {
  if (pageNumberForLoadNextSchool.value == 1) {
    filterForm.value.page += 1
  }
  else {
    pageNumberForLoadNextSchool.value += 1
    filterForm.value.page = pageNumberForLoadNextSchool.value
  }
  isPaginationSchoolLoading.value = true
  updateQueryParams()
}

const loadPreviousSchool = () => {
  if (filterForm.value.page > 1) {
    pageNumberForLoadPreviousSchool.value -= 1
    filterForm.value.page = pageNumberForLoadPreviousSchool.value
    isPaginationPreviousSchoolLoading.value = true
    updateQueryParams()
  }
}

// End Filter Section

// Start filter chips section
// const chips = ref([]);

// const addChip = (chip) => {
//   const exists = chips.value.some(
//     item => item.name === chip.name,
//   );

//   if (exists) {
//     return;
//   }

//   chips.value.push({
//     name: chip.name,
//   });
// };

// const removeChip = (chipName) => {
//   chips.value = chips.value.filter(
//     chip => chip.name !== chipName,
//   );
// };
// End filter chips section

// Start Open/Close bottom nav and Expand Map in Desktop
const isExpandMapInDesktop = ref(false)
const isMapMode = computed(() => {
  return isExpandMapInDesktop.value || !openBottomNavFilterList.value
})
const showUserLocationMarker = computed(() => {
  return route.query.distance !== undefined
    && route.query.distance !== null
    && route.query.distance !== ''
    && Boolean(location.value)
})

const changeStatusExpandMap = () => {
  isExpandMapInDesktop.value = !isExpandMapInDesktop.value
  if (isExpandMapInDesktop.value) {
    perPage.value = 200
    filterForm.value.lat = defaultLatLongDistance.lat
    filterForm.value.lng = defaultLatLongDistance.lng
    filterForm.value.distance = defaultLatLongDistance.distance
    schools.value = []
  }
  else {
    perPage.value = 20
    shouldZoomToUserLocation.value = false
    mapRef.value?.removeUserLocationMarker()
  }
  resetParameter()
  updateQueryParams()
}
// End Open/Close bottom nav and Expand Map in Desktop

// Start Handle Drag To Open/Close Bottom Nav
const openBottomNavFilterList = ref(true)

const changeBottomSheetStatus = (value) => {
  if (value) {
    perPage.value = 20
    shouldZoomToUserLocation.value = false
    mapRef.value?.removeUserLocationMarker()
  }
  else {
    perPage.value = 200
    filterForm.value.lat = defaultLatLongDistance.lat
    filterForm.value.lng = defaultLatLongDistance.lng
    filterForm.value.distance = defaultLatLongDistance.distance
  }
  resetParameter()
  updateQueryParams()
}

// End Handle Drag To Open/Close Bottom Nav

// Start School Modal Management
const showSchoolModal = ref(false)
const selectedSchool = ref(null)

const handleSchoolMarkerClick = (school) => {
  try {
    // Comprehensive validation of school data
    const validationResult = validateSchoolData(school)

    if (!validationResult.isValid) {
      console.warn('School data validation failed:', {
        school,
        missingFields: validationResult.missingFields,
        context: {
          zoom: 'marker-click',
          timestamp: new Date().toISOString(),
        },
      })

      // If we have at least an ID, try to fetch complete data
      if (school?.id) {
        fetchAdditionalSchoolDetails(school.id)
        return
      }
      else {
        console.error(
          'Invalid school data received from map marker click - no ID available',
        )
        return
      }
    }

    // Set the selected school and show modal
    selectedSchool.value = school
    showSchoolModal.value = true

    // If data is incomplete but valid, fetch additional details
    if (!validationResult.hasDisplayData) {
      fetchAdditionalSchoolDetails(school.id)
    }
  }
  catch (error) {
    console.error('Error displaying school modal:', error)
    // Fallback to direct navigation if modal fails
    if (school && school.id) {
      const schoolSlug = $slugGenerator(school.name)
      window.open(`/school/${school.id}/${schoolSlug}`, '_blank')
    }
  }
}

// Validate school data completeness
const validateSchoolData = (school) => {
  if (!school) {
    return {
      isValid: false,
      missingFields: ['school object'],
      hasDisplayData: false,
    }
  }

  // Check if all required fields are present
  const requiredFields = ['id', 'name']
  const missingFields = requiredFields.filter(
    field =>
      !school[field]
      || school[field] === ''
      || school[field] === null
      || school[field] === undefined,
  )

  const hasAllRequired = missingFields.length === 0

  // Check if we have enough display data for the modal
  const hasDisplayData = !!(
    school.defaultImageUri
    || school.countryTitle
    || school.stateTitle
    || school.cityTitle
    || school.score
    || school.lastModifyDate
  )

  return {
    isValid: hasAllRequired,
    missingFields,
    hasDisplayData,
  }
}

// Fetch additional school details if needed
const fetchAdditionalSchoolDetails = async (schoolId) => {
  try {
    // Set loading state if modal is already shown
    if (showSchoolModal.value && selectedSchool.value) {
      // Modal is already open, we're just updating data
    }
    else {
      // We need to fetch data before showing modal
      selectedSchool.value = { id: schoolId, name: 'Loading...' }
      showSchoolModal.value = true
    }

    const response = await useApiService.get(`/api/v2/schools/${schoolId}`)
    if (response && response?.data) {
      selectedSchool.value = { ...selectedSchool?.value, ...response?.data }
    }
    else {
      throw new Error('No school data received from API')
    }
  }
  catch (error) {
    console.error('Error fetching additional school details:', error)

    // Close modal if it was opened for loading
    showSchoolModal.value = false

    // Fallback to direct navigation
    if (schoolId) {
      const schoolSlug = selectedSchool.value?.name
        ? $slugGenerator(selectedSchool.value.name)
        : 'school'
      window.open(`/school/${schoolId}/${schoolSlug}`, '_blank')
    }
  }
}

// Handle navigation from modal to school details
const navigateToSchoolDetails = (schoolId, schoolSlug) => {
  showSchoolModal.value = true
  window.open(`/school/${schoolId}/${schoolSlug}`, '_blank')
}

// Handle marker click errors
const handleSchoolMarkerClickError = (errorData) => {
  console.warn('School marker click error:', errorData)

  // If we have a school ID, try to fetch the data and show modal
  if (errorData?.id) {
    fetchAdditionalSchoolDetails(errorData.id)
  }
  else {
    console.error('Cannot handle marker click error - no school ID provided')
  }
}
// End School Modal Management
</script>

<style scoped>
@import "../../assets/scss/school/index.scss";
.map-div-button {
  z-index: 3;
  min-height: 70px;
}
</style>
