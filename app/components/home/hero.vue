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
          class="home-hero__tag home-hero__tag--score d-md-none d-lg-inline-flex"
          color="white"
          variant="flat"
          elevation="4"
          prepend-icon="mdi-check-circle"
        >
          <span class="d-sm-none">Instant score</span>
          <span class="d-none d-sm-inline">Score in seconds</span>
        </v-chip>
        <v-chip
          class="home-hero__tag home-hero__tag--advice d-md-none d-lg-inline-flex"
          color="white"
          variant="flat"
          elevation="4"
          prepend-icon="mdi-creation"
        >
          <span class="d-sm-none">AI advice</span>
          <span class="d-none d-sm-inline">AI study advice</span>
        </v-chip>
        <v-chip
          class="home-hero__tag home-hero__tag--rank d-md-none d-lg-inline-flex"
          color="white"
          variant="flat"
          elevation="4"
          prepend-icon="mdi-trophy"
        >
          <span class="d-sm-none d-lg-inline">Level up</span>
          <span class="d-none d-sm-inline d-lg-none">Level up with every exam</span>
        </v-chip>
        <img
          src="/images/hero-girl.webp"
          srcset="/images/hero-girl-sm.webp 340w, /images/hero-girl.webp 620w"
          sizes="(max-width: 959px) 99px, 274px"
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
  height: 18rem;
  margin: 0.6rem 0 1.2rem;

  img {
    position: relative;
    display: block;
    width: auto;
    height: 18rem;
  }
}

.home-hero :deep(.v-chip) {
  font-size: 1.3rem;
}

.home-hero__tag {
  position: absolute;
  z-index: 1;
  max-width: none;
  color: rgb(var(--v-theme-brandNavy));
  font-weight: 700;
}

/* Below the desktop layout the tags tuck into the gaps around the bulb and the body. */
.home-hero__tag--score {
  top: 8.8rem;
  right: calc(100% - 1.4rem);
  transform: rotate(-4deg);

  :deep(.v-chip__prepend) {
    color: rgb(var(--v-theme-success));
  }
}

.home-hero__tag--advice {
  top: 1.6rem;
  left: calc(100% - 1rem);
  transform: rotate(3deg);

  :deep(.v-chip__prepend) {
    color: rgb(var(--v-theme-primary));
  }
}

.home-hero__tag--rank {
  top: 12.4rem;
  left: calc(100% - 0.2rem);
  transform: rotate(-2deg);

  :deep(.v-chip__prepend) {
    color: rgb(var(--v-theme-primary));
  }
}

@keyframes home-hero-float {
  50% {
    translate: 0 -0.5rem;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .home-hero__tag {
    animation: home-hero-float 5s ease-in-out infinite;
  }

  .home-hero__tag--advice {
    animation-delay: -1.6s;
  }

  .home-hero__tag--rank {
    animation-delay: -3.2s;
  }
}

/* The bulb lights up the scene on phones and tablets. */
@media #{map.get(vuetify.$display-breakpoints, 'sm-and-down')} {
  .home-hero__figure::before {
    position: absolute;
    top: -5rem;
    left: 50%;
    width: 20rem;
    height: 20rem;
    background: radial-gradient(closest-side, rgba(var(--v-theme-primary), 0.16), transparent);
    content: '';
    transform: translateX(-50%);
    pointer-events: none;
  }
}

/* The narrowest phones have no room for the tag icons. */
@media (max-width: 359.98px) {
  .home-hero__tag :deep(.v-chip__prepend) {
    display: none;
  }
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
    right: auto;
    left: -9rem;
  }

  .home-hero__tag--advice {
    top: 24rem;
    left: -6rem;
  }

  .home-hero__tag--rank {
    top: 39rem;
    right: calc(100% - 14.6rem);
    left: auto;
  }
}
</style>
