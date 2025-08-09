<template>
  <div>
    <section class="about-get-section">
      <v-container>
        <div class="d-flex justify-content-center mb-4">
          <h2 class="about-get-title">
            What is <b>$GET</b>
          </h2>
        </div>
        <!-- Mobile Image -->
        <div class="about-get-img-mobile d-block d-sm-none text-center mb-4">
          <img
            class="about-get-img"
            src="/images/token/About/think.svg"
            alt="$GET token about illustration"
          >
        </div>
        <v-row class="justify-content-center about-get-row">
          <v-col
            cols="12"
            sm="8"
            class="about-get-text-col"
          >
            <p class="about-get-desc">
              <b>$GET</b> is GamaTrain's own cryptocurrency used for
              governance and incentivizing the Gama ecosystem.
            </p>
            <p class="about-get-desc">
              It empowers users to vote on platform decisions, propose new
              features, and earn rewards for meaningful contributions.
            </p>
            <p class="about-get-desc">
              By holding and using <b>$GET</b>, participants become active
              stakeholders in shaping the future of GamaTrain — from content
              creation to community growth.
            </p>
          </v-col>
          <!-- Desktop/Tablet Image -->
          <v-col
            cols="12"
            sm="4"
            class="about-get-img-col d-none d-sm-flex"
          >
            <img
              class="about-get-img"
              src="/images/token/About/think.svg"
              alt="$GET token about illustration"
            >
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.about-get-section {
  background: #fff;
  padding: 5rem 0 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.about-get-title {
  font-size: 24px;
  color: #24292f;
  text-align: center;
  margin-bottom: 2rem;
}

.about-get-text-col {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-get-desc {
  font-size: 16px;
  color: #24292f;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.about-get-img-col {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.about-get-img {
  width: 180px;
  height: auto;
}

.about-get-img-mobile {
  margin: 0 auto 2rem;
}

.about-get-img-mobile .about-get-img {
  width: 140px;
  height: auto;
}

@media (min-width: 600px) {
  .about-get-title {
    font-size: 32px;
  }

  .about-get-desc {
    font-size: 20px;
  }
}

@media (min-width: 1200px) {
  .about-get-title {
    font-size: 4rem;
  }
  .about-get-desc {
    font-size: 2.3rem;
    text-align: left;
  }
}

.about-get-row {
  display: flex;
  align-items: center;
}

/* iPad mini specific styles */
@media (min-width: 481px) and (max-width: 768px) {
  .about-get-section {
    padding: 4rem 2rem 3rem 2rem;
  }

  .about-get-title {
    font-size: 36px;
    margin-bottom: 4rem;
  }

  .about-get-row {
    flex-direction: row !important;
    gap: 2rem;
  }

  .about-get-text-col {
    order: 1;
    flex: 1;
    padding-right: 1rem;
  }

  .about-get-img-col {
    order: 2;
    flex: 0 0 auto;
    margin-bottom: 0;
  }

  .about-get-desc {
    font-size: 20px;
    text-align: left;
  }

  .about-get-img {
    width: 180px;
    max-width: 100%;
  }
}

/* Mobile styles */
@media (max-width: 599px) {
  .about-get-section {
    padding: 1rem 1.5rem 1rem 1.5rem;
  }

  .about-get-desc {
    padding: 0;
  }

  .about-get-img {
    width: 120px;
  }
}

@media (max-width: 400px) {
  .about-get-img {
    width: 140px;
  }
  .about-get-desc {
    text-align: left;
  }
}
</style>
