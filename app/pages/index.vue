<template>
  <v-container
    fluid
    class="px-0 py-0 mt-md-0"
  >
    <home-hero />

    <home-grade-explorer />

    <home-exam-cards />

    <!-- School finder -->
    <v-container class="py-10 py-md-16">
      <div class="home-school">
        <div class="home-school__text">
          <h2 class="home-title">
            Compare schools near you
          </h2>
          <p class="home-lead mb-6">
            Filter by location, ratings, reviews and facilities.
          </p>
          <v-btn
            class="home-cta"
            to="/school"
            color="primary"
            size="x-large"
            rounded="pill"
            flat
          >
            Find a school
          </v-btn>
        </div>
        <img
          src="/images/school-finder.webp"
          width="391"
          height="469"
          alt="A phone showing schools on a map under a magnifying glass"
          loading="lazy"
        >
      </div>
    </v-container>

    <home-post-container />

    <!-- Teachers -->
    <div class="home-teachers">
      <v-container class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
        <div>
          <h2 class="home-title text-white">
            Are you a teacher?
          </h2>
          <p class="home-lead text-onInverseSurfaceSubtle">
            Share your lessons and earn from every sale.
          </p>
        </div>
        <v-btn
          class="home-cta"
          to="/earn-money"
          color="primary"
          size="x-large"
          rounded="pill"
          flat
        >
          Earn money
        </v-btn>
      </v-container>
    </div>
  </v-container>
</template>

<script setup>
const title = 'GamaTrain: Online Exams & Past Papers for Checkpoint, IGCSE, A Level, Edexcel'
const description = 'Take online exams with instant scores, and find past papers, mark schemes and study materials for Cambridge, Edexcel and more.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://gamatrain.com/images/og-home.jpg',
  twitterCard: 'summary_large_image',
})

// WebSite gives Google the site name it shows in results, and every page's WebPage node already points
// at "#website" and "#organization" - this is where both are defined.
const { organizationSchema } = useSeoSchema()
useHead({
  titleTemplate: '%s',
  link: [{ rel: 'canonical', href: 'https://gamatrain.com/' }],
  script: [{
    key: 'json-ld-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://gamatrain.com/#website',
          'name': 'GamaTrain',
          'url': 'https://gamatrain.com',
          'publisher': { '@id': 'https://gamatrain.com/#organization' },
          'inLanguage': 'en',
        },
        { ...organizationSchema, sameAs: ['https://x.com/GamaEdtech'] },
      ],
    }),
  }],
})
</script>

<style lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.home-title {
  color: rgb(var(--v-theme-grey900));
  font-size: 2.7rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.home-lead {
  margin-top: 0.8rem;
  color: rgb(var(--v-theme-grey600));
  font-size: 1.5rem;
}

.v-btn.home-cta {
  width: 100%;
  color: rgb(var(--v-theme-on-primary));

  .v-btn__content {
    font-size: 1.6rem;
    font-weight: 800;
    text-transform: none;
    letter-spacing: 0;
  }
}

.home-school {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.6rem;
  padding: 2.4rem 2.2rem;
  border-radius: 2.4rem;
  background: rgb(var(--v-theme-primary50));

  img {
    display: block;
    width: 15rem;
    height: auto;
    margin: 0 auto;
  }
}

.home-teachers {
  padding: 3.6rem 0;
  background: rgb(var(--v-theme-secondary));
}

.v-theme--dark .home-teachers {
  background: rgb(var(--v-theme-surface));
}

@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
  .v-btn.home-cta {
    align-self: flex-start;
    width: auto;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'md-and-up')} {
  .home-title {
    font-size: 3.6rem;
  }

  .home-lead {
    font-size: 1.7rem;
  }

  .home-school {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 4.4rem 5rem;

    img {
      width: 22rem;
      margin: -9rem 4rem -6rem 0;
    }
  }
}
</style>
