<template>
  <v-container class="create-test-container mb-16 pb-10">
    <v-card flat>
      <v-card-text class="px-0">
        <create-test-form />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import CreateTestForm from '~/components/test-maker/create-test-form.vue'

// Define layout and page metadata
definePageMeta({
  layout: 'test-maker-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Create New Test',
  meta: [
    {
      name: 'description',
      content: 'Create a standalone test for your educational content',
    },
  ],
})
</script>

<style lang="scss">
.create-test-container {
  max-width: 1200px;
  margin: 5rem auto;
  padding-bottom: 80px; // Space for fixed bottom bar
}

@media (max-width: 768px) {
  .create-test-container {
    margin: 0;
    padding: 0;
  }
}
</style>
