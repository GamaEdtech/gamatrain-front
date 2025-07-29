<template>
  <div class="last-files pa-4">
    <div class="lastfile-content d-flex flex-column">
      <div class="lastfile-titles d-flex align-center pb-4 mb-5">
        <span class="icon icong-learnfiles lastfile-icon-title" />
        <p class="mb-0 mx-2 lastfile-title">
          Latest Multimedia
        </p>
      </div>
      <div class="video-slider">
        <!-- <Video :videos="videos" unique="desktop"></Video> -->
        <v-rating
          v-model="rating"
          color="yellow darken-3"
          background-color="grey darken-1"
          empty-icon="$ratingFull"
          half-increments
          hover
          size="20"
          class="slider-rating"
        />
      </div>
      <div
        class="d-none d-md-flex date-name align-center justify-space-between mt-5"
      >
        <div class="d-flex align-center">
          <!-- <img :src="require('@/assets/images/' + lastFile.img)" alt="" /> -->
          <p class="ml-2">
            {{ lastFile.name }}
          </p>
        </div>
        <div class="d-flex align-center">
          <i class="fa-solid fa-calendar-days" />
          <p class="ml-2">
            {{ lastFile.date }}
          </p>
        </div>
        <p>Slide numbers: {{ lastFile.number }}</p>
      </div>
      <p class="lastFile-text mt-5">
        {{
          lastFile.lastFileText.length > 350
            ? `${lastFile.lastFileText.substring(0, 350)}...`
            : lastFile.lastFileText
        }}
      </p>
      <div
        class="date-name d-none d-md-flex align-center justify-space-between my-5"
      >
        <p>Content:{{ lastFile.content }}</p>
        <p>Budgeting: {{ lastFile.budget }}</p>
      </div>
    </div>
    <div
      class="d-flex d-md-none date-name align-center justify-space-between mt-3"
    >
      <div class="d-flex align-center">
        <!-- <img :src="require('@/assets/images/' + lastFile.img)" alt=""> -->
        <p class="ml-2">
          {{ lastFile.name }}
        </p>
      </div>
      <div class="d-flex align-center">
        <i class="fa-solid fa-calendar-days" />
        <p class="ml-2">
          {{ lastFile.date }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LatestTrainingContent',
  components: {
    // Video component removed as it was unused
  },
  data() {
    return {
      videos: [
        {
          img: 'vid.png',
          vid: 'video.mp4',
        },
        {
          img: 'vid.png',
          vid: 'video.mp4',
        },
        {
          img: 'vid.png',
          vid: 'video.mp4',
        },
        {
          img: 'vid.png',
          vid: 'video.mp4',
        },
        {
          img: 'vid.png',
          vid: 'video.mp4',
        },
        {
          img: 'vid.png',
          vid: 'video.mp4',
        },
      ],
      lastFile: {
        img: 'dexter-morse2.png',
        name: 'Arian Etemdi',
        date: '27 Jun',
        number: '27',
        responsiveText:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک ......',
        lastFileText:
          'Lorem Epsom is a fictitious text produced with incomprehensible simplicity from the printing industry and using graphic designers, printers and texts, but also newspapers and magazines in columns and rows as necessary and for the current conditions of technology and diverse applications with the aim of improving practical tools. A lot in sixty...',
        content: 'Gifted level education (pptx)',
        budget: 'Page 1 to page 168',
      },
    }
  },
}
</script>

<style scoped></style>
