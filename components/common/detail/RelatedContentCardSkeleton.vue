<template>
  <div
    v-if="type == `paper`"
    class="card-paper mx-1 d-flex flex-column rounded-lg"
  >
    <v-skeleton-loader
      class="w-100"
      height="190"
    />
    <div class="w-100 px-2 box-bottom d-flex align-center justify-start ga-2">
      <v-skeleton-loader
        width="20"
        height="20"
        class="rounded-circle"
      />
      <v-skeleton-loader
        width="60"
        height="10"
        class="rounded-pill"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type content = 'paper'

defineProps<{
  type: content
}>()
</script>

<style scoped>
.card-paper {
  width: 160px;
  height: 230px;
  border: 1px solid #e4e7ec;
}
.box-bottom {
  height: 40px;
}
</style>
