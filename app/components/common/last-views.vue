<template>
  <div class="last-view-holder">
    <h3 class="last-view-title">
      You have just visited these pages
    </h3>
    <div class="last-view-slider-holder">
      <v-sheet
        class="mx-auto last-view-slider"
      >
        <v-slide-group
          v-model="model"
          active-class="success"
          class="pa-4"
          show-arrows
        >
          <v-slide-item
            v-for="(last, index) in lastviewList"
            :key="index"
            class="mx-4"
          >
            <div class="last-view-item">
              <nuxt-link
                class=" "
                to=""
              >
                <img
                  :alt="last.description"
                  :src="require(`~/assets/images/${last.img}`)"
                  class="last-view-image"
                >
                <div class="last-view-description">
                  <p class="description-title">{{ last.description }}</p>
                </div>
              </nuxt-link>
            </div>
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    model: null,
    lastviewList: [
      { img: 'test1.png', description: 'A collection of 120 test questions for lessons 6 to 9 on (3) 12th' },
    ],
  }),

}
</script>
