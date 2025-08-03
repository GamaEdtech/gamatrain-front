<template>
  <v-container>
    <div id="school-list">
      <h1>لیست مدارس</h1>
      <v-divider />
      <v-row class="mt-3">
        <v-col cols="4">
          <v-text-field
            v-model="region"
            label="ناحیه"
            class="mx-4"
            :loading="table_loading"
            @keyup="searchData()"
          />
        </v-col>
      </v-row>

      <v-simple-table>
        <thead>
          <tr>
            <th>استان</th>
            <th>ناحیه</th>
            <th>استیج</th>
            <th>نام مدرسه</th>
            <th>نام مدرسه ثانویه</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="table_loading"
            class="mt-12 mb-12"
          >
            <td
              colspan="3"
              class="text-center"
            >
              <v-progress-circular
                :size="40"
                class="my-10"
                :width="3"
                color="orange"
                indeterminate
              />
            </td>
          </tr>
          <tr
            v-for="(school, index) in school_list"
            v-else
            :key="index"
          >
            <td>
              {{ school.stateTitle }}
            </td>
            <td>
              {{ school.regionTitle }}
            </td>
            <td>
              {{ school.stageTitle }}
            </td>
            <td>
              {{ school.schoolTitle }}
            </td>
            <td>
              {{ school.schoolTitle2 }}
            </td>
            <td>
              <v-btn
                icon
                :to="'/school-list/edit/' + school.Id"
              >
                <v-icon
                  small
                  class="mr-2"
                >
                  mdi-pencil
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-dialog
        v-model="deleteConfirmDialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            Are you sure?
          </v-card-title>

          <v-card-text> Click AGREE if you are sure </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              text
              @click="deleteConfirmDialog = false"
            >
              Disagree
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              :loading="delete_loading"
              @click="deletePage()"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div
        v-if="total_page > 1"
        class="text-center"
      >
        <v-pagination
          v-model="page"
          circle
          :length="total_page"
          total-visible="7"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'SchoolMange',
  layout: 'admin',
  data() {
    return {
      total_page: 0,
      page: 1,
      table_loading: false,

      deleteConfirmDialog: false,
      delete_loading: false,
      delete_item: null,

      school_list: {},
      region: '',
      timer: 0,
    }
  },
  head() {
    return {
      title: 'لیست مدارس',
    }
  },
  watch: {
    page(_val) {
      this.school_list = []
      this.getList()
    },
  },
  mounted() {
    this.getList()
  },
  methods: {
    searchData() {
      this.table_loading = true
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      this.timer = setTimeout(() => {
        this.getList()
      }, 1000)
    },
    getList() {
      this.table_loading = true
      this.$fetch
        .$get('/test_api/school_list', {
          params: {
            page: this.page,
            region: this.region,
          },
        })
        .then((response) => {
          this.school_list = response.data
          this.total_page = Math.ceil(response.total / response.per_page)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally((_msg) => {
          this.table_loading = false
        })
    },
  },
}
</script>

<style scoped>
#school-list {
  direction: rtl;
}
</style>
