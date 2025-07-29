<template>
  <div>
    <v-container
      id="earn-page-header"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="gama-text-h1 ">
                Earn money
              </h1>
              <p class="gama-text-subtitle2">
                Empower Educators with Our Lucrative Content Monetization Service
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container
      id="earn-page-banner"
      fluid
    >
      <v-container>
        <img
          id="mov-img"
          src="/images/mov-img.svg"
        >
        <img
          id="doc-img"
          src="/images/doc-img.svg"
        >
        <img
          id="zip-img"
          src="/images/zip-img.svg"
        >
        <img
          id="pdf-img"
          src="/images/pdf-img.svg"
        >
        <img
          id="gif-img"
          src="/images/gif-img.svg"
        >
        <img
          id="mp3-img"
          src="/images/mp3-img.svg"
        >
      </v-container>
    </v-container>

    <v-conteiner id="earn-content-monetization">
      <v-row>
        <h2 class="gama-text-h4 monetization-title">
          Why Choose Our Content Monetization Service?
        </h2>
        <div id="content-monetization-steps">
          <div class="step">
            <div class="step-num">
              <h3 class="gama-text-h4">
                1
              </h3>
            </div>

            <div class="step-info">
              <h3 class="gama-text-h6">
                Maximize Your Earnings
              </h3>
              <div class="gama-text-body2">
                Earn the Highest Share of Sales in the Industry.
              </div>
            </div>
          </div>

          <div class="step">
            <div class="step-num">
              <h3 class="gama-text-h4">
                2
              </h3>
            </div>

            <div class="step-info">
              <h3 class="gama-text-h6">
                Share Your Expertise
              </h3>
              <p class="gama-text-body2">
                Empower K-12 Students with Your Valuable Educational Content.
              </p>
            </div>
          </div>

          <div class="step">
            <div class="step-num">
              <h3 class="gama-text-h4">
                3
              </h3>
            </div>

            <div class="step-info">
              <h3 class="gama-text-h6">
                Flexible Formats
              </h3>
              <p class="gama-text-body2">
                Share Word, PDF, PowerPoint, and More.
              </p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">
              <h3 class="gama-text-h4">
                4
              </h3>
            </div>

            <div class="step-info">
              <h3 class="gama-text-h6">
                Easy Setup
              </h3>
              <p class="gama-text-body2">
                Quick and Hassle-Free Integration into Your Workflow.
              </p>
            </div>
          </div>
        </div>
      </v-row>
    </v-conteiner>

    <v-container
      id="earn-how-work"
      fluid
    >
      <v-container>
        <h2 class="gama-text-h4">
          How It Works?
        </h2>
        <p class="gama-text-body1">
          So easy, just follow these steps
        </p>
      </v-container>
    </v-container>

    <div id="earn-how-work-level">
      <LevelGuidBanner :slide-arr="slideArr" />
    </div>

    <v-container id="earn-features">
      <v-row>
        <v-card flat>
          <h2 class="gama-text-h4">
            What Features and Benefits?
          </h2>
          <div
            v-for="(item, index) in featureList"
            :key="index"
            class="feature-box"
          >
            <h4 class="gama-text-h6">
              <v-icon>mdi-{{ item.icon }}</v-icon>{{ item.title }}
            </h4>
            <p class="gama-text-body1">
              {{ item.describe }}
            </p>
          </div>
        </v-card>
      </v-row>
    </v-container>

    <v-container
      id="start-monetizing-job"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <p class="gama-text-h6">
              Join Our Community.Start Monetizing Your Content Now.
            </p>
            <button class="gama-primary-btn">
              Get Started Today!
            </button>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import LevelGuidBanner from '~/components/home/level-guid-banner.vue'

