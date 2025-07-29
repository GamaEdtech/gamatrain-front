<template>
  <v-container
    fluid
    class="px-0 py-0 mt-md-0"
  >
    <home-main-slider />

    <lazy-home-grade-explorer />

    <home-level-guid-banner :slide-arr="slideArr" />

    <!-- Ai learn banner -->
    <v-container>
      <v-row>
        <v-col
          id="ai-learn-banner"
          cols="12"
        >
          <img
            id="img-top"
            alt="AI Learn"
            src="/images/ai-learn-bg1.png"
          >
          <v-card
            flat
            class="overflow-unset"
          >
            <h2 class="gama-text-h2">
              AI Learn
            </h2>
            <p class="gama-text-subtitle1">
              Discover Your Full Potential with AI-based Education
            </p>
            <v-btn
              :large="display.mdAndUp"
              :small="display.xs"
              to="/smart-learning"
              rounded
              class="primary gama-btn"
            >
              Read about it
            </v-btn>
            <img
              id="img-bottom"
              alt="AI Learn"
              src="/images/ai-learn-bg2.png"
            >
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- End ai learn banner -->

    <!-- Sudent help banner -->
    <v-container
      id="student-help-container"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <h2 class="gama-text-h4">
              Study Smarter, Not Harder
            </h2>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-card
              class="fill-height float-sm-right"
              to="/search?type=test"
            >
              <v-card-title class="gama-text-h6 pt-4 pb-3">
                <v-icon
                  size="48"
                  class="text-primary icon mr-2"
                >
                  mdi-cloud-download
                </v-icon>
                <span class="text-white">Educational Content</span>
              </v-card-title>
              <v-card-text class="gama-text-body2">
                <span class="text-white">Empower Your Studies. Download Worksheets and Educational
                  Materials.</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-card
              class="fill-height float-sm-left"
              to="/search?type=azmoon"
            >
              <v-card-title class="gama-text-h6 pt-4 pb-3">
                <v-icon
                  size="48"
                  class="text-primary icon icon-exam"
                />
                <span class="text-white">&nbsp; Exam</span>
              </v-card-title>
              <v-card-text class="gama-text-body2 text-white">
                You can test yourself with online tests and increase your
                preparation.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- School service banner -->
    <v-container id="school-service-container">
      <v-row>
        <v-col
          cols="12"
          sm="4"
        >
          <v-img
            width="246"
            height="184"
            class="mx-auto"
            src="/images/school-service.png"
          />
        </v-col>
        <v-col
          cols="12"
          sm="8"
        >
          <h2 class="gama-text-h4">
            Search Nearby Schools by Location, Ratings & Reviews
          </h2>
          <p class="gama-text-body1 describe">
            Stop searching blindly. With GamaTrain, discovering the best schools
            near you is just a few clicks away. Filter by location, ratings,
            reviews, and facilities – and let us do the rest.
          </p>

          <v-btn
            :size="display.mdAndUp ? 'large' : 'small'"
            rounded
            class="primary gama-btn"
            to="/school"
          >
            School finder
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <!-- End school service banner -->

    <!-- Car Race container -->
    <home-car-race-banner />
    <!-- End Car Race container -->

    <!-- Stats container -->
    <home-stats-banner />
    <!-- End stats container -->

    <!-- Blog container -->
    <home-blog-container />
    <!-- End blog container -->

    <!-- Earn money banner -->
    <v-container
      id="earn-money-container"
      fluid
    >
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="12"
            class="text-md-right"
          >
            <h2 class="gama-text-h6 text-center">
              Monetize Your Teaching Skills
            </h2>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="12"
            class="text-center"
          >
            <v-btn
              rounded
              :size="display.mdAndUp ? 'large' : 'small'"
              to="/earn-money"
              class="primary gama-btn"
            >
              Earn money
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <!-- End earn money banner -->
  </v-container>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'

const display = useDisplay()
// Data
const _test_schools = ref('')
const _less = ref(true)
const _showLess = ref(true)

const _items = ref([
  {
    src: 'banner_home_2.jpg',
  },
  {
    src: 'banner_home_2.jpg',
  },
])

const slideArr = ref([
  {
    img: 'guid-banner1.svg',
    caption: 'Sign Up',
    describe: 'Register and Create Your Content Creator Profile',
  },
  {
    img: 'guid-banner2.png',
    caption: 'Upload Your Content',
    describe: 'Share Your Lesson Plans, Study Guides, and More.',
  },
  {
    img: 'guid-banner3.svg',
    caption: 'Reach Students',
    describe: 'Gain Exposure through Our Platform and Network.',
  },
  {
    img: 'guid-banner4.svg',
    caption: 'Earn Big',
    describe: 'Reap the Rewards as Students Purchase Your Content.',
  },
])

const _slideColor = computed(() => {
  if (colors.value && carousel_model.value) {
    return colors.value[carousel_model.value]
  }
  return '#24292F' // Default color if colors or carousel_model are not available
})

// Lifecycle Hook (onMounted)

// head() {
//   return {
//     titleTemplate: "%s",
//     title:
//       "GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education",
//     meta: [
//       {
//         hid: "description",
//         name: "description",
//         content:
//           "Discover GamaTrain, an innovative K12 learning platform transforming education with AI-powered instruction, a vibrant community, and personalized learning experiences.",
//       },
//       {
//         hid: "apple-mobile-web-app-title",
//         name: "apple-mobile-web-app-title",
//         content:
//           "GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education",
//       },
//       {
//         hid: "og:title",
//         name: "og:title",
//         content:
//           "GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education",
//       },
//       {
//         hid: "og:site_name",
//         name: "og:site_name",
//         content: "GamaTrain",
//       },
//     ],
//   };
// },
</script>

