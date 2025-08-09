<template>
  <v-container
    id="level-guid-banner"
    fluid
  >
    <v-container>
      <v-row>
        <v-col
          cols="12"
          class="text-center"
        >
          <h2 class="gama-text-h4 black--text">
            Earn Money with GamaTrain
          </h2>
        </v-col>
        <v-col
          cols="12"
          class="text-center"
        >
          <h2 class="gama-text-h4">
            {{ slideArr[slideIndex].caption }}
          </h2>
        </v-col>
        <v-col cols="12">
          <p class="gama-text-body1">
            {{ slideArr[slideIndex].describe }}
          </p>
          <div class="img-holder">
            <v-slide-x-transition>
              <img
                v-if="expand"
                :alt="slideArr[slideIndex].caption"
                :src="`/images/${slideArr[slideIndex].img}`"
              >
            </v-slide-x-transition>
          </div>

          <v-item-group
            v-model="slideIndex"
            class="paginate d-flex justify-space-between"
          >
            <v-item
              v-for="n in slideArr.length"
              :key="n"
            >
              <v-btn
                icon
                variant="text"
                @click="slideIndex = n - 1"
              >
                {{ n }}
              </v-btn>
            </v-item>
          </v-item-group>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'LevelGuidBanner',
  props: {
    slideArr: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      slideIndex: 0,
      expand: true,
      intervalId: null, // Store the interval ID
    }
  },
  watch: {
    slideIndex(_val) {
      this.expand = false

      setTimeout(() => {
        this.expand = true
      }, 500)
    },
  },
  mounted() {
    this.handleAutoCycle()
  },
  beforeUnmount() {
    this.stopInterval()
  },
  methods: {
    handleAutoCycle() {
      this.intervalId = setInterval(() => {
        if (this.slideIndex == this.slideArr.length - 1) this.slideIndex = 0
        else this.slideIndex++
      }, 8000)
    },
    stopInterval() {
      clearInterval(this.intervalId) // Clear the interval using the interval ID
    },
  },
}
</script>

<style>
#level-guid-banner {
  padding-top: 2.4rem;
  padding-bottom: 2.4rem;
  height: 46.3rem;
  background: #f6f8fa;

  .black--text {
    color: #24292f !important;
    margin-bottom: 0.4rem;
  }

  .gama-text-h4 {
    color: #ffb600;
    text-align: center;
    margin-bottom: 0.4rem;
  }

  .gama-text-body1 {
    text-align: center;
    color: #6e7781;
    margin-bottom: 0.4rem;
  }

  .img-holder {
    width: 19.3rem !important;
    height: 14.4rem !important;
    text-align: center;
    margin: 1.6rem auto 5.8rem auto;

    & > img {
      width: 19.3rem !important;
      height: 14.4rem !important;
      margin: 0 auto 0 auto;
    }
  }

  .paginate {
    width: 22.7rem;
    height: 5.1rem;
    border-radius: 3rem;
    background: #eaeef2;
    padding: 0 0.4rem 0 0.4rem;
    margin: 0 auto 0 auto;

    .v-btn {
      width: 4.4rem;
      height: 4.4rem;
      justify-content: center;
      background-color: #ffffff;
      color: #000000;
      font-weight: bold;
      margin: auto 0;
    }

    .v-item--active {
      color: #ffffff;
      background-color: #ffb300;
    }
  }
}

@media (min-width: 600px) {
  #level-guid-banner {
    padding-top: 3.6rem;
    padding-bottom: 2.4rem;
    height: 51.8rem;
    background: #f6f8fa;

    .gama-text-h4 {
      color: #ffb600;
      text-align: center;
    }

    .gama-text-body1 {
      text-align: center;
      color: #6e7781;
    }

    .img-holder {
      width: 19.3rem !important;
      height: 14.4rem !important;
      margin: 1.6rem auto 5.8rem auto;

      & > img {
        width: 19.3rem !important;
        height: 14.4rem !important;
        margin: 0 auto 0 auto;
      }
    }

    .paginate {
      width: 22.7rem;
      height: 5.1rem;
      border-radius: 3rem;
      background: #eaeef2;
      padding: 0 0.4rem 0 0.4rem;
      margin: 0 auto 0 auto;

      .v-btn {
        width: 4.4rem;
        height: 4.4rem;
        justify-content: center;
        background-color: #ffffff;
        color: #000000;
        font-weight: bold;
        margin: auto 0;
      }

      .v-item--active {
        color: #ffffff;
        background-color: #ffb300;
      }
    }
  }
}

@media (min-width: 1264px) {
  #level-guid-banner {
    height: 64.2rem;
    padding-top: 5rem;
    padding-bottom: 5rem;

    .black--text {
      margin-bottom: 3.2rem;
    }

    .gama-text-h4 {
      margin-bottom: 3.2rem;
    }

    .gama-text-body1 {
      margin-bottom: 3.2rem;
    }

    .img-holder {
      width: 26rem !important;
      height: 20rem !important;
      margin: 1.6rem auto 2.6rem auto;

      & > img {
        width: 26rem !important;
        height: 20rem !important;
        margin: 0 auto 0 auto;
      }
    }

    .paginate {
      width: 22.7rem;
      height: 5.1rem;
      border-radius: 3rem;
      background: #eaeef2;
      padding: 0 0.4rem 0 0.4rem;
      margin: 0 auto 0 auto;

      .v-btn {
        width: 4.4rem;
        height: 4.4rem;
        justify-content: center;
        background-color: #ffffff;
        color: #000000;
        font-weight: bold;
        margin: auto 0;
      }

      .v-item--active {
        color: #ffffff;
        background-color: #ffb300;
      }
    }
  }
}
</style>
