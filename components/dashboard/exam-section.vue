<template>
  <v-row v-if="userType === 6">
    <v-col
      cols="12"
      class="px-0 px-sm-2"
    >
      <v-card>
        <v-card-title class="text-h4">
          <v-row>
            <v-col cols="6">
              <i class="fa-solid fa-laptop mr-2" />
              Exams
            </v-col>
            <v-col
              cols="6"
              class="text-right"
            >
              <v-btn color="warning">
                See result
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="px-sm-8 px-md-4">
          <v-alert type="warning">
            You have not participated in 10 out of 20 tests
          </v-alert>

          <v-row class="mt-5 d-flex d-md-none">
            <v-col cols="6">
              <p class="text-h5">
                <i class="fa-regular fa-circle-check green--text" />
                Participated
              </p>
            </v-col>
            <v-col cols="6">
              <p class="text-h5">
                <i class="fa-regular fa-times-circle red--text" />
                Not Participated
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              class="px-0 px-sm-4 px-md-4"
            >
              <v-table class="exams_table">
                <thead>
                  <tr>
                    <th class="text-left text-h5">
                      Course name
                    </th>
                    <th class="text-center teal--text text-h5">
                      <i
                        class="fa-regular fa-circle-check fa-xl green--text d-block d-md-none"
                      />
                      <span class="d-none d-md-block"> Participated </span>
                    </th>
                    <th class="text-center orange--text text-h5">
                      <i
                        class="fa-regular fa-times-circle fa-xl red--text d-block d-md-none"
                      />
                      <span class="d-none d-md-block"> Not Participated </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in examData?.lessons || []"
                    :key="item.id"
                  >
                    <td>{{ item.title }}</td>
                    <td class="text-center">
                      {{ item.participated }}
                    </td>
                    <td class="text-center">
                      {{ item.total - item.participated }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr bgcolor="#E5FBF7">
                    <td>Total</td>
                    <td class="text-center">
                      {{ examData?.participated || "" }}
                    </td>
                    <td class="text-center">
                      {{ examData?.total || "" }}
                    </td>
                  </tr>
                </tfoot>
              </v-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const _props = defineProps({
  examData: {
    type: Object,
    default: () => ({}),
  },
})

const { user } = useUser()
const userType = computed(() => user.value?.group_id)
</script>

<style scoped>
.exams_table tbody tr td {
  font-size: 1.2rem !important;
}

.exams_table tfoot tr td {
  font-size: 1.2rem !important;
  font-weight: bolder;
}
</style>
