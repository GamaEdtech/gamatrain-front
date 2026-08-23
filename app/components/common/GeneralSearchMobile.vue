<template>
  <v-bottom-sheet v-model="searchBottomSheetModel">
    <v-sheet
      class="mobile-search-sheet"
      :height="`${mobileSearchSheetConfig.sheetHeight}vh`"
    >
      <div
        class="search-sheet-handler-holder"
        @touchstart="startDrag"
        @touchend="endDrag"
        @touchmove="handleDrag"
      >
        <div class="search-sheet-handler" />
      </div>

      <v-slide-group
        v-model="selectedCategory"
        mandatory
        show-arrows
        class="pt-1 centered-slide-group"
        @update:model-value="changeSelectCategory"
      >
        <v-slide-group-item
          v-for="(item, index) in categories"
          :key="index"
          v-slot="{ isSelected, toggle }"
          :value="item"
        >
          <div
            class="ma-4 d-flex flex-column align-center justify-center ga-2"
            @click="toggle"
          >
            <div
              :class="`d-flex align-center justify-center rounded-circle ${
                isSelected ? `active-category` : ``
              }`"
              :style="{ backgroundColor: isSelected ? item.activeColor : `` }"
            >
              <div
                class="category-div d-flex align-center justify-center rounded-circle"
                :style="{ backgroundColor: item.backgroundColor }"
              >
                <span :class="`icon-category ${item.iconName}`" />
              </div>
            </div>
            <div class="primary-gray-600">
              {{ item.title }}
            </div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
      <div class="w-100 d-flex px-3">
        <v-row class="w-100">
          <v-col
            cols="12"
            class="pb-4"
          >
            <v-text-field
              ref="keywordInputRef"
              v-model="searchKey"
              class="h-100"
              rounded="pill"
              label="Ex: Paper Summer Session"
              :append-inner-icon="searchKey ? 'md:cancel' : ''"
              hide-details
              variant="outlined"
              autocomplete="off"
              color="primary"
              icon-color="primary"
              glow
              density="compact"
              prepend-inner-icon="md:search"
              @click:append-inner="closeSearch()"
            />
          </v-col>
          <v-col
            cols="12"
            class="pt-0 px-1"
          >
            <div
              v-if="searchResultsSection"
              class="mobile-search-result-container"
            >
              <div
                class="search-result-mobile"
                @scroll="checkSearchScroll"
              >
                <div class="result-stat">
                  <span class="gama-text-overline-search"> Search result </span>
                  <span class="gama-text-button-search">
                    {{
                      searchCount != "..."
                        ? $numberFormat(searchCount)
                        : searchCount
                    }}
                  </span>
                </div>
                <div v-if="searchCount > 0">
                  <v-row
                    v-for="(item, index) in searchResults"
                    :key="index"
                    class="w-100 ma-0 d-flex justify-center list-item"
                  >
                    <lazy-common-general-search-card
                      :information="item"
                      :category="selectedCategory"
                      :class="index % 2 == 1 ? `background-odd` : ``"
                    />
                  </v-row>
                  <div
                    ref="lineSpecifierLoadMoreMobileRef"
                    class="line-specifier-load-more"
                  />
                  <v-row
                    v-if="allDataLoaded == false"
                    class="w-100 ma-0 d-flex justify-center"
                  >
                    <lazy-common-general-search-card-skeleton />
                  </v-row>
                </div>
                <div
                  v-else-if="searchCount == 0 && searchLoading == false"
                  class="text-center"
                >
                  <span class="gama-text-button-search">
                    Opps! no data found
                  </span>
                </div>
                <div v-else>
                  <v-row
                    v-for="i in 3"
                    :key="i"
                    class="w-100 ma-0 d-flex justify-center"
                  >
                    <lazy-common-general-search-card-skeleton
                      :class="i % 2 == 1 ? `background-odd` : ``"
                    />
                  </v-row>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script setup>
const route = useRoute()
const props = defineProps({
  showSearchBottomSheet: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:showSearchBottomSheet'])

const searchBottomSheetModel = computed({
  get: () => props.showSearchBottomSheet,
  set: value => emit('update:showSearchBottomSheet', value),
})

const searchResults = ref([])
const searchCount = ref('...')
const searchKey = ref('')
const categories = [
  {
    title: 'Past Papers',
    value: 'Past Papers',
    api: '/api/v1/search?type=test',
    type: 'paper',
    typePaper: 'paper',
    isOldApi: true,
    keywordSearch: 'title',
    iconName: 'icon-paper',
    backgroundColor: '#01c8c8',
    activeColor: '#bbe9bd',
  },
  {
    title: 'Multimedia',
    value: 'Multimedia',
    api: '/api/v1/search?type=learnfiles',
    type: 'paper',
    typePaper: 'multimedia',
    isOldApi: true,
    keywordSearch: 'title',
    iconName: 'icon-multimedia',
    backgroundColor: '#8800b8',
    activeColor: '#dcb3ea',
  },
  {
    title: 'QuizHub',
    value: 'QuizHub',
    api: '/api/v1/search?type=azmoon',
    type: 'paper',
    typePaper: 'exam',
    isOldApi: true,
    keywordSearch: 'title',
    iconName: 'icon-exam',
    backgroundColor: '#7b61ff',
    activeColor: '#d8d0ff',
  },
  {
    title: 'Forum',
    value: 'Forum',
    api: '/api/v1/search?type=question',
    type: 'paper',
    typePaper: 'qa',
    isOldApi: true,
    keywordSearch: 'title',
    iconName: 'icon-q-a',
    backgroundColor: '#ff50a6',
    activeColor: '#ffcbe4',
  },
  {
    title: 'Tutorial',
    value: 'Tutorial',
    api: '/api/v1/search?type=dars',
    type: 'paper',
    typePaper: 'tutorial',
    isOldApi: true,
    keywordSearch: 'title',
    iconName: 'icon-tutorial',
    backgroundColor: '#2a91ff',
    activeColor: '#c0deff',
  },
  {
    title: 'Teacher',
    value: 'Teacher',
    api: '/api/v2/identities/profiles/list',
    type: 'teacher',
    isOldApi: false,
    keywordSearch: 'FullName',
    iconName: 'icon-teacher',
    backgroundColor: '#12b76a',
    activeColor: '#12b76a70',
  },
  {
    title: 'School',
    value: 'School',
    api: '/api/v2/schools',
    type: 'school',
    isOldApi: false,
    keywordSearch: 'Name',
    iconName: 'icon-school',
    backgroundColor: '#a15801',
    activeColor: '#e3cdb3',
  },
  {
    title: 'Blog',
    value: 'Blog',
    api: '/api/v2/blogs/posts',
    type: 'blog',
    isOldApi: false,
    keywordSearch: 'Title',
    iconName: 'icon-student',
    backgroundColor: '#ff9400',
    activeColor: '#ffdfb3',
  },
]
const selectedCategory = ref(categories[0])
const searchLoading = ref(true)
const pageNumber = ref(1)
const pageSize = 10
const searchResultsSection = ref(false)
const allDataLoaded = ref(false)
const keywordInputRef = ref(null)
const timer = ref(null)
const lineSpecifierLoadMoreMobileRef = ref(null)

watch(searchKey, (val) => {
  searchLoading.value = true
  searchCount.value = '...'
  if (val.trim() === '') {
    searchResultsSection.value = false
  }
  else {
    searchResultsSection.value = true
  }
  debouncedSearchText()
})

watch(
  () => route.name,
  () => {
    emit('update:showSearchBottomSheet', false)
    searchKey.value = ''
  },
)

const debouncedSearchText = () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  timer.value = setTimeout(() => {
    pageNumber.value = 1
    searchCount.value = '...'
    allDataLoaded.value = false
    searchResults.value = []
    search()
  }, 800)
}

const search = async () => {
  if (searchKey.value && allDataLoaded.value == false) {
    try {
      let params = {}
      params[selectedCategory.value.keywordSearch] = searchKey.value
      if (selectedCategory.value.isOldApi) {
        params.page = pageNumber.value
      }
      else {
        params = {
          ...params,
          'PagingDto.PageFilter.Size': pageSize,
          'PagingDto.PageFilter.Skip': pageSize * (pageNumber.value - 1),
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        }
      }

      const response = await useApiService.get(selectedCategory.value.api, {
        ...params,
      }, { public: true })
      if (response.data && response.data.list) {
        searchResults.value = [...searchResults.value, ...response.data.list]
        if (selectedCategory.value.isOldApi) {
          searchCount.value = response.data.num
        }
        else {
          searchCount.value = response.data.totalRecordsCount
        }

        if (response.data.list.length < pageSize) {
          allDataLoaded.value = true
        }
      }
      else {
        searchCount.value = 0
        searchResults.value = []
        searchLoading.value = false
      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
      searchLoading.value = false
    }
  }
}
const closeSearch = () => {
  searchResultsSection.value = false
  searchKey.value = ''
  keywordInputRef.value?.blur()
}

const changeSelectCategory = () => {
  if (searchResultsSection.value) {
    pageNumber.value = 1
    searchCount.value = '...'
    allDataLoaded.value = false
    searchResults.value = []
    searchLoading.value = true
    search()
  }
}

const mobileSearchSheetConfig = ref({
  isDragging: false,
  startDragY: 0,
  sheetHeight: 70,
})

const checkSearchScroll = async () => {
  const targetDiv = lineSpecifierLoadMoreMobileRef.value
  const rect = targetDiv?.getBoundingClientRect()
  if (rect) {
    const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight
    if (isDivInView && !searchLoading.value && !allDataLoaded.value) {
      searchLoading.value = true
      pageNumber.value++
      await search()
    }
  }
}

const startDrag = (e) => {
  mobileSearchSheetConfig.value.isDragging = true
  mobileSearchSheetConfig.value.startDragY = e.touches[0].clientY
}
const handleDrag = (e) => {
  if (mobileSearchSheetConfig.value.isDragging) {
    e.preventDefault()

    const currentY = e.touches[0].clientY
    const dragDistance = mobileSearchSheetConfig.value.startDragY - currentY
    const viewportHeight = window.innerHeight

    const currentHeight = mobileSearchSheetConfig.value.sheetHeight
    const newHeightVH = currentHeight + (dragDistance / viewportHeight) * 100

    // Limit the newHeightVH to reasonable values
    const newHeight = Math.min(Math.max(newHeightVH, 10), 100) // 10vh to 100vh

    mobileSearchSheetConfig.value.sheetHeight = newHeight
    mobileSearchSheetConfig.value.startDragY = currentY
  }
}
const endDrag = (_e) => {
  mobileSearchSheetConfig.value.isDragging = false
  if (mobileSearchSheetConfig.value.sheetHeight < 30)
    emit('update:showSearchBottomSheet', false)
}

watch(
  () => props.showSearchBottomSheet,
  (val) => {
    if (val == true) mobileSearchSheetConfig.value.sheetHeight = 70
  },
)
</script>

<style>
.line-specifier-load-more {
  width: 100%;
  height: 4px;
}
.category-div {
  width: 50px;
  height: 50px;
}
.icon-category {
  font-size: 30px;
  color: #ffffff;
}

.active-category {
  width: 70px;
  height: 70px;
}

.list-item {
  a {
    text-decoration: none;
    color: unset;
  }
}
.result-stat {
  padding: 1.6rem;
  text-align: right;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #f6f8fa;
}
.gama-text-button-search {
  color: #57b947;
  text-align: right;
}

.gama-text-overline-search {
  color: rgba(36, 41, 47, 0.3);
  margin-right: 0.22rem;
}

.mobile-search-sheet {
  height: 70vh !important;
  border-radius: 3rem 3rem 0 0 !important;
  justify-content: center;
  align-items: center;
  background: #f6f8fa;
  position: relative;
  padding: 20px 0;
}
.centered-slide-group .v-slide-group__content {
  justify-content: center !important;
}

.search-sheet-handler-holder {
  position: absolute;
  width: 100%;
  height: 6.4rem;
  border-radius: 10rem;
  opacity: 0.4;
  top: 0;
  left: 0;
  right: 0;
  background: transparent;
  margin: auto;
}

.search-sheet-handler {
  position: absolute;
  width: 3.2rem;
  height: 0.4rem;
  border-radius: 10rem;
  opacity: 0.4;
  top: 1.6rem;
  left: 0;
  right: 0;
  background: var(--m-3-sys-light-outline, #79747e);
  margin: auto;
}

.mobile-search-result-container {
  display: block;
  margin: auto;
  z-index: 4;
  min-height: 40vh;
  height: 40vh;
  overflow: hidden;
}
.search-result-mobile {
  max-height: 40vh;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}
.v-skeleton-loader {
  background-color: transparent;
}
.background-odd {
  background-color: #ebebeb;
}
@media (min-width: 600px) {
  .mobile-search-sheet {
    height: 50vh;
    border-radius: 3rem 3rem 0 0;
    justify-content: center;
    align-items: center;
  }
}
</style>
