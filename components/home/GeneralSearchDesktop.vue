<template>
  <div
    class="d-none d-md-flex align-center position-absolute rounded-pill main-search-div"
  >
    <v-col cols="7">
      <v-text-field
        ref="keywordInputRef"
        v-model="searchKey"
        class="h-100"
        rounded="s-pill"
        label="Ex: Paper Summer Session"
        :append-inner-icon="searchKey ? 'md:cancel' : ''"
        hide-details
        variant="solo"
        autocomplete="off"
        @click:append-inner="closeSearch()"
      />
    </v-col>
    <v-col
      cols="4"
      class="pl-0"
    >
      <v-autocomplete
        v-model="selectedCategory"
        hide-details
        label="Select category"
        :items="categories"
        variant="solo"
        return-object
        @update:model-value="changeSelectCategory"
      >
        <template #item="{ props, item }">
          <v-list-item v-bind="props">
            <template #title>
              <span class="text-h5 font-weight-bold">{{ item.title }}</span>
            </template>
          </v-list-item>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col
      cols="1"
      class="pl-0"
    >
      <v-btn
        color="#FFB300"
        size="x-large"
        class="text-white button-search rounded-e-pill"
        min-width="50"
      >
        <v-icon
          color="#ffffff"
          size="20"
        >
          md:search
        </v-icon>
      </v-btn>
    </v-col>
  </div>

  <div
    v-if="searchResultsSection"
    class="d-none d-md-block position-absolute rounded-xl bg-white search-result-container"
  >
    <div
      class="search-result"
      @scroll="checkSearchScroll"
    >
      <div class="result-stat bg-white">
        <span class="gama-text-overline"> Search result </span>
        <span class="gama-text-button">
          {{ searchCount != "..." ? $numberFormat(searchCount) : searchCount }}
        </span>
      </div>
      <div v-if="searchCount > 0">
        <v-row
          v-for="(item, index) in searchResults"
          :key="index"
          class="py-3 px-6"
        >
          <search-card
            v-if="selectedCategory.type == `paper`"
            :information="item"
          />
          <school-card-school
            v-if="selectedCategory.type == `school`"
            :school="item"
          />
          <blog-card
            v-if="selectedCategory.type == `blog`"
            :blog="item"
          />
        </v-row>
        <div
          ref="lineSpecifierLoadMoreRef"
          class="line-specifier-load-more"
        />
        <v-row
          v-if="allDataLoaded == false"
          class="py-4 px-6 mt-1"
        >
          <search-card-skeleton v-if="selectedCategory.type == `paper`" />
          <school-card-school-skeleton
            v-if="selectedCategory.type == `school`"
          />
          <blog-card-skeleton v-if="selectedCategory.type == `blog`" />
        </v-row>
      </div>
      <div
        v-else-if="searchCount == 0 && searchLoading == false"
        class="text-center"
      >
        <span class="gama-text-button"> Opps! no data found </span>
      </div>
      <div v-else>
        <v-row
          v-for="i in 3"
          :key="i"
          class="py-4 px-6"
        >
          <search-card-skeleton v-if="selectedCategory.type == `paper`" />
          <school-card-school-skeleton
            v-if="selectedCategory.type == `school`"
          />
          <blog-card-skeleton v-if="selectedCategory.type == `blog`" />
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
const searchResults = ref([])
const searchCount = ref('...')
const searchKey = ref('')
const categories = [
  {
    title: 'Past Papers',
    value: 'Past Papers',
    api: '/api/v1/search?type=test',
    type: 'paper',
    isOldApi: true,
    keywordSearch: 'title',
  },
  {
    title: 'Multimedia',
    value: 'Multimedia',
    api: '/api/v1/search?type=learnfiles',
    type: 'paper',
    isOldApi: true,
    keywordSearch: 'title',
  },
  {
    title: 'QuizHub',
    value: 'QuizHub',
    api: '/api/v1/search?type=azmoon',
    type: 'paper',
    isOldApi: true,
    keywordSearch: 'title',
  },
  {
    title: 'Forum',
    value: 'Forum',
    api: '/api/v1/search?type=question',
    type: 'paper',
    isOldApi: true,
    keywordSearch: 'title',
  },
  {
    title: 'Tutorial',
    value: 'Tutorial',
    api: '/api/v1/search?type=dars',
    type: 'paper',
    isOldApi: true,
    keywordSearch: 'title',
  },
  {
    title: 'School',
    value: 'School',
    api: '/api/v2/schools',
    type: 'school',
    isOldApi: false,
    keywordSearch: 'Name',
  },
  {
    title: 'Blog',
    value: 'Blog',
    api: '/api/v2/blogs/posts',
    type: 'blog',
    isOldApi: false,
    keywordSearch: 'Keyword',
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
const lineSpecifierLoadMoreRef = ref(null)

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

const checkSearchScroll = () => {
  const targetDiv = lineSpecifierLoadMoreRef.value
  const rect = targetDiv?.getBoundingClientRect()
  if (rect) {
    const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight
    if (isDivInView && !searchLoading.value && !allDataLoaded.value) {
      searchLoading.value = true
      pageNumber.value++
      search()
    }
  }
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
      })
      if (response.data && response.data.list) {
        searchResults.value.push(...response.data.list)

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
</script>

<style>
.line-specifier-load-more {
  width: 100%;
  height: 4px;
}

.search-result-container {
  top: 41.8rem;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 4;
  width: 78rem;
  min-height: 39.7rem;
  height: 39.7rem;
  overflow: hidden;
  box-shadow: 0px 9px 46px 8px rgba(0, 0, 0, 0.12),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 11px 15px -7px rgba(0, 0, 0, 0.2);
}

.search-result {
  max-height: 39.7rem;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  height: 100%;
}

.result-stat {
  padding: 1.6rem;
  text-align: right;
  position: sticky;
  top: 0;
  z-index: 100;
}
.gama-text-button {
  color: #57b947;
  text-align: right;
}

.gama-text-overline {
  color: rgba(36, 41, 47, 0.3);
  margin-right: 0.22rem;
}

.main-search-div {
  bottom: 8rem;
  width: 78rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 8.2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(7.5px);
}
.button-search {
  max-width: 100%;
}
</style>
