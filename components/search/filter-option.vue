<template>
  <div
    class="w-100 d-none d-md-flex justify-center align-center flex-wrap ga-4 mt-2"
  >
    <template
      v-for="(filter, index) in filters"
      :key="filter.title || index"
    >
      <v-btn
        append-icon="mdi-chevron-down"
        :class="`text-h5 primary-gray-700 ${
          filter.isOpenModal || filter.selectedItem ? `open-style-btn` : ``
        }`"
        variant="outlined"
        rounded="xl"
        value="board"
        :disabled="filter.disabled"
        :loading="filter.loading"
        @click="filter.isOpenModal = !filter.isOpenModal"
      >
        {{ filter.selectedItem ? filter.selectedItem.title : filter.title }}
      </v-btn>

      <search-select-dialog
        v-model:show-dialog="filter.isOpenModal"
        :title-modal="filter.title"
        :items="filter.items"
        :selected-item="filter.selectedItem"
        @change-selected-item="onFilterUpdate($event, filter.title)"
      />
    </template>
    <v-col
      cols="12"
      class="d-flex flex-wrap align-center ga-4 max-width-container"
    >
      <template v-for="(filter, index) in filters">
        <v-chip
          v-if="filter.selectedItem"
          :key="filter.title"
          variant="flat"
          class="text-h5 pl-5 pr-5"
          color="#F2F4F7"
          :closable="index != FILTER_INDEX.Type"
          @click:close="clearFilter(filter, index)"
        >
          {{ filter.selectedItem?.title }}
        </v-chip>
      </template>
    </v-col>
  </div>

  <v-dialog
    v-model="dialogModel"
    transition="dialog-bottom-transition"
    fullscreen
    scrim="#ffffff"
  >
    <div
      class="w-100 h-100 d-flex flex-column justify-space-between overflow-y-auto bg-white position-relative"
    >
      <v-container class="flex-column">
        <v-col
          cols="12"
          class="d-flex justify-space-between align-center"
        >
          <span class="text-h3">Filter</span>

          <v-icon
            size="x-large"
            color="#D0D5DD"
            @click="closeModalFilterMobile"
          >
            mdi-close-circle
          </v-icon>
        </v-col>
        <v-col
          cols="12"
          class="d-flex flex-wrap align-center ga-4"
        >
          <template v-for="(filter, index) in filters">
            <v-chip
              v-if="filter.selectedItem"
              :key="filter.title"
              variant="flat"
              class="text-h5 pl-5 pr-5"
              color="#F2F4F7"
              :closable="index != FILTER_INDEX.Type"
              @click:close="clearFilter(filter, index)"
            >
              {{ filter.selectedItem?.title }}
            </v-chip>
          </template>
        </v-col>
        <v-col
          cols="12"
          class="d-flex flex-column justify-start align-center mt-4"
        >
          <div
            v-for="(filter, index) in filters"
            :key="index"
            :class="`w-100 d-flex justify-space-between align-center flex-wrap pt-2 pb-2 ${
              filter.disabled ? `opacity-20 cursor-not-allowed` : ``
            }`"
            @click="openModalSelectedFilter(filter)"
          >
            <v-badge
              :color="filter.selectedItem ? `#F04438` : `#ffffff`"
              dot
              floating
            >
              <span class="text-h4">{{ filter.title }} </span>
            </v-badge>
            <div class="d-flex align-center ga-1">
              <v-chip
                v-if="filter.selectedItem"
                variant="flat"
                class="text-h5 font-weight-bold pl-5 pr-5"
                color="#F2F4F7"
              >
                {{ filter.selectedItem.title }}
              </v-chip>

              <v-icon color="#667085">
                mdi-chevron-down
              </v-icon>
            </div>

            <v-divider
              :thickness="2"
              class="border-opacity-100 mt-4 mb-4"
              color="#F2F4F7"
            />
          </div>
        </v-col>
      </v-container>
      <div class="w-100 d-flex align-center justify-center ga-3 box-button">
        <v-btn
          variant="text"
          class="text-h5"
          @click="clearAllFilter"
        >
          Clear All
        </v-btn>
        <v-btn
          color="#ffb600"
          rounded="xl"
          height="40"
          width="200"
          class="text-h5"
          @click="closeModalFilterMobile"
        >
          Show {{ $numberFormat(countDataFound) }} Results
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  showDialogFilterMobile: {
    type: Boolean,
    default: false,
  },
  countDataFound: {
    type: String,
    default: () => '0',
  },
})

const emit = defineEmits([
  'update:showDialogFilterMobile',
  'changeFilterQuery',
])

const pageTitle = ref('')
const pageDescribe = ref('')

