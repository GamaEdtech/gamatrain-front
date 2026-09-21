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
                Looking to publish your materials and reach students worldwide?
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container
      id="earn-page-banner"
      fluid
    />

    <v-container id="earn-content-monetization">
      <v-row>
        <h2 class="gama-text-h4 monetization-title">
          Want your resources aligned with global curricula?
        </h2>
        <!--
          Intentional exception: custom CSS preserves the approved numbered
          chevron rail, which has no Vuetify equivalent.
        -->
        <div id="content-monetization-steps">
          <div class="step">
            <div class="step-num">
              <h3 class="gama-text-h4">
                1
              </h3>
            </div>

            <div class="step-info">
              <h3 class="gama-text-h6">
                Aligned with Leading Exam Boards
              </h3>
              <div class="gama-text-body2">
                Your resources are matched to Cambridge, Edexcel, OCR, AQA, and regional boards worldwide.
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
                Global Reach
              </h3>
              <p class="gama-text-body2">
                Get your materials in front of K‑12 students across different educational systems.
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
                What You Can Publish
              </h3>
              <p class="gama-text-body2">
                Upload Worksheets, Topical Questions, Workbooks, Coursebooks, Book Answers, Predicted Papers, and more.
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
                Cross‑Board Alignment
              </h3>
              <p class="gama-text-body2">
                Publish on your local board, and we'll align your content with other international boards — so students
                worldwide can benefit too.
              </p>
            </div>
          </div>
        </div>
      </v-row>
    </v-container>

    <v-container id="earn-features">
      <v-row>
        <v-card elevation="0">
          <h2 class="gama-text-h4">
            Features & Benefits
          </h2>
          <v-card
            v-for="(item, index) in featureList"
            :key="index"
            class="feature-box"
            elevation="0"
          >
            <h4 class="gama-text-h6">
              <v-icon>mdi-{{ item.icon }}</v-icon>{{ item.title }}
            </h4>
            <p class="gama-text-body1">
              {{ item.describe }}
            </p>
          </v-card>
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
              Publish Your Materials. Reach Students Worldwide.
            </p>
            <v-btn
              color="primary"
              rounded="pill"
              size="large"
              variant="flat"
            >
              Start Publishing
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      featureList: [
        {
          icon: 'eye',
          title: 'Global Distribution',
          describe: 'Your materials reach students studying under Cambridge, Edexcel, OCR, AQA, and other regional curricula.',
        },
        {
          icon: 'account-circle',
          title: 'Your Brand, Your Identity',
          describe: 'Publish under your own name and build your reputation as an educator.',
        },
        {
          icon: 'security',
          title: 'Secure Payments',
          describe: 'Reliable and transparent transaction processing.',
        },
        {
          icon: 'chart-donut',
          title: 'Performance Analytics',
          describe: 'See which materials resonate and refine your content strategy.',
        },
        {
          icon: 'headset',
          title: 'Ongoing Support',
          describe: 'Our team helps you throughout the publishing journey.',
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

    height: 20rem;
    background: rgb(var(--v-theme-grey800));
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
            color: rgb(var(--v-theme-primary));
            margin-bottom: 0.8rem;
        }

        .gama-text-subtitle2 {
            color: rgb(var(--v-theme-primary)) !important;
            font-size: 1.8rem;
        }
    }

}

#earn-page-banner {
    width: 100%;
    height: auto;
    aspect-ratio: 373 / 333;
    overflow: hidden;
    background: url('/images/earn-banner-xs.webp');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: 3.4rem;
    background-position: center;
}

#earn-content-monetization {
    text-align: center;

    .monetization-title {
        color: rgb(var(--v-theme-grey800));
    }

    .monetization-title {
        text-align: center;
        width: 95vw;
        margin: auto auto;
        margin-bottom: 3rem;

    }

    #content-monetization-steps {
        width: calc(100% - 3.2rem);
        max-width: 800px;
        overflow-x: hidden;
        margin: auto auto;
        padding-bottom: 5.8rem;

        .step {
            border-left: 6.4rem solid rgb(var(--v-theme-primary100));
            border-top: 1rem solid transparent;
            border-bottom: 1rem solid transparent;
            height: auto;
            min-height: 10.7rem;
            width: 0;
            position: relative;

            .step-num {
                position: absolute;
                right: 3.2rem;
                top: 50%;
                transform: translate(50%, -50%);

                .gama-text-h4 {
                    color: rgb(var(--v-theme-grey700));
                    text-align: center;
                    margin-bottom: 0;
                }
            }

            .step-info {
                width: calc(min(calc(100vw - 3.2rem), 800px) - 6.4rem);
                height: auto;
                min-height: 8.6rem;
                background: rgb(var(--v-theme-grey25));
                border: 1px solid rgb(var(--v-theme-grey200));
                padding: 1.6rem 1.6rem 1.6rem 1.6rem;
                text-align: left;

                .gama-text-h6 {
                    color: rgb(var(--v-theme-grey800));
                    margin-bottom: 0.8rem;
                }

                .gama-text-body2 {
                    color: rgb(var(--v-theme-grey600));
                }

            }

        }

    }
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
        color: rgb(var(--v-theme-grey800));
        margin: auto;
        margin-bottom: 2.4rem;
    }

    .feature-box {
        display: block;
        text-align: left;
        max-width: 57.8rem;
        height: fit-content;
        width: 100%;
        padding: 2.4rem 1.6rem 1.6rem 2.4rem;
        border-radius: 0.6rem;
        background: rgb(var(--v-theme-grey50));
        border: 1px solid rgb(var(--v-theme-grey200));
        margin: auto auto 0.8rem auto !important;

        .gama-text-h6 {
            color: rgb(var(--v-theme-grey800));
            margin-bottom: 0;

            .v-icon {
                color: rgb(var(--v-theme-primary));
                font-size: 2rem;
                margin-right: 0.8rem;
                margin-bottom: 0.4rem;
            }
        }

        .gama-text-body1 {
            color: rgb(var(--v-theme-grey600));
        }
    }
}