export default {
  auth: false,
  components: { LevelGuidBanner },
  data() {
    return {
      slideArr: [
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
      ],
      featureList: [
        {
          icon: 'eye',
          title: 'High Visibility',
          describe: 'Reach a Wide Audience of K-12 Students.',
        },
        {
          icon: 'account-circle',
          title: 'Personalized Branding',
          describe: 'Showcase Your Unique Teaching Style.',
        },
        {
          icon: 'security',
          title: 'Secure Transactions',
          describe: 'Trustworthy Payment Processing.',
        },
        {
          icon: 'chart-donut',
          title: 'Data Insights',
          describe: 'Understand Your Audience and Optimize Your Strategy.',
        },
        {
          icon: 'headset',
          title: 'Dedicated Support',
          describe: 'Our Team is Here to Assist You Every Step of the Way.',
        },
      ],
    }
  },
  head() {
    return {
      title: 'Earn money',
    }
  },
  computed: {},
  watch: {},
  methods: {},
}
</script>

<style>
#earn-page-header {
    margin-bottom: 4.2rem;
    height: 20rem;
    background: #24292F;
    position: relative;

    #main-title-holder {
        max-width: 31.2rem;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 9.7rem;
        text-align: center;

        .gama-text-h1 {
            color: #FFB600;
            margin-bottom: 0.8rem;
        }

        .gama-text-subtitle2 {
            color: #FFB600 !important;
        }
    }

}

#earn-page-banner {
    height: 44rem;
    overflow: hidden;
    background: url('/images/earn-banner-xs.svg');
    background-repeat: no-repeat;
    background-size: 110% auto;
    margin-bottom: 3.4rem;
    background-position: center top;

    .container {
        position: relative;
            height: 44rem;

        #mov-img {
            position: absolute;
            top: 10.6;
            opacity: 0;
            left: 3.38rem;
            animation-name: slideAndRotateMovMobileAnimation;
            animation-duration: 2s;
            /* Adjust the animation duration as needed */
            animation-timing-function: ease;
            /* Adjust the timing function as needed */
            animation-fill-mode: forwards;
            /* Keeps the final state of the animation */
        }

        #doc-img {
            position: absolute;
            top: 19.2rem;
            left: 2.85rem;
            animation-name: slideAndRotateDocMobileAnimation;
            animation-duration: 2s;
            /* Adjust the animation duration as needed */
            animation-timing-function: ease;
            /* Adjust the timing function as needed */
            animation-fill-mode: forwards;
            /* Keeps the final state of the animation */
        }

        #zip-img {
            position: absolute;
            top: 14.5rem;
            left: 6.7rem;
            animation-name: slideAndRotateZipMobileAnimation;
            animation-duration: 4s;
            /* Adjust the animation duration as needed */
            animation-timing-function: ease;
            /* Adjust the timing function as needed */
            animation-fill-mode: forwards;
            /* Keeps the final state of the animation */
        }

        #pdf-img {
            position: absolute;
            top: 13.1rem;
            right: 6.29rem;
            animation-name: slideAndRotatePdfMobileAnimation;
            animation-duration: 2s;
            /* Adjust the animation duration as needed */
            animation-timing-function: ease;
            /* Adjust the timing function as needed */
            animation-fill-mode: forwards;
            /* Keeps the final state of the animation */
            z-index: 1;

        }

        #gif-img {
            position: absolute;
            top: 8.03rem;
            right: 4.52rem;
            animation-name: slideAndRotateGifMobileAnimation;
            animation-duration: 2s;
            /* Adjust the animation duration as needed */
            animation-timing-function: ease;
            /* Adjust the timing function as needed */
            animation-fill-mode: forwards;
            /* Keeps the final state of the animation */
            z-index: 2;
        }

        #mp3-img {
            position: absolute;
            top: 17.5rem;
            right: 1.88rem;
            animation-name: slideAndRotateMp3MobileAnimation;
            animation-duration: 2s;
            /* Adjust the animation duration as needed */
            animation-timing-function: ease;
            /* Adjust the timing function as needed */
            animation-fill-mode: forwards;
            /* Keeps the final state of the animation */
            z-index: 0;
        }

    }

}

