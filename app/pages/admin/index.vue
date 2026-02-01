<template>
  <div class="admin-page">
    Wellcome to Admin Panel
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})
</script>
