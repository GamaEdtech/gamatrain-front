<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <admin-subscription-tabs />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})
</script>