#earn-content-monetization {
    text-align: center;

    .monetization-title {
        text-align: center;
        width: 95vw;
        margin: auto auto;
        margin-bottom: 3rem;

    }

    #content-monetization-steps {
        width: 88rem;
        overflow-x: hidden;
        margin: auto auto;
        padding-bottom: 5.8rem;

        .step {
            border-left: 6.4rem solid #24292F1A;
            border-top: 1rem solid transparent;
            border-bottom: 1rem solid transparent;
            height: 10.7rem;
            width: 0;
            position: relative;

            .step-num {
                position: absolute;
                right: 2.6rem;
                top: 2.6rem;

                .gama-text-h4 {
                    text-align: center;
                    margin-bottom: 3rem;
                }
            }

            .step-info {
                width: 90vw;
                height: 8.6rem;
                background: #F4F4F4;
                padding: 1.6rem 1.6rem 1.6rem 1.6rem;
                text-align: left;

                .gama-text-h6 {
                    margin-bottom: 0.8rem;
                }

            }

        }

    }
}

#earn-how-work {
    text-align: center;

    .gama-text-h4 {
        margin-bottom: 2.4rem;
    }

    .gama-text-body1 {
        margin-bottom: 2.4rem;
    }

}

#earn-how-work-level {
    margin-bottom: 4.8rem;
}

#earn-features {
    text-align: center;
    margin-bottom: 4.8rem;
    padding: 2.6rem;

    .v-card {
        width: 100vw;
        margin: auto;
    }

    .gama-text-h4 {
        margin: auto;
        margin-bottom: 2.4rem;
    }

    .feature-box {
        display: block;
        text-align: left;
        max-width: 57.8rem;
        height: fit-content;
        width: 100%;
        max-height: 13.2rem;
        padding: 2.4rem 1.6rem 1.6rem 2.4rem;
        border-radius: 0.6rem;
        background: rgba(36, 41, 47, 0.05);
        margin: auto auto 0.8rem auto !important;

        .gama-text-h6 {
            margin-bottom: 1.7rem;

            .v-icon {
                color: #FFB600;
                font-size: 2rem;
                margin-right: 0.8rem;
                margin-bottom: 0.4rem;
            }
        }
    }
}

#start-monetizing-job {
    background: #24292F;
    text-align: center;
    padding-top: 2.4rem;
    padding-bottom: 2.4rem;

    .gama-text-h6 {
        color: #F3F3FB;
        margin-bottom: 2.4rem;
    }

}

@media (min-width: 438px) {
    #earn-page-banner {
        height: 60rem;
    }
}

@media (min-width: 500px) {
    #earn-page-banner {
        height: 70rem;
    }
}

