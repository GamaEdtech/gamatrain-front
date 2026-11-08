<template>
  <v-container class="py-10 py-md-16">
    <h2 class="home-title">
      Practise. Then know exactly where you stand.
    </h2>
    <p class="home-lead">
      Every exam shows you what to study next.
    </p>

    <v-sheet
      class="exam-steps mt-6 pa-4"
      rounded="lg"
      border
    >
      <template
        v-for="(step, index) in HOME_EXAM_STEPS"
        :key="step.title"
      >
        <v-icon
          v-if="index"
          class="d-none d-sm-inline-flex"
          icon="mdi-arrow-right"
          color="grey500"
        />
        <span class="d-flex align-center ga-2 font-weight-bold">
          <v-icon
            :icon="step.icon"
            color="primaryStrong"
          />
          {{ step.title }}
        </span>
      </template>
    </v-sheet>

    <v-row class="mt-3">
      <v-col
        v-for="card in HOME_EXAM_CARDS"
        :key="card.id"
        cols="12"
        md="6"
      >
        <div
          class="exam-card fill-height"
          :class="`exam-card--${card.id}`"
        >
          <img
            :src="themedImage(card.image)"
            :srcset="`${themedImage(card.imageSmall)} ${card.smallWidth}w, ${themedImage(card.image)} ${card.width}w`"
            :sizes="card.sizes"
            :width="card.width"
            :height="card.height"
            :alt="card.alt"
            loading="lazy"
          >
          <h3 class="exam-card__title">
            {{ card.title }}
          </h3>
          <p class="exam-card__text">
            {{ card.text }}
          </p>
          <ul class="exam-card__points">
            <li
              v-for="point in card.points"
              :key="point"
              class="d-flex ga-2"
            >
              <v-icon
                icon="mdi-check"
                color="primary"
                size="small"
              />
              {{ point }}
            </li>
          </ul>
          <v-btn
            class="home-cta"
            :to="card.link"
            color="primary"
            size="x-large"
            rounded="pill"
            flat
          >
            {{ card.action }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { HOME_EXAM_CARDS, HOME_EXAM_STEPS } from '@/constants/home'

const { themedImage } = useThemeMode()
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.exam-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.625rem;
}

.exam-card {
  display: flex;
  flex-direction: column;
  padding: 0 1.375rem 1.5rem;
  overflow: hidden;
  border-radius: 1.5rem;
  color: rgb(var(--v-theme-white));

  img {
    display: block;
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 16.25rem;
    margin: 0.875rem auto 0.375rem;
  }
}

.exam-card--exam {
  background:
    linear-gradient(135deg, transparent, rgba(var(--v-theme-white), 0.08)),
    rgb(var(--v-theme-quizFill));
}

.exam-card--analysis {
  background:
    linear-gradient(135deg, transparent, rgba(var(--v-theme-white), 0.14)),
    rgb(var(--v-theme-secondary));
}

.exam-card__title {
  font-size: 1.5625rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.exam-card__text {
  margin: 0.5rem 0 0.875rem;
  font-size: 1rem;
  line-height: 1.5;
}

.exam-card__points {
  margin: 0 0 1.25rem;
  padding: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  list-style: none;

  li {
    margin: 0.4375rem 0;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
  .exam-steps {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'lg-and-up')} {
  .exam-card {
    position: relative;
    min-height: 25rem;
    padding: 2.125rem;

    img {
      position: absolute;
      /* Sits beside the button and grows with the card, clear of the text column. */
      right: 1.5rem;
      bottom: 1.5rem;
      width: clamp(15.625rem, calc(100% - 18.75rem), 23.75rem);
      max-height: none;
      margin: 0;
    }
  }

  .exam-card__title {
    font-size: 1.875rem;
  }

  .exam-card__text,
  .exam-card__points {
    max-width: 13.75rem;
  }

  .home-cta {
    margin-top: auto;
  }
}
</style>
