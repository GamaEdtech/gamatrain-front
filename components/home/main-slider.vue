<template>
  <div id="slider-container">
    <v-col
      cols="12"
      sm="12"
      md="12"
      class="pt-0 px-0 pt-sm-0"
    >
      <v-carousel
        id="main-slider"
        v-model="carousel_model"
        cycle
        delimiter-icon="mdi-square"
        interval="5000"
        hide-delimiter-background
        :show-arrows="false"
      >
        <v-carousel-item
          v-for="(slide, i) in slides"
          :key="i"
        >
          <v-sheet
            :id="slide.id"
            class="section1"
          >
            <v-container class="pt-0 pt-sm-6 pt-md-6 pt-lg-8">
              <v-card
                flat
                class="px-4 px-sm-8 px-md-12"
              >
                <v-row class="text-white">
                  <v-col col="12">
                    <div
                      class="slide-title"
                      v-html="slide.title"
                    />
                    <div
                      class="slide-describe gama-text-body1 mt-6 d-none d-md-block"
                      v-html="slide.text"
                    />
                    <v-btn
                      id="read-about-btn"
                      rounded
                      :to="slide.link"
                      class="d-none d-md-inline-flex"
                      size="x-large"
                    >
                      Learn more
                    </v-btn>

                    <v-btn
                      id="slide-register-btn"
                      variant="text"
                      :to="slide.link"
                      class="d-md-none"
                    >
                      Learn more
                      <v-icon color="#FFB300">
                        mdi-arrow-right-bold
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-sheet>
          <v-sheet class="section2" />
        </v-carousel-item>
        <v-card
          id="main-search"
          class="d-none d-md-block"
        >
          <v-card-text class="mt-1">
            <v-row class="text-center">
              <v-col
                id="main-search-keyword"
                cols="7"
              >
                <v-text-field
                  ref="keywordInput"
                  v-model="searchKey"
                  class="h-100"
                  rounded="s-pill"
                  label="Ex: Paper Summer Session"
                  density="compact"
                  :append-inner-icon="searchKey ? 'mdi-close-circle' : ''"
                  hide-details
                  variant="solo"
                  autocomplete="off"
                  @click:append-inner="closeSearch()"
                />
              </v-col>
              <v-col
                id="keysearch-cate"
                cols="4"
                class="pl-0"
              >
                <v-autocomplete
                  v-model="searchCate"
                  hide-details
                  density="compact"
                  label="Select category"
                  :items="['Paper', 'Multimedia', 'Q&A', 'Exam', 'Tutorial']"
                  variant="solo"
                />
              </v-col>
              <v-col
                cols="1"
                class="pl-0"
              >
                <v-btn
                  color="#FFB300"
                  class="text-white"
                >
                  <v-icon
                    color="#ffffff"
                    size="20"
                  >
                    mdi-magnify
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-carousel>
    </v-col>
    <div
      v-if="searchResultsSection"
      id="search-result-container"
    >
      <div
        id="search-result"
        ref="searchResult"
        @scroll="checkSearchScroll"
      >
        <div id="result-stat">
          <span class="gama-text-overline"> Search result </span>
          <span class="gama-text-button">
            {{ searchCount }}
          </span>
        </div>
        <div v-if="searchCount > 0">
          <v-row
            v-for="(item, index) in searchResults"
            :key="index"
            class="list-item"
          >
            <v-col
              cols="1"
              class="pr-1"
            >
              <nuxt-link :to="`/${calcPath(item.type)}/${item.id}`">
                <div
                  v-if="item.type == 'gama_tests'"
                  class="avatar paper-avatar"
                >
                  <span class="icon icon-paper" />
                </div>
                <div
                  v-else-if="
                    item.type == 'gama_learnfiles' || item.type == 'gama_files'
                  "
                  class="avatar multimedia-avatar"
                >
                  <span class="icon icon-multimedia" />
                </div>
                <div
                  v-else-if="item.type == 'gama_azmoons'"
                  class="avatar exam-avatar"
                >
                  <span class="icon icon-exam" />
                </div>
                <div
                  v-else-if="item.type == 'gama_questions'"
                  class="avatar qa-avatar"
                >
                  <span class="icon icon-q-a" />
                </div>
                <div
                  v-else-if="item.type == 'gama_dars'"
                  class="avatar tutorial-avatar"
                >
                  <span class="icon icon-tutorial" />
                </div>
                <div
                  v-else-if="item.type == 'gama_teachers'"
                  class="avatar teacher-avatar"
                >
                  <span class="icon icon-teacher" />
                </div>
                <div
                  v-else-if="item.type == 'gama_schools'"
                  class="avatar school-avatar"
                >
                  <span class="icon icon-school" />
                </div>
                <div
                  v-else-if="item.type == 'gama_live'"
                  class="avatar live-avatar"
                >
                  <span class="icon icon-live" />
                </div>
                <div
                  v-else-if="item.type == 'gama_students'"
                  class="avatar student-avatar"
                >
                  <span class="icon icon-live" />
                </div>
              </nuxt-link>
            </v-col>
            <v-col cols="11">
              <div class="gama-text-button">
                <nuxt-link :to="`/${calcPath(item.type)}/${item.id}`">{{
                  item.title
                }}</nuxt-link>
              </div>
              <div class="chip-container">
                <div
                  v-if="item.lesson_title"
                  class="chip"
                >
                  <nuxt-link
                    :to="`/search?type=test&section=${item.section}&base=${item.base}&lesson=${item.lesson}`"
                  >{{ item.lesson_title }}</nuxt-link>
                </div>
                <div
                  v-if="item.base_title"
                  class="chip"
                >
                  <nuxt-link
                    :to="`/search?type=test&section=${item.section}&base=${item.base}`"
                  >{{ item.base_title }}</nuxt-link>
                </div>
                <div
                  v-if="item.section_title"
                  class="chip"
                >
                  <nuxt-link
                    :to="`/search?type=test&section=${item.section}`"
                  >{{ item.section_title }}</nuxt-link>
                </div>
              </div>
            </v-col>
          </v-row>
          <div
            ref="lineSpecifierLoadMoreRef"
            class="line-specifier-load-more"
          />
          <v-row
            v-if="allDataLoaded == false"
            class="list-item"
          >
            <v-col cols="12">
              <v-skeleton-loader type="list-item-avatar" />
            </v-col>
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
            class="list-item"
          >
            <v-col cols="12">
              <v-skeleton-loader type="list-item-avatar" />
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const carousel_model = ref(0)
const _colors = ['#24292F', '#0092A9']

