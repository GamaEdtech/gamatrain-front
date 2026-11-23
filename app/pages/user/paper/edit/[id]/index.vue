<template>
  <paper-edit-form />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useSeoMeta({
  title: 'Edit Paper',
})
</script>
