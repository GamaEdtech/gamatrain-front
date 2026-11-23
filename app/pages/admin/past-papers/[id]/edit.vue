<template>
  <paper-edit-form admin />
</template>

<script setup lang="ts">
// Any paper, any status, through the admin endpoints: its fields and every file (question paper, Word, answers, extras).
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useSeoMeta({
  title: 'Edit past paper',
})
</script>