const setMetaData = (type) => {
  const titles = {
    boardTitle: filters[FILTER_INDEX.Board]?.selectedItem?.title
      ? filters[FILTER_INDEX.Board]?.selectedItem?.title
      : undefined,
    gradeTitle: filters[FILTER_INDEX.Grade]?.selectedItem?.title
      ? filters[FILTER_INDEX.Grade]?.selectedItem?.title
      : '',
    subjectTitle: filters[FILTER_INDEX.Subject]?.selectedItem?.title
      ? filters[FILTER_INDEX.Subject]?.selectedItem?.title
      : '',
    classificationTitle: filters[FILTER_INDEX.Classification]?.selectedItem
      ?.title
      ? filters[FILTER_INDEX.Classification]?.selectedItem?.title
      : '',
    yearTitle: filters[FILTER_INDEX.Year]?.selectedItem?.title
      ? filters[FILTER_INDEX.Year]?.selectedItem?.title
      : '',
    monthTitle: filters[FILTER_INDEX.Month]?.selectedItem?.title
      ? filters[FILTER_INDEX.Month]?.selectedItem?.title
      : '',
  }

  const joinTextTitles = `${titles.monthTitle} ${titles.yearTitle} ${titles.classificationTitle} ${titles.subjectTitle} ${titles.gradeTitle} ${titles.boardTitle}`
  setPageDescribe(type, joinTextTitles, titles)
  setPageTitle(type, joinTextTitles, titles)
  useHead(() => ({
    title: pageTitle.value,
    meta: [
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: pageTitle.value,
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: pageTitle.value,
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'GamaTrain',
      },
      {
        hid: 'description',
        name: 'description',
        content: pageDescribe.value,
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: pageDescribe.value,
      },
    ],
  }))
}

const setPageTitle = (type, joinTextTitles, titles) => {
  const titleTemplates = {
    learnfiles: {
      dynamic: `${joinTextTitles}  multimedia`,
      fallback:
        'Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain',
    },
    test: {
      dynamic: `${joinTextTitles} Past Papers`,
      fallback: 'Educational Resources | K12 Education Papers and Materials',
    },
    question: {
      dynamic: `${joinTextTitles} Forum`,
      fallback:
        'Seek Clarification, Expand Your Understanding: GamaTrain\'s Q&A Forum',
    },
    azmoon: {
      dynamic: `${joinTextTitles} Online test`,
      fallback: 'Online Exams, Free Exams for Improving Education',
    },
    dars: {
      dynamic: `${joinTextTitles} Textbook`,
      fallback:
        'Master Concepts, Enhance Learning: GamaTrain\'s Online Tutorials',
    },
    tutor: {
      dynamic: `${joinTextTitles} Teacher`,
      fallback: 'Teacher',
    },
    default: {
      dynamic: `${joinTextTitles} Past Papers`,
      fallback: 'Educational Resources | K12 Education Papers and Materials',
    },
  }

  const template = titleTemplates[type] || titleTemplates.default

  pageTitle.value = titles.boardTitle ? template.dynamic : template.fallback
}

const pageDescriptions = {
  learnfiles:
    'Elevate your learning experience with GamaTrain\'s captivating multimedia content, including PowerPoint presentations, informative videos, and diverse educational materials.',
  test: 'Enhance your learning with GamaTrain\'s extensive collection of online documents and texts, carefully curated to enrich your academic journey.',
  question:
    'Engage in active learning and gain deeper insights through GamaTrain\'s interactive Q&A platform, where you can pose questions and seek support from fellow learners and experts.',
  azmoon:
    'Hone your skills and assess your knowledge with GamaTrain\'s online exams, designed to enhance your exam preparation and boost your confidence.',
  dars: 'Complement your studies with GamaTrain\'s comprehensive online tutorials, providing step-by-step guidance and practice opportunities to refine your understanding.',
  tutor: 'Teacher',
}

const setPageDescribe = (type, joinTextTitles, titles) => {
  const descriptionTemplates = {
    learnfiles: {
      dynamic: `Free download list of ${joinTextTitles}  multimedia. Includes mark scheme for exam preparation.`,
    },
    test: {
      dynamic: `Free download list of ${joinTextTitles} Past Papers. Includes mark scheme for exam preparation.`,
    },
    question: {
      dynamic: `Free download list of ${joinTextTitles} Forum. Includes mark scheme for exam preparation.`,
    },
    azmoon: {
      dynamic: `Free download list of ${joinTextTitles} Online test. Includes mark scheme for exam preparation.`,
    },
    dars: {
      dynamic: `Free download list of ${joinTextTitles} Textbook. Includes mark scheme for exam preparation.`,
    },
    tutor: {
      dynamic: `Free download list of ${joinTextTitles} Teacher. Includes mark scheme for exam preparation.`,
    },
    default: {
      dynamic: `Free download list of ${joinTextTitles} Past Papers. Includes mark scheme for exam preparation.`,
    },
  }

  const template = descriptionTemplates[type] || descriptionTemplates.default

  pageDescribe.value = titles.boardTitle
    ? template.dynamic
    : pageDescriptions[type]
}

