<template>
  <user-posts-edit-post />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Edit post',
})
</script>