@media (min-width: 600px) {
    #earn-page-header {
        height: 24.2rem;
        margin-bottom: 3.4rem;

        #main-title-holder {
            max-width: 71.2rem;
            top: 11.8rem;
        }

    }

    #earn-page-banner {
        height: 40rem;

        background: url('/images/earn-banner-sm.svg');
        background-repeat: no-repeat;
        background-size: 140% auto;
        background-position: center top;

        .container {
            position: relative;
            height: 50rem;

            #mov-img {
                position: absolute;
                top: 0;
                opacity: 0;
                left: 10.78rem;
                animation-name: slideAndRotateMovTabletAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #doc-img {
                position: absolute;
                top: 24.9rem;
                left: -10rem;
                animation-name: slideAndRotateDocTabletAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #zip-img {
                position: absolute;
                bottom: -10rem;
                left: -40rem;
                animation-name: slideAndRotateZipTabletAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #pdf-img {
                position: absolute;
                top: 12rem;
                right: -60rem;
                animation-name: slideAndRotatePdfTabletAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #gif-img {
                position: absolute;
                top: 5.83rem;
                right: -40rem;
                animation-name: slideAndRotateGifTabletAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #mp3-img {
                position: absolute;
                top: 20.81rem;
                right: 15.46rem;
                animation-name: slideAndRotateMp3TabletAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

        }

    }

    #earn-content-monetization {
        text-align: center;

        #content-monetization-steps {
            width: 100vw;
            padding-left: 1.6rem;
            padding-right: 1.6rem;
            padding-bottom: 5.8rem;
            margin: auto auto;

            .step {
                border-left: 6.4rem solid #24292F1A;
                border-top: 1rem solid transparent;
                border-bottom: 1rem solid transparent;
                height: 10.7rem;
                width: 0;
                position: relative;

                .step-num {
                    position: absolute;
                    right: 2.6rem;
                    top: 2.6rem;
                }

                .step-info {
                    width: 88vw;
                    height: 8.6rem;
                    background: #F4F4F4;
                    padding: 2.4rem 1.6rem 1.6rem 1.6rem;
                    text-align: left;

                    .gama-text-h6 {
                        margin-bottom: 0.8rem;
                    }

                    .gama-text-body2 {}

                }

            }

        }
    }

    #earn-how-work-level {
        margin-bottom: 4.8rem;
    }

    #earn-features {
        text-align: center;
        margin-bottom: 6.4rem;

        .gama-text-h4 {
            margin: auto;

            margin-bottom: 2.4rem;
        }

        .feature-box {
            text-align: left;
            max-width: 57.8rem;
            height: fit-content;
            width: 100%;
            max-height: 13.2rem;
            padding: 2.4rem 1.6rem 1.6rem 2.4rem;
            border-radius: 0.6rem;
            background: rgba(36, 41, 47, 0.05);
            margin: auto auto 0.8rem auto !important;

            .gama-text-h6 {
                margin-bottom: 1.7rem;

                .v-icon {
                    color: #FFB600;
                    font-size: 2rem;
                    margin-right: 0.8rem;
                    margin-bottom: 0.4rem;
                }
            }
        }
    }

    #start-monetizing-job {
        background: #24292F;
        text-align: center;
        padding-top: 2.4rem;
        padding-bottom: 2.4rem;

        .gama-text-h6 {
            color: #F3F3FB;
            margin-bottom: 2.4rem;
        }
    }

    #earn-features {
        text-align: center;
        margin-bottom: 6.4rem;

        .gama-text-h4 {
            margin: auto;

            margin-bottom: 2.4rem;
        }

        .feature-box {
            text-align: left;
            max-width: 57.8rem;
            height: fit-content;
            width: 100%;
            max-height: 13.2rem;
            padding: 2.4rem 1.6rem 1.6rem 2.4rem;
            border-radius: 0.6rem;
            background: rgba(36, 41, 47, 0.05);
            margin: auto auto 0.8rem auto !important;

            .gama-text-h6 {
                margin-bottom: 1.7rem;

                .v-icon {
                    font-size: 2.4rem;
                }
            }
        }
    }

}

@media (min-width: 750px) {
    #earn-page-banner {
        height: 45rem;
    }
}

@media (min-width: 850px) {
    #earn-page-banner {
        height: 50rem;
    }
}

