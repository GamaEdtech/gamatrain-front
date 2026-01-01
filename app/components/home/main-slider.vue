<template>
  <div id="slider-container">
    <v-col
      cols="12"
      sm="12"
      md="12"
      class="pt-0 px-0 pt-sm-0"
    >
      <v-carousel
        id="main-slider"
        v-model="carousel_model"
        cycle
        delimiter-icon="mdi-square"
        interval="5000"
        hide-delimiter-background
        :show-arrows="false"
      >
        <v-carousel-item
          v-for="(slide, i) in slides"
          :key="i"
        >
          <v-sheet
            :id="slide.id"
            class="section1"
          >
            <v-container class="pt-0 pt-sm-6 pt-md-6 pt-lg-8">
              <v-card
                flat
                class="px-4 px-sm-8 px-md-12"
              >
                <v-row class="text-white">
                  <v-col col="12">
                    <div
                      class="slide-title"
                      v-html="slide.title"
                    />
                    <div
                      class="slide-describe gama-text-body1 mt-6 d-none d-md-block"
                      v-html="slide.text"
                    />
                    <v-btn
                      id="read-about-btn"
                      rounded
                      :to="slide.link"
                      class="d-none d-md-inline-flex"
                      size="x-large"
                    >
                      Learn more
                    </v-btn>

                    <v-btn
                      id="slide-register-btn"
                      variant="text"
                      :to="slide.link"
                      class="d-md-none"
                    >
                      Learn more
                      <v-icon color="#FFB300">
                        mdi-arrow-right-bold
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-sheet>
          <v-sheet class="section2" />
        </v-carousel-item>
      </v-carousel>

      <home-general-search-desktop />
    </v-col>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const carousel_model = ref(0)
const _colors = ['#24292F', '#0092A9']

const slides = [
  {
    title:
      '<span class="gama-text-h1 font-weight-bold">Learn<span class="d-sm-none"><br>&nbsp&nbsp</span> & Earn</span>',
    text: 'Where education meets Web3 — empowering students to learn,<br> earn, and thrive in a decentralized future.',
    img: 'learn&earn.png',
    id: 'le-slide',
    link: '/earn-money',
  },
  {
    title:
      '<span class="gama-text-h1">AI</span> <span class="gama-text-h4 text-white">&nbspSystem <span class="d-sm-none"><br>&nbsp&nbsp</span>in Education</span>',
    img: 'ai-robot.png',
    text: 'Discover the future of education with our AI-powered learning platform,<br> revolutionizing the way you acquire knowledge and skills.',
    id: 'ai-slide',
    link: '/smart-learning',
  },
  {
    title: '<span class="gama-text-h1">School finder</span>',
    img: 'school-finder.png',
    text: 'Discover the future of education with our AI-powered learning platform,<br> revolutionizing the way you acquire knowledge and skills.',
    id: 'school-finder-slide',
    link: '/school',
  },
  {
    title:
      '<span class="gama-text-h1 font-weight-bold">Question<span class="d-sm-none"><br>&nbsp&nbsp</span> & Answer</span>',
    text: 'Q&A made easy. Connect with classmates and<br> teachers for quick answers to your questions.',
    img: 'a-q.png',
    id: 'aq-slide',
    link: '/search?type=quizhub',
  },
]
</script>

<style>
#main-slider {
  height: 25rem !important;
}

#main-slider .section1 {
  height: 35%;

  .v-container {
    width: 100%;

    .slide-title {
      margin-top: 3rem;
    }

    .slide-img {
      width: 12rem;
      float: right;
    }

    .gama-text-h1 {
      color: #fff;
    }

    .gama-text-h4 {
      color: #fff;
    }

    #slide-register-btn {
      text-transform: none;
      color: #a5a6a7;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 400;
      line-height: 2.4rem;

      .v-icon {
        display: inline-flex !important;
        color: #ffb300 !important;
        font-size: 2.4rem;
        padding-left: 0.8rem;
        margin-top: 0.4rem;
      }
    }
  }
}

#main-slider .section2 {
  height: 80%;
}

