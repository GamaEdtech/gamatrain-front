<template>
  <v-container
    v-if="isLoading || slideItems.length > 5"
    id="blog-list-container"
    fluid
    :class="route.path === '/' ? 'bg-blue-grey-lighten-5' : ''"
  >
    <v-container>
      <v-card
        flat
        class="bg-transparent py-4"
      >
        <div class="main-card">
          <v-row>
            <v-col
              cols="6"
              class="px-md-0"
            >
              <h2
                id="main-title "
                class="gama-text-h4"
              >
                Blog
              </h2>
            </v-col>
            <v-col
              cols="6"
              class="text-right"
            >
              <div class="d-none d-md-inline">
                <v-btn
                  variant="outlined"
                  rounded
                  outlined
                  size="large"
                  to="/blog"
                  class="gama-btn"
                >
                  Go to blog
                </v-btn>
              </div>
              <router-link
                to="/blog"
                class="d-flex align-center d-md-none seeAllBtn"
              >
                <span class="content"> See all</span>
                <v-icon>md:chevron_forward</v-icon>
              </router-link>
            </v-col>
            <v-col
              cols="12"
              class="px-md-0"
            >
              <template v-if="isLoading">
                <v-slide-group
                  :mobile="false"
                  class="slider py-sm-4"
                >
                  <v-slide-group-item
                    v-for="(i, index) in 10"
                    :key="index"
                  >
                    <v-skeleton-loader
                      class="mx-auto slide-loading"
                      type="card"
                    />
                  </v-slide-group-item>
                </v-slide-group>
              </template>
              <template v-else>
                <v-slide-group class="slider py-sm-4">
                  <v-slide-group-item
                    v-for="(item, n) in slideItems"
                    :key="item.id || n"
                  >
                    <v-card
                      flat
                      :to="`/blog/${item.id}/${item.slug}`"
                    >
                      <v-card flat>
                        <v-img
                          :src="item.imageUri.replace(/^http:\/\//, 'https://')"
                        />
                        <v-card-title>
                          <span
                            v-if="!isHovered[n]"
                            class="gama-text-button"
                          >
                            {{ item.title }}
                          </span>
                          <div
                            v-else
                            class="text-center"
                          >
                            <v-btn
                              text
                              size="small"
                              color="primary"
                            >
                              read more
                            </v-btn>
                          </div>
                        </v-card-title>
                      </v-card>
                      <div class="gama-text-subtitle2 pl-2">
                        {{ truncateBody(item.summary) }}
                        <nuxt-link
                          :to="`/blog/${item.id}/${item.slug}`"
                          :aria-label="item.slug"
                        >Read more</nuxt-link>
                      </div>
                    </v-card>
                  </v-slide-group-item>
                </v-slide-group>
              </template>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup>
import { useDisplay } from 'vuetify'

// Using Vuetify's breakpoint system
const { sm, xs } = useDisplay()

// Reactive properties
const isHovered = ref([])
const slideItems = ref([])
const isLoading = ref(true)
const route = useRoute()

// Methods
const loadBlog = async () => {
  isLoading.value = true
  try {
    const response = await useApiService.get('/api/v2/blogs/posts/random', {
      Size: 10,
    })

    if (response.data && response.succeeded) {
      slideItems.value = response.data.list
    }
  }
  catch (err) {
    console.error(err)
  }
  finally {
    isLoading.value = false
  }
}

const truncateBody = (text) => {
  let cutLength = 40
  if (sm.value) cutLength = 42
  else if (xs.value) cutLength = 38
  return text.length > cutLength
    ? text.slice(0, cutLength) + '...'
    : text + '...'
}

loadBlog()
</script>

<style scoped>
#blog-list-container {
  margin: 2.4rem auto 0 auto;
  height: 38rem;

  :deep(.v-card-title) {
    -webkit-backdrop-filter: blur(7.5px);
    backdrop-filter: blur(7.5px);
    background: rgba(36, 41, 47, 0.7);
    border-radius: 0 0 6px 6px;
    bottom: 0;
    color: #fff;
    font-family: "Inter";
    height: 4.9rem;
    left: 0;
    margin: 0 auto;
    max-height: 4.9rem;
    padding-bottom: 5rem !important;
    padding-top: 0.6rem !important;
    position: absolute;
    right: 0;
  }

  :deep(.gama-text-button) {
    text-wrap: wrap;
    color: #fff;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  :deep(.v-img__img--contain) {
    object-fit: cover;
  }

  #main-title {
    color: #354053;
  }

  .v-btn {
    .v-btn__content {
      font-family: "Inter";
    }
  }

  .seeAllBtn {
    padding-right: 0;
    float: right;

    :hover {
      background-color: transparent;
    }

    :active {
      background-color: transparent;
    }

    :focus {
      background-color: transparent;
    }

    .content {
      text-transform: none;
      color: #475467;
      font-family: Inter;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
    }

    .v-icon {
      padding-left: 0.4rem;
      font-size: 2.8rem;
      color: #ffb600;
    }
  }

  .slider {
    .slide-loading {
      width: 21.9rem;
      margin-right: 1.6rem !important;
      position: relative;
      border-radius: 0.6rem;
    }

    .v-card {
      width: 21.9rem;
      height: 19.9rem;
      margin-right: 1.6rem;
      position: relative;
      border-radius: 0.6rem;

      .v-card {
        height: 15.9rem;

        .v-card__title {
          border-radius: 0px 0px 6px 6px;
          background: rgba(36, 41, 47, 0.7);
          backdrop-filter: blur(7.5px);
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          font-family: "Inter";
          margin: 0 auto;
          color: #fff;
          padding-top: 0.6rem !important;
          padding-bottom: 0.6rem;
          height: 4.9rem;
          max-height: 4.9rem;

          .gama-text-button {
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    .gama-text-subtitle2 {
      margin-top: 4px;
      max-width: 18.2rem;
      text-align: left;
      color: #6e7781;

      & > a {
        color: #ffb600;
      }
    }
  }
}

@media screen and (min-width: 600px) {
  #blog-list-container {
    height: 37rem;

    .main-card {
      padding-left: 1.3rem !important;
      padding-right: 1.3rem !important;
    }

    .slider {
      .v-card {
        width: 25.6rem;
        height: 23.7rem;
        margin-right: 1.6rem;

        .v-card {
          height: 18.5rem;

          .v-card__title {
            font-size: 1.6rem;
            font-style: normal;
            font-weight: 600;
            line-height: 1.8rem;
            padding-top: 0.8rem !important;
            padding-bottom: 0.8rem;
            line-height: normal;
            height: 5.4rem;
            max-height: 5.4rem;
          }
        }
      }

      .gama-text-subtitle2 {
        max-width: 21.4rem;
      }
    }
  }
}

@media screen and (min-width: 960px) {
  #blog-list-container {
    margin: 7.8rem auto 0 auto;
    height: 40.6rem;

    .main-card {
      padding-left: 1.2rem !important;
      padding-right: 1.2rem !important;
    }

    .slider {
      .v-card {
        width: 26.1rem;
        height: 23.7rem;
        margin-right: 1.6rem;

        .v-card {
          height: 18.5rem;

          .v-card__title {
            line-height: normal;

            .gama-text-button {
              font-size: 1.4rem;
            }
          }
        }
      }

      .gama-text-subtitle2 {
        max-width: 22rem;
      }
    }
  }
}

@media screen and (min-width: 1264px) {
  #blog-list-container {
    .slider {
      .v-card {
        .v-card {
          .v-card__title {
            .gama-text-button {
              font-size: 1.8rem;
            }
          }
        }
      }
    }
  }
}
</style>