@media only screen and (min-width: 960px) {

    #earn-page-banner {
        background: url('/images/earn-banner-md.svg');
        height: 34.4rem;
        background-repeat: no-repeat;
        background-position: center top;
        background-size: 120% auto;
        width: 100%;

        .container {
            position: relative;
            height: 38.4rem;

            #mov-img {
                position: absolute;
                top: 0;
                opacity: 0;
                left: 10.78rem;
                animation-name: slideAndRotateMovDesktopAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #doc-img {
                position: absolute;
                top: 24.9rem;
                left: -10rem;
                animation-name: slideAndRotateDocDesktopAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #zip-img {
                position: absolute;
                bottom: -10rem;
                left: -40rem;
                animation-name: slideAndRotateZipDesktopAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #pdf-img {
                position: absolute;
                top: 12rem;
                right: -60rem;
                animation-name: slideAndRotatePdfDesktopAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #gif-img {
                position: absolute;
                top: 5.83rem;
                right: -40rem;
                animation-name: slideAndRotateGifDesktopAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

            #mp3-img {
                position: absolute;
                top: 20.81rem;
                right: 15.46rem;
                animation-name: slideAndRotateMp3DesktopAnimation;
                animation-duration: 2s;
                /* Adjust the animation duration as needed */
                animation-timing-function: ease;
                /* Adjust the timing function as needed */
                animation-fill-mode: forwards;
                /* Keeps the final state of the animation */
            }

        }

    }

    #earn-content-monetization {
        text-align: center;

        .monetization-title {
            text-align: center;
            width: 95vw;
            margin: auto auto;
            margin-bottom: 3rem;

        }

        #content-monetization-steps {
            width: 78vw;
            margin: auto auto;
            padding-bottom: 5.8rem;

            .step {
                border-left: 6.4rem solid #24292F1A;
                border-top: 1rem solid transparent;
                border-bottom: 1rem solid transparent;
                height: 10.7rem;
                width: 0;
                position: relative;

                .step-num {
                    position: absolute;
                    right: 2.6rem;
                    top: 2.6rem;

                    .gama-text-h4 {
                        text-align: center;
                        margin-bottom: 3rem;
                    }
                }

                .step-info {
                    width: 75vw;
                    height: 8.6rem;
                    background: #F4F4F4;
                    padding: 2.4rem 1.6rem 1.6rem 1.6rem;
                    text-align: left;

                    .gama-text-h6 {
                        margin-bottom: 0.8rem;
                    }

                    .gama-text-body2 {}

                }

            }

        }
    }

    #earn-how-work {
        margin-bottom: 2.4rem;

    }

    #earn-how-work-level {
        margin-bottom: 10rem;
    }

    #earn-features {
        text-align: center;
        margin-bottom: 6.4rem;

        .gama-text-h4 {
            margin: auto;

            margin-bottom: 2.4rem;
        }

        .feature-box {
            text-align: left;
            max-width: 57.8rem;
            height: fit-content;
            width: 100%;
            max-height: 13.2rem;
            padding: 2.4rem 1.6rem 1.6rem 2.4rem;
            border-radius: 0.6rem;
            background: rgba(36, 41, 47, 0.05);
            margin: auto auto 0.8rem auto !important;

            .gama-text-h6 {
                margin-bottom: 1.7rem;

                .v-icon {
                    color: #FFB600;
                    font-size: 3.2rem;
                    margin-right: 0.8rem;
                    margin-bottom: 0.4rem;
                }
            }
        }
    }
}

@media (min-width: 1100px) {
    #earn-page-banner {
        height: 40rem;
    }
}
@media (min-width: 1100px) {
    #earn-page-banner {
        height: 45rem;
    }
}
@media (min-width: 1560px) {
    #earn-page-banner {
        height: 60rem;
    }
}

@media (min-width: 1920px) {
    #earn-page-banner {
        height: 65rem;
    }
}

@media (min-width: 2200px) {
    #earn-page-banner {
        height: 70rem;
    }
}

@media (min-width: 2400px) {
    #earn-page-banner {
        height: 75rem;
    }
}

@media (min-width: 2500px) {
    #earn-page-banner {
        height: 80rem;
    }
}

@media (min-width: 2800px) {
    #earn-page-banner {
        height: 90rem;
    }
}

