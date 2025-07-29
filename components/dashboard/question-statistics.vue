<template>
  <div class="d-inline-flex">
    <v-carousel
      height="48"
      hide-delimiters
      cycle
      :show-arrows="false"
    >
      <v-carousel-item>
        <div class="px-3 text-center question">
          <span class="counter">
            {{ statistics?.question?.total || 0 }}
          </span>

          <p class="text-h6">
            Question's
          </p>
        </div>
      </v-carousel-item>
      <v-carousel-item>
        <div class="px-3 text-center question-inbox">
          <span class="counter">
            {{ statistics?.question?.unreadReplies || 0 }}
          </span>
          <p class="text-h6">
            Inbox
          </p>
        </div>
      </v-carousel-item>
      <v-carousel-item>
        <div class="px-3 text-center question-outbox">
          <span class="counter">
            {{ statistics?.questionReply?.total || 0 }}
          </span>
          <p class="text-h6">
            Outbox
          </p>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup>
const _props = defineProps({
  statistics: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style scoped>
.group-icon {
  font-size: 5rem;
}

.question {
  color: #ff9800;
}

.question-inbox {
  color: orchid;
}

.question-outbox {
  color: #00d2ae;
}
</style>