// Start Section Handle Status Modal
const dialogModel = computed({
  get: () => props.showDialogFilterMobile,
  set: value => emit('update:showDialogFilterMobile', value),
})

const closeModalFilterMobile = () => {
  emit('update:showDialogFilterMobile', false)
}
// End Section Handle Status Modal

const router = useRouter()
const route = useRoute()

const FILTER_INDEX = {
  Board: 0,
  Grade: 1,
  Subject: 2,
  Topic: 3,
  Type: 4,
  Classification: 5,
  Year: 6,
  Month: 7,
}
const FILTER_TYPE = {
  Board: 'section',
  Grade: 'base',
  Subject: 'lesson',
  Topic: 'topic',
  Type: 'type',
  Classification: 'classification',
  Year: 'edu_year',
  Month: 'edu_month',
}
const filters = reactive([
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: 'Board',
    disabled: false,
    loading: false,
  },
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: 'Grade',
    disabled: true,
    loading: false,
  },
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: 'Subject',
    disabled: true,
    loading: false,
  },
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: 'Topic',
    disabled: true,
    loading: false,
  },
  {
    items: [
      {
        title: 'Past Papers',
        id: '101',
        hasClassification: true,
        typeForGetClassification: 'test_type',
        typeForGetContent: 'test',
      },
      {
        title: 'Multimedia',
        id: '102',
        hasClassification: true,
        typeForGetClassification: 'content_type',
        typeForGetContent: 'learnfiles',
      },
      {
        title: 'QuizHub',
        id: '103',
        hasClassification: true,
        typeForGetClassification: 'test_type',
        typeForGetContent: 'azmoon',
      },
      {
        title: 'Forum',
        id: '104',
        hasClassification: false,
        typeForGetClassification: null,
        typeForGetContent: 'question',
      },
      {
        title: 'Tutorial',
        id: '105',
        hasClassification: false,
        typeForGetClassification: null,
        typeForGetContent: 'dars',
      },
    ],
    selectedItem: null,
    isOpenModal: false,
    title: 'Type',
    disabled: false,
    loading: false,
  },
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: 'Classification',
    disabled: true,
    loading: false,
  },
  {
    items: [
      {
        id: '2025',
        title: '2025',
      },
      {
        id: '2024',
        title: '2024',
      },
      {
        id: '2023',
        title: '2023',
      },
      {
        id: '2022',
        title: '2022',
      },
      {
        id: '2021',
        title: '2021',
      },
      {
        id: '2020',
        title: '2020',
      },
      {
        id: '2019',
        title: '2019',
      },
      {
        id: '2018',
        title: '2018',
      },
      {
        id: '2017',
        title: '2017',
      },
      {
        id: '2016',
        title: '2016',
      },
      {
        id: '2015',
        title: '2015',
      },
      {
        id: '2014',
        title: '2014',
      },
      {
        id: '2013',
        title: '2013',
      },
    ],
    selectedItem: null,
    isOpenModal: false,
    title: 'Year',
    disabled: true,
    loading: false,
  },
  {
    items: [
      { id: 1, title: 'January' },
      { id: 2, title: 'February' },
      { id: 3, title: 'March' },
      { id: 4, title: 'April' },
      { id: 5, title: 'May' },
      { id: 6, title: 'June' },
      { id: 7, title: 'July' },
      { id: 8, title: 'August' },
      { id: 9, title: 'September' },
      { id: 10, title: 'October' },
      { id: 11, title: 'November' },
      { id: 12, title: 'December' },
    ],
    selectedItem: null,
    isOpenModal: false,
    title: 'Month',
    disabled: true,
    loading: false,
  },
])

const openModalSelectedFilter = (filter) => {
  if (!filter.disabled) {
    filter.isOpenModal = !filter.isOpenModal
  }
}

const clearAllFilter = () => {
  filters.forEach((filter, index) => {
    if (index != FILTER_INDEX.Type) {
      filter.selectedItem = null
      filter.disabled = true
    }
  })
  filters[FILTER_INDEX.Board].disabled = false
  filters[FILTER_INDEX.Type].disabled = false
  updateQueryParam()
}

