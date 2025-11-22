<template>
  <div class="label-holder mt-4">
    <v-chip
      v-if="sectionTitle"
      link
      class="mr-1 bg-blue-grey-darken-2"
    >
      <nuxt-link :to="`/search?type=learnfiles&section=${sectionId}`">
        {{ sectionTitle }}
      </nuxt-link>
    </v-chip>

    <v-chip
      v-if="baseTitle"
      link
      class="mr-1 bg-blue-grey-darken-2"
    >
      <nuxt-link
        :to="`/search?type=learnfiles&section=${sectionId}&base=${baseId}`"
      >
        {{ baseTitle }}
      </nuxt-link>
    </v-chip>

    <v-chip
      v-if="lessonTitle"
      link
      class="ma-1 bg-blue-grey-darken-2"
    >
      <nuxt-link
        :to="`/search?type=learnfiles&section=${sectionId}&base=${baseId}&lesson=${lessonId}`"
      >
        {{ lessonTitle }}
      </nuxt-link>
    </v-chip>

    <!-- Custom tags can be added here in the future -->
  </div>
</template>

<script setup>
defineProps({
  sectionId: {
    type: String,
    default: '',
  },
  sectionTitle: {
    type: String,
    default: '',
  },
  baseId: {
    type: String,
    default: '',
  },
  baseTitle: {
    type: String,
    default: '',
  },
  lessonId: {
    type: String,
    default: '',
  },
  lessonTitle: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.label-holder {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.v-chip :deep(a) {
  color: white;
  text-decoration: none;
}
</style>
