<template>
  <user-posts-edit-post admin />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({
  title: 'Edit post',
})
</script>
