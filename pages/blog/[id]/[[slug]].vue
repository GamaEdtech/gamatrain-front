<template>
  <v-container
    v-if="error"
    id="blog"
  >
    <v-row>
      <h1 class="gama-text-h3 font-weight-bold">
        Pleas Try Again Later.
      </h1>
    </v-row>
  </v-container>
  <v-container
    v-else
    id="blog"
  >
    <v-row>
      <v-col cols="12">
        <div id="general-data-holder">
          <div id="general-data">
            <h1 class="gama-text-h3 font-weight-bold">
              {{ contentData.title }}
            </h1>
            <v-chip
              :x-small="xs"
              :small="sm"
              :to="`/blog?cat=${contentData.cat}`"
            >
              {{ contentData.cat_title }}
            </v-chip>

            <figure>
              <NuxtImg
                id="blog-img"
                :src="contentData.pic"
                :alt="contentData.title"
                sizes="xs:300,sm:300px,md:600px, 730px"
                placeholder
              />
              <figcaption id="general-data-footer">
                <div id="autor-holder">
                  <NuxtImg
                    width="30px"
                    :src="contentData.avatar"
                    placeholder
                  />
                  <span class="gama-text-overline">{{ contentData.first_name }}
                    {{ contentData.last_name }}</span>
                </div>
                <div id="date-holder">
                  <v-icon
                    class="pr-6"
                    @click="share"
                  >
                    mdi-share-variant
                  </v-icon>
                  <v-icon> mdi-eye </v-icon>
                  <span class="gama-text-overline pr-6">
                    {{ contentData.views }}
                  </span>
                  <v-icon> mdi-calendar-blank-outline </v-icon>
                  <span class="gama-text-overline">
                    {{ $dayjs(contentData.subdate).format("YYYY-MM-DD") }}
                  </span>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div id="blog-body">
          <div
            id="blog-describe"
            v-html="contentData.body"
          />

          <div
            v-if="contentData.tags"
            id="blog-tags"
          >
            <v-btn
              v-for="(item, index) in contentData.tags"
              :key="index"
              :to="`/blog/${contentData.id}/${$slugGenerator(
                contentData.title,
              )}`"
              plain
              :x-small="xs"
              :small="sm"
            >
              #{{ item }}
            </v-btn>
          </div>
          <div id="blog-like-section">
            <p class="gama-text-h6">
              Did you like this article?
            </p>
            <div id="like-area">
              <div class="btn dislike-btn">
                <v-icon> mdi-thumb-down </v-icon>
              </div>
              <div class="btn like-btn">
                <v-icon> mdi-thumb-up </v-icon>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

const { $slugGenerator } = useNuxtApp()
const route = useRoute()
const blogId = route.params.id
const { xs, sm } = useDisplay()
const requestURL = ref(useRequestURL().href)
const { data: contentData, error } = await useAsyncData(
  `blog-${blogId}`,
  () => $fetch(`/api/v1/blogs/${blogId}`),
  {
    transform: (response) => {
      return response.status === 1 ? response.data : []
    },
  },
)

// SEO
useHead({
  title: contentData.value?.title,
  link: [
    {
      rel: 'canonical',
      href: requestURL.value,
    },
  ],
})

const share = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: contentData.value.title,
        text: contentData.value.body,
        url: `https://gamatrain.com/blog/${contentData.value.id}`,
      })
    }
    catch (error) {
      console.error('Error sharing:', error)
    }
  }
  else {
    console.warn('Share API is not supported in this browser')
  }
}
</script>

