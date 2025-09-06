<template>
  <div
    style="
      width: 100%;
      height: 100%;
      background: red;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <span style="color: white; font-size: 24px; font-weight: bold">
      {{ title }} dddd
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    topic_title?: string
    views?: string
  }>(),
  {
    title: 'title',
    topic_title: 'topic_title',
    views: 'views',
  },
)
</script>

<style scoped></style>
