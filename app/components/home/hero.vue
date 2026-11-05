<template>
  <div class="home-hero">
    <v-container class="home-hero__grid">
      <div class="home-hero__text">
        <v-chip
          color="primary"
          variant="tonal"
          prepend-icon="mdi-star-four-points"
          class="d-none d-sm-inline-flex font-weight-bold"
        >
          Online exams with instant scores
        </v-chip>
        <h1 class="home-hero__title">
          Ace your <span class="text-primary">next exam.</span>
        </h1>
        <p class="home-hero__lead">
          For Cambridge, Edexcel and more.
          <span class="d-none d-md-inline">Get your score the moment you finish, then see what to study next.</span>
        </p>
      </div>
      <div class="home-hero__figure">
        <v-chip
          class="home-hero__tag home-hero__tag--score d-none d-lg-inline-flex"
          color="white"
          variant="flat"
          prepend-icon="mdi-check-circle"
        >
          Score in seconds
        </v-chip>
        <v-chip
          class="home-hero__tag home-hero__tag--advice d-none d-lg-inline-flex"
          color="white"
          variant="flat"
          prepend-icon="mdi-creation"
        >
          AI study advice
        </v-chip>
        <img
          src="/images/hero-girl.webp"
          srcset="/images/hero-girl-sm.webp 340w, /images/hero-girl.webp 620w"
          sizes="(max-width: 959px) 93px, 274px"
          width="620"
          height="1133"
          alt="The GamaTrain student floating under a glowing light bulb"
          fetchpriority="high"
        >
      </div>
      <home-exam-finder class="home-hero__finder" />
    </v-container>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.home-hero {
  --hero-base: var(--v-theme-secondary);
  padding: 8.4rem 0 2.4rem;
  color: rgb(var(--v-theme-white));
  text-align: center;
  background:
    radial-gradient(60rem 42rem at 50% 45%, rgba(var(--v-theme-white), 0.1), transparent 72%),
    rgb(var(--hero-base));
}

.v-theme--dark .home-hero {
  --hero-base: var(--v-theme-surface);
}

.home-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
}

.home-hero__finder {
  width: 100%;
  text-align: left;
}

.home-hero__title {
  margin: 0 0 0.8rem;
  font-size: clamp(2.6rem, 8.6vw, 3.2rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.home-hero__lead {
  max-width: 52rem;
  margin: 0 auto;
  color: rgb(var(--v-theme-onInverseSurfaceSubtle));
  font-size: 1.6rem;
  line-height: 1.4;
}

.home-hero__figure {
  position: relative;
  height: 17rem;
  margin: 1.2rem 0 1.6rem;

  img {
    display: block;
    width: auto;
    height: 17rem;
  }
}

.home-hero :deep(.v-chip) {
  font-size: 1.3rem;
}

.home-hero__tag {
  position: absolute;
  z-index: 1;
  color: rgb(var(--v-theme-brandNavy));
  font-weight: 700;
}

/* Short phones: the search form matters more than the character. */
@media (max-height: 700px) and (max-width: 599.98px) {
  .home-hero__figure {
    display: none;
  }

  .home-hero__text {
    margin-bottom: 1.2rem;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
  .home-hero__title {
    margin: 1.4rem 0 1.2rem;
    font-size: 4rem;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'md-and-up')} {
  .home-hero {
    padding: 10rem 0 5.6rem;
    text-align: left;
    background:
      radial-gradient(90rem 62rem at 78% 42%, rgba(var(--v-theme-white), 0.1), transparent 72%),
      rgb(var(--hero-base));
  }

  .home-hero__grid {
    grid-template-columns: minmax(0, 78rem) auto;
    grid-template-areas:
      'text figure'
      'finder figure';
    justify-content: space-between;
    justify-items: start;
    align-items: center;
    column-gap: 4rem;
    row-gap: 2.8rem;
  }

  .home-hero__text {
    grid-area: text;
  }

  .home-hero__finder {
    grid-area: finder;
  }

  .home-hero__title {
    margin: 2rem 0 1.8rem;
    font-size: 5.6rem;
  }

  .home-hero__lead {
    margin: 0;
    font-size: 1.9rem;
  }

  .home-hero__figure {
    grid-area: figure;
    height: 50rem;
    margin: 0 3rem 0 0;

    img {
      height: 100%;
    }
  }

  .home-hero :deep(.v-chip) {
    font-size: 1.4rem;
  }

  .home-hero__tag--score {
    top: 6rem;
    left: -9rem;
    transform: rotate(-4deg);
  }

  .home-hero__tag--advice {
    top: 24rem;
    left: -6rem;
    transform: rotate(3deg);
  }
}
</style>
