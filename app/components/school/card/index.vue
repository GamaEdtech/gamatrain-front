<template>
  <div class="w-100 d-none d-md-flex justify-center">
    <school-card-desktop :school="school" />
  </div>
  <div class="w-100 d-flex justify-center d-md-none">
    <school-card-mobile :school="school" />
  </div>
</template>

<script setup>
defineProps({
  school: {
    type: Object,
  },
})
</script>

<style scoped>

</style>
