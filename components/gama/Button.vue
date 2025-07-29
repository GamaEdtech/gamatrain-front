<template>
  <v-btn
    v-bind="$attrs"
    rounded
    color="primary"
    class="gama-btn"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'GamaButton',
  inheritAttrs: false,
}
</script>

<style scoped>
.gama-btn {
  margin-top: 1.5rem;
  color: #24292f;
}
</style>
