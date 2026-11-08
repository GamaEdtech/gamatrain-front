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
          src="/images/hero-student.webp"
          srcset="/images/hero-student-sm.webp 340w, /images/hero-student.webp 620w"
          sizes="(max-width: 959px) 99px, 274px"
          width="620"
          height="1134"
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
  padding: 5.25rem 0 1.5rem;
  color: rgb(var(--v-theme-white));
  text-align: center;
  background:
    radial-gradient(37.5rem 26.25rem at 50% 45%, rgba(var(--v-theme-white), 0.1), transparent 72%),
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
  margin: 0 0 0.5rem;
  font-size: clamp(1.625rem, 8.6vw, 2rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.home-hero__lead {
  max-width: 32.5rem;
  margin: 0 auto;
  color: rgb(var(--v-theme-onInverseSurfaceSubtle));
  font-size: 1rem;
  line-height: 1.4;
}

.home-hero__figure {
  position: relative;
  height: 11.25rem;
  margin: 0.375rem 0 0.75rem;

  img {
    position: relative;
    display: block;
    width: auto;
    height: 11.25rem;
  }
}

.home-hero :deep(.v-chip) {
  font-size: 0.8125rem;
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
  top: 6.5rem;
  right: calc(100% + 0.25rem);
  transform: rotate(-4deg);

  :deep(.v-chip__prepend) {
    color: rgb(var(--v-theme-success));
  }
}

.home-hero__tag--advice {
  top: 1rem;
  left: calc(100% - 0.625rem);
  transform: rotate(3deg);

  :deep(.v-chip__prepend) {
    color: rgb(var(--v-theme-primary));
  }
}

.home-hero__tag--rank {
  top: 7.75rem;
  left: calc(100% - 0.125rem);
  transform: rotate(-2deg);

  :deep(.v-chip__prepend) {
    color: rgb(var(--v-theme-primary));
  }
}

@keyframes home-hero-float {
  50% {
    translate: 0 -0.3125rem;
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
    top: -3.125rem;
    left: 50%;
    width: 12.5rem;
    height: 12.5rem;
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
    margin-bottom: 0.75rem;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
  .home-hero__title {
    margin: 0.875rem 0 0.75rem;
    font-size: 2.5rem;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'md-and-up')} {
  .home-hero {
    padding: 6.25rem 0 3.5rem;
    text-align: left;
    background:
      radial-gradient(56.25rem 38.75rem at 78% 42%, rgba(var(--v-theme-white), 0.1), transparent 72%),
      rgb(var(--hero-base));
  }

  .home-hero__grid {
    grid-template-columns: minmax(0, 48.75rem) auto;
    grid-template-areas:
      'text figure'
      'finder figure';
    justify-content: space-between;
    justify-items: start;
    align-items: center;
    column-gap: 2.5rem;
    row-gap: 1.75rem;
  }

  .home-hero__text {
    grid-area: text;
  }

  .home-hero__finder {
    grid-area: finder;
  }

  .home-hero__title {
    margin: 1.25rem 0 1.125rem;
    font-size: 3.5rem;
  }

  .home-hero__lead {
    margin: 0;
    font-size: 1.1875rem;
  }

  .home-hero__figure {
    grid-area: figure;
    height: 31.25rem;
    margin: 0 1.875rem 0 0;

    img {
      height: 100%;
    }
  }

  .home-hero :deep(.v-chip) {
    font-size: 0.875rem;
  }

  .home-hero__tag--score {
    top: 3.75rem;
    right: auto;
    left: -5.625rem;
  }

  .home-hero__tag--advice {
    top: 12.5rem;
    left: -9.375rem;
  }

  // Right of the backpack: lower down it covered the shoes, and on the left it ran into the exam finder.
  .home-hero__tag--rank {
    top: 16.25rem;
    right: auto;
    left: calc(100% - 4.5rem);
  }
}
</style>
