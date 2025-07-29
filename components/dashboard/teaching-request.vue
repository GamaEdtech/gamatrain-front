<template>
  <v-col
    cols="12"
    class="px-0 px-md-4"
  >
    <v-card>
      <v-card-text class="px-0 px-sm-6 px-md-4">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-row>
              <v-col
                cols="12"
                class="d-flex"
              >
                <v-btn
                  class="d-flex"
                  outlined
                  fab
                  small
                >
                  <v-icon>
                    mdi-account-outline
                  </v-icon>
                </v-btn>
                <div class="ml-2">
                  <p class="text-h5 ">
                    <strong>
                      Nasrin javadi
                    </strong>
                  </p>
                  <p class="text-h6">
                    Teaching request from nasrin javadi
                  </p>
                </div>
              </v-col>
              <v-col
                cols="6"
                class="teaching-request-details"
              >
                <i class="fa-regular fa-clock teal--text" />
                <span>
                  Tuesday, 18:00
                </span>
              </v-col>
              <v-col
                cols="6"
                class="teaching-request-details"
              >
                <i class="fa-solid fa-book-open teal--text" />
                <span>
                  Lesson: math
                </span>
              </v-col>
              <v-col
                cols="6"
                md="6"
              >
                <v-btn
                  color="#E2CA31"
                  block
                >
                  Ok
                </v-btn>
              </v-col>
              <v-col
                cols="6"
                md="6"
              >
                <v-btn
                  color="#00D2AE"
                  block
                >
                  Send message
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="text-right px-6 px-sm-3 pt-0 pt-md-4"
          >
            <v-btn
              :width="$vuetify.breakpoint.smAndDown ? '' : '200'"
              :block="$vuetify.breakpoint.smAndDown"
              outlined
            >
              <i class="fa-solid  fa-exclamation-circle red--text mr-3" />
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'TeachingRequest',
}
</script>

<style scoped>

</style>
