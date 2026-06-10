<template>
  <div
    class="card-wrapper"
  >
    <div class="w-100 d-none d-md-flex justify-center">
      <school-card-desktop :school="school" />
    </div>
    <div class="w-100 d-flex justify-center d-md-none">
      <school-card-mobile :school="school" />
    </div>
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
.card-wrapper {
  width: fit-content;
}
@media (min-width: 960px) {
  .card-wrapper {
    width: 100%;
  }
}
</style>