const clearFilter = (filter, index) => {
  if (index < FILTER_INDEX.Type) {
    for (let i = index; i < FILTER_INDEX.Type; i++) {
      filters[i].selectedItem = null
      if (i != index) {
        filters[i].disabled = true
      }
    }
    if (index == FILTER_INDEX.Board) {
      filters[FILTER_INDEX.Classification].selectedItem = null
      filters[FILTER_INDEX.Classification].disabled = true
    }
  }
  if (index == FILTER_INDEX.Type) {
    filters[index].selectedItem = null
    filters[FILTER_INDEX.Classification].selectedItem = null
    filters[FILTER_INDEX.Classification].disabled = true

    filters[FILTER_INDEX.Month].selectedItem = null
    filters[FILTER_INDEX.Month].disabled = true

    filters[FILTER_INDEX.Year].selectedItem = null
    filters[FILTER_INDEX.Year].disabled = true
  }
  if (index >= FILTER_INDEX.Classification) {
    filters[index].selectedItem = null
    filters[index].disabled = false
  }
  updateQueryParam()
}

const updateClassificationFilter = async () => {
  resetFilters(FILTER_INDEX.Classification, 6)
  if (filters[FILTER_INDEX.Type].selectedItem.hasClassification) {
    filters[FILTER_INDEX.Classification].loading = true
    const response = await getInformationNextFilter(
      'Board',
      filters[FILTER_INDEX.Type].selectedItem.typeForGetClassification,
    )
    filters[FILTER_INDEX.Classification].loading = false
    filters[FILTER_INDEX.Classification].disabled = false
    if (response.data) {
      filters[FILTER_INDEX.Classification].items = response.data
      filters[FILTER_INDEX.Classification].disabled = false
    }
  }
  else {
    filters[FILTER_INDEX.Classification].disabled = true
  }
}

const updateStatusMonthYearFilter = () => {
  if (
    filters[FILTER_INDEX.Type].selectedItem
    && filters[FILTER_INDEX.Type].selectedItem.title == 'Past Papers'
  ) {
    filters[FILTER_INDEX.Year].disabled = false
    filters[FILTER_INDEX.Month].disabled = false
  }
  else {
    filters[FILTER_INDEX.Year].selectedItem = null
    filters[FILTER_INDEX.Year].disabled = true
    filters[FILTER_INDEX.Month].selectedItem = null
    filters[FILTER_INDEX.Month].disabled = true
  }
}

const onFilterUpdate = async (item, filterName) => {
  const index = FILTER_INDEX[filterName]
  filters[index].isOpenModal = false

  if (item.id && item.id != filters[index]?.selectedItem?.id) {
    filters[index].selectedItem = item

    if (index == FILTER_INDEX.Board || index == FILTER_INDEX.Type) {
      if (
        filters[FILTER_INDEX.Board].selectedItem
        && filters[FILTER_INDEX.Type].selectedItem
      ) {
        await updateClassificationFilter()
      }
      updateStatusMonthYearFilter()
    }

    if (index < FILTER_INDEX.Type) {
      resetFilters(index + 1, 4)
    }
    if (index < FILTER_INDEX.Topic) {
      const typeNextFilter = FILTER_TYPE[filters[index + 1].title]
      filters[index + 1].loading = true
      const response = await getInformationNextFilter(
        filterName,
        typeNextFilter,
      )
      filters[index + 1].loading = false
      if (response.data) {
        filters[index + 1].items = response.data
        filters[index + 1].disabled = false
      }
    }

    updateQueryParam()
  }
}

const resetFilters = (startIndexFilter, endInexFilter) => {
  for (let index = startIndexFilter; index < endInexFilter; index++) {
    filters[index].items = []
    filters[index].selectedItem = null
    filters[index].disabled = true
  }
}

const getInformationNextFilter = async (filterName, typeFilter) => {
  try {
    const params = { type: typeFilter }

    const keyParams = FILTER_TYPE[filterName] + '_id'
    const indexFilter = FILTER_INDEX[filterName]
    params[keyParams] = filters[indexFilter].selectedItem.id
    const response = await $fetch(`/api/v1/types/list`, { params })
    return response
  }
  catch (error) {
    console.log('error', error)
    return error
  }
}