#main-slider #school-finder-slide {
  padding-top: 6rem;
  background: linear-gradient(83deg, #465568 0.59%, #86afd7 100%);
  background-repeat: no-repeat;
  height: 21.5rem;
}

#main-slider #school-finder-slide .v-card {
  height: 21.5rem;
  background-color: transparent;
  background-image: url("/images/school-finder.png");
  background-position: right 2.4rem;
  background-size: 15rem 18.1rem;
  background-repeat: no-repeat;
}

#main-slider #ai-slide {
  padding-top: 6rem;
  background: #24292f !important;
  background-repeat: no-repeat;
  background-size: 90%, 10%;
  height: 21.5rem;
}

#main-slider #ai-slide .v-card {
  height: 21.5rem;
  background-color: transparent;
  background-image: url("/images/ai-robot.png");
  background-position: right 2.4rem;
  background-size: 15rem 18.1rem;
  background-repeat: no-repeat;
}

#main-slider #aq-slide {
  padding-top: 6rem;
  height: 21.5rem;
  background: linear-gradient(45deg, #0092a9 0%, #2bddff 100%);
  background-repeat: no-repeat;
}

#main-slider #aq-slide .v-card {
  height: 21.5rem;
  background-size: 15.4rem 13.36rem;
  background-color: transparent;
  background-image: url("/images/a-q.png");
  background-repeat: no-repeat;
  background-position: 95% top;
}

#main-slider #le-slide {
  padding-top: 6rem;
  height: 21.5rem;
  background: linear-gradient(45deg, #24292f 0%, #091b30 100%);
  background-repeat: no-repeat;
}

#main-slider #le-slide .v-card {
  height: 21.5rem;
  background-size: 15.4rem 13.36rem;
  background-color: transparent;
  background-image: url("/images/learn&earn.png");
  background-position: right 2.2rem !important;
  background-repeat: no-repeat;
  background-position: 95% top;
}

#main-slider .section2 {
  height: 10%;
}

#main-slider .v-carousel__controls {
  position: absolute;
  top: 18.8rem;
}

#main-slider .v-carousel__controls .v-btn--icon {
  background-color: #ebece9;
  height: 0.1rem;
  width: 2.9rem;
  margin-right: 0.05rem !important;
  margin-left: 0.05rem !important;
  border-radius: 0.4rem;
}

#main-slider .v-carousel__controls .v-btn--icon.v-btn--active {
  background-color: #ffb300;
  /* Colour for active one */
}

#main-slider .v-carousel__controls .v-btn--icon:hover {
  background-color: #ffb300;
  /* You might also want to customise the hover effect */
}

#main-slider .v-btn__content .v-icon {
  display: none;
}

@media (min-width: 600px) {
  #main-slider {
    height: 30.8rem !important;
  }

  #main-slider .section1 {
    height: 51%;

    .container {
      width: 100%;

      .slide-img {
        width: 17rem;
        float: right;
      }

      #slide-register-btn {
        margin-top: 3rem;
        text-transform: none;
        color: #a5a6a7;
        font-size: 1.6rem;
        font-style: normal;
        font-weight: 400;
        line-height: 2.4rem;

        .v-icon {
          display: inline-flex !important;
          color: #ffb300 !important;
          font-size: 4.8rem !important;
          margin-top: 0.4rem;
          padding-left: 0.8rem;
        }
      }
    }
  }

  #main-slider #school-finder-slide {
    height: 27rem;
  }

  #main-slider #school-finder-slide .v-card {
    height: 34rem;
    background-position: 98% top;
    background-size: 17.7rem 22.11rem;
  }

  #main-slider #ai-slide {
    height: 27rem;
  }

  #main-slider #ai-slide .v-card {
    height: 34rem;
    background-position: 98% top;
    background-size: 17.7rem 22.11rem;
  }

  #main-slider #aq-slide {
    height: 27rem;
  }

  #main-slider #aq-slide .v-card {
    height: 34rem;
    background-size: 18.4rem 16.36rem;
  }

  #main-slider #le-slide {
    height: 27rem;
  }

  #main-slider #le-slide .v-card {
    height: 34rem;
    background-size: 18.4rem 16.36rem;
  }

  #main-slider .v-carousel__controls {
    position: absolute;
    top: 24.2rem;
  }

  #main-slider .v-carousel__controls .v-btn--icon {
    /* Background color of non-active ones */
    height: 0.2rem;
    /* Height you want */
    width: 6.4rem;
    /* Width you want */
  }
}

