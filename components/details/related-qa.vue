<template>
  <div class="ask-card mb-6 pa-4">
    <div class="ask-title d-flex align-center mb-5">
      <span
        :class="'icon icong-' + askCard.icon"
        class="ask-icon d-flex align-center"
      />
      <div class="ask-title-texts d-flex flex-column ml-3">
        <div class="asktitle">
          Related Q&As
        </div>
        <div class="asksubtitle">
          Ask questions or answer other people's questions...
        </div>
      </div>
    </div>
    <div
      v-for="(item, ask) in askTexts "
      :key="ask.value"
      class="ask-texts d-flex"
    >
      <p class="my-3 ask-text">
        <i class="fa-solid fa-link ask-text-icon mr-2" />
        {{ displayQuestion(item.askText) }}
      </p>
    </div>
    <v-divider class="mt-4" />
    <div class="ask-footer my-4 ">
      <v-btn class="askcard-footer-btn">
        <i class="fa-solid fa-plus mr-2" />Send file
      </v-btn>
      <nuxt-link
        to=""
        class="askcard-footer-link ml-6"
      >
        More
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelatedQa',
  data() {
    return {
      askCard: {
        icon: 'qa',
      },
      askTexts: [
        {
          responsiveText: 'Exercise solution video (3 and 4) lesson 10 and text translation...',
          askText: 'Exercise solution video (3 and 4) lesson 10 and text translation + exercise solution (1 and 2) lesson 11',
        },
        {
          responsiveText: 'Math 7th movie Chapter 2: Integers...',
          askText: 'Math 7th movie Chapter 2: Integers (fourth session: sample solution)',
        },
        {
          responsiveText: '7th social studies PowerPoint Lesson 12: ...',
          askText: '7th social studies PowerPoint Lesson 12: Protection of Iran\'s habitats',
        },
      ],

    }
  },
  methods: {
    displayQuestion(text) {
      if (this.$vuetify.breakpoint.xs)
        return text.length > 44 ? `${text.substring(0, 44)}...` : text
      else
        return text.length > 90 ? `${text.substring(0, 90)}...` : text
    },
  },
}
</script>

<style scoped>

</style>
