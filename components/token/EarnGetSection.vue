<template>
  <section class="earn-get-section">
    <v-container class="earn-get-container">
      <h2 class="earn-get-title">
        How Do You Earn $GET?
      </h2>
      <v-row
        class="earn-get-grid"
        align="center"
        justify="center"
      >
        <v-col
          v-for="(card, i) in cards"
          :key="i"
          cols="6"
          sm="6"
          md="6"
          lg="3"
          class="earn-get-col"
        >
          <div class="earn-get-card">
            <div class="earn-get-img-section">
              <v-img
                :src="card.img"
                class="earn-get-img"
                contain
              />
            </div>
            <div class="earn-get-card-content">
              <h3 class="earn-get-card-title">
                {{ card.title }}
              </h3>
              <p class="earn-get-card-desc">
                {{ card.desc }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
const cards = ref([
  {
    title: 'Teachers',
    desc: 'Create content and upload learning materials',
    img: '/images/token/Earn/teachers.png',
  },
  {
    title: 'Students',
    desc: 'Use the system and submit assignments',
    img: '/images/token/Earn/students.png',
  },
  {
    title: 'Developers',
    desc: 'Contribute to the development process',
    img: '/images/token/Earn/developers.png',
  },
  {
    title: 'Community',
    desc: 'Use social media to help others learn about Gamatrain',
    img: '/images/token/Earn/community.png',
  },
])
</script>

<style scoped>
.earn-get-section {
  background: rgba(36, 41, 47, 0.05);
  padding: 48px 0;
  margin-top: 4rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;
  padding-right: 2rem;
}
.earn-get-container {
  max-width: 1100px;
  margin: 0 auto;
}
.earn-get-title {
  color: #24292f;
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
}

.earn-get-card {
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px 0 rgba(44, 62, 80, 0.08);
  margin: 0;
  overflow: hidden;
  height: 100%;
}

.earn-get-img-section {
  background: rgba(36, 41, 47, 0.7);
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.earn-get-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.earn-get-card-content {
  padding: 1.2rem;
  height: 100px;
}

.earn-get-card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #222;
}

.earn-get-card-desc {
  color: #6e7781;
  font-size: 12px;
  line-height: 1.4;
}

.earn-get-col {
  display: flex;
  padding: 8px;
}

.earn-get-card {
  width: 100%;
  margin: 0;
}

@media (min-width: 600px) {
  .earn-get-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 3.5rem;
  }
  .earn-get-card-desc {
    font-size: 20px;
  }
}
@media (min-width: 960px) {
}

.earn-get-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.earn-get-col {
  padding: 8px;
  display: flex;
}

.earn-get-card {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px 0 rgba(44, 62, 80, 0.08);
}

/* iPad mini specific styles */
@media (min-width: 481px) and (max-width: 768px) {
  .earn-get-section {
    padding: 4rem 1rem;
    margin-top: 3rem;
  }

  .earn-get-container {
    padding: 0 1rem;
  }

  .earn-get-grid {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
  }

  .earn-get-col {
    width: 50%;
    padding: 10px;
    display: flex;
  }

  .earn-get-title {
    font-size: 36px;
    margin-bottom: 4rem;
  }

  .earn-get-card {
    width: 100%;
    margin: 0;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 24px 0 rgba(44, 62, 80, 0.08);
  }

  .earn-get-img-section {
    height: 200px;
    padding: 2rem;
  }

  .earn-get-card-content {
    height: 140px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .earn-get-card-title {
    font-size: 22px;
    margin-bottom: 1rem;
  }

  .earn-get-card-desc {
    font-size: 16px;
    line-height: 1.5;
  }
}

/* Mobile styles */
@media (max-width: 600px) {
  .earn-get-section {
    padding: 32px 0;
    margin-top: 0;
  }

  .earn-get-container {
    padding: 0 8px;
  }

  .earn-get-title {
    font-size: 20px;
    margin-bottom: 24px;
  }

  .earn-get-img-section {
    height: 100px;
    padding: 1rem;
  }

  .earn-get-section {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .earn-get-card {
    height: 210px;
  }

  .earn-get-card-content {
    padding: 0.8rem;
    height: 90px;
    overflow: hidden;
  }

  .earn-get-card-title {
    font-size: 16px;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .earn-get-card-desc {
    font-size: 14px;
    line-height: 1.2;
    padding-bottom: 2rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 50px;
  }

  .earn-get-col {
    padding: 4px;
  }

  .earn-get-grid {
    margin: -4px;
  }
}

@media (min-width: 1200px) {
  .earn-get-section {
    max-width: 1400px;
    padding: 80px 0;
  }

  .earn-get-container {
    max-width: 1300px;
  }

  .earn-get-title {
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 6rem;
  }

  .earn-get-card {
    border-radius: 16px;
  }

  .earn-get-img-section {
    height: 220px;
    padding: 2rem;
  }

  .earn-get-card-content {
    height: 130px;
    padding: 2rem;
  }

  .earn-get-card-title {
    font-size: 2.2rem;
  }

  .earn-get-card-desc {
    font-size: 1.6rem;
  }

  .earn-get-col {
    padding: 16px;
  }
}

@media (min-width: 1600px) {
  .earn-get-section {
    max-width: 1600px;
  }

  .earn-get-container {
    max-width: 1500px;
  }

  .earn-get-img-section {
    height: 280px;
    padding: 2.5rem;
  }

  .earn-get-card-content {
    height: 180px;
    padding: 2.5rem;
  }

  .earn-get-card-title {
    font-size: 2.5rem;
  }

  .earn-get-card-desc {
    font-size: 2rem;
  }
}
</style>