/* Animate for mobile*/
@keyframes slideAndRotateMovMobileAnimation {
    0% {
        top: -10rem;
        opacity: 0;
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        opacity: 1;
        top: 15.6rem;
        left: 0.2rem;
        transform: translateY(-50%) rotate(-11deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateDocMobileAnimation {
    0% {
        left: -10rem;
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        left: 0rem;
        top: 24.2rem;
        transform: translateY(-50%) rotate(-45deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateZipMobileAnimation {
    0% {
        top: 0;
        left: 12rem;
        opacity: 0;
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        top: 20.2rem;
        left: 5.4rem;
        opacity: 1;
        transform: translateY(-50%) rotate(-28.7deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotatePdfMobileAnimation {
    0% {
        top: 40rem;
        right: -10rem;
        opacity: 0;
        transform: translateY(-50%) rotate(180deg);
    }

    100% {
        top: 18.1rem;
        right: 4.29rem;
        opacity: 1;
        transform: translateY(-50%) rotate(-11deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateGifMobileAnimation {
    0% {
        top: -100rem;
        right: -40rem;
        opacity: 0;
        transform: translateY(-50%) rotate(360deg);
    }

    100% {
        top: 13.03rem;
        right: 2.52rem;
        opacity: 1;
        transform: translateY(-50%) rotate(6.416deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateMp3MobileAnimation {
    0% {
        top: 20.81rem;
        right: -40rem;
        transform: translateY(-50%) rotate(0);
    }

    100% {
        top: 22.5rem;
        right: 0rem;
        transform: translateY(-50%) rotate(42.5deg);
        /* Rotate to 45 degrees */
    }
}

/* End animate for mobile*/

/* Animate for tablet*/
@keyframes slideAndRotateMovTabletAnimation {
    0% {
        top: -10rem;
        opacity: 0;
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        opacity: 1;
        top: 10rem;
        left: 8rem;
        transform: translateY(-50%) rotate(-11deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateDocTabletAnimation {
    0% {
        left: -10rem;
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        top: 18rem;
        left: 10.75rem;
        transform: translateY(-50%) rotate(-45deg);

        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateZipTabletAnimation {
    0% {
        bottom: -10rem;
        left: 12rem;
        opacity: 0;
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        top: 16.6rem;
        left: 17.5rem;
        opacity: 1;
        transform: translateY(-50%) rotate(-28.7deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotatePdfTabletAnimation {
    0% {
        top: 40rem;
        right: -10rem;
        opacity: 0;
        transform: translateY(-50%) rotate(180deg);
    }

    100% {
        right: 16rem;
        top: 12rem;
        opacity: 1;
        transform: translateY(-50%) rotate(-11deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateGifTabletAnimation {
    0% {
        top: -100rem;
        right: -40rem;
        opacity: 0;
        transform: translateY(-50%) rotate(360deg);
    }

    100% {
        top: 5.83rem;
        right: 10.12rem;
        opacity: 1;
        transform: translateY(-50%) rotate(6.416deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateMp3TabletAnimation {
    0% {
        top: 20.81rem;
        right: -40rem;
        transform: translateY(-50%) rotate(0);
    }

    100% {
        top: 18.81rem;
        right: 10.46rem;
        transform: translateY(-50%) rotate(42.5deg);
        /* Rotate to 45 degrees */
    }
}

/* End animate for tablet*/

/* Animate for desktop*/
@keyframes slideAndRotateMovDesktopAnimation {
    0% {
        top: -10rem;
        opacity: 0;
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        opacity: 1;
        top: 10rem;
        transform: translateY(-50%) rotate(-11deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateDocDesktopAnimation {
    0% {
        left: -10rem;
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        left: 12.75rem;
        transform: translateY(-50%) rotate(-45deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateZipDesktopAnimation {
    0% {
        bottom: -10rem;
        left: 12rem;
        opacity: 0;
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        bottom: 19.6rem;
        left: 23.65rem;
        opacity: 1;
        transform: translateY(-50%) rotate(-28.7deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotatePdfDesktopAnimation {
    0% {
        top: 40rem;
        right: -10rem;
        opacity: 0;
        transform: translateY(-50%) rotate(180deg);
    }

    100% {
        right: 27rem;
        top: 12rem;
        opacity: 1;
        transform: translateY(-50%) rotate(-11deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateGifDesktopAnimation {
    0% {
        top: -100rem;
        right: -40rem;
        opacity: 0;
        transform: translateY(-50%) rotate(360deg);
    }

    100% {
        top: 5.83rem;
        right: 13.12rem;
        opacity: 1;
        transform: translateY(-50%) rotate(6.416deg);
        /* Rotate to 45 degrees */
    }
}

@keyframes slideAndRotateMp3DesktopAnimation {
    0% {
        top: 20.81rem;
        right: -40rem;
        transform: translateY(-50%) rotate(0);
    }

    100% {
        top: 20.81rem;
        right: 15.46rem;
        transform: translateY(-50%) rotate(42.5deg);
        /* Rotate to 45 degrees */
    }
}

/* End animate for desktop*/
</style>