<style>
/*Home page banner control background*/
.index-banner .v-window__prev,
.v-window__next {
  background: none !important;
}

.v-select__slot {
  /* border: transparent; */
  padding-left: 0;
  padding-right: 0;
}

.theme--dark.v-input input,
.theme--dark.v-input textarea {
  color: #000 !important;
}

#ai-learn-banner {
  position: relative;
  max-width: 73rem;
  margin: 0 auto 0 auto;

  .v-card {
    border-radius: 1rem;
    background-color: #24292f;
    color: #ffffff;
    text-align: center;
    margin: 100px auto 100px auto;
    padding: 2.4rem 0 2.4rem 0;
    position: relative;
    height: 17rem;

    .gama-text-h2 {
      color: #fff;
      text-align: center;
      margin-bottom: 1.6rem;
    }

    .gama-text-subtitle1 {
      color: #fff;
      width: 28.8rem;
      margin: auto;
    }

    #img-bottom {
      position: absolute;
      top: 12.5rem;
      width: 9.7rem;
      height: 11.1rem;
      flex-shrink: 0;
      left: 0;
    }

    .gama-btn {
      margin-top: 1.5rem;
      color: #24292f;
    }
  }

  #img-top {
    position: absolute;
    top: 6.45rem;
    height: auto;
    left: 0;
    right: 0;
    z-index: 1;
    width: 7.7333rem;
    height: 6.4rem;
    margin: 0 auto;
  }
}

#student-help-container {
  padding-top: 2.4rem;
  padding-bottom: 2.4rem;
  background: #ffb600;

  .gama-text-h4 {
    color: #24292f;
    text-align: center;
  }

  .v-card {
    border-radius: 1rem;
    background: rgba(36, 41, 47, 0.7);
    backdrop-filter: blur(0.46875rem);
    color: white;
    max-width: 35.3rem;
    min-height: 10.4rem;
    margin: auto;

    .v-card__title {
      color: #fff;
      padding-bottom: 0.8rem;

      .icon {
        font-size: 2.4rem;
        color: #ffb600;
      }
    }

    .v-card__text {
      color: #fff;
    }
  }
}

#school-service-container {
  margin: 10rem auto 10rem auto;
  text-align: center;

  .gama-text-h4 {
    color: #354053;
    margin-bottom: 2.4rem;
  }

  .gama-text-body1 {
    color: #6e7781;
    text-align: left;
  }

  .gama-btn {
    margin-top: 2.4rem;
  }
}

#earn-money-container {
  padding: 6.8rem 0 6.8rem 0;
  background: #24292f;

  .v-btn {
    .v-btn__content {
      font-family: "Inter";
      color: #24292f;
    }
  }

  .gama-text-h6 {
    color: #f3f3fb;
  }
}

@media (min-width: 600px) {
  #school-service-container {
    margin: 10rem auto 10rem auto;
    text-align: left;

    .gama-text-h4 {
      color: #354053;
      margin-bottom: 2.4rem;
    }

    .gama-text-body1 {
      color: #6e7781;
    }

    .v-btn {
      margin-top: 2rem;
    }
  }

  #ai-learn-banner {
    .v-card {
      padding: 4.8rem 0 4.8rem 0;
      height: 21.5rem;

      .gama-text-h2 {
        color: #fff;
        text-align: center;
        margin-bottom: 1.6rem;
      }

      .gama-text-subtitle1 {
        width: 40rem;
      }

      #img-bottom {
        top: 13.8rem;
        width: 12.8908rem;
        height: 16.3rem;
      }

      .gama-btn {
        margin-top: 2.4rem;
        color: #24292f;
      }
    }

    #img-top {
      top: 4.55rem;
      width: 10.9367rem;
      height: 9rem;
    }
  }

  #student-help-container {
    padding-top: 3.6rem;
    padding-bottom: 3.6rem;

    .v-card {
      min-height: 14.2rem;
      margin: auto;

      .v-card__title {
        .icon {
          font-size: 4.8rem;
        }
      }
    }
  }
}

@media (min-width: 960px) {
  #ai-learn-banner {
    margin: 8rem auto 8rem auto;

    .v-card {
      padding: 3.4rem 0 4.8rem 0;
      height: 21.5rem;

      .gama-text-h2 {
        color: #fff;
        text-align: center;
        margin-bottom: 1.6rem;
      }

      .gama-text-subtitle1 {
        width: 50rem;
      }

      #img-bottom {
        top: 13.8rem;
        width: 15.0261rem;
        height: 19rem;
      }

      .gama-btn {
        margin-top: 2.4rem;
        color: #24292f;
      }
    }

    #img-top {
      top: 2.45rem;
      width: 14.5823rem;
      height: 12rem;
    }
  }

  #student-help-container {
    .v-card {
      max-width: 47.1rem;
      min-height: 14.2rem;
      margin: auto;

      .v-card__title {
        padding-bottom: 1.6rem;
        .icon {
          font-size: 4.8rem;
        }
      }
    }
  }
}
</style>
