<template>
  <div>
    <div class="earn-header bg-grey800 pb-3 pb-sm-10">
      <v-container class="py-0 text-center">
        <div class="earn-header__title mx-auto">
          <h1 class="gama-text-h1 text-primary mb-2">
            Earn money
          </h1>
          <p class="gama-text-subtitle2 text-primary">
            Looking to publish your materials and reach students worldwide?
          </p>
        </div>
      </v-container>
    </div>

    <!--
      Intentional exception: <picture> instead of v-img, because the banner is
      art-directed (a different crop and aspect ratio per breakpoint).
    -->
    <picture class="earn-banner d-block mb-8">
      <source
        media="(min-width: 960px)"
        srcset="/images/earn-banner-md.webp"
        width="1748"
        height="545"
      >
      <source
        media="(min-width: 600px)"
        srcset="/images/earn-banner-sm.webp"
        width="1118"
        height="436"
      >
      <img
        src="/images/earn-banner-xs.webp"
        width="373"
        height="333"
        alt="Smiling teacher holding cash next to a laptop, with exam board logos"
        fetchpriority="high"
        class="d-block w-100 h-auto"
      >
    </picture>

    <v-container class="text-center">
      <h2 class="gama-text-h4 text-grey800 mb-8">
        Want your resources aligned with global curricula?
      </h2>
      <!--
        Intentional exception: custom CSS preserves the approved numbered
        chevron rail, which has no Vuetify equivalent.
      -->
      <ol class="earn-steps mx-auto">
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="earn-step"
        >
          <span
            class="earn-step__num gama-text-h4 text-grey700"
            aria-hidden="true"
          >{{ index + 1 }}</span>
          <div class="earn-step__info bg-grey25 text-left">
            <h3 class="gama-text-h6 text-grey800 mb-2">
              {{ step.title }}
            </h3>
            <p class="gama-text-body2 text-grey600">
              {{ step.describe }}
            </p>
          </div>
        </li>
      </ol>
    </v-container>

    <v-container class="text-center mb-12 mb-sm-16">
      <h2 class="gama-text-h4 text-grey800 mb-6">
        Features & Benefits
      </h2>
      <div class="earn-features mx-auto">
        <div
          v-for="item in featureList"
          :key="item.title"
          class="earn-feature bg-grey50 text-left pt-6 pr-4 pb-4 pl-6 mb-2"
        >
          <h3 class="gama-text-h6 text-grey800">
            <v-icon
              :icon="`mdi-${item.icon}`"
              color="primary"
              class="earn-feature__icon me-2 mb-1"
            />{{ item.title }}
          </h3>
          <p class="gama-text-body1 text-grey600">
            {{ item.describe }}
          </p>
        </div>
      </div>
    </v-container>

    <div class="bg-grey800 text-center py-6">
      <v-container>
        <p class="gama-text-h6 text-grey25 mb-6">
          Publish Your Materials. Reach Students Worldwide.
        </p>
        <v-btn
          color="primary"
          rounded="pill"
          size="large"
          variant="flat"
          :to="startPublishingLink"
        >
          Start Publishing
        </v-btn>
      </v-container>
    </div>
  </div>
</template>

<script setup>
const auth = useAuth()

// Guests get the login dialog first; signed-in users go straight to the upload form.
const startPublishingLink = computed(() =>
  auth.isAuthenticated.value ? '/user/paper/create' : { query: { auth_form: 'login' } },
)

const steps = [
  {
    title: 'Aligned with Leading Exam Boards',
    describe: 'Your resources are matched to Cambridge, Edexcel, OCR, AQA, and regional boards worldwide.',
  },
  {
    title: 'Global Reach',
    describe: 'Get your materials in front of K‑12 students across different educational systems.',
  },
  {
    title: 'What You Can Publish',
    describe: 'Upload Worksheets, Topical Questions, Workbooks, Coursebooks, Book Answers, Predicted Papers, and more.',
  },
  {
    title: 'Cross‑Board Alignment',
    describe: 'Publish on your local board, and we\'ll align your content with other international boards — so students worldwide can benefit too.',
  },
]

const featureList = [
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
]

useHead({ title: 'Earn money' })
</script>

<style scoped>
.earn-header {
  padding-top: 9.7rem;
}

.earn-header__title {
  max-width: 31.2rem;
}

.earn-header .gama-text-subtitle2 {
  font-size: 1.8rem;
}

.earn-steps {
  max-width: 80rem;
  padding: 0 0 5.8rem;
  list-style: none;
}

/* The transparent top/bottom borders cut the left border into a chevron. */
.earn-step {
  position: relative;
  min-height: 10.7rem;
  border-left: 6.4rem solid rgb(var(--v-theme-primary100));
  border-top: 1rem solid transparent;
  border-bottom: 1rem solid transparent;
}

.earn-step__num {
  position: absolute;
  left: -3.2rem;
  top: 50%;
  transform: translate(-50%, -50%);
}

.earn-step__info {
  min-height: 8.6rem;
  padding: 1.6rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}

.earn-features {
  max-width: 57.8rem;
}

.earn-feature {
  border: 1px solid rgb(var(--v-theme-grey200));
  border-radius: 0.6rem;
}

.earn-feature__icon {
  font-size: 2rem;
}

@media (min-width: 600px) {
  .earn-header {
    padding-top: 11.8rem;
  }

  .earn-header__title {
    max-width: 71.2rem;
  }

  .earn-step__info {
    padding-top: 2.4rem;
  }

  .earn-feature__icon {
    font-size: 2.4rem;
  }
}

@media (min-width: 960px) {
  .earn-feature__icon {
    font-size: 3.2rem;
  }
}
</style>
