<template>
  <!-- Start : Sample Test -->
  <!-- <section class="sample">
    <v-container class="pb-md-16 pb-5">
      <div class="d-flex flex-column align-center my-6">
        <div class="sample-titles d-flex align-center">
          <i class="icon icong-test title-icon d-flex algn-center"></i>
          <div class="sample-title mx-3">
            <p class="s-title">Related Past Papers</p>
            <p class="s-subtitle">Check out the Past Papers</p>
          </div>
        </div>
        <div class="sample-slider mt-10">
          <v-sheet class="mx-auto sample-width">
            <v-slide-group multiple show-arrows>
              <v-slide-item v-for="(item, index) in relatedItms" :key="index">
                <nuxt-link :to="`/paper/${item.id}/${item.title_url}`">
                  <div class="book-sample pa-4 mx-2">
                    <div class="py-4 img-holder">
                      <div class="item-img">
                        <v-img
                          v-if="item.lesson_pic"
                          :src="item.lesson_pic"
                          :alt="item.lesson_title"
                          class="item-image"
                        >
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0"
                              align="center"
                              justify="center"
                            >
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                        <v-card
                          v-else
                          class="book-no-img mx-autofill-height align-center justify-center"
                        >
                          <p class="font-weight-bold mb-2">
                            {{ item.lesson_title }}
                          </p>
                          <a href="https://gamatrain.com">Gamatrain.com</a>
                        </v-card>
                      </div>
                    </div>
                    <div class="sample-text">
                      <p>
                        {{
                          item.description.length > 50
                            ? `${item.description.substring(0, 50)}...`
                            : item.description
                        }}
                      </p>
                    </div>
                    <div
                      class="sbook-footer d-flex justify-space-between align-center mt-4"
                    >
                      <div class="d-flex align-center">
                        <img
                          :src="item.avatar"
                          width="30"
                          :alt="`${item.first_name} ${item.last_name}`"
                        />
                        <p class="sfooter-name mx-2">
                          {{ `${item.first_name} ${item.last_name}` }}
                        </p>
                      </div>
                      <div class="mb-0 sfooter-link">Past Papers</div>
                    </div>
                  </div>
                </nuxt-link>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </div>
      </div>
    </v-container>
  </section> -->

  <section>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <h4 class="section-title gama-text-h5 mb-4">
            Releated questions
          </h4>
          <div v-if="loading">
            <v-row
              v-for="i in 3"
              :key="i"
              class="latest-card"
            >
              <v-col cols="12">
                <v-skeleton-loader type="list-item-avatar" />
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <div v-if="relatedQuestion.length">
              <v-card
                v-for="item in relatedQuestion"
                :key="item.id"
                class="latest-card"
                flat
              >
                <v-row>
                  <v-col cols="1">
                    <v-avatar
                      class="my-3"
                      size="32"
                      rounded="0"
                    >
                      <v-img :src="item.avatar" />
                    </v-avatar>
                  </v-col>
                  <v-col cols="11">
                    <v-card-title>
                      <nuxt-link
                        class="gama-text-caption"
                        :to="`/qa/${item.id}/${item.title_url}`"
                      >
                        <span v-html="item.title" />
                      </nuxt-link>
                    </v-card-title>

                    <v-card-subtitle>
                      <v-row>
                        <v-col
                          cols="8"
                          class="owner-container gama-text-overline"
                        >
                          By:
                          {{ `${item.first_name} ${item.last_name}` }}
                        </v-col>
                        <v-col
                          cols="4"
                          class="subdate-container gama-text-overline"
                        >
                          <v-icon size="12">
                            mdi-calendar
                          </v-icon>
                          {{ $dayjs(item.subdate).format("MMM DD") }}
                        </v-col>
                      </v-row>
                    </v-card-subtitle>
                  </v-col>
                </v-row>
              </v-card>
            </div>
            <div v-else>
              Not found any related questions
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <h4 class="section-title gama-text-h5 mb-4">
            Related Past Papers
          </h4>
          <div v-if="loading">
            <v-row
              v-for="i in 3"
              :key="i"
              class="latest-card"
            >
              <v-col cols="12">
                <v-skeleton-loader type="list-item-avatar" />
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <div v-if="relatedPapers.length">
              <v-card
                v-for="item in relatedPapers"
                :key="item.id"
                class="latest-card"
                flat
              >
                <v-row>
                  <v-col cols="1">
                    <v-avatar
                      class="my-3"
                      size="32"
                      rounded="0"
                    >
                      <v-img :src="item.avatar" />
                    </v-avatar>
                  </v-col>
                  <v-col cols="11">
                    <v-card-title>
                      <nuxt-link
                        class="gama-text-caption"
                        :to="`/paper/${item.id}/${item.title_url}`"
                      >
                        <span v-html="item.title" />
                      </nuxt-link>
                    </v-card-title>

                    <v-card-subtitle>
                      <v-row>
                        <v-col
                          cols="8"
                          class="owner-container gama-text-overline"
                        >
                          By:
                          {{ `${item.first_name} ${item.last_name}` }}
                        </v-col>
                        <v-col
                          cols="4"
                          class="subdate-container gama-text-overline"
                        >
                          <v-icon size="12">
                            mdi-calendar
                          </v-icon>
                          {{ $dayjs(item.subdate).format("MMM DD") }}
                        </v-col>
                      </v-row>
                    </v-card-subtitle>
                  </v-col>
                </v-row>
              </v-card>
            </div>
            <div v-else>
              Not found any related past papers
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <!-- End : Sample test -->
</template>

<script>
export default {
  name: 'RelatedContent',
  props: {
    testType: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      relatedQuestion: [],
      relatedPapers: [],
      loading: true,
    }
  },
  mounted() {
    this.getContentList('test', 6)
    this.getContentList('question', 5)
  },
  methods: {
    async getContentList(type, perpage) {
      this.loading = true
      const params = {
        type,
        page: 1,
        perpage,
        sortby: 'subdateasc',
        section: this.board,
        base: this.grade,
        lesson: this.subject,
        test_type: this.test_type,
      }

      await this.$fetch
        .$get('/api/v1/search', {
          params: params,
        })
        .then((response) => {
          const findIndex = response.data.list.findIndex(
            x => x.id == this.$route.params.id,
          )
          if (findIndex > -1) response.data.list.splice(findIndex, 1)
          if (type === 'question')
            this.relatedQuestion.push(...response.data.list)

          if (type === 'test') this.relatedPapers.push(...response.data.list)
        })
        .catch((_err) => {})
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped></style>
