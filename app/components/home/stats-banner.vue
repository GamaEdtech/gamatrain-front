<template>
  <v-container
    id="stats-container"
    fluid
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="gama-text-h4">
            Millions Trust Us
          </h2>
          <div id="stats-section">
            <v-row>
              <v-col
                v-for="(item, index) in stats"
                :key="index"
                cols="6"
                sm="4"
                md="2"
                class="text-center"
              >
                <div class="stat-container">
                  <span
                    :class="item.icon"
                    class="item-icon"
                  />
                  <ClientOnly>
                    <div class="item-stat gama-text-h6">
                      +{{ $numberFormat(item.stat) }}
                    </div>
                  </ClientOnly>
                  <div class="item-title gama-text-caption">
                    {{ item.title }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <p class="describe gama-text-h6">
            Gamatrain-the smart choice for teachers, students, and schools
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
const stats = ref([
  {
    icon: 'icon-school',
    stat: '130000',
    title: 'Schools',
  },
  {
    icon: 'icon-teacher',
    stat: '500000',
    title: 'Teacher',
  },
  {
    icon: 'icon-student',
    stat: '3000000',
    title: 'Student',
  },
  {
    icon: 'icon-exam',
    stat: '7000',
    title: 'QuizHub',
  },
  {
    icon: 'icon-q-a',
    stat: '60000',
    title: 'Forum',
  },
  {
    icon: 'icon-multimedia',
    stat: '37000',
    title: 'Multimedia',
  },
])
</script>

<style>
#stats-container {
  height: 38.6rem;
  padding: 2.4rem 0 2.4rem 0;
  background: #24292f;
  color: #ffffff;

  text-align: center;

  .gama-text-h4 {
    color: #f3f3fb;
    margin-bottom: 0.3rem;
  }

  .describe {
    color: #f3f3fb;
    opacity: 0.30000001192092896;
    margin-top: 1.4rem;
  }

  #stats-section {
    width: 31.2rem;
    margin: auto auto;

    .stat-container {
      position: relative;
      text-align: left;
      padding-top: 2.3rem;
      padding-bottom: 2.3rem;

      .item-icon {
        font-size: 2rem;
        color: #ffb600;
      }

      .item-stat {
        position: absolute;
        color: #fff;
        top: 2.6rem;
        left: 2.8rem;
      }

      .item-title {
        position: absolute;
        color: #fff;
        left: 2.8rem;
      }
    }
  }
}

@media (min-width: 600px) {
  #stats-container {
    height: 38.1rem;
    padding: 4.8rem 0 4.8rem 0;

    .gama-text-h4 {
      margin-bottom: 2.4rem;
    }

    .describe {
      margin-top: 3.2rem;
    }

    #stats-section {
      width: 54.4rem;
      margin: auto auto;

      .stat-container {
        position: relative;
        text-align: left;
        padding-top: 2.4rem;
        padding-bottom: 2.4rem;

        .item-icon {
          font-size: 2.4rem;
          color: #ffb600;
        }

        .item-stat {
          position: absolute;
          color: #fff;
          top: 2.4rem;
          left: 2.8rem;
        }

        .item-title {
          position: absolute;
          color: #fff;
          top: 4.8rem;
          left: 3rem;
        }
      }
    }
  }
}

@media (min-width: 960px) {
  #stats-container {
    height: 31.6rem;
    padding: 3.6rem 0 4.8rem 0;
    background: #24292f;
    color: #ffffff;
    text-align: center;

    .gama-text-h4 {
      color: #f3f3fb;
      margin-bottom: 1.2rem;
    }

    .describe {
      color: #f3f3fb;
      opacity: 0.30000001192092896;
      margin-top: 0.15rem;
    }

    #stats-section {
      width: 100%;

      margin: auto auto;

      .stat-container {
        text-align: center;

        .item-icon {
          position: static;
          font-size: 4.8rem;
          color: #ffb600;
          margin-bottom: 1.6rem;
        }

        .item-stat {
          position: static;
          color: #fff;
          margin-bottom: 0.4rem;
        }

        .item-title {
          position: static;
          color: #fff;
        }
      }
    }
  }
}
</style>