const slides = [
  {
    title:
      '<span class="gama-text-h1">AI</span> <span class="gama-text-h4 text-white">&nbspSystem <span class="d-sm-none"><br>&nbsp&nbsp</span>in Education</span>',
    img: 'ai-robot.png',
    text: 'Discover the future of education with our AI-powered learning platform,<br> revolutionizing the way you acquire knowledge and skills.',
    id: 'ai-slide',
    link: '/smart-learning',
  },
  {
    title: '<span class="gama-text-h1">School finder</span>',
    img: 'school-finder.png',
    text: 'Discover the future of education with our AI-powered learning platform,<br> revolutionizing the way you acquire knowledge and skills.',
    id: 'school-finder-slide',
    link: '/school',
  },
  {
    title:
      '<span class="gama-text-h1 font-weight-bold">Question<span class="d-sm-none"><br>&nbsp&nbsp</span> & Answer</span>',
    text: 'Q&A made easy. Connect with classmates and<br> teachers for quick answers to your questions.',
    img: 'a-q.png',
    id: 'aq-slide',
    link: '/search?type=question',
  },
]

// Search section
const searchResults = ref([])
const searchCount = ref('...')
const searchKey = ref('')
const searchCate = ref(null)
const searchLoading = ref(true)
const pageNum = ref(1)
const timer = ref(0)
const searchResultsSection = ref(false)
const allDataLoaded = ref(false)
// End search section

const router = useRouter()
const keywordInput = ref(null)
const searchResult = ref(null)

watch(searchKey, (val) => {
  if (val.trim() === '') {
    searchResultsSection.value = false
  }
  else {
    searchResultsSection.value = true
  }
  pageNum.value = 1
  searchCount.value = '...'
  allDataLoaded.value = false
  searchResults.value = []
  search()
})

const _openAuthDialog = (val) => {
  router.push({ query: { auth_form: val } })
}

const lineSpecifierLoadMoreRef = ref(null)
const checkSearchScroll = () => {
  const targetDiv = lineSpecifierLoadMoreRef.value
  const rect = targetDiv.getBoundingClientRect()
  const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight

  if (isDivInView && !searchLoading.value && !allDataLoaded.value) {
    pageNum.value++
    search()
  }
}

const search = () => {
  searchLoading.value = true
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }

  timer.value = setTimeout(async () => {
    if (searchKey.value && allDataLoaded.value == false) {
      try {
        const params = {
          query: searchKey.value,
          page: pageNum.value,
        }
        const response = await $fetch('/api/v1/search/text', {
          params,
        })
        if (response.data) {
          searchCount.value = response.data.num
          searchResults.value.push(...response.data.list)

          if (response.data.list.length < 20) {
            allDataLoaded.value = true
          }
        }
      }
      catch (error) {
        console.log(error)
      }
      finally {
        searchLoading.value = false
      }
    }
  }, 800)
}

