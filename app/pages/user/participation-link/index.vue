<template>
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
          <span class="text-h4 teal--text">
            <v-icon color="teal">
              mdi-link
            </v-icon>
            Participation link
          </span>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="px-sm-8 px-md-4">
          <v-row>
            <v-col
              cols="6"
              sm="3"
              md="2"
            >
              <v-checkbox
                v-model="participation_type"
                label="Training course"
                color="red"
                value="course"
                hide-details
              />
            </v-col>
            <v-col
              cols="6"
              sm="3"
              md="2"
            >
              <v-checkbox
                v-model="participation_type"
                label="Test album"
                color="red"
                value="album"
                hide-details
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              class="px-0 px-sm-4 px-md-4"
            >
              <v-simple-table class="exams_table">
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left text-h5">
                        #
                      </th>
                      <th
                        class="text-center text-h5"
                        style="min-width: 100px!important;"
                      >
                        Link
                      </th>
                      <th class="text-center text-h5">
                        Title
                      </th>
                      <th class="text-center text-h5">
                        Visit
                      </th>
                      <th class="text-center text-h5">
                        Sales num
                      </th>
                      <th class="text-center text-h5">
                        Last visit
                      </th>
                      <th class="text-center text-h5">
                        Created at
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in participation_list"
                      v-show="participation_list.length>0"
                      :key="item.id"
                    >
                      <td>{{ index+1 }}</td>
                      <td class="text-center">
                        <v-btn
                          icon
                          @click="copyLink(item.link)"
                        >
                          <v-icon>
                            mdi-content-copy
                          </v-icon>
                        </v-btn>

                        <a
                          :href="item.link"
                          target="_blank"
                        >
                          <v-icon>
                            mdi-link-variant
                          </v-icon>
                        </a>
                      </td>
                      <td class="text-center">
                        {{ item.title }}
                      </td>
                      <td class="text-center">
                        {{ item.visits }}
                      </td>
                      <td class="text-center">
                        {{ item.sales_num }}
                      </td>
                      <td class="text-center">
                        {{ item.last_visit }}
                      </td>
                      <td class="text-center">
                        {{ item.created_at }}
                      </td>
                    </tr>
                    <tr v-show="participation_list .length===0">
                      <td colspan="8">
                        <p>Opps! no data found</p>
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
</template>

<script>
export default {
  name: 'ParticipationManage',
  layout: 'dashboard_layout',
  data() {
    return {
      participation_list: [
        {
          link: 'https://gamatrain.com/af-xRt',
          title: '721 Course',
          visits: '8452',
          sales_num: '5',
          last_visit: '2022-05-10 20:22',
          created_at: '2022-01-06 23:11',
        },
      ],
      participation_type: [],
    }
  },
  // async asyncData({params,$axios}) {
  //   const examData=await $axios.$get('/api/v1/exams');
  //   return {examData};
  // },
  head() {
    return {
      title: 'Participation manage',
    }
  },
  mounted() {
  },
  methods: {
    copyLink(link) {
      navigator.clipboard.writeText(link)
      this.$toast.success('Copied')
    },
  },

}
</script>

<style scoped>
p{
  font-size: 1.4rem;
}
</style>