<style>
#blog {
  margin-top: 64px;
  max-width: 79.4rem !important;

  h2 {
    font-size: 2rem !important;
  }
  h3 {
    font-size: 1.8rem !important;
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e1e2e3;
  }
  h4 {
    font-size: 1.5rem !important;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.4rem !important;
    line-height: 2.5rem !important;
  }
  #general-data-holder {
    padding-bottom: 8.7rem;

    #general-data {
      min-height: 25rem;
      max-height: 25rem;
      flex-shrink: 0;
      padding: 3.2rem 1.2rem 4.2rem 1.2rem;
      border-radius: 1rem;
      background: rgba(167, 177, 194, 0.1);
      position: relative;

      .gama-text-h1 {
        margin-bottom: 0.4rem;
        color: #24292f;
      }

      .v-chip {
        color: #fff;
        float: right;
        margin-bottom: 1rem;
        background: #a7b1c2;
        padding: 0.4rem 1.2rem;
      }
      .v-chip.v-chip--size-default {
        font-size: 14px;
      }

      #blog-img {
        height: auto;
        width: 100%;
        left: 0;
        right: 0;
        margin: auto;
        border-radius: 1rem;
      }
    }
  }

  #general-data-footer {
    padding: 0.8rem 0.2rem 2.9rem 0.2rem;
    width: 100%;
    height: 4.4rem;
    margin-bottom: 3.4rem;

    #autor-holder {
      float: left;
      position: relative;

      .gama-text-overline {
        color: #24292f;
        padding-left: 2.4rem;
      }

      > img {
        position: absolute;
        height: 2rem;
        width: 2rem;
        top: 0.2rem;
        border-radius: 50%;
      }
    }

    #date-holder {
      float: right;
      display: flex;
      align-items: center;

      .v-icon {
        font-size: 1.8rem;
        color: #a7b1c2;
        margin-right: 6px;
        margin-top: 2px;
      }

      .gama-text-overline {
        color: #a7b1c2;
      }
    }
  }

  #blog-describe {
    margin-bottom: 4.8rem !important;
    width: 98%;
    margin: auto auto 8.8rem auto;

    > h2 {
      font-family: Inter;
      font-size: 3rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      margin-top: 2.4rem;
      margin-bottom: 2.4rem;
    }

    > h3 {
      font-family: Inter;
      font-size: 2.8rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    > h4 {
      font-family: Inter;
      font-size: 2.4rem;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
    }

    > h5 {
      font-family: Inter;
      font-size: 2rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    > h6 {
      font-family: Inter;
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    > p {
      color: rgba(36, 41, 47, 0.8);
      font-family: Inter;
      font-size: 1.4rem !important;
      font-style: normal;
      font-weight: 400 !important;
      line-height: 2.4rem;
      margin-bottom: 1rem;
    }

    > ul {
      color: rgba(36, 41, 47, 0.8);
      font-family: Inter;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 400;
      line-height: 2.4rem;
    }
  }

  #blog-describe img {
    border-radius: 2rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    height: auto;
    max-width: 100%;
  }

  #blog-tags {
    text-align: center;
    margin-bottom: 4.8rem;
    .v-btn {
      color: white;
      box-shadow: none;
      .v-btn__content {
        color: #7f8a9c;
        font-family: Inter;
        font-size: 1.2rem;
        font-style: normal;
        font-weight: 800;
        line-height: normal;
        text-transform: none !important;
      }
    }
  }

  #blog-like-section {
    text-align: center;
    margin-bottom: 4.8rem;

    .gama-text-h6 {
      margin-bottom: 2.4rem;
    }

    #like-area {
      width: 7.2rem;
      margin: auto;
      display: flex;

      .btn {
        height: 2.4rem;
        width: 2.4rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .v-icon {
          color: white;
          font-size: 1.2rem;
        }
      }

      .dislike-btn {
        background: #919491;
        margin-right: 1.2rem;
      }

      .like-btn {
        background: #ffb600;
      }
    }
  }
}

@media (min-width: 600px) {
  #blog {
    margin-top: 64px;

    h2 {
      font-size: 3rem !important;
    }
    h3 {
      font-size: 2.5rem !important;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    h4 {
      font-size: 2rem !important;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.7rem !important;
      line-height: 2.5rem !important;
    }
    #general-data-holder {
      padding-bottom: 16rem;

      #general-data {
        min-height: 34rem;
        max-height: 34rem;
        flex-shrink: 0;
        padding: 2.4rem 1.2rem 17.4rem 1.2rem;
        border-radius: 1rem;
        background: rgba(167, 177, 194, 0.1);
        position: relative;

        .gama-text-h1 {
          margin-bottom: 0.4rem;
          color: #24292f;
        }

        .v-chip {
          margin-bottom: 0.8rem;
          padding: 0.8rem 1.6rem;
        }

        #blog-img {
          height: auto;
          width: 100%;
          margin: auto;
          border-radius: 1rem;
        }
      }
    }

    #general-data-footer {
      padding: 0.8rem 0.2rem 2.9rem 0.2rem;

      width: 100%;
      height: 4.4rem;
      margin: auto auto 4.8rem auto;

      #autor-holder {
        float: left;
        position: relative;

        .gama-text-overline {
          color: #24292f;
          padding-left: 2.4rem;
        }

        > img {
          position: absolute;
          height: 2rem;
          width: 2rem;
          top: 0.2rem;
          border-radius: 50%;
        }
      }

      #date-holder {
        float: right;

        .v-icon {
          font-size: 1.8rem;
          color: #a7b1c2;
        }
      }
    }

    #blog-describe {
      margin-bottom: 6.4rem;
      width: 98%;
      display: block;
      margin: auto auto 6.8rem auto;

      > h2 {
        font-family: Inter;
        font-size: 3rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin-top: 2.4rem;
        margin-bottom: 2.4rem;
      }

      > h3 {
        font-family: Inter;
        font-size: 2.8rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      > h4 {
        font-size: 2.6rem;
        font-style: normal;
        font-weight: 800;
        line-height: normal;
      }

      > h5 {
        font-size: 2rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      > h6 {
        font-size: 1.6rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      > p {
        font-size: 1.6rem !important;
        font-style: normal;
        font-weight: 400 !important;
        line-height: 2.4rem;
        margin-bottom: 1rem;
      }

      > ul {
        font-size: 1.6rem;
        font-style: normal;
        font-weight: 400;
        line-height: 2.4rem;
      }
    }

    #blog-describe img {
      border-radius: 2rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      height: auto;
      max-width: 100%;
    }

    #blog-tags {
      margin-bottom: 6.4rem;
      .v-btn {
        color: white;
        .v-btn__content {
          font-size: 1.6rem;
        }
      }
    }

    #blog-like-section {
      text-align: center;
      margin-bottom: 6.4rem;

      .gama-text-h6 {
        margin-bottom: 2.4rem;
      }

      #like-area {
        width: 8.8rem;
        margin: auto;
        display: flex;

        .btn {
          height: 3.2rem;
          width: 3.2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          .v-icon {
            color: white;
            font-size: 1.6rem;
          }
        }

        .dislike-btn {
          background: #919491;
          margin-right: 1.2rem;
        }

        .like-btn {
          background: #ffb600;
        }
      }
    }
  }
}