#start-monetizing-job {
    background: rgb(var(--v-theme-grey800));
    text-align: center;
    padding-top: 2.4rem;
    padding-bottom: 2.4rem;

    .gama-text-h6 {
        color: rgb(var(--v-theme-grey25));
        margin-bottom: 2.4rem;
    }

}

@media (min-width: 600px) {
    #earn-page-header {
        height: 24.2rem;

        #main-title-holder {
            max-width: 71.2rem;
            top: 11.8rem;
        }

    }

    #earn-page-banner {
        height: auto;
        aspect-ratio: 1118 / 436;
        background: url('/images/earn-banner-sm.webp');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
    }

    #earn-content-monetization {
        text-align: center;

        #content-monetization-steps {
            width: calc(100% - 3.2rem);
            max-width: 800px;
            padding-left: 0;
            padding-right: 0;
            padding-bottom: 5.8rem;
            margin: auto auto;

            .step {
                border-left: 6.4rem solid rgb(var(--v-theme-primary100));
                border-top: 1rem solid transparent;
                border-bottom: 1rem solid transparent;
                height: auto;
                min-height: 10.7rem;
                width: 0;
                position: relative;

                .step-num {
                    position: absolute;
                    right: 3.2rem;
                    top: 50%;
                    transform: translate(50%, -50%);
                }

                .step-info {
                    width: calc(min(calc(100vw - 3.2rem), 800px) - 6.4rem);
                    height: auto;
                    min-height: 8.6rem;
                    background: rgb(var(--v-theme-grey25));
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
            padding: 2.4rem 1.6rem 1.6rem 2.4rem;
            border-radius: 0.6rem;
            background: rgb(var(--v-theme-grey50));
            margin: auto auto 0.8rem auto !important;

            .gama-text-h6 {
                margin-bottom: 0;

                .v-icon {
                    color: rgb(var(--v-theme-primary));
                    font-size: 2rem;
                    margin-right: 0.8rem;
                    margin-bottom: 0.4rem;
                }
            }
        }
    }

    #start-monetizing-job {
        background: rgb(var(--v-theme-grey800));
        text-align: center;
        padding-top: 2.4rem;
        padding-bottom: 2.4rem;

        .gama-text-h6 {
            color: rgb(var(--v-theme-grey25));
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
            padding: 2.4rem 1.6rem 1.6rem 2.4rem;
            border-radius: 0.6rem;
            background: rgb(var(--v-theme-grey50));
            margin: auto auto 0.8rem auto !important;

            .gama-text-h6 {
                margin-bottom: 0;

                .v-icon {
                    font-size: 2.4rem;
                }
            }
        }
    }

}

@media only screen and (min-width: 960px) {

    #earn-page-banner {
        background: url('/images/earn-banner-md.webp');
        height: auto;
        aspect-ratio: 1748 / 545;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        width: 100%;
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
            width: calc(100% - 3.2rem);
            max-width: 800px;
            margin: auto auto;
            padding-bottom: 5.8rem;

            .step {
                border-left: 6.4rem solid rgb(var(--v-theme-primary100));
                border-top: 1rem solid transparent;
                border-bottom: 1rem solid transparent;
                height: auto;
                min-height: 10.7rem;
                width: 0;
                position: relative;

                .step-num {
                    position: absolute;
                    right: 3.2rem;
                    top: 50%;
                    transform: translate(50%, -50%);

                    .gama-text-h4 {
                        text-align: center;
                        margin-bottom: 0;
                    }
                }

                .step-info {
                    width: calc(min(calc(100vw - 3.2rem), 800px) - 6.4rem);
                    height: auto;
                    min-height: 8.6rem;
                    background: rgb(var(--v-theme-grey25));
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
            padding: 2.4rem 1.6rem 1.6rem 2.4rem;
            border-radius: 0.6rem;
            background: rgb(var(--v-theme-grey50));
            margin: auto auto 0.8rem auto !important;

            .gama-text-h6 {
                margin-bottom: 0;

                .v-icon {
                    color: rgb(var(--v-theme-primary));
                    font-size: 3.2rem;
                    margin-right: 0.8rem;
                    margin-bottom: 0.4rem;
                }
            }
        }
    }
}

</style>