const closeSearch = () => {
  searchResultsSection.value = false
  searchKey.value = ''
  keywordInput.value?.blur()
}

const calcPath = (type) => {
  if (type == 'gama_tests') return 'paper'
  else if (type == 'gama_learnfiles' || type == 'gama_files')
    return 'multimedia'
  else if (type == 'gama_azmoons') return 'exams'
  else if (type == 'gama_questions') return 'qa'
  else if (type == 'gama_dars') return 'tutorial'
  else if (type == 'gama_teachers') return 'teacher'
  else if (type == 'gama_schools') return 'school'
  else if (type == 'gama_live') return 'live'
  else if (type == 'gama_students') return 'student'
}
</script>

<style>
.line-specifier-load-more {
  width: 100%;
  height: 4px;
}
#main-slider {
  height: 25rem !important;
}

#search-result-container {
  display: none;
}

#main-slider .section1 {
  height: 35%;

  .v-container {
    width: 100%;

    .slide-title {
      margin-top: 3rem;
    }

    .slide-img {
      width: 12rem;
      float: right;
    }

    .gama-text-h1 {
      color: #fff;
    }

    .gama-text-h4 {
      color: #fff;
    }

    #slide-register-btn {
      text-transform: none;
      color: #a5a6a7;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 400;
      line-height: 2.4rem;

      .v-icon {
        display: inline-flex !important;
        color: #ffb300 !important;
        font-size: 2.4rem;
        padding-left: 0.8rem;
        margin-top: 0.4rem;
      }
    }
  }
}

#main-slider .section2 {
  height: 80%;
}

#main-slider #school-finder-slide {
  padding-top: 6rem;
  background: linear-gradient(83deg, #465568 0.59%, #86afd7 100%);
  background-repeat: no-repeat;
  height: 21.5rem;
}

#main-slider #school-finder-slide .v-card {
  height: 21.5rem;
  background-color: transparent;
  background-image: url("/images/school-finder.png");
  background-position: right 2.4rem;
  background-size: 15rem 18.1rem;
  background-repeat: no-repeat;
}

#main-slider #ai-slide {
  padding-top: 6rem;
  background: #24292f !important;
  background-repeat: no-repeat;
  background-size: 90%, 10%;
  height: 21.5rem;
}

#main-slider #ai-slide .v-card {
  height: 21.5rem;
  background-color: transparent;
  background-image: url("/images/ai-robot.png");
  background-position: right 2.4rem;
  background-size: 15rem 18.1rem;
  background-repeat: no-repeat;
}

#main-slider #aq-slide {
  padding-top: 6rem;
  height: 21.5rem;
  background: linear-gradient(45deg, #0092a9 0%, #2bddff 100%);
  background-repeat: no-repeat;
}

#main-slider #aq-slide .v-card {
  height: 21.5rem;
  background-size: 15.4rem 13.36rem;
  background-color: transparent;
  background-image: url("/images/a-q.png");
  background-repeat: no-repeat;
  background-position: 95% top;
}

#main-slider .section2 {
  height: 10%;
}

#main-slider .v-carousel__controls {
  position: absolute;
  top: 18.8rem;
}

#main-slider .v-carousel__controls .v-btn--icon {
  background-color: #ebece9;
  height: 0.1rem;
  width: 2.9rem;
  margin-right: 0.05rem !important;
  margin-left: 0.05rem !important;
  border-radius: 0.4rem;
}

#main-slider .v-carousel__controls .v-btn--icon.v-btn--active {
  background-color: #ffb300;
  /* Colour for active one */
}

#main-slider .v-carousel__controls .v-btn--icon:hover {
  background-color: #ffb300;
  /* You might also want to customise the hover effect */
}

#main-slider .v-btn__content .v-icon {
  display: none;
}