const updateQueryParam = () => {
  const query = {}
  filters.forEach((filter, index) => {
    const key = FILTER_TYPE[filter.title]
    if (filter.selectedItem && filter.selectedItem.id) {
      if (index == FILTER_INDEX.Classification) {
        if (
          filters[FILTER_INDEX.Type].selectedItem.typeForGetClassification
          == 'test_type'
        ) {
          query['test_type'] = filter.selectedItem.id
        }
        else if (
          filters[FILTER_INDEX.Type].selectedItem.typeForGetClassification
          == 'content_type'
        ) {
          query['content_type'] = filter.selectedItem.id
        }
      }
      else if (index == FILTER_INDEX.Type) {
        query[key] = filter.selectedItem.typeForGetContent
      }
      else {
        query[key] = filter.selectedItem.id
      }
    }
  })
  setMetaData(query.type)
  emit('changeFilterQuery', query)
  router.replace({ query })
}

const applyRouteToFilter = (index, queryKey, customId = null) => {
  const filter = filters[index]
  const key = queryKey || FILTER_TYPE[filter.title]
  const queryValue = customId || route.query[key]
  if (queryValue) {
    const found = filter.items.find(
      item => item.id == queryValue || item.typeForGetContent == queryValue,
    )
    if (found) filter.selectedItem = found
  }
}

const updateFiltersExistInRoute = async () => {
  const typeFilter = filters[FILTER_INDEX.Type]
  applyRouteToFilter(FILTER_INDEX.Type, FILTER_TYPE.Type)
  if (!filters[FILTER_INDEX.Type].selectedItem) {
    filters[FILTER_INDEX.Type].selectedItem
      = filters[FILTER_INDEX.Type].items[0]
  }
  if (typeFilter.selectedItem?.title === 'Past Papers') {
    filters[FILTER_INDEX.Year].disabled = false
    filters[FILTER_INDEX.Month].disabled = false
  }

  const boardResponse = await getBoardData()
  if (boardResponse.data) {
    filters[FILTER_INDEX.Board].items = boardResponse.data
    filters[FILTER_INDEX.Board].disabled = false
    applyRouteToFilter(FILTER_INDEX.Board, FILTER_TYPE.Board)
  }

  for (let index = FILTER_INDEX.Grade; index <= FILTER_INDEX.Topic; index++) {
    if (filters[index - 1].selectedItem) {
      const typeNextFilter = FILTER_TYPE[filters[index].title]
      filters[index].loading = true
      const response = await getInformationNextFilter(
        filters[index - 1].title,
        typeNextFilter,
      )
      filters[index].loading = false
      if (response.data) {
        filters[index].items = response.data
        filters[index].disabled = false
        applyRouteToFilter(index, FILTER_TYPE[filters[index].title])
      }
    }
  }

  [FILTER_INDEX.Year, FILTER_INDEX.Month].forEach((index) => {
    applyRouteToFilter(index, FILTER_TYPE[filters[index].title])
  })

  if (
    filters[FILTER_INDEX.Board].selectedItem
    && typeFilter.selectedItem
    && filters[FILTER_INDEX.Type].selectedItem.typeForGetClassification
  ) {
    filters[FILTER_INDEX.Classification].disabled = false
    filters[FILTER_INDEX.Classification].loading = true
    const classResponse = await getInformationNextFilter(
      'Board',
      typeFilter.selectedItem.typeForGetClassification,
    )
    filters[FILTER_INDEX.Classification].loading = false
    if (classResponse.data) {
      filters[FILTER_INDEX.Classification].items = classResponse.data
      const id = route.query['test_type'] || route.query['content_type']
      applyRouteToFilter(
        FILTER_INDEX.Classification,
        id ? null : FILTER_TYPE.Classification,
        id,
      )
    }
  }
  const skipFetch = true

  if (!route.query.type) {
    emit(
      'changeFilterQuery',
      {
        ...route.query,
        type: filters[FILTER_INDEX.Type].selectedItem.typeForGetContent,
      },
      skipFetch,
    )
    router.replace({
      query: {
        ...route.query,
        type: filters[FILTER_INDEX.Type].selectedItem.typeForGetContent,
      },
    })
  }
  else {
    emit('changeFilterQuery', route.query, skipFetch)
  }
}

const getBoardData = async () => {
  try {
    const params = { type: 'section' }
    filters[FILTER_INDEX.Board].loading = true
    const response = await $fetch(`/api/v1/types/list`, { params })
    filters[FILTER_INDEX.Board].loading = false
    return response
  }
  catch (error) {
    filters[FILTER_INDEX.Board].loading = false
    console.log('error', error)
    return error
  }
}

onMounted(async () => {
  await updateFiltersExistInRoute()
})
</script>

<style scoped>
.open-style-btn {
  background-color: #fff8e8;
  border: 1px solid #ffebb9;
}

.box-button {
  min-height: 74px;
  box-shadow: 0px -24px 50px 0px #1018280a;
}
.max-width-container {
  max-width: 1200px;
}
</style>
