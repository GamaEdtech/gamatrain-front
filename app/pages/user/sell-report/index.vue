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
              mdi-chart-line
            </v-icon>
            Sell Report
          </span>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="px-sm-8 px-md-4">
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
                      <th class="text-center text-h5">
                        Amount
                      </th>
                      <th class="text-center text-h5">
                        Reason
                      </th>
                      <th class="text-center text-h5">
                        Transaction code
                      </th>
                      <th class="text-center text-h5">
                        Status
                      </th>
                      <th class="text-center text-h5">
                        Transaction Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in payment_list"
                      v-show="payment_list.length>0"
                      :key="item.id"
                    >
                      <td />
                      <td class="text-center" />
                      <td class="text-center" />
                      <td class="text-center" />
                      <td class="text-center" />
                      <td class="text-center" />
                    </tr>
                    <tr v-show="payment_list.length===0">
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
  name: 'UserPaymentManage',
  layout: 'dashboard_layout',
  data() {
    return {
      payment_list: [],
    }
  },
  head() {
    return {
      title: 'Q & A manage',
    }
  },
  mounted() {
  },

}
</script>

<style scoped>
p{
  font-size: 1.4rem;
}
</style>