@media (min-width: 600px) {
  #main-slider {
    height: 30.8rem !important;
  }

  #main-slider .section1 {
    height: 51%;

    .container {
      width: 100%;

      .slide-img {
        width: 17rem;
        float: right;
      }

      #slide-register-btn {
        margin-top: 3rem;
        text-transform: none;
        color: #a5a6a7;
        font-size: 1.6rem;
        font-style: normal;
        font-weight: 400;
        line-height: 2.4rem;

        .v-icon {
          display: inline-flex !important;
          color: #ffb300 !important;
          font-size: 4.8rem !important;
          margin-top: 0.4rem;
          padding-left: 0.8rem;
        }
      }
    }
  }

  #main-slider #school-finder-slide {
    height: 27rem;
  }

  #main-slider #school-finder-slide .v-card {
    height: 34rem;
    background-position: 98% top;
    background-size: 17.7rem 22.11rem;
  }

  #main-slider #ai-slide {
    height: 27rem;
  }

  #main-slider #ai-slide .v-card {
    height: 34rem;
    background-position: 98% top;
    background-size: 17.7rem 22.11rem;
  }

  #main-slider #aq-slide {
    height: 27rem;
  }

  #main-slider #aq-slide .v-card {
    height: 34rem;
    background-size: 18.4rem 16.36rem;
  }

  #main-slider .v-carousel__controls {
    position: absolute;
    top: 24.2rem;
  }

  #main-slider .v-carousel__controls .v-btn--icon {
    /* Background color of non-active ones */
    height: 0.2rem;
    /* Height you want */
    width: 6.4rem;
    /* Width you want */
  }
}

