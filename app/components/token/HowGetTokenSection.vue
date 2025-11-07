<template>
  <div>
    <section class="can-get-section mt-10">
      <v-container>
        <div class="d-flex justify-content-center mb-9">
          <h2 class="can-get-title">
            What Can You Do With $GET?
          </h2>
        </div>
        <v-row class="justify-content-center align-center can-get-row">
          <v-col
            cols="12"
            sm="8"
            md="7"
            class="can-get-desc-col"
          >
            <div class="can-get-desc-block">
              <div class="can-get-desc-label">
                You can use <b>$GET</b> to:
              </div>
              <ul class="can-get-list">
                <li><b>Vote</b> on platform decisions</li>
                <li><b>Propose</b> new features</li>
                <li><b>Shape</b> the future of GamaTrain</li>
              </ul>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="4"
            md="3"
            class="can-get-img-col"
          >
            <img
              class="can-get-img"
              src="/images/token/About/Think2.svg"
              alt="What can you do with $GET token illustration"
            >
          </v-col>
        </v-row>
        <p class="can-get-footnote">
          As the ecosystem grows, <b>$GET</b> may also unlock exclusive tools,
          boost visibility for your content and grant access to new learning
          materials.
        </p>
      </v-container>
    </section>
  </div>
</template>

<script setup></script>

<style scoped>
.can-get-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  padding-bottom: 2.5rem;
}

.can-get-title {
  font-size: 24px;
  font-weight: 800;
  color: #24292f;
  text-align: center;
  margin-bottom: 2rem;
}

.can-get-desc-label {
  font-size: 16px;
  color: #24292f;
  margin-bottom: 2rem;
  font-weight: 500;
}

.can-get-list {
  padding: 0;
  list-style: disc;
  padding-left: 25px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.can-get-list li {
  font-size: 16px;
  margin-bottom: 0;
  line-height: 1.7;
}

.can-get-footnote {
  color: #24292f;
  margin-top: 2.5rem;
  text-align: left;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
}

.can-get-img-col {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
}

.can-get-img {
  width: 220px;
  height: auto;
}

@media (min-width: 600px) {
  .can-get-title {
    font-size: 32px;
    font-weight: 700;
  }

  .can-get-desc-label,
  .can-get-list li,
  .can-get-footnote {
    font-size: 20px;
  }
}

@media (max-width: 960px) {
  .can-get-row {
    flex-direction: column !important;
  }

  .can-get-img-col {
    order: -1; /* Move image to top */
    margin-bottom: 3rem;
  }

  .can-get-img {
    width: 180px; /* Maintain desktop size */
  }
}

.can-get-row {
  display: flex;
  align-items: center;
}

/* iPad mini specific styles */
@media (min-width: 481px) and (max-width: 768px) {
  .can-get-section {
    padding: 2rem 2rem 3rem 2rem;
  }

  .can-get-title {
    font-size: 36px;
    margin-bottom: 4rem;
  }

  .can-get-row {
    flex-direction: row !important;
    gap: 2rem;
  }

  .can-get-desc-col {
    order: 1;
    flex: 1;
    padding-right: 1rem;
  }

  .can-get-img-col {
    order: 2;
    flex: 0 0 auto;
    margin-bottom: 0;
  }

  .can-get-desc-label {
    font-size: 20px;
    margin-bottom: 2rem;
    text-align: left;
  }

  .can-get-list {
    gap: 1.2rem;
    margin: 0.5rem 0 1.5rem 1.5rem;
    text-align: left;
  }

  .can-get-list li {
    font-size: 20px;
    line-height: 1.6;
  }

  .can-get-footnote {
    font-size: 18px;
    margin-top: 2rem;
    line-height: 1.6;
    padding: 0;
    text-align: left;
  }

  .can-get-img {
    width: 180px;
    max-width: 100%;
  }
}

/* Keep existing mobile styles unchanged */
@media (max-width: 600px) {
  .can-get-section {
    width: 100%;
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  .can-get-desc-block {
    min-height: unset;
    padding: 0;
  }

  .can-get-title {
    font-size: 24px;
  }

  .can-get-desc-label {
    font-size: 18px;
    margin-bottom: 2.5rem;
  }

  .can-get-list {
    gap: 0.8rem;
    margin: 0.5rem 0 1rem 1.5rem;
  }

  .can-get-list li {
    font-size: 16px;
    line-height: 1.7;
  }

  .can-get-footnote {
    font-size: 16px;
    margin-top: 1.5rem;
    margin-bottom: 2rem;
    line-height: 1.7;
  }
  .can-get-img-col {
    margin-bottom: 2rem;
  }

  .can-get-img {
    width: 180px;
  }
}

@media (max-width: 400px) {
  .can-get-section {
    padding: 0 1.5rem 1rem 1.5rem;
  }

  .can-get-img {
    width: 180px;
  }

  .can-get-list {
    margin-left: 1.25rem;
  }
}

@media (min-width: 1200px) {
  .can-get-title {
    font-size: 4rem;
    color: #24292f;
    font-weight: 800;
  }
  .can-get-desc-label {
    font-size: 2.3rem;
    text-align: left;
  }
  .can-get-list {
    list-style-position: inside;
  }
  .can-get-list li {
    font-size: 2.3rem;
    padding-left: 4rem;
  }
  .can-get-footnote {
    font-size: 2.3rem;
  }
}
</style>
