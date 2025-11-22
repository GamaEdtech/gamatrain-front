<template>
  <section class="profit-buyback-section">
    <v-container class="profit-buyback-container">
      <v-row justify="center">
        <v-col cols="12">
          <h2 class="profit-buyback-title">
            Profit Distribution and Buyback
          </h2>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
          cols="12"
          md="10"
          lg="9"
          class="profit-buyback-content"
        >
          <div class="video-and-text-wrapper">
            <div class="video-card">
              <iframe
                class="rounded youtube-container"
                src="https://www.youtube.com/embed/qJcZwPcXyXU?si=Y4PcVrImzRAanotw"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              />
            </div>
            <div class="profit-buyback-text">
              <p>
                After covering platform costs (servers, development, maintenance,
                content team, and taxes), all remaining profits go toward buying
                back $GET tokens.
              </p>
              <p>
                These bought-back tokens are redistributed to governance members
                based on their activity, contributions, and commitment to the
                ecosystem.
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup></script>

<style scoped>
.profit-buyback-section {
  max-width: 1800px;
  margin: 2rem auto 0 auto;
  padding: 4rem 1rem;
  color: #24292f;
}

.profit-buyback-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profit-buyback-title {
  color: #24292f;
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
}

.profit-buyback-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-and-text-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.video-card {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  background: #000;
}

.youtube-container {
  width: 100%;
  height: 100%;
  min-height: 240px;
  border: none;
  display: block;
}

.profit-buyback-text {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-size: 20px;
  font-weight: 400;
  color: #24292f;
  text-align: left;
  line-height: 1.6;
}

.profit-buyback-text p {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 18px;
  font-weight: 400;
  color: #24292f;
  line-height: 1.6;
}

.profit-buyback-text p:last-child {
  margin-bottom: 0;
}

@media (min-width: 600px) {
  .profit-buyback-title {
    font-size: 32px;
    margin-bottom: 2.5rem;
  }
}

@media (max-width: 600px) {
  .profit-buyback-section {
    padding: 2rem 0.5rem;
  }

  .video-card {
    min-height: 180px;
    margin-bottom: 1.2rem;
  }

  .profit-buyback-text,
  .profit-buyback-text p {
    font-size: 14px;
    margin-top: 6px;
  }
}
@media (min-width: 1200px) {
  .profit-buyback-title {
    font-size: 4rem;
  }
  .profit-buyback-text,
  .profit-buyback-text p {
    font-size: 2rem;
  }
}
</style>
