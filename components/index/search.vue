<template>
  <v-container>
    <v-row class="mx-0 align-center search-container">
      <v-col
        cols="12"
        md="3"
        sm="12"
        class="search-item"
      >
        <v-autocomplete
          v-model="form.level"
          class="grade-search"
          :items="section_list"
          item-text="title"
          clearable
          item-value="id"
          dense
          outlined
          label="Level"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="12"
        class="search-item"
      >
        <v-autocomplete
          v-model="form.grade"
          class="grade-search"
          :items="grade_list"
          item-text="title"
          item-value="id"
          clearable
          dense
          outlined
          label="Garde"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="12"
        class="search-item"
      >
        <v-autocomplete
          v-model="form.lesson"
          class="grade-search"
          :items="lesson_list"
          item-text="title"
          item-value="id"
          dense
          clearable
          outlined
          label="Lesson"
        />
      </v-col>
      <v-col
        class="d-flex justify-md-start justify-end search-item-button"
        cols="12"
        md="3"
        sm="12"
      >
        <v-btn
          class="search-btn"
          :to="`/search?type=test&section=${form.level}&base=${form.grade}&lesson=${form.lesson}&sortby=best`"
          depressed
        >
          Search
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        level: '',
        grade: '',
        lesson: '',
      },
      section_list: [],
      grade_list: [],
      lesson_list: [],
    }
  },
  watch: {
    'form.level'(val) {
      this.grade_list = []
      this.lesson_list = []
      if (val) this.getTypeList('base', val)
    },
    'form.grade'(val) {
      this.lesson_list = []
      if (val) this.getTypeList('lesson', val)
    },
    'form.lesson'(_val) {
      //
    },
  },
  mounted() {
    this.getTypeList('section')
  },
  methods: {
    getTypeList(type, parent = '') {
      const params = {
        type: type,
      }
      if (type === 'base') params.section_id = parent
      if (type === 'lesson') {
        params.base_id = parent
      }

      this.$fetch
        .$get('/api/v1/types/list', {
          params,
        })
        .then((res) => {
          if (type === 'section') {
            this.section_list = res.data
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
  },
}
</script>