@media (min-width: 960px) {
  #blog {
    margin-top: 6.4rem;
    #general-data-holder {
      padding-bottom: 18rem;

      #general-data {
        min-height: 44rem;
        max-height: 44rem;
        padding: 4.8rem 1.6rem 4.8rem 1.6rem;

        .gama-text-h1 {
          color: #24292f;
        }

        .v-chip {
          margin-bottom: 0.8rem;
          padding: 0.8rem 1.8rem;
        }

        .gama-text-body1 {
          margin: 2.4rem auto 2.4rem auto;
        }

        .gama-text-subtitle1 {
          color: #a7b1c2;
          width: 100%;
          text-align: right;
          margin-bottom: 1.8rem;
          padding-right: 1.6rem;
        }

        #blog-img {
          width: 100%;
          height: auto;
          bottom: -23rem;
        }
      }
    }

    #general-data-footer {
      padding: 0.8rem 0 2.9rem 0;

      width: 97%;
      margin: auto auto 6.4rem auto;
      height: 4.4rem;

      #autor-holder {
        float: left;

        .gama-text-overline {
          padding-left: 2.8rem;
        }

        > img {
          position: absolute;
          height: 2.4rem;
          width: 2.4rem;
          top: -0.2rem;
          border-radius: 50%;
        }
      }

      #date-holder {
        float: right;
      }
    }

    #blog-describe {
      margin-bottom: 10rem !important;

      > h2 {
        font-size: 4.4rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin-top: 2.4rem;
        margin-bottom: 2.4rem;
      }

      > h3 {
        font-size: 3.6rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      > h4 {
        font-size: 3rem;
        font-style: normal;
        font-weight: 800;
        line-height: normal;
      }

      > h5 {
        font-size: 2.4rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      > h6 {
        font-size: 2rem;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }

      > p {
        font-size: 2rem !important;
        font-style: normal;
        font-weight: 400 !important;
        line-height: 3.2rem;
        margin-bottom: 1rem;
      }

      > ul {
        font-family: Inter;
        font-size: 2rem;
        font-style: normal;
        font-weight: 400;
        line-height: 3.2rem;
      }
    }

    #blog-describe img {
      border-radius: 2rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      height: auto;
      max-width: 100%;
    }

    #blog-tags {
      margin-bottom: 10rem;
      .v-btn {
        .v-btn__content {
          font-size: 1.8rem;
        }
      }
    }

    #blog-like-section {
      text-align: center;
      margin-bottom: 10rem;

      .gama-text-h6 {
        margin-bottom: 4.8rem;
      }

      #like-area {
        width: 12rem;
        margin: auto;
        display: flex;

        .btn {
          height: 4.8rem;
          width: 4.8rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          .v-icon {
            color: white;
          }
        }

        .dislike-btn {
          background: #919491;
          margin-right: 1.2rem;
        }

        .like-btn {
          background: #ffb600;
        }
      }
    }
  }
}

@media (min-width: 1264px) {
  #blog {
    margin-top: 6.4rem;
  }
}
</style>
