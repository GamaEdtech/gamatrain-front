<template>
  <v-container>
    <div>
      <v-col
        cols="12"
        class="px-0 px-sm-2"
      >
        <v-row>
          <v-col
            cols="12"
            class="pl-5"
          >
            <span class="icon icong-qa text-h3 teal--text" />
            <span class="text-h4 teal--text"> Results </span>
          </v-col>
        </v-row>
        <v-card class="mt-3">
          <v-card-text class="px-sm-8 px-md-4">
            <!-- Filter section -->
            <v-row class="d-none d-md-flex">
              <v-col
                cols="12"
                md="3"
              >
                <v-autocomplete
                  v-model="filter.level"
                  dense
                  clearable
                  :items="level_list"
                  item-text="title"
                  item-value="id"
                  label="Curriculum"
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-autocomplete
                  v-model="filter.grade"
                  dense
                  clearable
                  :items="grade_list"
                  item-value="id"
                  item-text="title"
                  label="Grade"
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-autocomplete
                  v-model="filter.lesson"
                  dense
                  :items="lesson_list"
                  item-value="id"
                  item-text="title"
                  clearable
                  label="Subject"
                  outlined
                />
              </v-col>
            </v-row>
            <!-- End filter section -->

            <v-row>
              <v-col
                cols="12"
                class="px-0 px-sm-4 px-md-4"
              >
                <v-simple-table class="exams_table">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-h5">
                          Title
                        </th>
                        <th class="text-center text-h5">
                          Date
                        </th>
                        <th class="text-center text-h5">
                          Status
                        </th>
                        <th class="text-center text-h5">
                          Report card
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in exam_list"
                        v-show="exam_list.length > 0"
                        :key="item.id"
                      >
                        <td>
                          {{ item.exam_title }}
                        </td>
                        <td class="text-center">
                          {{ item.subdate }}
                        </td>
                        <td
                          class="text-center"
                          :class="
                            item.status == 1 ? 'green--text' : 'red--text'
                          "
                        >
                          {{ item.status == 1 ? "Complete" : "Incomplete" }}
                        </td>
                        <td class="text-center">
                          <nuxt-link
                            v-show="item.status == 1"
                            :to="`/exam/result/${item.id}`"
                          >
                            Report card
                          </nuxt-link>
                          <nuxt-link
                            v-show="item.status != 1"
                            :to="`/exam/start/${item.id}`"
                          >
                            Continue
                          </nuxt-link>
                        </td>
                      </tr>
                      <tr
                        v-show="
                          page_loading === false && exam_list.length === 0
                        "
                      >
                        <td colspan="4">
                          <p>Oops! no data found</p>
                        </td>
                      </tr>
                      <tr v-show="page_loading">
                        <td
                          cols="4"
                          class="text-center"
                        >
                          <v-progress-circular
                            :size="40"
                            :width="4"
                            class="mt-12 mb-12"
                            color="orange"
                            indeterminate
                          />
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'UserExamsResults',
  layout: 'test-maker-layout',
  data() {
    return {
      filter: {
        level: '',
        grade: '',
        lesson: '',
      },

      level_list: [],
      grade_list: [],
      field_list: [],
      lesson_list: [],
      exam_list: [],

      page_loading: false,
      page: 1,
      all_files_loaded: false,
    }
  },
  head() {
    return {
      title: 'Results',
    }
  },
  watch: {
    'filter.level'(val) {
      this.filter.grade = ''
      this.filter.lesson = ''
      if (val) this.getTypeList('base', val)

      this.page = 1
      this.all_files_loaded = false
      this.exam_list = []
      this.getExams()
    },
    'filter.grade'(val) {
      this.filter.lesson = ''
      if (val) this.getTypeList('lesson', val)

      this.page = 1
      this.all_files_loaded = false
      this.exam_list = []
      this.getExams()
    },
    'filter.lesson'(_val) {
      this.page = 1
      this.all_files_loaded = false
      this.exam_list = []
      this.getExams()
    },
  },
  mounted() {
    this.getTypeList('section')
    this.getExams()
    this.scroll()
  },
  methods: {
    getTypeList(type, _val) {
      const params = {
        type: type,
      }
      if (type === 'base') params.section_id = _val
      if (type === 'lesson') {
        params.base_id = _val
      }

      this.$fetch
        .$get('/api/v1/types/list', {
          params,
        })
        .then((res) => {
          const _data = {}
          if (type === 'section') {
            this.level_list = res.data
          }
          else if (type === 'base') {
            this.grade_list = res.data
          }
          else if (type === 'lesson') {
            this.lesson_list = res.data
          }
        })
        .catch((err) => {
          this.$toast.error(err)
        })
    },
    getExams() {
      if (!this.all_files_loaded) {
        this.page_loading = true
        this.$fetch
          .$get('/api/v1/exams/results', {
            params: {
              perpage: 20,
              page: this.page,
              section: this.filter.level,
              base: this.filter.grade,
              lesson: this.filter.lesson,
            },
          })
          .then((response) => {
            this.exam_list.push(...response.data.list)

            if (response.data.list.length === 0)
              // For terminate auto load request
              this.all_files_loaded = true
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.page_loading = false
          })
      }
    },
    showStatus(id) {
      if (id === '6') return 'Under construction'
      else if (id === '7') return 'Published'
    },
    scroll() {
      // For infinite loading
      window.onscroll = () => {
        // Scroll position
        const scrollPosition
          = Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop,
          )
          + window.innerHeight
          + 50
        const bottomOfWindow
          = scrollPosition >= document.documentElement.offsetHeight

        // Avoid the number of requests
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }

        // Load next page
        if (bottomOfWindow && this.all_files_loaded === false) {
          this.page_loading = true
          this.timer = setTimeout(() => {
            this.page++
            this.getExams()
          }, 800)
        }
      }
    },
  },
}
</script>

<style scoped>
p {
  font-size: 1.4rem;
}
</style>