@media (min-width: 960px) {
  #slider-container {
    position: relative;
    height: 50rem !important;
  }

  #main-slider {
    height: 50rem !important;
  }

  #main-slider .section1 {
    .container {
      width: 100%;
    }
  }

  #main-slider #main-search {
    position: absolute;
    bottom: 8rem;
    width: 78rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    height: 8.2rem;
    border-radius: 9rem;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(7.5px);
  }

  #main-slider #main-search textarea {
    color: #24292f !important;
  }

  #main-slider #main-search #keysearch-cate .v-input {
    background: #fff;
    border-radius: 0.4rem;
    height: 5.2rem !important;
  }

  #main-slider #main-search #main-search-keyword .v-input .v-icon {
    color: rgba(36, 41, 47, 0.3);
    font-size: 2.4rem !important;
  }

  #slider-container #search-result-container {
    display: block;
    position: absolute;
    top: 41.8rem;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 4;
    width: 74rem;
    min-height: 39.7rem;
    height: 39.7rem;
    overflow: hidden;
    border-radius: 2rem;
    background: #fff;
    box-shadow: 0px 9px 46px 8px rgba(0, 0, 0, 0.12),
      0px 24px 38px 3px rgba(0, 0, 0, 0.14),
      0px 11px 15px -7px rgba(0, 0, 0, 0.2);
  }

  #slider-container #search-result-container #search-result {
    max-height: 39.7rem;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    height: 100%;

    #result-stat {
      padding: 1.6rem;
      text-align: right;
      position: sticky;
      background: #fff;
      top: 0;

      .gama-text-button {
        color: #57b947;
        text-align: right;
      }

      .gama-text-overline {
        color: rgba(36, 41, 47, 0.3);
        margin-right: 0.22rem;
      }
    }

    .list-item {
      height: 11.9rem;
      padding: 1.6rem;

      .gama-text-button {
        color: rgba(36, 41, 47, 0.8);
        margin-bottom: 1.7rem;
        white-space: nowrap;
        width: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .avatar {
        width: 4.8rem;
        height: 4.8rem;
        border-radius: 2.6rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
          font-size: 3.2rem;
          color: #ffffff;
        }
      }

      .paper-avatar {
        background: #01c8c8;
      }

      .multimedia-avatar {
        background: #8800b8;
      }

      .exam-avatar {
        background: #7b61ff;
      }

      .qa-avatar {
        background: #ff50a6;
      }

      .tutorial-avatar {
        background: #2a91ff;
      }

      .student-avatar {
        background: #ff9400;
      }

      .teacher-avatar {
        background: #1cb423;
      }

      .school-avatar {
        background: #a15801;
      }

      .live-avatar {
        background: #ff0000;
      }

      .chip-container {
        display: flex;

        .chip {
          height: 3.5rem;
          padding: 0.8rem 1.6rem 0.8rem 1.6rem;
          width: max-content;
          border-radius: 2rem;
          background: rgba(36, 41, 47, 0.05);
          margin-right: 0.8rem;

          color: rgba(36, 41, 47, 0.8);
          font-family: Inter;
          font-size: 1.6rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          max-width: 18.4rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .v-skeleton-loader__list-item-avatar {
        background: transparent;
      }
    }

    .list-item:nth-child(even) {
      background: rgba(36, 41, 47, 0.05);
    }
  }

  #main-slider {
    #main-search {
      .v-text-field > .v-input__control > .v-input__slot:before {
        border-style: none !important;
      }

      .v-text-field > .v-input__control > .v-input__slot:after {
        border-style: none !important;
      }

      .v-input--dense .v-select__slot > input {
        align-self: center;
        margin-top: 1.2rem;
      }

      .v-text-field--filled:not(.v-text-field--single-line) input {
        align-self: center;
        margin-top: 1.2rem;
      }
    }
  }

  #main-slider #main-search #keysearch-cate .v-label {
    color: rgba(0, 0, 0, 0.6);
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 300;
    line-height: 1.8rem;
  }

  #main-slider #main-search #keysearch-cate .v-label.v-label--active {
    color: rgba(0, 0, 0, 0.6) !important;
  }

  #main-slider #main-search .mdi-menu-down::before {
    color: #000 !important;
  }

  #main-slider #main-search #main-search-keyword input {
    caret-color: black;
  }

  #main-slider #main-search #main-search-keyword {
    .v-input {
      border-color: #fff;
      color: transparent !important;

      .v-input__control {
        border-color: transparent;

        .v-input__slot {
          background-color: #fff !important;

          border: transparent;
          border-radius: 3rem 0.4rem 0.4rem 3rem;

          .v-label {
            color: rgba(0, 0, 0, 0.6);
            font-size: 1.4rem;
            font-style: normal;
            font-weight: 300;
            line-height: 1.8rem;
          }

          .v-label.v-label--active {
            color: rgba(0, 0, 0, 0.6) !important;
          }
        }

        .v-input__slot::before {
          border: transparent;
        }
      }
    }
  }

  #main-slider #main-search .v-btn {
    border-radius: 0.4rem 3rem 3rem 0.4rem;
    height: 5.2rem !important;
    width: 5rem !important;
    min-width: 4rem;

    .v-btn__content .v-icon {
      display: block;
    }
  }

  #main-slider .section1 {
    height: 95%;

    .gama-text-h1 {
      color: #fff;
    }

    .slide-title {
      margin-top: 2rem !important;

      .gama-text-h4 {
        font-size: 4.4rem !important;
        font-weight: 700 !important;
      }
    }

    .slide-describe {
      margin-top: 2rem;
      color: #fff;
    }

    .slide-img {
      width: 33rem;
      float: right;
    }

    #read-about-btn {
      background: #ffb600;
      max-width: 16rem;
      margin-top: 2.4rem;

      .v-btn__content {
        color: #24292f !important;
        font-size: 1.6rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2rem;
        letter-spacing: 0.0143rem;
        text-transform: uppercase;
      }
    }
  }

  #main-slider #school-finder-slide {
    padding-top: 6rem;
    background: linear-gradient(83deg, #465568 0.59%, #86afd7 100%);
    background-repeat: no-repeat;
    height: 44rem;
  }

  #main-slider #school-finder-slide .v-card {
    height: 42rem;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: 32.4rem 40.5rem;
    z-index: 1;
  }

  #main-slider #ai-slide {
    padding-top: 6rem;
    background: #24292f !important;
    background-repeat: no-repeat;
    background-size: 90%, 10%;
    height: 44rem;
  }

  #main-slider #ai-slide .v-card {
    height: 42rem;
    background-color: transparent;
    background-image: url("/images/ai-robot.png");
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: 32.4rem 40.5rem;
    z-index: 1;
  }

  #main-slider #aq-slide {
    padding-top: 6rem;
    background: linear-gradient(45deg, #0092a9 0%, #2bddff 100%);
    background-repeat: no-repeat;
    height: 44rem;
  }

  #main-slider #aq-slide .v-card {
    height: 42rem;
    background-color: transparent;
    background-image: url("/images/a-q.png");
    background-repeat: no-repeat;
    background-position: right top;
    background-size: 32.4rem 30.36rem;
  }

  #main-slider .section2 {
    height: 10%;
  }

  #main-slider .v-carousel__controls {
    position: absolute;
    top: 41.18rem;
    /* height: 5rem !important; */
  }

  #main-slider .v-carousel__controls .v-btn--icon {
    background-color: #ebece9;
    /* Background color of non-active ones */
    height: 0.42rem;
    /* Height you want */
    width: 10.3rem;
    margin-right: 0.1rem !important;
    margin-left: 0.1rem !important;
    /* Width you want */
    border-radius: 0.4rem;
    /* Remove default border radius */
  }

  #main-slider .v-carousel__controls .v-btn--icon.v-btn--active {
    background-color: #ffb300;
    /* Colour for active one */
  }

  #main-slider .v-carousel__controls .v-btn--icon:hover {
    background-color: #ffb300;
    /* You might also want to customise the hover effect */
  }

  #main-slider .v-btn__content .v-icon {
    display: none;
  }
}

@media (min-width: 1264px) {
  #main-slider .section1 {
    .container {
      width: 78%;
    }
  }
}
</style>