@media (min-width: 960px) {
  #slider-container {
    position: relative;
    height: 50rem !important;
  }

  #main-slider {
    height: 50rem !important;
  }

  #main-slider .section1 {
    .container {
      width: 100%;
    }
  }

  #main-slider .section1 {
    height: 95%;

    .gama-text-h1 {
      color: #fff;
    }

    .slide-title {
      margin-top: 2rem !important;

      .gama-text-h4 {
        font-size: 4.4rem !important;
        font-weight: 700 !important;
      }
    }

    .slide-describe {
      margin-top: 2rem;
      color: #fff;
    }

    .slide-img {
      width: 33rem;
      float: right;
    }

    #read-about-btn {
      background: #ffb600;
      max-width: 16rem;
      margin-top: 2.4rem;

      .v-btn__content {
        color: #24292f !important;
        font-size: 1.6rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2rem;
        letter-spacing: 0.0143rem;
        text-transform: uppercase;
      }
    }
  }

  #main-slider #school-finder-slide {
    padding-top: 6rem;
    background: linear-gradient(83deg, #465568 0.59%, #86afd7 100%);
    background-repeat: no-repeat;
    height: 44rem;
  }

  #main-slider #school-finder-slide .v-card {
    height: 42rem;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: 32.4rem 40.5rem;
    z-index: 1;
  }

  #main-slider #ai-slide {
    padding-top: 6rem;
    background: #24292f !important;
    background-repeat: no-repeat;
    background-size: 90%, 10%;
    height: 44rem;
  }

  #main-slider #ai-slide .v-card {
    height: 42rem;
    background-color: transparent;
    background-image: url("/images/ai-robot.png");
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: 32.4rem 40.5rem;
    z-index: 1;
  }

  #main-slider #aq-slide {
    padding-top: 6rem;
    background: linear-gradient(45deg, #0092a9 0%, #2bddff 100%);
    background-repeat: no-repeat;
    height: 44rem;
  }

  #main-slider #aq-slide .v-card {
    height: 42rem;
    background-color: transparent;
    background-image: url("/images/a-q.png");
    background-repeat: no-repeat;
    background-position: right top;
    background-size: 32.4rem 30.36rem;
  }

  #main-slider #le-slide {
    padding-top: 6rem;
    background: linear-gradient(45deg, #24292f 0%, #091b30 100%);
    background-repeat: no-repeat;
    height: 44rem;
  }

  #main-slider #le-slide .v-card {
    height: 42rem;
    background-color: transparent;
    background-image: url("/images/learn&earn.png");
    background-repeat: no-repeat;
    background-size: 32.4rem 30.36rem;
  }

  #main-slider .section2 {
    height: 10%;
  }

  #main-slider .v-carousel__controls {
    position: absolute;
    top: 41.18rem;
    /* height: 5rem !important; */
  }

  #main-slider .v-carousel__controls .v-btn--icon {
    background-color: #ebece9;
    /* Background color of non-active ones */
    height: 0.42rem;
    /* Height you want */
    width: 10.3rem;
    margin-right: 0.1rem !important;
    margin-left: 0.1rem !important;
    /* Width you want */
    border-radius: 0.4rem;
    /* Remove default border radius */
  }

  #main-slider .v-carousel__controls .v-btn--icon.v-btn--active {
    background-color: #ffb300;
    /* Colour for active one */
  }

  #main-slider .v-carousel__controls .v-btn--icon:hover {
    background-color: #ffb300;
    /* You might also want to customise the hover effect */
  }

  #main-slider .v-btn__content .v-icon {
    display: none;
  }
}

@media (min-width: 1264px) {
  #main-slider .section1 {
    .container {
      width: 78%;
    }
  }
}
</style>
