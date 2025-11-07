<template>
  <section class="trust-community-section">
    <v-container class="trust-community-container">
      <h2 class="trust-community-title">
        Built On Trust, Driven By Community
      </h2>
      <v-img
        src="/images/token/Mission/community.svg"
        alt="Community trust and collaboration illustration"
        class="trust-community-illustration"
        contain
        width="245"
        height="245"
      />
      <p class="trust-community-subtitle text-h5">
        At Gamatrain, our mission is to empower the community through a
        foundation of:
      </p>
      <v-row
        class="trust-community-content"
        justify="center"
        align="center"
        no-gutters
      >
        <v-col
          cols="12"
          md="4"
          class="trust-community-list-col"
        >
          <ul class="trust-community-list">
            <li
              v-for="item in items"
              :key="item.text"
              class="trust-community-list-item"
            >
              <span class="trust-community-icon">
                <v-img
                  :src="item.img"
                  :alt="item.text + ' icon'"
                  class="trust-community-img-icon"
                  contain
                  width="21"
                  height="18"
                />
              </span>
              <span class="trust-community-list-text">{{ item.text }}</span>
            </li>
          </ul>
        </v-col>
      </v-row>
      <p class="trust-community-description text-h5">
        Every decision, reward, and improvement is made with our contributors in
        mind – because GamaTrain is built with you, not just for you.
      </p>
    </v-container>
  </section>
</template>

<script setup>
const items = ref([
  {
    img: '/images/token/Mission/trust.svg',
    text: 'Trust',
  },
  {
    img: '/images/token/Mission/transparency.svg',
    text: 'Transparency',
  },
  {
    img: '/images/token/Mission/shared.svg',
    text: 'Shared Accountability',
  },
])
</script>

<style scoped>
.trust-community-section {
  background: #fff;
  padding: 56px 0 40px 0;
}
.trust-community-container {
}
.trust-community-title {
  text-align: center;
  color: #354053;
  font-weight: 800;
  margin-bottom: 32px;
  font-size: 24px;
}
.trust-community-subtitle {
  text-align: center;
  color: #24292f;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.trust-community-content {
  margin-bottom: 32px;
}
.trust-community-list-col {
  display: flex;
  justify-content: center;
}
.trust-community-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.trust-community-list-item {
  display: flex;
  align-items: center;
  gap: 11px;
}
.trust-community-icon {
  background: #262729;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #23272f;
  flex-shrink: 0;
}
.trust-community-img-icon {
  width: 21px;
  height: 18px;
  object-fit: contain;
}
.trust-community-list-text {
  color: #4a5568;
  font-size: 16px;
  font-weight: 700;
  font-family: "Inter", "Roboto", "Arial", sans-serif;
  margin-left: 4px;
}
.trust-community-illustration-col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.trust-community-illustration {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}
.trust-community-description {
  margin-top: 40px;
  text-align: center;
  color: #4a5568;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
}
/* ===== MOBILE STYLES (max-width: 599px) ===== */
@media (max-width: 599px) {
  .trust-community-section {
    padding: 40px 0 32px 0;
  }
  .trust-community-title {
    font-size: 24px;
    margin-bottom: 24px;
  }
  .trust-community-subtitle {
    font-size: 16px !important;
    margin-bottom: 24px;
    padding: 0 16px;
  }
  .trust-community-list-text {
    font-size: 14px;
  }
  .trust-community-description {
    font-size: 16px !important;
    padding: 0 16px;
    margin-top: 32px;
  }
  .trust-community-icon {
    width: 36px;
    height: 36px;
  }
  .trust-community-img-icon {
    width: 18px;
    height: 15px;
  }
  .trust-community-mobile-illustration {
    display: block !important;
    margin: 0 auto 24px;
  }
  .trust-community-illustration {
    display: none !important;
  }
}

/* ===== TABLET STYLES (min-width: 600px) and (max-width: 1199px) ===== */
@media (min-width: 600px) and (max-width: 1199px) {
  .trust-community-title {
    font-size: 4rem !important;
    font-weight: 750;
    margin-bottom: 2rem;
  }
  .trust-community-illustration {
    display: block !important;
    margin: 0 auto 2.5rem auto !important;
    width: 300px;
    height: 300px;
  }
  .trust-community-subtitle {
    font-size: 2.3rem !important;
    margin-bottom: 4rem;
  }
  .trust-community-list {
    margin-bottom: 2.5rem;
  }
  .trust-community-list-text {
    font-size: 2rem;
    padding-top: 0;
    padding-bottom: 0;
  }
  .trust-community-icon {
    width: 56px;
    height: 56px;
  }
  .trust-community-img-icon {
    width: 28px;
    height: 24px;
  }
  .trust-community-description {
    font-size: 2.3rem !important;
    margin-bottom: 4rem;
    margin-top: 2.5rem;
  }
  .trust-community-content {
    flex-direction: column !important;
  }
}

/* ===== DESKTOP STYLES (min-width: 1200px) ===== */
@media (min-width: 1200px) {
  .trust-community-section {
    padding: 80px 0 60px 0;
  }
  .trust-community-container {
    max-width: 1400px;
  }
  .trust-community-title {
    font-size: 4rem;
    margin-bottom: 48px;
  }
  .trust-community-subtitle {
    font-size: 24px !important;
    margin-bottom: 48px;
    max-width: 800px;
  }
  .trust-community-content {
    margin-bottom: 48px;
  }
  .trust-community-list {
    gap: 32px;
  }
  .trust-community-icon {
    width: 80px;
    height: 80px;
  }
  .trust-community-img-icon {
    width: 42px !important;
    height: 36px !important;
  }
  .trust-community-list-text {
    font-size: 24px;
  }
  .trust-community-illustration {
    display: block !important;
    width: 400px;
    height: 400px;
    margin: 0 auto;
  }
  .trust-community-mobile-illustration {
    display: none !important;
  }
  .trust-community-description {
    font-size: 24px !important;
    margin-top: 60px;
    max-width: 800px;
  }
}

/* ===== ULTRA-WIDE DESKTOP STYLES (min-width: 1600px) ===== */
@media (min-width: 1600px) {
  .trust-community-container {
    max-width: 1600px;
  }
  .trust-community-title {
    font-size: 4rem;
  }
  .trust-community-subtitle,
  .trust-community-description {
    max-width: 1000px;
    font-size: 28px !important;
  }
  .trust-community-illustration {
    width: 500px;
    height: 500px;
  }
  .trust-community-icon {
    width: 86px;
    height: 86px;
  }
  .trust-community-img-icon {
    width: 40px !important;
    height: 34px !important;
  }
}
</style>
