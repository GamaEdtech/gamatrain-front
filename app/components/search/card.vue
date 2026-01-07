<template>
  <div
    class="w-100 card-search rounded-lg px-2 py-4 d-flex flex-wrap ga-3 align-center justify-start position-relative"
  >
    <Nuxt-link
      :to="createLinkCard(information)"
    >
      <div class="w-100 h-100 ">
        <div class="d-flex ga-3 align-stretch justify-start">
          <div
            class="img-div rounded-ts-lg rounded-bs-lg d-flex align-center justify-center ga-3 flex-column"
          >
            <!-- <NuxtImg
          v-if="information.lesson_pic"
          :alt="information?.title"
          width="100px"
          :src="information.lesson_pic"
          placeholder
          class="w-100 h-100 rounded-ts-lg rounded-bs-lg"
        /> -->
            <v-img
              v-if="information.lesson_pic"
              :alt="information?.title"
              width="100px"
              cover
              :src="information.lesson_pic"
              class="w-100 h-100 rounded-ts-lg rounded-bs-lg"
            />
            <template v-else>
              <p class="text-subtitle-1 font-weight-bold text-center">
                {{ information.lesson_title }}
              </p>
              <a
                class="text-subtitle-2"
                href="https://gamatrain.com text-center"
              >Gamatrain.com</a>
            </template>
          </div>
          <div
            class="content-card d-flex flex-column ga-2 align-start justify-center justify-sm-space-between"
          >
            <h2
              class="text-h5 text-sm-h4 text-black font-weight-medium"
            >
              {{ information?.title }}
            </h2>
            <div class="d-flex align-center justify-start flex-wrap ga-3">
              <v-chip
                v-if="information.section_title"
                variant="flat"
                class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
                color="grey100"
                :to="`/search?type=${
                  route.query.type ? route.query.type : `paper`
                }&section=${information.section}`"
              >
                <span class="text-grey500">{{ information?.section_title }}</span>
              </v-chip>
              <v-chip
                v-if="information.base_title"
                variant="flat"
                class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
                color="grey100"
                :to="`/search?type=${
                  route.query.type ? route.query.type : `paper`
                }&section=${information.section}&base=${information.base}`"
              >
                <span class="text-grey500">{{ information?.base_title }}</span>
              </v-chip>
              <v-chip
                v-if="information.lesson_title"
                variant="flat"
                class="text-subtitle-1 text-sm-h5 pl-5 pr-5"
                color="grey100"
                :to="`/search?type=${
                  route.query.type ? route.query.type : `paper`
                }&section=${information.section}&base=${information.base}&lesson=${
                  information.lesson
                }`"
              >
                <span class="text-grey500">{{ information.lesson_title }}</span>
              </v-chip>
            </div>
            <div
              class="d-none d-sm-flex align-center justify-space-between container-extra-info"
            >
              <span
                v-if="information.ext && route.query.type == `learnfiles`"
                class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
              >
                <v-icon color="grey300">md:sticky_note_outlined</v-icon>
                {{ information.ext }}
              </span>
              <span
                v-if="information.test_type_title"
                class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
              >
                <v-icon color="grey300">md:folder_outlined</v-icon>
                {{ information.test_type_title }}
              </span>
              <span
                v-if="information.tests_num && route.query.type == `azmoon`"
                class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
              >
                <v-icon color="grey300">md:list</v-icon>
                {{ information.tests_num }}
              </span>

              <span
                v-if="information.views"
                class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
              >
                <v-icon color="grey300">md:visibility_outlined</v-icon>
                {{ information.views }}
              </span>

              <span
                v-if="information.reply_num && route.query.type == `question`"
                class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
              >
                <v-icon color="grey300">md:reply</v-icon>
                {{ information.reply_num }}
              </span>

              <span
                class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
              >
                <v-icon color="grey300">md:calendar_month_outlined</v-icon>
                {{ new Date(information.subdate).toLocaleDateString() }}
              </span>

              <div class="d-flex align-center ga-1">
                <v-icon
                  v-if="information.q_file"
                  color="lightError"
                  :to="`/paper/${information.id}/${information.title_url}`"
                >
                  md:picture_as_pdf
                </v-icon>
                <v-icon
                  v-if="information.q_file_word"
                  color="info"
                >
                  md:text_snippet
                </v-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex d-sm-none align-center justify-space-between w-100 mt-2">
          <span
            v-if="information.ext && route.query.type == `learnfiles`"
            class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="grey300">md:sticky_note_outlined</v-icon>
            {{ information.ext }}
          </span>
          <span
            v-if="information.test_type_title"
            class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="grey300">md:folder_outlined</v-icon>
            {{ information.test_type_title }}
          </span>

          <span
            v-if="information.tests_num && route.query.type == `azmoon`"
            class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="grey300">md:list</v-icon>
            {{ information.tests_num }}
          </span>
          <span
            v-if="information.views"
            class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="grey300">md:visibility_outlined</v-icon>
            {{ information.views }}
          </span>
          <span
            v-if="information.reply_num && route.query.type == `question`"
            class="text-grey500 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="grey300">md:reply</v-icon>
            {{ information.reply_num }}
          </span>
          <span class="text-grey500 text-subtitle-1 d-flex align-start ga-1">
            <v-icon color="grey300">md:calendar_month_outlined</v-icon>
            {{ new Date(information.subdate).toLocaleDateString() }}
          </span>

          <div class="d-flex align-center ga-1">
            <v-icon
              v-show="information.q_file"
              color="lightError"
            >
              md:picture_as_pdf
            </v-icon>
            <v-icon
              v-show="information.q_file_word"
              color="info"
            >
              md:text_snippet
            </v-icon>
          </div>
        </div>
      </div>
    </Nuxt-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps({
  information: {
    type: Object,
  },
})

const getEquivalentOldType = (type) => {
  switch (type) {
    case 'paper':
      return 'test'
    case 'multimedia':
      return 'learnfiles'
    case 'quizhub':
      return 'azmoon'
    case 'forum':
      return 'question'
    case 'tutorial':
      return 'dars'
    case 'test':
      return 'test'
    case 'learnfiles':
      return 'learnfiles'
    case 'azmoon':
      return 'azmoon'
    case 'question':
      return 'question'
    case 'dars':
      return 'dars'
    default:
      return 'test'
  }
}

const createLinkCard = (information) => {
  let idType = ''
  switch (getEquivalentOldType(route.query.type)) {
    case 'test':
      idType = 'paper'
      break
    case 'question':
      idType = 'qa'
      break
    case 'dars':
      idType = 'tutorial'
      break

    case 'azmoon':
      idType = 'exam'
      break
    case 'learnfiles':
      idType = 'multimedia'
      break
    default:
      idType = 'paper'
      break
  }
  return `/${idType}/${information.id}/${information.title_url}`
}
</script>

<style scoped>
.card-search {
  border: 1px solid rgb(var(--v-theme-grey200));
  min-height: 120px;
  max-width: 1200px;
}
.img-div {
  min-width: 100px;
  max-width: 100px;
  height: 120px;
  background-color: #f9f3f3;
}
.container-extra-info {
  width: 400px;
}
</style>
